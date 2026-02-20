import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, Text, Pressable, AppState, AppStateStatus } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTimerStore } from '@/stores/timerStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { getPlanById } from '@/constants/plans';
import { useNotification } from '@/hooks/useNotification';
import { formatDuration, formatTime } from '@/utils/time';
import { Modal } from '@/components/common';
import { CircularTimer, TimerTip, TimerInfo, TimerButton } from '@/components/timer';
import type { FastingPlan } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const {
    status,
    fastingStartTime,
    fastingTargetEndTime,
    eatingStartTime,
    eatingTargetEndTime,
    startFasting,
    transitionToEating,
    stopTimer,
  } = useTimerStore();
  const { selectedPlanId, customFastingHours, customEatingHours, notifications } = useSettingsStore();
  const { scheduleNotifications, cancelAllNotifications } = useNotification();

  const [remainingMs, setRemainingMs] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showStopConfirmModal, setShowStopConfirmModal] = useState(false);
  // 종료 타입: 'fasting_incomplete' | 'eating_early' | 'natural_completion'
  const [endType, setEndType] = useState<'fasting_incomplete' | 'eating_early' | 'natural_completion'>('natural_completion');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTransitioningRef = useRef(false);

  // 마지막 완료 기록 가져오기
  const records = useTimerStore((state) => state.records);
  const lastCompletedRecord = useMemo(() => {
    const completedRecords = records.filter((r) => r.completed);
    return completedRecords.length > 0 ? completedRecords[completedRecords.length - 1] : null;
  }, [records]);

  // 플랜 정보 도출
  const plan = getPlanById(selectedPlanId);
  const fastingHours = plan?.fastingHours ?? customFastingHours ?? 16;
  const eatingHours = plan?.eatingHours ?? customEatingHours ?? 8;
  const planName = plan?.name ?? `${customFastingHours ?? 16}:${24 - (customFastingHours ?? 16)}`;
  const planLabel = plan?.label ?? '커스텀';

  // 알림 스케줄링용 플랜 객체 생성 (useMemo로 메모이제이션)
  const currentPlan: FastingPlan = useMemo(() => plan ?? {
    id: 'custom',
    name: planName,
    label: planLabel,
    fastingHours,
    eatingHours,
    description: '커스텀 플랜',
  }, [plan, planName, planLabel, fastingHours, eatingHours]);

  const isFasting = status === 'fasting';
  const isEating = status === 'eating';
  const isActive = isFasting || isEating;

  // 현재 단계의 시작/목표 시간
  const currentStartTime = isFasting ? fastingStartTime : eatingStartTime;
  const currentTargetEndTime = isFasting ? fastingTargetEndTime : eatingTargetEndTime;

  /** 타이머 상태 업데이트 */
  const updateTimerState = useCallback(() => {
    if (!isActive || !currentStartTime || !currentTargetEndTime) return;

    const now = Date.now();
    const start = new Date(currentStartTime).getTime();
    const target = new Date(currentTargetEndTime).getTime();
    const remaining = Math.max(0, target - now);
    const total = target - start;
    const elapsed = now - start;

    setRemainingMs(remaining);
    setProgress(Math.min(1, Math.max(0, elapsed / total)));

    // 전환 중이면 중복 실행 방지
    if (isTransitioningRef.current) return;

    // 단식 완료 → 식사로 자동 전환
    if (isFasting && remaining <= 0) {
      isTransitioningRef.current = true;
      transitionToEating(eatingHours);
      // 다음 틱에서 플래그 해제
      setTimeout(() => { isTransitioningRef.current = false; }, 100);
    }

    // 식사 완료 → idle 상태로 복귀 + 완료 모달
    if (isEating && remaining <= 0) {
      isTransitioningRef.current = true;
      stopTimer(selectedPlanId);
      cancelAllNotifications();
      setEndType('natural_completion');
      setShowEndModal(true);
      // 다음 틱에서 플래그 해제
      setTimeout(() => { isTransitioningRef.current = false; }, 100);
    }
  }, [
    isActive,
    isFasting,
    isEating,
    currentStartTime,
    currentTargetEndTime,
    eatingHours,
    transitionToEating,
    stopTimer,
    selectedPlanId,
    cancelAllNotifications,
  ]);

  /** 상태 변경 시 전환 플래그 리셋 */
  useEffect(() => {
    if (status === 'idle') {
      isTransitioningRef.current = false;
    }
  }, [status]);

  /** 앱 상태 변화 감지 */
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        updateTimerState();
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [updateTimerState]);

  /** 타이머 인터벌 */
  useEffect(() => {
    if (isActive) {
      updateTimerState();
      intervalRef.current = setInterval(updateTimerState, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setRemainingMs(0);
      setProgress(0);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, updateTimerState]);

  /** 단식 시작 */
  const handleStart = async () => {
    const now = new Date().toISOString();
    startFasting(fastingHours, eatingHours);
    await scheduleNotifications(now, currentPlan, notifications);
  };

  /** 종료 버튼 클릭 */
  const handleStopPress = () => {
    if (isFasting) {
      // 단식 중 종료 → 확인 모달
      setShowStopConfirmModal(true);
    } else if (isEating) {
      // 식사 중 종료 → 바로 종료 (단식은 이미 완료)
      void handleEatingStop();
    }
  };

  /** 단식 중 종료 확정 (미완료) */
  const handleConfirmStop = async () => {
    setShowStopConfirmModal(false);
    stopTimer(selectedPlanId);
    await cancelAllNotifications();
    setEndType('fasting_incomplete');
    setShowEndModal(true);
  };

  /** 식사 중 수동 종료 */
  const handleEatingStop = async () => {
    stopTimer(selectedPlanId);
    await cancelAllNotifications();
    setEndType('eating_early');
    setShowEndModal(true);
  };

  /** 기록 보기 (모달 확인) */
  const handleViewRecords = () => {
    setShowEndModal(false);
    router.push('/records');
  };

  // 오늘 날짜 정보
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const weekday = weekdays[today.getDay()];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <View className="flex-1 px-6 py-4">
        {/* 날짜 표시 */}
        <View className="items-center pt-10 pb-4">
          <Text className="text-2xl font-heading text-text-primary">
            {month}월 {day}일
          </Text>
          <Text className="text-sm font-sans text-text-secondary mt-1">
            {weekday}
          </Text>
        </View>

        {/* 타이머 영역 */}
        <View className="flex-1 items-center justify-center">
          <CircularTimer
            progress={progress}
            remainingTime={formatDuration(remainingMs)}
            status={status}
          />
        </View>

        {/* 하단 영역 */}
        <View className="gap-4 pb-4">
          {/* 팁 */}
          <TimerTip status={status} />

          {/* 플랜 정보 */}
          <TimerInfo
            status={status}
            planName={planName}
            planLabel={planLabel}
            startTime={currentStartTime ? formatTime(new Date(currentStartTime)) : null}
            targetEndTime={currentTargetEndTime ? formatTime(new Date(currentTargetEndTime)) : null}
            lastCompletedTime={lastCompletedRecord?.endTime ? formatTime(new Date(lastCompletedRecord.endTime)) : null}
          />

          {/* 버튼 */}
          <TimerButton
            status={status}
            onStart={handleStart}
            onStop={handleStopPress}
          />

          {/* 플랜 변경 링크 (idle 상태에서만 표시) */}
          {!isActive && (
            <Pressable
              onPress={() => router.push('/settings')}
              className="mt-3 self-center"
            >
              <Text className="font-sans text-sm text-text-secondary underline">
                단식 플랜 변경
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* 단식 중 종료 확인 모달 */}
      <Modal
        visible={showStopConfirmModal}
        type="confirm"
        title="단식을 종료하시겠습니까?"
        message="아직 목표 시간에 도달하지 않았습니다.\n종료하면 미완료로 기록됩니다."
        confirmText="종료"
        cancelText="계속하기"
        danger
        onConfirm={handleConfirmStop}
        onCancel={() => setShowStopConfirmModal(false)}
      />

      {/* 종료 완료 모달 */}
      <Modal
        visible={showEndModal}
        type="confirm"
        title={
          endType === 'natural_completion'
            ? '오늘의 단식을 완료했어요!'
            : endType === 'eating_early'
            ? '식사를 일찍 마쳤어요'
            : '단식이 기록되었습니다'
        }
        message="기록을 확인해보세요"
        confirmText="기록 보기"
        cancelText="닫기"
        onConfirm={handleViewRecords}
        onCancel={() => setShowEndModal(false)}
      />
    </SafeAreaView>
  );
}
