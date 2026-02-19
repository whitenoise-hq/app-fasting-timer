import { View, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSettingsStore } from '../../stores/settingsStore';
import { getThemeColors } from '../../constants/colors';

/** 기록이 없을 때 표시되는 빈 상태 UI */
export default function EmptyState() {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = getThemeColors(darkMode);

  return (
    <View className="flex-1 items-center justify-center py-12">
      {/* 아이콘 */}
      <View className="w-24 h-24 bg-background dark:bg-background-dark rounded-full items-center justify-center mb-6">
        <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
          <Path
            d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM16 2v4M8 2v4M3 10h18"
            stroke={theme.textMuted}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="15" r="2" stroke={theme.textMuted} strokeWidth={1.5} />
        </Svg>
      </View>

      {/* 텍스트 */}
      <Text className="text-xl font-heading text-text-primary dark:text-text-primary-dark mb-2">
        아직 단식 기록이 없어요
      </Text>
      <Text className="font-sans text-sm text-text-muted dark:text-text-muted-dark text-center px-8">
        첫 번째 단식을 시작하면{'\n'}여기에 기록이 표시됩니다
      </Text>
    </View>
  );
}
