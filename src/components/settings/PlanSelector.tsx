import { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { DEFAULT_PLANS } from '@/constants/plans';
import { Modal } from '../common';
import type { FastingPlan } from '@/types';

interface PlanSelectorProps {
  /** 저장된 플랜 ID */
  selectedPlanId: string;
  /** 저장된 커스텀 단식 시간 */
  customFastingHours: number | null;
  /** 저장된 커스텀 식사 시간 */
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
  // 임시 선택 상태 (저장 전)
  const [tempPlanId, setTempPlanId] = useState(selectedPlanId);
  const [tempFasting, setTempFasting] = useState(
    customFastingHours?.toString() ?? '16'
  );
  const [tempEating, setTempEating] = useState(
    customEatingHours?.toString() ?? '8'
  );

  // 모달 상태
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // 저장된 값이 변경되면 임시 상태도 업데이트
  useEffect(() => {
    setTempPlanId(selectedPlanId);
  }, [selectedPlanId]);

  useEffect(() => {
    if (customFastingHours !== null) {
      setTempFasting(customFastingHours.toString());
    }
    if (customEatingHours !== null) {
      setTempEating(customEatingHours.toString());
    }
  }, [customFastingHours, customEatingHours]);

  const isCustomSelected = tempPlanId === 'custom';

  // 변경 사항 있는지 확인
  const hasChanges = useMemo(() => {
    if (tempPlanId !== selectedPlanId) return true;
    if (tempPlanId === 'custom') {
      const fasting = parseInt(tempFasting, 10) || 0;
      const eating = parseInt(tempEating, 10) || 0;
      if (fasting !== customFastingHours || eating !== customEatingHours) {
        return true;
      }
    }
    return false;
  }, [tempPlanId, selectedPlanId, tempFasting, tempEating, customFastingHours, customEatingHours]);

  /** 저장 버튼 클릭 */
  const handleSave = () => {
    if (tempPlanId === 'custom') {
      const fasting = parseInt(tempFasting, 10) || 0;
      const eating = parseInt(tempEating, 10) || 0;

      // 24시간 검증
      if (fasting + eating !== 24) {
        setShowErrorModal(true);
        return;
      }

      onSetCustomHours(fasting, eating);
    } else {
      onSelectPlan(tempPlanId);
    }

    setShowSuccessModal(true);
  };

  /** 플랜 항목 렌더링 */
  const renderPlanItem = (plan: FastingPlan) => {
    const isSelected = tempPlanId === plan.id;

    return (
      <View key={plan.id}>
        <Pressable
          onPress={() => setTempPlanId(plan.id)}
          className="flex-row items-center px-4 py-3 active:bg-background/50"
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
      </View>
    );
  };

  return (
    <>
    <View className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
      {/* 프리셋 플랜 목록 */}
      {DEFAULT_PLANS.map((plan) => renderPlanItem(plan))}

      {/* 커스텀 옵션 */}
      <Pressable
        onPress={() => setTempPlanId('custom')}
        className="flex-row items-center px-4 py-3 active:bg-background/50"
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
          <View className="px-4 pb-3">
            <View className="flex-row gap-3 ml-8">
            <View className="flex-1">
              <Text className="font-sans text-xs text-text-muted mb-1">
                단식 (시간)
              </Text>
              <TextInput
                value={tempFasting}
                onChangeText={(text) => {
                  setTempFasting(text);
                  const fasting = parseInt(text, 10);
                  if (!isNaN(fasting) && fasting >= 0 && fasting <= 24) {
                    setTempEating((24 - fasting).toString());
                  }
                }}
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
                value={tempEating}
                onChangeText={setTempEating}
                keyboardType="number-pad"
                maxLength={2}
                className="font-sans bg-background rounded-lg px-3 py-2 text-base text-text-primary"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        </View>
        )}

      {/* 저장 버튼 */}
      <View className="px-4 pt-4 pb-4">
        <Pressable
          onPress={handleSave}
          disabled={!hasChanges}
          className={`py-3 rounded-full items-center justify-center ${
            hasChanges
              ? 'bg-btn-primary active:opacity-80'
              : 'bg-border-custom'
          }`}
        >
          <Text
            className={`font-heading text-base ${
              hasChanges ? 'text-white' : 'text-text-muted'
            }`}
          >
            저장
          </Text>
        </Pressable>
      </View>
    </View>

    {/* 저장 성공 모달 */}
    <Modal
      visible={showSuccessModal}
      type="alert"
      title="저장되었습니다"
      onConfirm={() => setShowSuccessModal(false)}
    />

    {/* 24시간 오류 모달 */}
    <Modal
      visible={showErrorModal}
      type="alert"
      title="시간 설정 오류"
      message="단식 시간과 식사 시간의 합이\n24시간이 되어야 합니다."
      onConfirm={() => setShowErrorModal(false)}
    />
  </>
  );
}
