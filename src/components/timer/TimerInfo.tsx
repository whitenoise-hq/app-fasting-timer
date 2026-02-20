import { View, Text } from 'react-native';
import type { TimerStatus } from '@/types';

interface TimerInfoProps {
  /** 타이머 상태 */
  status: TimerStatus;
  /** 플랜 이름 */
  planName: string;
  /** 플랜 라벨 */
  planLabel: string;
  /** 시작 시간 */
  startTime: string | null;
  /** 목표 종료 시간 */
  targetEndTime: string | null;
  /** 마지막 완료 시간 (idle 상태에서 표시) */
  lastCompletedTime?: string | null;
}

/** 타이머 하단 정보 표시 */
export default function TimerInfo({
  status,
  planName,
  planLabel,
  startTime,
  targetEndTime,
  lastCompletedTime,
}: TimerInfoProps) {
  const isFasting = status === 'fasting';

  // 상태별 라벨
  const startLabel = isFasting ? '단식 시작' : '식사 시작';
  const endLabel = isFasting ? '단식 목표' : '식사 목표';

  return (
    <View className="w-full bg-surface border border-border-custom rounded-2xl p-4">
      {/* 플랜 정보 */}
      <View className="flex-row items-center justify-center mb-3">
        <Text className="text-lg font-heading text-text-primary">
          {planName}
        </Text>
        <View className="ml-2 px-3 py-1 bg-accent-green rounded-full">
          <Text className="font-sans text-xs text-white" numberOfLines={1}>
            {planLabel}
          </Text>
        </View>
      </View>

      {/* 시간 정보 */}
      {startTime && targetEndTime ? (
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="font-sans text-xs text-text-muted mb-1">
              {startLabel}
            </Text>
            <Text className="text-base font-heading text-text-primary">
              {startTime}
            </Text>
          </View>
          <View className="w-px bg-border-custom mx-4" />
          <View className="items-center flex-1">
            <Text className="font-sans text-xs text-text-muted mb-1">
              {endLabel}
            </Text>
            <Text className="text-base font-heading text-text-primary">
              {targetEndTime}
            </Text>
          </View>
        </View>
      ) : lastCompletedTime ? (
        <Text className="font-sans text-center text-sm text-text-secondary">
          마지막 단식: {lastCompletedTime} 완료
        </Text>
      ) : (
        <Text className="font-sans text-center text-sm text-text-muted">
          단식을 시작하면 시간 정보가 표시됩니다
        </Text>
      )}
    </View>
  );
}
