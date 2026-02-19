import type { FastingPlan } from '../types';

/** 기본 플랜 ID */
export const DEFAULT_PLAN_ID = '16-8';

/** 기본 제공 단식 플랜 목록 */
export const DEFAULT_PLANS: FastingPlan[] = [
  {
    id: '12-12',
    name: '12:12',
    label: '입문용',
    fastingHours: 12,
    eatingHours: 12,
    description: '저녁 8시 ~ 아침 8시 공복 유지',
  },
  {
    id: '14-10',
    name: '14:10',
    label: '초보자용',
    fastingHours: 14,
    eatingHours: 10,
    description: '아침을 늦게 먹거나 저녁을 일찍 마치는 방식',
  },
  {
    id: '16-8',
    name: '16:8',
    label: '가장 권장',
    fastingHours: 16,
    eatingHours: 8,
    description: '오전 11시 ~ 오후 7시 식사',
  },
  {
    id: '23-1',
    name: '23:1',
    label: '1일 1식',
    fastingHours: 23,
    eatingHours: 1,
    description: '강력한 체지방 분해 효과',
  },
];

/** 플랜 ID로 플랜 찾기 */
export function getPlanById(planId: string): FastingPlan | undefined {
  return DEFAULT_PLANS.find((plan) => plan.id === planId);
}
