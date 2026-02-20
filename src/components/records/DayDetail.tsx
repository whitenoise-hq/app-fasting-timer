import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { FastingRecord } from '../../types';
import { ACCENT } from '../../constants/colors';
import { Modal } from '../common';

interface DayDetailProps {
  /** 선택된 날짜 */
  dateKey: string;
  /** 해당 날짜의 기록 목록 */
  records: FastingRecord[];
  /** 기록 삭제 핸들러 */
  onDeleteRecord: (recordId: string) => void;
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
export default function DayDetail({ dateKey, records, onDeleteRecord }: DayDetailProps) {
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  /** 삭제 확인 */
  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      onDeleteRecord(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  if (records.length === 0) {
    return (
      <View className="bg-surface rounded-2xl p-4 items-center">
        <Text className="font-sans text-text-muted">
          {formatDateDisplay(dateKey)}에는 기록이 없습니다
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-surface rounded-2xl p-4">
      <Text className="text-lg font-heading text-text-primary mb-3">
        {formatDateDisplay(dateKey)} 기록
      </Text>

      {records.map((record, index) => (
        <View
          key={record.id}
          className={`${index > 0 ? 'mt-3 pt-3 border-t border-border-custom' : ''}`}
        >
          {/* 상단: 성공/실패 배지 + 삭제 버튼 */}
          <View className="flex-row items-center justify-between mb-2">
            <View
              className={`flex-row items-center px-2 py-1 rounded-full ${
                record.completed
                  ? 'bg-accent-green/10'
                  : 'bg-background'
              }`}
            >
              {record.completed ? (
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M20 6L9 17l-5-5"
                    stroke={ACCENT.green}
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
                className={`font-sans text-xs ml-1 ${
                  record.completed
                    ? 'text-accent-green'
                    : 'text-text-muted'
                }`}
              >
                {record.completed ? '목표 달성' : '중도 종료'}
              </Text>
            </View>

            {/* 삭제 버튼 */}
            <Pressable
              onPress={() => setDeleteTargetId(record.id)}
              className="flex-row items-center px-2 py-1 rounded-full active:bg-accent-red/10"
            >
              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
                  stroke={ACCENT.red}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text className="font-sans text-xs text-accent-red ml-1">삭제</Text>
            </Pressable>
          </View>

          {/* 시간 정보 */}
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="font-sans text-xs text-text-muted mb-1">시작</Text>
              <Text className="font-sans text-sm text-text-primary">
                {formatTimeFromISO(record.startTime)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-sans text-xs text-text-muted mb-1">종료</Text>
              <Text className="font-sans text-sm text-text-primary">
                {record.endTime ? formatTimeFromISO(record.endTime) : '-'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-sans text-xs text-text-muted mb-1">단식 시간</Text>
              <Text className="font-sans text-sm text-text-primary">
                {formatMinutes(record.actualDuration)}
              </Text>
            </View>
          </View>
        </View>
      ))}

      <Modal
        visible={deleteTargetId !== null}
        type="confirm"
        emoji="🗑️"
        title="기록 삭제"
        message="이 기록을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </View>
  );
}
