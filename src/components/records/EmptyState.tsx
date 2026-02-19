import { View, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { THEME } from '../../constants/colors';

/** 기록이 없을 때 표시되는 빈 상태 UI */
export default function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center py-12">
      {/* 아이콘 */}
      <View className="w-24 h-24 bg-background rounded-full items-center justify-center mb-6">
        <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
          <Path
            d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18"
            stroke={THEME.textMuted}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="15" r="2" stroke={THEME.textMuted} strokeWidth={1.5} />
        </Svg>
      </View>

      {/* 텍스트 */}
      <Text className="text-xl font-heading text-text-primary mb-2">
        아직 단식 기록이 없어요
      </Text>
      <Text className="font-sans text-sm text-text-muted text-center px-8">
        첫 번째 단식을 시작하면{'\n'}여기에 기록이 표시됩니다
      </Text>
    </View>
  );
}
