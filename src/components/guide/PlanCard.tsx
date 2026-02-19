import { View, Text } from 'react-native';
import type { FastingPlan } from '../../types';

interface PlanCardProps {
  plan: FastingPlan;
}

/** 플랜별 라벨 chip 색상 */
const LABEL_COLORS: Record<string, string> = {
  '12-12': 'bg-accent-blue',
  '14-10': 'bg-accent-green',
  '16-8': 'bg-accent-orange',
  '23-1': 'bg-accent-red',
};

/** 단식 플랜 카드 */
export default function PlanCard({ plan }: PlanCardProps) {
  const chipColor = LABEL_COLORS[plan.id] ?? 'bg-text-muted';

  return (
    <View className="bg-surface dark:bg-surface-dark border border-border-custom dark:border-border-custom-dark rounded-2xl p-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-2xl font-heading text-text-primary dark:text-text-primary-dark">
          {plan.name}
        </Text>
        <View className={`px-2.5 py-1 rounded-full ${chipColor}`}>
          <Text className="font-sans text-xs text-white">{plan.label}</Text>
        </View>
      </View>

      <View className="flex-row mb-3">
        <View className="flex-1 mr-2">
          <Text className="font-sans text-xs text-text-muted dark:text-text-muted-dark mb-1">단식</Text>
          <Text className="text-lg font-heading text-text-primary dark:text-text-primary-dark">
            {plan.fastingHours}시간
          </Text>
        </View>
        <View className="flex-1">
          <Text className="font-sans text-xs text-text-muted dark:text-text-muted-dark mb-1">식사</Text>
          <Text className="text-lg font-heading text-text-primary dark:text-text-primary-dark">
            {plan.eatingHours}시간
          </Text>
        </View>
      </View>

      <Text className="font-sans text-sm text-text-secondary dark:text-text-secondary-dark">
        {plan.description}
      </Text>
    </View>
  );
}
