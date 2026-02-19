import { View, Text } from 'react-native';
import type { FastingStats } from '../../types';

interface WeeklyStatsProps {
  /** 전체 통계 */
  stats: FastingStats;
  /** 이번 주 통계 */
  weeklyStats: {
    totalCount: number;
    completedCount: number;
    successRate: number;
    averageDuration: number;
  };
}

/** 분을 시간:분 형태로 변환 */
function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}분`;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}

/** 주간 통계 카드 */
export default function WeeklyStats({ stats, weeklyStats }: WeeklyStatsProps) {
  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-4">
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        이번 주 통계
      </Text>

      <View className="flex-row flex-wrap -mx-2">
        {/* 성공률 */}
        <View className="w-1/2 px-2 mb-4">
          <View className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3">
            <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">성공률</Text>
            <View className="flex-row items-baseline">
              <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                {weeklyStats.successRate}
              </Text>
              <Text className="text-sm text-green-600 dark:text-green-400 ml-0.5">%</Text>
            </View>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {weeklyStats.completedCount}/{weeklyStats.totalCount}회 완료
            </Text>
          </View>
        </View>

        {/* 평균 단식 시간 */}
        <View className="w-1/2 px-2 mb-4">
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
            <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">평균 단식</Text>
            <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {weeklyStats.averageDuration > 0
                ? formatMinutes(weeklyStats.averageDuration)
                : '-'}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              이번 주 평균
            </Text>
          </View>
        </View>

        {/* 현재 스트릭 */}
        <View className="w-1/2 px-2">
          <View className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3">
            <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">현재 연속</Text>
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.currentStreak}
              </Text>
              <Text className="text-xl ml-1">🔥</Text>
            </View>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              연속 달성 중
            </Text>
          </View>
        </View>

        {/* 최장 스트릭 */}
        <View className="w-1/2 px-2">
          <View className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3">
            <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">최장 연속</Text>
            <View className="flex-row items-center">
              <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.longestStreak}
              </Text>
              <Text className="text-sm text-purple-600 dark:text-purple-400 ml-1">일</Text>
            </View>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              역대 최고 기록
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
