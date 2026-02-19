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
      className={`rounded-2xl p-4 bg-surface ${
        isRecommended
          ? 'border-2 border-btn-primary'
          : 'border border-border-custom'
      }`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className={`text-base font-heading ${
            isRecommended
              ? 'text-text-primary'
              : 'text-text-primary'
          }`}
        >
          {timeWindow.title}
        </Text>
        {isRecommended && (
          <View className="bg-btn-primary px-2 py-0.5 rounded-full">
            <Text className="font-sans text-xs text-btn-text">추천</Text>
          </View>
        )}
      </View>

      <Text className="text-lg font-heading mb-2 text-text-primary">
        {timeWindow.timeRange}
      </Text>

      <Text className="font-sans text-sm text-text-secondary">
        {timeWindow.description}
      </Text>
    </View>
  );
}
