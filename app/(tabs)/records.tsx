import { useState, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, DayDetail, WeeklyStats, EmptyState } from '../../src/components/records';
import { useFastingRecords } from '../../src/hooks/useFastingRecords';

export default function RecordsScreen() {
  const {
    records,
    stats,
    weeklyStats,
    getRecordsByDate,
    hasCompletedRecord,
    hasRecord,
  } = useFastingRecords();

  // 현재 표시 중인 연/월
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());

  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  /** 이전 달로 이동 */
  const handlePrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  }, [currentMonth]);

  /** 다음 달로 이동 */
  const handleNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  }, [currentMonth]);

  /** 날짜 선택 */
  const handleSelectDate = useCallback((dateKey: string) => {
    setSelectedDate((prev) => (prev === dateKey ? null : dateKey));
  }, []);

  // 기록이 없으면 빈 상태 표시
  if (records.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <EmptyState />
      </SafeAreaView>
    );
  }

  // 선택된 날짜의 기록
  const selectedRecords = selectedDate ? getRecordsByDate(selectedDate) : [];

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 주간 통계 */}
        <WeeklyStats stats={stats} weeklyStats={weeklyStats} />

        {/* 캘린더 */}
        <Calendar
          year={currentYear}
          month={currentMonth}
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          hasCompletedRecord={hasCompletedRecord}
          hasRecord={hasRecord}
        />

        {/* 선택된 날짜 상세 */}
        {selectedDate && (
          <DayDetail dateKey={selectedDate} records={selectedRecords} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
