import { Pressable, Text } from 'react-native';
import type { TimerStatus } from '@/types';
import { THEME, ACCENT } from '@/constants/colors';

interface TimerButtonProps {
  /** 타이머 상태 */
  status: TimerStatus;
  /** 시작 핸들러 */
  onStart: () => void;
  /** 종료 핸들러 */
  onStop: () => void;
}

/** 상태별 버튼 텍스트 */
const BUTTON_TEXT: Record<TimerStatus, string> = {
  idle: '단식 시작',
  fasting: '단식 종료',
  eating: '식사 종료',
};

/** 상태별 버튼 색상 */
const BUTTON_COLOR: Record<TimerStatus, string> = {
  idle: THEME.btnPrimary,
  fasting: ACCENT.red,
  eating: ACCENT.green,
};

/** 타이머 시작/종료 버튼 */
export default function TimerButton({ status, onStart, onStop }: TimerButtonProps) {
  const isActive = status === 'fasting' || status === 'eating';

  return (
    <Pressable
      onPress={isActive ? onStop : onStart}
      className="w-full py-4 rounded-full items-center justify-center active:opacity-80"
      style={{ backgroundColor: BUTTON_COLOR[status] }}
    >
      <Text className="text-white text-lg font-heading">
        {BUTTON_TEXT[status]}
      </Text>
    </Pressable>
  );
}
