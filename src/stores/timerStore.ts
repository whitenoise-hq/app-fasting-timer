import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TimerStatus, FastingRecord } from '../types';

interface TimerState {
  status: TimerStatus;
  fastingStartTime: string | null;
  fastingTargetEndTime: string | null;
  eatingStartTime: string | null;
  eatingTargetEndTime: string | null;
  currentRecordId: string | null;
  isFastingCompleted: boolean;
  records: FastingRecord[];
}

interface TimerActions {
  startFasting: (fastingHours: number, eatingHours: number) => void;
  transitionToEating: (eatingHours: number) => void;
  stopTimer: (planId: string) => void;
  deleteRecord: (recordId: string) => void;
  reset: () => void;
}

type TimerStore = TimerState & TimerActions;

const initialState: TimerState = {
  status: 'idle',
  fastingStartTime: null,
  fastingTargetEndTime: null,
  eatingStartTime: null,
  eatingTargetEndTime: null,
  currentRecordId: null,
  isFastingCompleted: false,
  records: [],
};

/** 고유 ID 생성 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      /** 단식 시작 */
      startFasting: (fastingHours: number, eatingHours: number) => {
        const now = new Date();
        const fastingEnd = new Date(now.getTime() + fastingHours * 60 * 60 * 1000);
        const eatingEnd = new Date(fastingEnd.getTime() + eatingHours * 60 * 60 * 1000);
        const recordId = generateId();

        set({
          status: 'fasting',
          fastingStartTime: now.toISOString(),
          fastingTargetEndTime: fastingEnd.toISOString(),
          eatingStartTime: null,
          eatingTargetEndTime: eatingEnd.toISOString(),
          currentRecordId: recordId,
          isFastingCompleted: false,
        });
      },

      /** 단식 완료 → 식사 중으로 전환 */
      transitionToEating: (eatingHours: number) => {
        const now = new Date();
        const eatingEnd = new Date(now.getTime() + eatingHours * 60 * 60 * 1000);

        set({
          status: 'eating',
          eatingStartTime: now.toISOString(),
          eatingTargetEndTime: eatingEnd.toISOString(),
          isFastingCompleted: true,
        });
      },

      /** 타이머 종료 및 기록 저장 */
      stopTimer: (planId: string) => {
        const {
          status,
          fastingStartTime,
          fastingTargetEndTime,
          currentRecordId,
          isFastingCompleted,
          records,
        } = get();

        if (!fastingStartTime || !currentRecordId) return;

        const now = new Date();
        const start = new Date(fastingStartTime);

        // 단식 실제 시간 계산
        let actualDuration: number;
        if (status === 'fasting') {
          // 단식 중 종료: 현재까지의 단식 시간
          actualDuration = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
        } else {
          // 식사 중 종료: 단식 목표 시간 (100% 완료했으므로)
          const fastingEnd = fastingTargetEndTime ? new Date(fastingTargetEndTime) : now;
          actualDuration = Math.floor((fastingEnd.getTime() - start.getTime()) / (1000 * 60));
        }

        const targetDuration = fastingTargetEndTime
          ? Math.floor((new Date(fastingTargetEndTime).getTime() - start.getTime()) / (1000 * 60))
          : 0;

        // 단식 100% 완료 여부로 completed 결정
        const completed = isFastingCompleted || status === 'eating';

        const newRecord: FastingRecord = {
          id: currentRecordId,
          planId,
          startTime: fastingStartTime,
          endTime: now.toISOString(),
          targetDuration,
          actualDuration,
          completed,
        };

        set({
          ...initialState,
          records: [...records, newRecord],
        });
      },

      /** 기록 삭제 */
      deleteRecord: (recordId: string) => {
        const { records } = get();
        set({ records: records.filter((r) => r.id !== recordId) });
      },

      /** 상태 초기화 */
      reset: () => set(initialState),
    }),
    {
      name: 'timer-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
