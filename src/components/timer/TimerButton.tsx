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
      className={`
        w-full py-4 rounded-2xl items-center justify-center
        ${isFasting
          ? 'bg-red-500 active:bg-red-600'
          : 'bg-primary-500 active:bg-primary-600'
        }
      `}
    >
      <Text className="text-white text-lg font-semibold">
        {isFasting ? '단식 종료' : '단식 시작'}
      </Text>
    </Pressable>
  );
}
