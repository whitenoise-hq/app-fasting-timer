import { View, Text } from 'react-native';

interface TimeWindow {
  id: string;
  title: string;
  timeRange: string;
  description: string;
}

interface TimeWindowCardProps {
  timeWindow: TimeWindow;
  isRecommended?: boolean;
}

/** 추천 식사 시간대 카드 */
export default function TimeWindowCard({ timeWindow, isRecommended }: TimeWindowCardProps) {
  return (
    <View
      className={`rounded-2xl p-4 bg-surface dark:bg-surface-dark ${
        isRecommended
          ? 'border-2 border-btn-primary dark:border-btn-primary-dark'
          : 'border border-border-custom dark:border-border-custom-dark'
      }`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className={`text-base font-bold ${
            isRecommended
              ? 'text-text-primary dark:text-text-primary-dark'
              : 'text-text-primary dark:text-text-primary-dark'
          }`}
        >
          {timeWindow.title}
        </Text>
        {isRecommended && (
          <View className="bg-btn-primary dark:bg-btn-primary-dark px-2 py-0.5 rounded-full">
            <Text className="text-xs font-medium text-btn-text dark:text-btn-text-dark">추천</Text>
          </View>
        )}
      </View>

      <Text className="text-lg font-semibold mb-2 text-text-primary dark:text-text-primary-dark">
        {timeWindow.timeRange}
      </Text>

      <Text className="text-sm text-text-secondary dark:text-text-secondary-dark">
        {timeWindow.description}
      </Text>
    </View>
  );
}
