import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { TimerStatus } from '../../types';
import { useSettingsStore } from '../../stores/settingsStore';
import { getThemeColors } from '../../constants/colors';

interface CircularTimerProps {
  /** 진행률 (0~1) */
  progress: number;
  /** 남은 시간 문자열 */
  remainingTime: string;
  /** 타이머 상태 */
  status: TimerStatus;
  /** 원 크기 */
  size?: number;
  /** 선 두께 */
  strokeWidth?: number;
}

/** 원형 프로그레스 타이머 */
export default function CircularTimer({
  progress,
  remainingTime,
  status,
  size = 280,
  strokeWidth = 12,
}: CircularTimerProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;

  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = getThemeColors(darkMode);

  /** 상태별 텍스트 */
  const getStatusText = () => {
    switch (status) {
      case 'fasting':
        return '단식 중';
      case 'eating':
        return '식사 가능';
      default:
        return '대기 중';
    }
  };

  return (
    <View className="items-center justify-center">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* 배경 원 */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={theme.progressTrack}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* 진행률 원 */}
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

        {/* 중앙 텍스트 */}
        <View
          className="absolute items-center justify-center"
          style={{ width: size, height: size }}
        >
          <Text
            className="text-sm font-medium mb-1"
            style={{ color: theme.textSecondary }}
          >
            {getStatusText()}
          </Text>
          <Text className="text-5xl font-bold text-text-primary dark:text-text-primary-dark">
            {remainingTime}
          </Text>
          {status === 'fasting' && (
            <Text className="text-sm text-text-muted dark:text-text-muted-dark mt-2">
              {Math.round(progress * 100)}% 완료
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
