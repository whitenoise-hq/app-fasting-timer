import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, AppState, AppStateStatus } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { getThemeColors, ACCENT } from '../../src/constants/colors';

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

type TimerStatus = 'idle' | 'fasting';

export default function HomeScreen() {
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [targetEndTime, setTargetEndTime] = useState<Date | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = getThemeColors(darkMode);

  const fastingHours = 16;
  const planName = '16:8';
  const planLabel = '가장 권장';

  /** 타이머 상태 업데이트 */
  const updateTimerState = useCallback(() => {
    if (status !== 'fasting' || !startTime || !targetEndTime) {
      return;
    }

    const now = Date.now();
    const remaining = Math.max(0, targetEndTime.getTime() - now);
    const total = targetEndTime.getTime() - startTime.getTime();
    const elapsed = now - startTime.getTime();

    setRemainingMs(remaining);
    setProgress(Math.min(1, Math.max(0, elapsed / total)));
  }, [status, startTime, targetEndTime]);

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
      }
    };
  }, [status, updateTimerState]);

  /** 단식 시작 */
  const handleStart = () => {
    const now = new Date();
    const target = new Date(now.getTime() + fastingHours * 60 * 60 * 1000);
    setStartTime(now);
    setTargetEndTime(target);
    setStatus('fasting');
  };

  /** 단식 종료 */
  const handleStop = () => {
    setStatus('idle');
    setStartTime(null);
    setTargetEndTime(null);
  };

  const isFasting = status === 'fasting';
  const statusText = isFasting ? '단식 중' : '대기 중';

  // 원형 타이머 계산
  const size = 280;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <View className="flex-1 px-6 py-4">
        {/* 타이머 영역 */}
        <View className="flex-1 items-center justify-center">
          <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={theme.progressTrack}
                strokeWidth={strokeWidth}
                fill="none"
              />
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={theme.progressBar}
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
                className="font-sans text-sm mb-1"
                style={{ color: theme.textSecondary }}
              >
                {statusText}
              </Text>
              <Text className="text-5xl font-heading text-text-primary dark:text-text-primary-dark">
                {formatDuration(remainingMs)}
              </Text>
              {isFasting && (
                <Text className="font-sans text-sm text-text-muted dark:text-text-muted-dark mt-2">
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
                stroke={ACCENT.blue}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text className="font-sans flex-1 text-sm text-text-secondary dark:text-text-secondary-dark">
              {isFasting ? '물, 블랙커피, 무가당 차는 OK!' : '오늘도 건강한 단식을 시작해보세요!'}
            </Text>
          </View>

          {/* 플랜 정보 */}
          <View className="w-full bg-surface dark:bg-surface-dark border border-border-custom dark:border-border-custom-dark rounded-2xl p-4">
            <View className="flex-row items-center justify-center mb-3">
              <Text className="text-lg font-heading text-text-primary dark:text-text-primary-dark">{planName}</Text>
              <View className="ml-2 px-2.5 py-0.5 bg-accent-green rounded-full">
                <Text className="font-sans text-xs text-white">{planLabel}</Text>
              </View>
            </View>
            {startTime && targetEndTime ? (
              <View className="flex-row justify-between">
                <View className="items-center flex-1">
                  <Text className="font-sans text-xs text-text-muted dark:text-text-muted-dark mb-1">시작</Text>
                  <Text className="text-base font-heading text-text-primary dark:text-text-primary-dark">
                    {formatTime(startTime)}
                  </Text>
                </View>
                <View className="w-px bg-border-custom dark:bg-border-custom-dark mx-4" />
                <View className="items-center flex-1">
                  <Text className="font-sans text-xs text-text-muted dark:text-text-muted-dark mb-1">목표</Text>
                  <Text className="text-base font-heading text-text-primary dark:text-text-primary-dark">
                    {formatTime(targetEndTime)}
                  </Text>
                </View>
              </View>
            ) : (
              <Text className="font-sans text-center text-sm text-text-muted dark:text-text-muted-dark">
                단식을 시작하면 시간 정보가 표시됩니다
              </Text>
            )}
          </View>

          {/* 버튼 */}
          <Pressable
            onPress={isFasting ? handleStop : handleStart}
            className="w-full py-4 rounded-full items-center justify-center bg-btn-primary dark:bg-btn-primary-dark active:opacity-80"
          >
            <Text className="text-btn-text dark:text-btn-text-dark text-lg font-heading">
              {isFasting ? '단식 종료' : '단식 시작'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
