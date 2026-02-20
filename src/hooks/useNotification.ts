import { useEffect, useCallback, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import type { NotificationSettings, FastingPlan } from '../types';

/** 알림 ID 저장 타입 */
interface ScheduledNotificationIds {
  fastingStart: string | null;
  fastingEnd: string | null;
  eatingReminder: string | null;
  halfwayCheer: string | null;
}

/** 알림 메시지 */
const NOTIFICATION_MESSAGES = {
  fastingStart: {
    title: '단식 시작',
    body: '단식이 시작되었습니다 💪 목표까지 화이팅!',
  },
  halfwayCheer: {
    title: '절반 달성!',
    body: '절반 지났어요! 잘하고 있습니다 🔥',
  },
  eatingReminder: {
    title: '식사 시간 알림',
    body: '30분 후 단식이 시작됩니다 🍽️',
  },
  fastingEnd: {
    title: '단식 완료!',
    body: '단식 완료! 식사를 시작하세요 🎉',
  },
};

/** 포그라운드 알림 설정 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** 알림 권한 상태 */
export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

/**
 * 푸시 알림 관리 훅
 * - 권한 요청
 * - 알림 스케줄링
 * - 알림 취소
 */
export function useNotification() {
  const scheduledIdsRef = useRef<ScheduledNotificationIds>({
    fastingStart: null,
    fastingEnd: null,
    eatingReminder: null,
    halfwayCheer: null,
  });

  /** 알림 권한 요청 */
  const requestPermissions = useCallback(async (): Promise<PermissionStatus> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();

    if (existingStatus === 'granted') {
      return 'granted';
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status as PermissionStatus;
  }, []);

  /** 현재 권한 상태 확인 */
  const getPermissionStatus = useCallback(async (): Promise<PermissionStatus> => {
    const { status } = await Notifications.getPermissionsAsync();
    return status as PermissionStatus;
  }, []);

  /** 모든 예약된 알림 취소 */
  const cancelAllNotifications = useCallback(async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    scheduledIdsRef.current = {
      fastingStart: null,
      fastingEnd: null,
      eatingReminder: null,
      halfwayCheer: null,
    };
  }, []);

  /** 개별 알림 스케줄링 */
  const scheduleNotification = useCallback(
    async (
      key: keyof ScheduledNotificationIds,
      triggerDate: Date
    ): Promise<string | null> => {
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
      // 기존 알림 취소
      await cancelAllNotifications();

      const startDate = new Date(startTime);
      const fastingMs = plan.fastingHours * 60 * 60 * 1000;
      const eatingMs = plan.eatingHours * 60 * 60 * 1000;

      // 1. 단식 시작 알림 (즉시 - 시작 버튼 누른 시점)
      if (settings.fastingStart) {
        // 즉시 알림은 1초 뒤로 설정
        const triggerDate = new Date(startDate.getTime() + 1000);
        const id = await scheduleNotification('fastingStart', triggerDate);
        scheduledIdsRef.current.fastingStart = id;
      }

      // 2. 중간 격려 알림 (단식 시간의 50% 지점)
      if (settings.halfwayCheer) {
        const halfwayTime = startDate.getTime() + fastingMs / 2;
        const id = await scheduleNotification('halfwayCheer', new Date(halfwayTime));
        scheduledIdsRef.current.halfwayCheer = id;
      }

      // 3. 식사 종료 30분 전 리마인더 (단식 종료 + 식사 시간 - 30분)
      if (settings.eatingReminder) {
        const eatingEndTime = startDate.getTime() + fastingMs + eatingMs - 30 * 60 * 1000;
        const id = await scheduleNotification('eatingReminder', new Date(eatingEndTime));
        scheduledIdsRef.current.eatingReminder = id;
      }

      // 4. 단식 종료 알림 (목표 단식 시간 도달)
      if (settings.fastingEnd) {
        const endTime = startDate.getTime() + fastingMs;
        const id = await scheduleNotification('fastingEnd', new Date(endTime));
        scheduledIdsRef.current.fastingEnd = id;
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
