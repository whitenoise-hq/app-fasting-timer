import { useCallback, useRef } from 'react';
import Constants from 'expo-constants';
import type { NotificationSettings, FastingPlan } from '@/types';

/** Expo Go 환경인지 확인 */
const isExpoGo = Constants.appOwnership === 'expo';

/** 알림 ID 저장 타입 */
interface ScheduledNotificationIds {
  fastingEnd: string | null;
  eatingReminder: string | null;
}

/** 알림 권한 상태 */
export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

/** 알림 메시지 */
const NOTIFICATION_MESSAGES = {
  fastingEnd: {
    title: '단식 완료!',
    body: '단식 완료! 식사를 시작하세요 🎉',
  },
  eatingReminder: {
    title: '식사 시간 알림',
    body: '30분 후 단식이 시작됩니다 🍽️',
  },
};

// Expo Go에서는 알림 모듈을 로드하지 않음
let Notifications: typeof import('expo-notifications') | null = null;

if (!isExpoGo) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const NotificationsModule = require('expo-notifications') as typeof import('expo-notifications');
  Notifications = NotificationsModule;

  /** 포그라운드 알림 설정 */
  NotificationsModule.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * 푸시 알림 관리 훅
 * - 권한 요청
 * - 알림 스케줄링
 * - 알림 취소
 *
 * Expo Go에서는 알림 기능이 비활성화됩니다.
 */
export function useNotification() {
  const scheduledIdsRef = useRef<ScheduledNotificationIds>({
    fastingEnd: null,
    eatingReminder: null,
  });

  /** 알림 권한 요청 */
  const requestPermissions = useCallback(async (): Promise<PermissionStatus> => {
    if (!Notifications) {
      return 'undetermined';
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus === 'granted') {
      return 'granted';
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status as PermissionStatus;
  }, []);

  /** 현재 권한 상태 확인 */
  const getPermissionStatus = useCallback(async (): Promise<PermissionStatus> => {
    if (!Notifications) {
      return 'undetermined';
    }

    const { status } = await Notifications.getPermissionsAsync();
    return status as PermissionStatus;
  }, []);

  /** 모든 예약된 알림 취소 */
  const cancelAllNotifications = useCallback(async () => {
    if (!Notifications) {
      return;
    }

    await Notifications.cancelAllScheduledNotificationsAsync();
    scheduledIdsRef.current = {
      fastingEnd: null,
      eatingReminder: null,
    };
  }, []);

  /** 개별 알림 스케줄링 */
  const scheduleNotification = useCallback(
    async (
      key: keyof ScheduledNotificationIds,
      triggerDate: Date
    ): Promise<string | null> => {
      if (!Notifications) {
        return null;
      }

      const now = Date.now();
      const triggerTime = triggerDate.getTime();

      // 과거 시간이면 스케줄링하지 않음
      if (triggerTime <= now) {
        return null;
      }

      const message = NOTIFICATION_MESSAGES[key];
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: message.title,
          body: message.body,
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
        },
      });

      return id;
    },
    []
  );

  /**
   * 단식 시작 시 알림 스케줄링
   * @param startTime 단식 시작 시간 (ISO 문자열)
   * @param plan 선택된 플랜
   * @param settings 알림 설정
   */
  const scheduleNotifications = useCallback(
    async (
      startTime: string,
      plan: FastingPlan,
      settings: NotificationSettings
    ) => {
      if (!Notifications) {
        return;
      }

      // 기존 알림 취소
      await cancelAllNotifications();

      const startDate = new Date(startTime);
      const fastingMs = plan.fastingHours * 60 * 60 * 1000;
      const eatingMs = plan.eatingHours * 60 * 60 * 1000;

      // 1. 단식 종료 알림 (목표 단식 시간 도달)
      if (settings.fastingEnd) {
        const endTime = startDate.getTime() + fastingMs;
        const id = await scheduleNotification('fastingEnd', new Date(endTime));
        scheduledIdsRef.current.fastingEnd = id;
      }

      // 2. 식사 종료 30분 전 리마인더 (단식 종료 + 식사 시간 - 30분)
      if (settings.eatingReminder) {
        const eatingEndTime = startDate.getTime() + fastingMs + eatingMs - 30 * 60 * 1000;
        const id = await scheduleNotification('eatingReminder', new Date(eatingEndTime));
        scheduledIdsRef.current.eatingReminder = id;
      }
    },
    [cancelAllNotifications, scheduleNotification]
  );

  /** 현재 예약된 알림 ID 반환 */
  const getScheduledIds = useCallback(() => {
    return { ...scheduledIdsRef.current };
  }, []);

  return {
    requestPermissions,
    getPermissionStatus,
    scheduleNotifications,
    cancelAllNotifications,
    getScheduledIds,
  };
}
