import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';

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

  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between p-4 active:bg-gray-50 dark:active:bg-gray-700"
      >
        <Text className="text-base font-medium text-gray-900 dark:text-white flex-1 mr-3">
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
              stroke="#9ca3af"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </Pressable>

      {isExpanded && (
        <View className="px-4 pb-4 pt-0">
          <View className="h-px bg-gray-100 dark:bg-gray-700 mb-3" />
          <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
            {faq.answer}
          </Text>
        </View>
      )}
    </View>
  );
}
