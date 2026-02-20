import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useTimerStore } from '../stores/timerStore';
import { useSettingsStore } from '../stores/settingsStore';
import { getPlanById } from '../constants/plans';
import { getRemainingMs, getProgress, formatDuration, formatTime } from '../utils/time';

interface UseTimerReturn {
  /** 타이머 상태 */
  status: 'idle' | 'fasting' | 'eating';
  /** 남은 시간 문자열 (HH:MM:SS) */
  remainingTime: string;
  /** 진행률 (0~1) */
  progress: number;
  /** 시작 시간 표시 문자열 */
  startTimeDisplay: string | null;
  /** 목표 종료 시간 표시 문자열 */
  targetEndDisplay: string | null;
  /** 현재 플랜 이름 */
  planName: string;
  /** 현재 플랜 라벨 */
  planLabel: string;
  /** 단식 중인지 */
  isFasting: boolean;
  /** 식사 중인지 */
  isEating: boolean;
  /** 타이머 활성 상태 */
  isActive: boolean;
  /** 단식 시작 */
  startFasting: () => void;
  /** 타이머 종료 */
  stopTimer: () => void;
}

/**
 * 타이머 로직을 관리하는 커스텀 훅
 * - 백그라운드 복귀 시 startTime 기준으로 재계산
 * - setInterval은 UI 업데이트용으로만 사용
 * - 단식 → 식사 → 단식 두 단계 사이클 지원
 */
export function useTimer(): UseTimerReturn {
  const {
    status,
    fastingStartTime,
    fastingTargetEndTime,
    eatingStartTime,
    eatingTargetEndTime,
    startFasting: storeStartFasting,
    stopTimer: storeStopTimer,
  } = useTimerStore();
  const { selectedPlanId, customFastingHours, customEatingHours } = useSettingsStore();

  const [remainingMs, setRemainingMs] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** 현재 플랜 정보 가져오기 */
  const plan = getPlanById(selectedPlanId);
  const fastingHours = plan?.fastingHours ?? customFastingHours ?? 16;
  const eatingHours = plan?.eatingHours ?? customEatingHours ?? 8;
  const planName = plan?.name ?? `${customFastingHours ?? 16}:${24 - (customFastingHours ?? 16)}`;
  const planLabel = plan?.label ?? '커스텀';

  const isFasting = status === 'fasting';
  const isEating = status === 'eating';
  const isActive = isFasting || isEating;

  /** 현재 단계의 시작/목표 시간 */
  const currentStartTime = isFasting ? fastingStartTime : eatingStartTime;
  const currentTargetEndTime = isFasting ? fastingTargetEndTime : eatingTargetEndTime;

  /** 타이머 상태 업데이트 (startTime 기준 재계산) */
  const updateTimerState = useCallback(() => {
    if (!isActive || !currentStartTime || !currentTargetEndTime) {
      setRemainingMs(0);
      setProgress(0);
      return;
    }

    const remaining = getRemainingMs(currentTargetEndTime);
    const currentProgress = getProgress(currentStartTime, currentTargetEndTime);

    setRemainingMs(remaining);
    setProgress(currentProgress);
  }, [isActive, currentStartTime, currentTargetEndTime]);

  /** 앱 상태 변화 감지 (백그라운드 → 포그라운드) */
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        updateTimerState();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [updateTimerState]);

  /** 타이머 인터벌 관리 */
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
        intervalRef.current = null;
      }
    };
  }, [isActive, updateTimerState]);

  /** 단식 시작 */
  const startFasting = useCallback(() => {
    storeStartFasting(fastingHours, eatingHours);
  }, [storeStartFasting, fastingHours, eatingHours]);

  /** 타이머 종료 */
  const stopTimer = useCallback(() => {
    storeStopTimer(selectedPlanId);
  }, [storeStopTimer, selectedPlanId]);

  return {
    status,
    remainingTime: formatDuration(remainingMs),
    progress,
    startTimeDisplay: currentStartTime ? formatTime(currentStartTime) : null,
    targetEndDisplay: currentTargetEndTime ? formatTime(currentTargetEndTime) : null,
    planName,
    planLabel,
    isFasting,
    isEating,
    isActive,
    startFasting,
    stopTimer,
  };
}
