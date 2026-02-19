import { Pressable, Text } from 'react-native';
import type { TimerStatus } from '../../types';

interface TimerButtonProps {
  /** 타이머 상태 */
  status: TimerStatus;
  /** 시작 핸들러 */
  onStart: () => void;
  /** 종료 핸들러 */
  onStop: () => void;
}

/** 타이머 시작/종료 버튼 */
export default function TimerButton({ status, onStart, onStop }: TimerButtonProps) {
  const isFasting = status === 'fasting';

  return (
    <Pressable
      onPress={isFasting ? onStop : onStart}
      className="w-full py-4 rounded-full items-center justify-center bg-btn-primary active:opacity-80"
    >
      <Text className="text-btn-text text-lg font-heading">
        {isFasting ? '단식 종료' : '단식 시작'}
      </Text>
    </Pressable>
  );
}
