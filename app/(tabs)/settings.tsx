import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Linking, Platform } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import {
  SettingSection,
  SettingToggle,
  PlanSelector,
  DangerButton,
} from '../../src/components/settings';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useTimerStore } from '../../src/stores/timerStore';
import { useNotification, PermissionStatus } from '../../src/hooks/useNotification';
import { THEME } from '../../src/constants/colors';
import { getPlanById } from '../../src/constants/plans';
import type { NotificationSettings, FastingPlan } from '../../src/types';

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
  const timerStatus = useTimerStore((state) => state.status);
  const fastingStartTime = useTimerStore((state) => state.fastingStartTime);
  const isTimerActive = timerStatus === 'fasting' || timerStatus === 'eating';
  const { getPermissionStatus, scheduleNotifications } = useNotification();
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('undetermined');
  const scrollViewRef = useRef<ScrollViewType>(null);
  const navigation = useNavigation();
  const isFocusedRef = useRef(true);

  // 현재 탭을 다시 누르면 스크롤 최상단으로 이동
  useEffect(() => {
    const unsubscribeFocus = (navigation as any).addListener('focus', () => {
      isFocusedRef.current = true;
    });
    const unsubscribeBlur = (navigation as any).addListener('blur', () => {
      isFocusedRef.current = false;
    });
    const unsubscribeTabPress = (navigation as any).addListener('tabPress', () => {
      if (isFocusedRef.current) {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    });
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      unsubscribeTabPress();
    };
  }, [navigation]);

  // 현재 플랜 정보
  const plan = getPlanById(selectedPlanId);
  const currentPlan: FastingPlan = plan ?? {
    id: 'custom',
    name: `${customFastingHours ?? 16}:${customEatingHours ?? 8}`,
    label: '커스텀',
    fastingHours: customFastingHours ?? 16,
    eatingHours: customEatingHours ?? 8,
    description: '커스텀 플랜',
  };

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

  /** 알림 설정 변경 핸들러 (타이머 활성 중이면 재스케줄링) */
  const handleNotificationChange = useCallback(
    async (key: keyof NotificationSettings, value: boolean) => {
      setNotification(key, value);

      // 타이머 활성 중이면 알림 재스케줄링
      if (isTimerActive && fastingStartTime) {
        const updatedNotifications = { ...notifications, [key]: value };
        await scheduleNotifications(fastingStartTime, currentPlan, updatedNotifications);
      }
    },
    [isTimerActive, fastingStartTime, notifications, currentPlan, setNotification, scheduleNotifications]
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <ScrollView
        ref={scrollViewRef}
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
          <View className="relative">
            <PlanSelector
              selectedPlanId={selectedPlanId}
              customFastingHours={customFastingHours}
              customEatingHours={customEatingHours}
              onSelectPlan={setSelectedPlan}
              onSetCustomHours={setCustomHours}
            />
            {/* 타이머 진행 중 오버레이 */}
            {isTimerActive && (
              <View className="absolute inset-0 bg-background/70 border border-border-custom rounded-2xl overflow-hidden items-center justify-center">
                <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 16v-4M12 8h.01"
                    stroke={THEME.textSecondary}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text className="font-sans text-sm text-text-primary mt-3 text-center">
                  타이머가 진행 중일 때는
                </Text>
                <Text className="font-sans text-sm text-text-primary text-center">
                  플랜 변경이 불가능합니다.
                </Text>
              </View>
            )}
          </View>
        </SettingSection>

        {/* 알림 설정 */}
        <SettingSection title="알림">
          <View className="bg-surface border border-border-custom rounded-2xl overflow-hidden">
            {permissionStatus === 'denied' ? (
              <View className="p-4">
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
                  title="단식 종료 알림"
                  description="목표 단식 시간에 도달하면 알려드려요"
                  value={notifications.fastingEnd}
                  onValueChange={(v) => handleNotificationChange('fastingEnd', v)}
                />
                <SettingToggle
                  title="식사 종료 리마인더"
                  description="식사 시간 마감 30분 전에 알려드려요"
                  value={notifications.eatingReminder}
                  onValueChange={(v) => handleNotificationChange('eatingReminder', v)}
                />
              </>
            )}
          </View>
        </SettingSection>

        {/* 데이터 관리 */}
        <SettingSection title="데이터">
          <DangerButton
            title="모든 데이터 초기화"
            confirmMessage="모든 설정과 단식 기록이 삭제됩니다. \n이 작업은 되돌릴 수 없습니다."
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
