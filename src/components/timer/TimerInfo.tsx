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
    <View className="w-full bg-surface dark:bg-surface-dark border border-border-custom dark:border-border-custom-dark rounded-2xl p-4">
      {/* 플랜 정보 */}
      <View className="flex-row items-center justify-center mb-3">
        <Text className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
          {planName}
        </Text>
        <View className="ml-2 px-2.5 py-0.5 bg-accent-green rounded-full">
          <Text className="text-xs font-medium text-white">
            {planLabel}
          </Text>
        </View>
      </View>

      {/* 시간 정보 */}
      {startTime && targetEndTime ? (
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-xs text-text-muted dark:text-text-muted-dark mb-1">
              시작
            </Text>
            <Text className="text-base font-semibold text-text-primary dark:text-text-primary-dark">
              {startTime}
            </Text>
          </View>
          <View className="w-px bg-border-custom dark:bg-border-custom-dark mx-4" />
          <View className="items-center flex-1">
            <Text className="text-xs text-text-muted dark:text-text-muted-dark mb-1">
              목표
            </Text>
            <Text className="text-base font-semibold text-text-primary dark:text-text-primary-dark">
              {targetEndTime}
            </Text>
          </View>
        </View>
      ) : (
        <Text className="text-center text-sm text-text-muted dark:text-text-muted-dark">
          단식을 시작하면 시간 정보가 표시됩니다
        </Text>
      )}
    </View>
  );
}
