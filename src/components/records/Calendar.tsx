import { View, Text, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  getDaysInMonth,
  getFirstDayOfWeek,
  formatDateKey,
  isToday,
  WEEKDAY_NAMES,
} from '../../utils/date';
import { useSettingsStore } from '../../stores/settingsStore';
import { getThemeColors } from '../../constants/colors';

interface CalendarProps {
  /** 현재 표시 연도 */
  year: number;
  /** 현재 표시 월 (0-11) */
  month: number;
  /** 선택된 날짜 키 */
  selectedDate: string | null;
  /** 날짜 선택 핸들러 */
  onSelectDate: (dateKey: string) => void;
  /** 이전 달 이동 */
  onPrevMonth: () => void;
  /** 다음 달 이동 */
  onNextMonth: () => void;
  /** 완료된 기록이 있는 날짜인지 확인 */
  hasCompletedRecord: (dateKey: string) => boolean;
  /** 기록이 있는 날짜인지 확인 */
  hasRecord: (dateKey: string) => boolean;
}

/** 월간 캘린더 컴포넌트 */
export default function Calendar({
  year,
  month,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  hasCompletedRecord,
  hasRecord,
}: CalendarProps) {
  const darkMode = useSettingsStore((state) => state.darkMode);
  const theme = getThemeColors(darkMode);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfWeek(year, month);

  /** 캘린더 그리드 데이터 생성 */
  const calendarDays: (number | null)[] = [];

  // 첫 주 빈 칸
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // 날짜 채우기
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  /** 날짜 셀 렌더링 */
  const renderDay = (day: number | null, index: number) => {
    if (day === null) {
      return <View key={`empty-${index}`} className="flex-1 aspect-square" />;
    }

    const date = new Date(year, month, day);
    const dateKey = formatDateKey(date);
    const isSelected = selectedDate === dateKey;
    const isTodayDate = isToday(date);
    const hasCompleted = hasCompletedRecord(dateKey);
    const hasAnyRecord = hasRecord(dateKey);

    return (
      <Pressable
        key={dateKey}
        onPress={() => onSelectDate(dateKey)}
        className="flex-1 aspect-square items-center justify-center"
      >
        <View
          className={`w-10 h-10 items-center justify-center rounded-full ${
            isSelected
              ? 'bg-btn-primary dark:bg-btn-primary-dark'
              : isTodayDate
              ? 'bg-background dark:bg-background-dark'
              : ''
          }`}
        >
          <Text
            className={`font-sans text-base ${
              isSelected
                ? 'text-btn-text dark:text-btn-text-dark'
                : isTodayDate
                ? 'text-text-primary dark:text-text-primary-dark'
                : 'text-text-secondary dark:text-text-secondary-dark'
            }`}
          >
            {day}
          </Text>
        </View>
        {/* 기록 표시 점 */}
        {hasAnyRecord && !isSelected && (
          <View
            className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
              hasCompleted ? 'bg-accent-green' : 'bg-accent-red'
            }`}
          />
        )}
      </Pressable>
    );
  };

  return (
    <View className="bg-surface dark:bg-surface-dark rounded-2xl p-4">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between mb-4">
        <Pressable
          onPress={onPrevMonth}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-background dark:active:bg-background-dark"
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 18l-6-6 6-6"
              stroke={theme.textSecondary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>

        <Text className="text-lg font-heading text-text-primary dark:text-text-primary-dark">
          {year}년 {month + 1}월
        </Text>

        <Pressable
          onPress={onNextMonth}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-background dark:active:bg-background-dark"
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 18l6-6-6-6"
              stroke={theme.textSecondary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </View>

      {/* 요일 헤더 */}
      <View className="flex-row mb-2">
        {WEEKDAY_NAMES.map((name, index) => (
          <View key={name} className="flex-1 items-center py-2">
            <Text
              className={`font-sans text-sm ${
                index === 0
                  ? 'text-accent-red'
                  : index === 6
                  ? 'text-accent-blue'
                  : 'text-text-muted dark:text-text-muted-dark'
              }`}
            >
              {name}
            </Text>
          </View>
        ))}
      </View>

      {/* 날짜 그리드 */}
      <View className="flex-row flex-wrap">
        {calendarDays.map((day, index) => (
          <View key={index} className="w-[14.28%]">
            {renderDay(day, index)}
          </View>
        ))}
      </View>
    </View>
  );
}
