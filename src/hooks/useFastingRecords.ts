import { useMemo } from 'react';
import { useTimerStore } from '../stores/timerStore';
import type { FastingRecord, FastingStats } from '../types';
import { getDateKeyFromISO, getWeekStart, getWeekEnd, isSameDay } from '../utils/date';

interface RecordsByDate {
  [dateKey: string]: FastingRecord[];
}

interface WeeklyStats {
  totalCount: number;
  completedCount: number;
  successRate: number;
  averageDuration: number;
}

interface UseFastingRecordsReturn {
  /** 전체 기록 목록 */
  records: FastingRecord[];
  /** 날짜별 기록 맵 */
  recordsByDate: RecordsByDate;
  /** 전체 통계 */
  stats: FastingStats;
  /** 이번 주 통계 */
  weeklyStats: WeeklyStats;
  /** 특정 날짜의 기록 조회 */
  getRecordsByDate: (dateKey: string) => FastingRecord[];
  /** 특정 날짜에 완료된 기록이 있는지 확인 */
  hasCompletedRecord: (dateKey: string) => boolean;
  /** 특정 날짜에 기록이 있는지 확인 */
  hasRecord: (dateKey: string) => boolean;
}

/**
 * 단식 기록 및 통계를 조회하는 커스텀 훅
 */
export function useFastingRecords(): UseFastingRecordsReturn {
  const records = useTimerStore((state) => state.records);

  /** 날짜별 기록 맵 생성 */
  const recordsByDate = useMemo(() => {
    const map: RecordsByDate = {};
    records.forEach((record) => {
      const dateKey = getDateKeyFromISO(record.startTime);
      if (!map[dateKey]) {
        map[dateKey] = [];
      }
      map[dateKey].push(record);
    });
    return map;
  }, [records]);

  /** 연속 스트릭 계산 */
  const calculateStreaks = useMemo(() => {
    if (records.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    // 날짜별로 완료 여부 확인
    const completedDates = new Set<string>();
    records.forEach((record) => {
      if (record.completed) {
        completedDates.add(getDateKeyFromISO(record.startTime));
      }
    });

    const sortedDates = Array.from(completedDates).sort().reverse();
    if (sortedDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // 현재 스트릭 계산 (오늘 또는 어제부터 연속)
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    // 오늘이나 어제에 기록이 있으면 현재 스트릭 시작
    if (completedDates.has(todayKey) || completedDates.has(yesterdayKey)) {
      const startDate = completedDates.has(todayKey) ? today : yesterday;
      let checkDate = new Date(startDate);

      while (true) {
        const checkKey = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
        if (completedDates.has(checkKey)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // 최장 스트릭 계산
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return { currentStreak, longestStreak };
  }, [records]);

  /** 전체 통계 계산 */
  const stats = useMemo((): FastingStats => {
    const totalFasts = records.length;
    const completedFasts = records.filter((r) => r.completed).length;
    const successRate = totalFasts > 0 ? Math.round((completedFasts / totalFasts) * 100) : 0;
    const totalDuration = records.reduce((sum, r) => sum + r.actualDuration, 0);
    const averageDuration = totalFasts > 0 ? Math.round(totalDuration / totalFasts) : 0;

    return {
      totalFasts,
      completedFasts,
      currentStreak: calculateStreaks.currentStreak,
      longestStreak: calculateStreaks.longestStreak,
      averageDuration,
      successRate,
    };
  }, [records, calculateStreaks]);

  /** 이번 주 통계 계산 */
  const weeklyStats = useMemo((): WeeklyStats => {
    const now = new Date();
    const weekStart = getWeekStart(now);
    const weekEnd = getWeekEnd(now);

    const weekRecords = records.filter((record) => {
      const recordDate = new Date(record.startTime);
      return recordDate >= weekStart && recordDate <= weekEnd;
    });

    const totalCount = weekRecords.length;
    const completedCount = weekRecords.filter((r) => r.completed).length;
    const successRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const totalDuration = weekRecords.reduce((sum, r) => sum + r.actualDuration, 0);
    const averageDuration = totalCount > 0 ? Math.round(totalDuration / totalCount) : 0;

    return {
      totalCount,
      completedCount,
      successRate,
      averageDuration,
    };
  }, [records]);

  /** 특정 날짜의 기록 조회 */
  const getRecordsByDate = (dateKey: string): FastingRecord[] => {
    return recordsByDate[dateKey] || [];
  };

  /** 특정 날짜에 완료된 기록이 있는지 확인 */
  const hasCompletedRecord = (dateKey: string): boolean => {
    const dayRecords = recordsByDate[dateKey];
    return dayRecords ? dayRecords.some((r) => r.completed) : false;
  };

  /** 특정 날짜에 기록이 있는지 확인 */
  const hasRecord = (dateKey: string): boolean => {
    return !!recordsByDate[dateKey]?.length;
  };

  return {
    records,
    recordsByDate,
    stats,
    weeklyStats,
    getRecordsByDate,
    hasCompletedRecord,
    hasRecord,
  };
}
