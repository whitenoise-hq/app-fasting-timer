import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  SettingSection,
  SettingToggle,
  PlanSelector,
  TimePicker,
  DangerButton,
} from '../../src/components/settings';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useTimerStore } from '../../src/stores/timerStore';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const {
    selectedPlanId,
    customFastingHours,
    customEatingHours,
    eatingStartTime,
    notifications,
    darkMode,
    setSelectedPlan,
    setCustomHours,
    setEatingStartTime,
    setNotification,
    setDarkMode,
    resetSettings,
  } = useSettingsStore();

  const resetTimer = useTimerStore((state) => state.reset);

  /** 모든 데이터 초기화 */
  const handleResetAllData = () => {
    resetSettings();
    resetTimer();
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View className="mb-6">
          <Text className="text-2xl font-heading text-text-primary dark:text-text-primary-dark">
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

        {/* 식사 시간 */}
        <SettingSection title="식사 시간">
          <TimePicker value={eatingStartTime} onValueChange={setEatingStartTime} />
        </SettingSection>

        {/* 알림 설정 */}
        <SettingSection title="알림">
          <SettingToggle
            title="단식 시작 알림"
            description="식사 시간이 끝나면 알려드려요"
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
        </SettingSection>

        {/* 화면 설정 */}
        <SettingSection title="화면">
          <SettingToggle
            title="다크 모드"
            description="어두운 화면으로 전환해요"
            value={darkMode}
            onValueChange={setDarkMode}
            showDivider={false}
          />
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
          <Text className="font-sans text-sm text-text-muted dark:text-text-muted-dark">
            단식 타이머 v{APP_VERSION}
          </Text>
          <Text className="font-sans text-xs text-text-muted dark:text-text-muted-dark mt-1">
            Made with ❤️ for healthy lifestyle
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
