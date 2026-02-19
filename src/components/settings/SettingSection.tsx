import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

interface SettingSectionProps {
  /** 섹션 제목 */
  title: string;
  /** 섹션 내용 */
  children: ReactNode;
}

/** 설정 섹션 컴포넌트 */
export default function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">
        {title}
      </Text>
      <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
        {children}
      </View>
    </View>
  );
}
