/** 단식 플랜 */
export interface FastingPlan {
  id: string;
  name: string;
  label: string;
  fastingHours: number;
  eatingHours: number;
  description: string;
}

/** 단식 기록 */
export interface FastingRecord {
  id: string;
  planId: string;
  startTime: string;
  endTime: string | null;
  targetDuration: number;
  actualDuration: number;
  completed: boolean;
}

/** 알림 설정 */
export interface NotificationSettings {
  fastingEnd: boolean;
  eatingReminder: boolean;
}

/** 사용자 설정 */
export interface UserSettings {
  selectedPlanId: string;
  customFastingHours: number | null;
  customEatingHours: number | null;
  notifications: NotificationSettings;
}

/** 통계 */
export interface FastingStats {
  totalFasts: number;
  completedFasts: number;
  currentStreak: number;
  longestStreak: number;
  averageDuration: number;
  successRate: number;
}

/** 타이머 상태 */
export type TimerStatus = 'idle' | 'fasting' | 'eating';

/** 타이머 상태 정보 */
export interface TimerState {
  status: TimerStatus;
  startTime: string | null;
  targetEndTime: string | null;
}
