import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NotificationSettings } from '../types';
import { DEFAULT_PLAN_ID } from '../constants/plans';

interface SettingsState {
  selectedPlanId: string;
  customFastingHours: number | null;
  customEatingHours: number | null;
  eatingStartTime: string;
  notifications: NotificationSettings;
}

interface SettingsActions {
  setSelectedPlan: (planId: string) => void;
  setCustomHours: (fasting: number, eating: number) => void;
  setEatingStartTime: (time: string) => void;
  setNotification: (key: keyof NotificationSettings, value: boolean) => void;
  resetSettings: () => void;
}

type SettingsStore = SettingsState & SettingsActions;

const initialState: SettingsState = {
  selectedPlanId: DEFAULT_PLAN_ID,
  customFastingHours: null,
  customEatingHours: null,
  eatingStartTime: '11:00',
  notifications: {
    fastingStart: true,
    fastingEnd: true,
    eatingReminder: true,
    halfwayCheer: false,
  },
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...initialState,

      /** 플랜 선택 */
      setSelectedPlan: (planId: string) => set({ selectedPlanId: planId }),

      /** 커스텀 시간 설정 */
      setCustomHours: (fasting: number, eating: number) =>
        set({
          selectedPlanId: 'custom',
          customFastingHours: fasting,
          customEatingHours: eating,
        }),

      /** 식사 시작 시간 설정 */
      setEatingStartTime: (time: string) => set({ eatingStartTime: time }),

      /** 알림 설정 */
      setNotification: (key: keyof NotificationSettings, value: boolean) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),

      /** 설정 초기화 */
      resetSettings: () => set(initialState),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
