import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, Text, Pressable, AppState, AppStateStatus } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTimerStore } from '../../src/stores/timerStore';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { getPlanById } from '../../src/constants/plans';
import { THEME, ACCENT } from '../../src/constants/colors';
import { useNotification } from '../../src/hooks/useNotification';
import { Modal } from '../../src/components/common';
import type { FastingPlan } from '../../src/types';

/** 밀리초를 시:분:초 형태로 변환 */
function formatDuration(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
}

/** ISO 문자열을 "오전/오후 HH:MM" 형태로 변환 */
function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? '오전' : '오후';
  const displayHours = hours % 12 || 12;
  return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
}

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

  // 상태별 텍스트 및 색상
  const statusText = isFasting ? '단식 중' : isEating ? '식사 중' : '대기 중';
  const progressColor = THEME.progressBar;
  const buttonColor = isFasting ? ACCENT.red : isEating ? ACCENT.green : THEME.btnPrimary;
  const buttonText = isFasting ? '단식 종료' : isEating ? '식사 종료' : '단식 시작';

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
      handleEatingStop();
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

  // 원형 타이머 계산
  const size = 280;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;

  // 오늘 날짜 정보
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const weekday = weekdays[today.getDay()];

  // 팁 텍스트
  const tipText = isFasting
    ? '물, 블랙커피, 무가당 차는 OK!'
    : isEating
    ? '건강한 음식으로 식사를 즐기세요!'
    : '오늘도 건강한 단식을 시작해보세요!';

  return (
    <SafeAreaView className="flex-1 bg-background">
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
          <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={THEME.progressTrack}
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={progressColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 ${center} ${center})`}
              />
            </Svg>
            <View
              className="absolute items-center justify-center"
              style={{ width: size, height: size }}
            >
              <Text
                className="font-heading text-sm mb-1"
                style={{ color: isFasting ? ACCENT.red : isEating ? ACCENT.green : THEME.textSecondary }}
              >
                {statusText}
              </Text>
              <Text className="text-5xl font-heading text-text-primary">
                {formatDuration(remainingMs)}
              </Text>
              {isActive && (
                <Text className="font-sans text-sm text-text-muted mt-2">
                  {Math.round(progress * 100)}% 완료
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* 하단 영역 */}
        <View className="gap-4 pb-4">
          {/* 팁 */}
          <View className="flex-row items-center bg-accent-blue/10 rounded-xl px-4 py-3">
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" className="mr-3">
              <Path
                d="M9 21h6M12 3a6 6 0 00-4 10.47V17a1 1 0 001 1h6a1 1 0 001-1v-3.53A6 6 0 0012 3z"
                stroke={ACCENT.yellow}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text className="font-sans flex-1 text-sm text-text-secondary ml-1">
              {tipText}
            </Text>
          </View>

          {/* 플랜 정보 */}
          <View className="w-full bg-surface border border-border-custom rounded-2xl p-4">
            <View className="flex-row items-center justify-center mb-3">
              <Text className="text-lg font-heading text-text-primary">{planName}</Text>
              <View className="ml-2 px-2.5 py-0.5 bg-accent-green rounded-full">
                <Text className="font-sans text-xs text-white">{planLabel}</Text>
              </View>
            </View>
            {currentStartTime && currentTargetEndTime ? (
              <View className="flex-row justify-between">
                <View className="items-center flex-1">
                  <Text className="font-sans text-xs text-text-muted mb-1">
                    {isFasting ? '단식 시작' : '식사 시작'}
                  </Text>
                  <Text className="text-base font-heading text-text-primary">
                    {formatTime(new Date(currentStartTime))}
                  </Text>
                </View>
                <View className="w-px bg-border-custom mx-4" />
                <View className="items-center flex-1">
                  <Text className="font-sans text-xs text-text-muted mb-1">
                    {isFasting ? '단식 목표' : '식사 목표'}
                  </Text>
                  <Text className="text-base font-heading text-text-primary">
                    {formatTime(new Date(currentTargetEndTime))}
                  </Text>
                </View>
              </View>
            ) : lastCompletedRecord?.endTime ? (
              <Text className="font-sans text-center text-sm text-text-secondary">
                마지막 단식: {formatTime(new Date(lastCompletedRecord.endTime))} 완료
              </Text>
            ) : (
              <Text className="font-sans text-center text-sm text-text-muted">
                단식을 시작하면 시간 정보가 표시됩니다
              </Text>
            )}
          </View>

          {/* 버튼 */}
          <Pressable
            onPress={isActive ? handleStopPress : handleStart}
            className="w-full py-4 rounded-full items-center justify-center active:opacity-80"
            style={{ backgroundColor: buttonColor }}
          >
            <Text className="text-white text-lg font-heading">
              {buttonText}
            </Text>
          </Pressable>
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
        emoji={endType === 'natural_completion' ? '🎉' : endType === 'eating_early' ? '👍' : '📝'}
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
