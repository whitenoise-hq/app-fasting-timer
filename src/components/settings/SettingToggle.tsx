import { View, Text, Switch } from 'react-native';
import { useSettingsStore } from '../../stores/settingsStore';
import { getThemeColors, ACCENT } from '../../constants/colors';

interface SettingToggleProps {
  /** 토글 제목 */
  title: string;
  /** 토글 설명 */
  description?: string;
  /** 현재 값 */
  value: boolean;
  /** 변경 핸들러 */
  onValueChange: (value: boolean) => void;
  /** 구분선 표시 여부 */
  showDivider?: boolean;
}

/** 설정 토글 스위치 */
export default function SettingToggle({
  title,
  description,
  value,
  onValueChange,
  showDivider = true,
}: SettingToggleProps) {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = getThemeColors(darkMode);

  return (
    <View>
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-1 mr-3">
          <Text className="text-base text-text-primary dark:text-text-primary-dark">{title}</Text>
          {description && (
            <Text className="text-sm text-text-muted dark:text-text-muted-dark mt-0.5">
              {description}
            </Text>
          )}
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.progressTrack, true: ACCENT.green }}
          thumbColor={value ? '#FFFFFF' : theme.surface}
        />
      </View>
      {showDivider && <View className="h-px bg-border-custom dark:bg-border-custom-dark ml-4" />}
    </View>
  );
}
