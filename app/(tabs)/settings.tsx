import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  SettingSection,
  SettingToggle,
  PlanSelector,
  DangerButton,
} from '../../src/components/settings';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useTimerStore } from '../../src/stores/timerStore';
import { useNotification, PermissionStatus } from '../../src/hooks/useNotification';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const {
    selectedPlanId,
    customFastingHours,
    customEatingHours,
    notifications,
    setSelectedPlan,
    setCustomHours,
    setNotification,
    resetSettings,
  } = useSettingsStore();

  const resetTimer = useTimerStore((state) => state.reset);
  const { getPermissionStatus, requestPermissions } = useNotification();
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('undetermined');

  /** 권한 상태 확인 */
  const checkPermission = useCallback(async () => {
    const status = await getPermissionStatus();
    setPermissionStatus(status);
  }, [getPermissionStatus]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  /** 설정 앱 열기 */
  const openSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }, []);

  /** 모든 데이터 초기화 */
  const handleResetAllData = () => {
    resetSettings();
    resetTimer();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View className="mb-6">
          <Text className="text-2xl font-heading text-text-primary">
            설정
          </Text>
        </View>

        {/* 단식 플랜 */}
        <SettingSection title="단식 플랜">
          <PlanSelector
            selectedPlanId={selectedPlanId}
            customFastingHours={customFastingHours}
            customEatingHours={customEatingHours}
            onSelectPlan={setSelectedPlan}
            onSetCustomHours={setCustomHours}
          />
        </SettingSection>

        {/* 알림 설정 */}
        <SettingSection title="알림">
          {permissionStatus === 'denied' ? (
            <View className="py-4">
              <Text className="font-sans text-sm text-text-secondary mb-3">
                알림 권한이 거부되어 있습니다. 알림을 받으려면 설정에서 권한을 허용해주세요.
              </Text>
              <Pressable
                onPress={openSettings}
                className="bg-accent-green py-3 px-4 rounded-xl items-center"
              >
                <Text className="font-heading text-white">설정으로 이동</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <SettingToggle
                title="단식 시작 알림"
                description="단식이 시작되면 알려드려요"
                value={notifications.fastingStart}
                onValueChange={(v) => setNotification('fastingStart', v)}
              />
              <SettingToggle
                title="단식 종료 알림"
                description="목표 단식 시간에 도달하면 알려드려요"
                value={notifications.fastingEnd}
                onValueChange={(v) => setNotification('fastingEnd', v)}
              />
              <SettingToggle
                title="식사 종료 리마인더"
                description="식사 시간 마감 30분 전에 알려드려요"
                value={notifications.eatingReminder}
                onValueChange={(v) => setNotification('eatingReminder', v)}
              />
              <SettingToggle
                title="중간 격려 알림"
                description="단식 절반 지점에서 응원 메시지를 보내드려요"
                value={notifications.halfwayCheer}
                onValueChange={(v) => setNotification('halfwayCheer', v)}
                showDivider={false}
              />
            </>
          )}
        </SettingSection>

        {/* 데이터 관리 */}
        <SettingSection title="데이터">
          <DangerButton
            title="모든 데이터 초기화"
            confirmMessage="모든 설정과 단식 기록이 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
            onConfirm={handleResetAllData}
          />
        </SettingSection>

        {/* 앱 정보 */}
        <View className="items-center py-6">
          <Text className="font-sans text-sm text-text-muted">
            단식 타이머 v{APP_VERSION}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
