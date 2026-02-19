/** 라이트 모드 색상 */
export const LIGHT = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E5E7EB',
  btnPrimary: '#1A1A1A',
  btnText: '#FFFFFF',
  progressBar: '#1A1A1A',
  progressTrack: '#E5E7EB',
} as const;

/** 다크 모드 색상 */
export const DARK = {
  background: '#111111',
  surface: '#1C1C1E',
  textPrimary: '#F5F5F5',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  border: '#2C2C2E',
  btnPrimary: '#F5F5F5',
  btnText: '#1A1A1A',
  progressBar: '#F5F5F5',
  progressTrack: '#2C2C2E',
} as const;

/** 액센트 색상 (라이트/다크 공통) */
export const ACCENT = {
  green: '#22C55E',
  red: '#EF4444',
  blue: '#3B82F6',
  orange: '#F97316',
  purple: '#A855F7',
} as const;

/** 테마 색상 반환 헬퍼 */
export function getThemeColors(isDark: boolean) {
  return isDark ? DARK : LIGHT;
}
