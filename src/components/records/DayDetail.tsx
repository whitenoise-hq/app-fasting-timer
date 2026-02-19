import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { FastingRecord } from '../../types';

interface DayDetailProps {
  /** 선택된 날짜 */
  dateKey: string;
  /** 해당 날짜의 기록 목록 */
  records: FastingRecord[];
}

/** 분을 시간:분 형태로 변환 */
function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}분`;
  if (mins === 0) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}

/** ISO 문자열을 시간 형태로 변환 */
function formatTimeFromISO(isoString: string): string {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? '오전' : '오후';
  const displayHours = hours % 12 || 12;
  return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
}

/** 날짜 키를 표시용 문자열로 변환 */
function formatDateDisplay(dateKey: string): string {
  const [year, month, day] = dateKey.split('-');
  return `${parseInt(month)}월 ${parseInt(day)}일`;
}

/** 선택된 날짜의 상세 기록 표시 */
export default function DayDetail({ dateKey, records }: DayDetailProps) {
  if (records.length === 0) {
    return (
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 items-center">
        <Text className="text-gray-500 dark:text-gray-400">
          {formatDateDisplay(dateKey)}에는 기록이 없습니다
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-4">
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
        {formatDateDisplay(dateKey)} 기록
      </Text>

      {records.map((record, index) => (
        <View
          key={record.id}
          className={`${index > 0 ? 'mt-3 pt-3 border-t border-gray-100 dark:border-gray-700' : ''}`}
        >
          {/* 성공/실패 배지 */}
          <View className="flex-row items-center mb-2">
            <View
              className={`flex-row items-center px-2 py-1 rounded-full ${
                record.completed
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              {record.completed ? (
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M20 6L9 17l-5-5"
                    stroke="#22c55e"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              ) : (
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="#6b7280"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
              <Text
                className={`text-xs font-medium ml-1 ${
                  record.completed
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {record.completed ? '목표 달성' : '중도 종료'}
              </Text>
            </View>
          </View>

          {/* 시간 정보 */}
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">시작</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {formatTimeFromISO(record.startTime)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">종료</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {record.endTime ? formatTimeFromISO(record.endTime) : '-'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">단식 시간</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-white">
                {formatMinutes(record.actualDuration)}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
