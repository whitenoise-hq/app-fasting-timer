import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import type { TimerStatus } from '@/types';
import { THEME, ACCENT } from '@/constants/colors';

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

/** 상태별 텍스트 */
const STATUS_TEXT: Record<TimerStatus, string> = {
  idle: '대기 중',
  fasting: '단식 중',
  eating: '식사 중',
};

/** 상태별 색상 */
const STATUS_COLOR: Record<TimerStatus, string> = {
  idle: THEME.textSecondary,
  fasting: ACCENT.red,
  eating: ACCENT.green,
};

/** 원형 프로그레스 타이머 */
export default function CircularTimer({
  progress,
  remainingTime,
  status,
  size = 280,
  strokeWidth = 14,
}: CircularTimerProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;

  const isActive = status === 'fasting' || status === 'eating';

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* 배경 원 */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={THEME.progressTrack}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* 진행률 원 */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={THEME.progressBar}
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
          className="font-heading text-sm mb-1"
          style={{ color: STATUS_COLOR[status] }}
        >
          {STATUS_TEXT[status]}
        </Text>
        <Text className="text-5xl font-heading text-text-primary">
          {remainingTime}
        </Text>
        {isActive && (
          <Text className="font-sans text-sm text-text-muted mt-2">
            {Math.round(progress * 100)}% 완료
          </Text>
        )}
      </View>
    </View>
  );
}
