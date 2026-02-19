import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSettingsStore } from '../../stores/settingsStore';
import { getThemeColors } from '../../constants/colors';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQItemProps {
  faq: FAQ;
}

/** FAQ 아이템 (아코디언) */
export default function FAQItem({ faq }: FAQItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = getThemeColors(darkMode);

  return (
    <View className="bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden">
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between p-4 active:bg-background dark:active:bg-background-dark"
      >
        <Text className="text-base font-medium text-text-primary dark:text-text-primary-dark flex-1 mr-3">
          {faq.question}
        </Text>
        <View
          style={{
            transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
          }}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M6 9l6 6 6-6"
              stroke={theme.textMuted}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </Pressable>

      {isExpanded && (
        <View className="px-4 pb-4 pt-0">
          <View className="h-px bg-border-custom dark:bg-border-custom-dark mb-3" />
          <Text className="text-sm text-text-secondary dark:text-text-secondary-dark leading-5">
            {faq.answer}
          </Text>
        </View>
      )}
    </View>
  );
}
