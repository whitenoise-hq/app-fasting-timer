import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { TimerStatus } from '../../types';
import { ACCENT } from '../../constants/colors';

interface TimerTipProps {
  /** 타이머 상태 */
  status: TimerStatus;
}

/** 상태별 팁 텍스트 */
const TIPS: Record<TimerStatus, string> = {
  idle: '오늘도 건강한 단식을 시작해보세요!',
  fasting: '물, 블랙커피, 무가당 차는 OK!',
  eating: '식사 시간이 끝나기 전에 마무리하세요',
};

/** 타이머 상태별 팁 표시 */
export default function TimerTip({ status }: TimerTipProps) {
  const tip = TIPS[status];

  return (
    <View className="flex-row items-center bg-accent-blue/10 rounded-xl px-4 py-3">
      {/* 전구 아이콘 */}
      <View className="mr-3">
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 21h6M12 3a6 6 0 00-4 10.47V17a1 1 0 001 1h6a1 1 0 001-1v-3.53A6 6 0 0012 3z"
            stroke={ACCENT.blue}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      <Text className="font-sans flex-1 text-sm text-text-secondary">
        {tip}
      </Text>
    </View>
  );
}
