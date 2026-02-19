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
  /** 단식 시작 */
  startFasting: () => void;
  /** 단식 종료 */
  stopFasting: () => void;
}

/**
 * 타이머 로직을 관리하는 커스텀 훅
 * - 백그라운드 복귀 시 startTime 기준으로 재계산
 * - setInterval은 UI 업데이트용으로만 사용
 */
export function useTimer(): UseTimerReturn {
  const { status, startTime, targetEndTime, startFasting: storeStartFasting, stopFasting: storeStopFasting } =
    useTimerStore();
  const { selectedPlanId, customFastingHours } = useSettingsStore();

  const [remainingMs, setRemainingMs] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** 현재 플랜 정보 가져오기 */
  const plan = getPlanById(selectedPlanId);
  const fastingHours = plan?.fastingHours ?? customFastingHours ?? 16;
  const planName = plan?.name ?? `${customFastingHours}:${24 - (customFastingHours ?? 16)}`;
  const planLabel = plan?.label ?? '커스텀';

  /** 타이머 상태 업데이트 (startTime 기준 재계산) */
  const updateTimerState = useCallback(() => {
    if (status !== 'fasting' || !startTime || !targetEndTime) {
      setRemainingMs(0);
      setProgress(0);
      return;
    }

    const remaining = getRemainingMs(targetEndTime);
    const currentProgress = getProgress(startTime, targetEndTime);

    setRemainingMs(remaining);
    setProgress(currentProgress);

    // 목표 시간 도달 시 자동 종료하지 않음 (사용자가 직접 종료)
  }, [status, startTime, targetEndTime]);

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
    if (status === 'fasting') {
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
  }, [status, updateTimerState]);

  /** 단식 시작 */
  const startFasting = useCallback(() => {
    storeStartFasting(fastingHours);
  }, [storeStartFasting, fastingHours]);

  /** 단식 종료 */
  const stopFasting = useCallback(() => {
    const completed = progress >= 1;
    storeStopFasting(completed, selectedPlanId);
  }, [storeStopFasting, progress, selectedPlanId]);

  return {
    status,
    remainingTime: formatDuration(remainingMs),
    progress,
    startTimeDisplay: startTime ? formatTime(startTime) : null,
    targetEndDisplay: targetEndTime ? formatTime(targetEndTime) : null,
    planName,
    planLabel,
    startFasting,
    stopFasting,
  };
}
