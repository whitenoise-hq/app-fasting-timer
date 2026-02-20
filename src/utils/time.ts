/** 밀리초를 시:분:초 형태로 변환 */
export function formatDuration(ms: number): string {
  if (ms <= 0) return '00:00:00';

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
}

/** 분을 "X시간 Y분" 형태로 변환 */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}분`;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}

/** Date 또는 ISO 문자열을 "오전/오후 HH:MM" 형태로 변환 */
export function formatTime(dateOrIso: Date | string): string {
  const date = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? '오전' : '오후';
  const displayHours = hours % 12 || 12;

  return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
}

/** 두 시간 사이의 남은 밀리초 계산 */
export function getRemainingMs(targetTime: string): number {
  const target = new Date(targetTime).getTime();
  const now = Date.now();
  return Math.max(0, target - now);
}

/** 진행률 계산 (0~1) */
export function getProgress(startTime: string, targetEndTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(targetEndTime).getTime();
  const now = Date.now();

  const total = end - start;
  const elapsed = now - start;

  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, elapsed / total));
}
