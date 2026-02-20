import { useState, useCallback, useRef, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { Calendar, DayDetail, WeeklyStats } from '../../src/components/records';
import { useFastingRecords } from '../../src/hooks/useFastingRecords';
import { formatDateKey } from '../../src/utils/date';

export default function RecordsScreen() {
  const {
    stats,
    weeklyStats,
    getRecordsByDate,
    hasCompletedRecord,
    hasRecord,
    deleteRecord,
  } = useFastingRecords();

  const scrollViewRef = useRef<ScrollViewType>(null);
  const navigation = useNavigation();
  const isFocusedRef = useRef(false);

  // 현재 탭을 다시 누르면 스크롤 최상단으로 이동
  useEffect(() => {
    const unsubscribeFocus = (navigation as any).addListener('focus', () => {
      isFocusedRef.current = true;
    });
    const unsubscribeBlur = (navigation as any).addListener('blur', () => {
      isFocusedRef.current = false;
    });
    const unsubscribeTabPress = (navigation as any).addListener('tabPress', () => {
      if (isFocusedRef.current) {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    });
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      unsubscribeTabPress();
    };
  }, [navigation]);

  // 현재 표시 중인 연/월
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth());

  // 선택된 날짜 (기본값: 오늘)
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateKey(new Date()));

  /** 이전 달로 이동 */
  const handlePrevMonth = useCallback(() => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate('');
  }, [currentMonth]);

  /** 다음 달로 이동 */
  const handleNextMonth = useCallback(() => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate('');
  }, [currentMonth]);

  /** 날짜 선택 */
  const handleSelectDate = useCallback((dateKey: string) => {
    setSelectedDate(dateKey);
  }, []);

  // 선택된 날짜의 기록
  const selectedRecords = selectedDate ? getRecordsByDate(selectedDate) : [];
  const showDayDetail = selectedDate.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        ref={scrollViewRef}
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
        {showDayDetail && (
          <DayDetail dateKey={selectedDate} records={selectedRecords} onDeleteRecord={deleteRecord} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
