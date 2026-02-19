import { View, Text, Switch } from 'react-native';

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
  return (
    <View>
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-1 mr-3">
          <Text className="text-base text-gray-900 dark:text-white">{title}</Text>
          {description && (
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </Text>
          )}
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#d1d5db', true: '#86efac' }}
          thumbColor={value ? '#22c55e' : '#f3f4f6'}
        />
      </View>
      {showDivider && <View className="h-px bg-gray-100 dark:bg-gray-700 ml-4" />}
    </View>
  );
}
