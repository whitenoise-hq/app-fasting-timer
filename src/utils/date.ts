/** 해당 월의 첫 번째 날 */
export function getFirstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

/** 해당 월의 마지막 날 */
export function getLastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}

/** 해당 월의 일수 */
export function getDaysInMonth(year: number, month: number): number {
  return getLastDayOfMonth(year, month).getDate();
}

/** 해당 월 첫 번째 날의 요일 (0: 일요일) */
export function getFirstDayOfWeek(year: number, month: number): number {
  return getFirstDayOfMonth(year, month).getDay();
}

/** 날짜를 YYYY-MM-DD 형식 문자열로 변환 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** ISO 문자열에서 날짜 키 추출 */
export function getDateKeyFromISO(isoString: string): string {
  return isoString.split('T')[0];
}

/** 주의 시작일 (일요일) 구하기 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** 주의 마지막일 (토요일) 구하기 */
export function getWeekEnd(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (6 - day));
  d.setHours(23, 59, 59, 999);
  return d;
}

/** 두 날짜가 같은 날인지 확인 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/** 오늘 날짜인지 확인 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/** 월 이름 (한국어) */
export function getMonthName(month: number): string {
  return `${month + 1}월`;
}

/** 요일 이름 (한국어, 짧은 형식) */
export const WEEKDAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];
