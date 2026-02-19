import { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { DEFAULT_PLANS } from '../../constants/plans';
import type { FastingPlan } from '../../types';

interface PlanSelectorProps {
  /** 선택된 플랜 ID */
  selectedPlanId: string;
  /** 커스텀 단식 시간 */
  customFastingHours: number | null;
  /** 커스텀 식사 시간 */
  customEatingHours: number | null;
  /** 플랜 선택 핸들러 */
  onSelectPlan: (planId: string) => void;
  /** 커스텀 시간 설정 핸들러 */
  onSetCustomHours: (fasting: number, eating: number) => void;
}

/** 단식 플랜 선택 컴포넌트 */
export default function PlanSelector({
  selectedPlanId,
  customFastingHours,
  customEatingHours,
  onSelectPlan,
  onSetCustomHours,
}: PlanSelectorProps) {
  const [customFasting, setCustomFasting] = useState(
    customFastingHours?.toString() ?? '16'
  );
  const [customEating, setCustomEating] = useState(
    customEatingHours?.toString() ?? '8'
  );

  const isCustomSelected = selectedPlanId === 'custom';

  /** 커스텀 시간 적용 */
  const handleApplyCustom = () => {
    const fasting = parseInt(customFasting, 10) || 16;
    const eating = parseInt(customEating, 10) || 8;
    onSetCustomHours(fasting, eating);
  };

  /** 플랜 항목 렌더링 */
  const renderPlanItem = (plan: FastingPlan, index: number) => {
    const isSelected = selectedPlanId === plan.id;
    const isLast = index === DEFAULT_PLANS.length - 1 && !isCustomSelected;

    return (
      <View key={plan.id}>
        <Pressable
          onPress={() => onSelectPlan(plan.id)}
          className="flex-row items-center px-4 py-3 active:bg-background"
        >
          {/* 라디오 버튼 */}
          <View
            className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
              isSelected
                ? 'border-btn-primary'
                : 'border-border-custom'
            }`}
          >
            {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-btn-primary" />}
          </View>

          {/* 플랜 정보 */}
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="font-sans text-base text-text-primary">
                {plan.name}
              </Text>
              <View className="ml-2 px-1.5 py-0.5 bg-background rounded">
                <Text className="font-sans text-xs text-text-secondary">
                  {plan.label}
                </Text>
              </View>
            </View>
            <Text className="font-sans text-sm text-text-muted mt-0.5">
              단식 {plan.fastingHours}시간 / 식사 {plan.eatingHours}시간
            </Text>
          </View>
        </Pressable>
        {!isLast && <View className="h-px bg-border-custom ml-12" />}
      </View>
    );
  };

  return (
    <View>
      {/* 프리셋 플랜 목록 */}
      {DEFAULT_PLANS.map((plan, index) => renderPlanItem(plan, index))}

      {/* 커스텀 옵션 */}
      <View className="h-px bg-border-custom ml-12" />
      <Pressable
        onPress={() => onSelectPlan('custom')}
        className="flex-row items-center px-4 py-3 active:bg-background"
      >
        <View
          className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
            isCustomSelected
              ? 'border-btn-primary'
              : 'border-border-custom'
          }`}
        >
          {isCustomSelected && <View className="w-2.5 h-2.5 rounded-full bg-btn-primary" />}
        </View>
        <Text className="font-sans text-base text-text-primary">
          직접입력
        </Text>
      </Pressable>

      {/* 커스텀 입력 필드 */}
      {isCustomSelected && (
        <View className="px-4 pb-4">
          <View className="flex-row gap-3 ml-8">
            <View className="flex-1">
              <Text className="font-sans text-xs text-text-muted mb-1">
                단식 (시간)
              </Text>
              <TextInput
                value={customFasting}
                onChangeText={setCustomFasting}
                onBlur={handleApplyCustom}
                keyboardType="number-pad"
                maxLength={2}
                className="font-sans bg-background rounded-lg px-3 py-2 text-base text-text-primary"
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View className="flex-1">
              <Text className="font-sans text-xs text-text-muted mb-1">
                식사 (시간)
              </Text>
              <TextInput
                value={customEating}
                onChangeText={setCustomEating}
                onBlur={handleApplyCustom}
                keyboardType="number-pad"
                maxLength={2}
                className="font-sans bg-background rounded-lg px-3 py-2 text-base text-text-primary"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
