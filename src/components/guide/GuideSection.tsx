import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

interface GuideSectionProps {
  /** 섹션 제목 */
  title: string;
  /** 섹션 내용 */
  children: ReactNode;
}

/** 가이드 섹션 컴포넌트 */
export default function GuideSection({ title, children }: GuideSectionProps) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </Text>
      {children}
    </View>
  );
}
