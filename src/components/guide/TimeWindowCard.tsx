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
      className={`rounded-2xl p-4 ${
        isRecommended
          ? 'bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800'
          : 'bg-gray-50 dark:bg-gray-800'
      }`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className={`text-base font-bold ${
            isRecommended
              ? 'text-primary-700 dark:text-primary-300'
              : 'text-gray-900 dark:text-white'
          }`}
        >
          {timeWindow.title}
        </Text>
        {isRecommended && (
          <View className="bg-primary-500 px-2 py-0.5 rounded">
            <Text className="text-xs font-medium text-white">추천</Text>
          </View>
        )}
      </View>

      <Text
        className={`text-lg font-semibold mb-2 ${
          isRecommended
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {timeWindow.timeRange}
      </Text>

      <Text className="text-sm text-gray-600 dark:text-gray-400">
        {timeWindow.description}
      </Text>
    </View>
  );
}
