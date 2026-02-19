import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TimerStatus, FastingRecord } from '../types';

interface TimerState {
  status: TimerStatus;
  startTime: string | null;
  targetEndTime: string | null;
  currentRecordId: string | null;
  records: FastingRecord[];
}

interface TimerActions {
  startFasting: (fastingHours: number) => void;
  stopFasting: (completed: boolean, planId: string) => void;
  deleteRecord: (recordId: string) => void;
  reset: () => void;
}

type TimerStore = TimerState & TimerActions;

const initialState: TimerState = {
  status: 'idle',
  startTime: null,
  targetEndTime: null,
  currentRecordId: null,
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
      startFasting: (fastingHours: number) => {
        const now = new Date();
        const targetEnd = new Date(now.getTime() + fastingHours * 60 * 60 * 1000);
        const recordId = generateId();

        set({
          status: 'fasting',
          startTime: now.toISOString(),
          targetEndTime: targetEnd.toISOString(),
          currentRecordId: recordId,
        });
      },

      /** 단식 종료 및 기록 저장 */
      stopFasting: (completed: boolean, planId: string) => {
        const { startTime, targetEndTime, currentRecordId, records } = get();

        if (!startTime || !currentRecordId) return;

        const now = new Date();
        const start = new Date(startTime);
        const actualDuration = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
        const targetDuration = targetEndTime
          ? Math.floor((new Date(targetEndTime).getTime() - start.getTime()) / (1000 * 60))
          : 0;

        const newRecord: FastingRecord = {
          id: currentRecordId,
          planId,
          startTime,
          endTime: now.toISOString(),
          targetDuration,
          actualDuration,
          completed,
        };

        set({
          status: 'idle',
          startTime: null,
          targetEndTime: null,
          currentRecordId: null,
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
