import { View, Text } from 'react-native';
import type { FastingPlan } from '../../types';

interface PlanCardProps {
  plan: FastingPlan;
}

/** 단식 플랜 카드 */
export default function PlanCard({ plan }: PlanCardProps) {
  /** 플랜별 배경색 */
  const getBgColor = () => {
    switch (plan.id) {
      case '12-12':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case '14-10':
        return 'bg-green-50 dark:bg-green-900/20';
      case '16-8':
        return 'bg-amber-50 dark:bg-amber-900/20';
      case '23-1':
        return 'bg-red-50 dark:bg-red-900/20';
      default:
        return 'bg-gray-50 dark:bg-gray-800';
    }
  };

  /** 플랜별 라벨 색상 */
  const getLabelColor = () => {
    switch (plan.id) {
      case '12-12':
        return 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200';
      case '14-10':
        return 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200';
      case '16-8':
        return 'bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-200';
      case '23-1':
        return 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200';
    }
  };

  return (
    <View className={`rounded-2xl p-4 ${getBgColor()}`}>
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          {plan.name}
        </Text>
        <View className={`px-2 py-1 rounded-full ${getLabelColor()}`}>
          <Text className="text-xs font-medium">{plan.label}</Text>
        </View>
      </View>

      <View className="flex-row mb-3">
        <View className="flex-1 mr-2">
          <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">단식</Text>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {plan.fastingHours}시간
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">식사</Text>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {plan.eatingHours}시간
          </Text>
        </View>
      </View>

      <Text className="text-sm text-gray-600 dark:text-gray-300">
        {plan.description}
      </Text>
    </View>
  );
}
