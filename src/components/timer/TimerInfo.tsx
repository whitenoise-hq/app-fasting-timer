import { View, Text } from 'react-native';

interface TimerInfoProps {
  /** 플랜 이름 */
  planName: string;
  /** 플랜 라벨 */
  planLabel: string;
  /** 시작 시간 */
  startTime: string | null;
  /** 목표 종료 시간 */
  targetEndTime: string | null;
}

/** 타이머 하단 정보 표시 */
export default function TimerInfo({
  planName,
  planLabel,
  startTime,
  targetEndTime,
}: TimerInfoProps) {
  return (
    <View className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
      {/* 플랜 정보 */}
      <View className="flex-row items-center justify-center mb-3">
        <Text className="text-lg font-bold text-gray-900 dark:text-white">
          {planName}
        </Text>
        <View className="ml-2 px-2 py-0.5 bg-primary-100 dark:bg-primary-900 rounded">
          <Text className="text-xs font-medium text-primary-700 dark:text-primary-300">
            {planLabel}
          </Text>
        </View>
      </View>

      {/* 시간 정보 */}
      {startTime && targetEndTime ? (
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              시작
            </Text>
            <Text className="text-base font-semibold text-gray-900 dark:text-white">
              {startTime}
            </Text>
          </View>
          <View className="w-px bg-gray-200 dark:bg-gray-700 mx-4" />
          <View className="items-center flex-1">
            <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              목표
            </Text>
            <Text className="text-base font-semibold text-gray-900 dark:text-white">
              {targetEndTime}
            </Text>
          </View>
        </View>
      ) : (
        <Text className="text-center text-sm text-gray-500 dark:text-gray-400">
          단식을 시작하면 시간 정보가 표시됩니다
        </Text>
      )}
    </View>
  );
}
