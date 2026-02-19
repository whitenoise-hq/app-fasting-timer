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
      <Text className="font-sans text-sm text-text-secondary mb-2 px-1">
        {title}
      </Text>
      <View className="bg-surface rounded-2xl overflow-hidden">
        {children}
      </View>
    </View>
  );
}
