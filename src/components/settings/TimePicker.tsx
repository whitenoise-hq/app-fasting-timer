import { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface TimePickerProps {
  /** 현재 시간 (HH:MM 형식) */
  value: string;
  /** 변경 핸들러 */
  onValueChange: (time: string) => void;
}

/** 시간 옵션 생성 */
const TIME_OPTIONS = Array.from({ length: 24 }, (_, hour) => {
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour % 12 || 12;
  return {
    value: `${hour.toString().padStart(2, '0')}:00`,
    label: `${period} ${displayHour}:00`,
  };
});

/** 시간 선택 피커 */
export default function TimePicker({ value, onValueChange }: TimePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  /** 현재 선택된 시간 표시 텍스트 */
  const getDisplayTime = () => {
    const hour = parseInt(value.split(':')[0], 10);
    const period = hour < 12 ? '오전' : '오후';
    const displayHour = hour % 12 || 12;
    return `${period} ${displayHour}:00`;
  };

  /** 시간 선택 */
  const handleSelectTime = (time: string) => {
    onValueChange(time);
    setIsModalVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setIsModalVisible(true)}
        className="flex-row items-center justify-between px-4 py-3 active:bg-gray-50 dark:active:bg-gray-700"
      >
        <Text className="text-base text-gray-900 dark:text-white">
          식사 시작 시간
        </Text>
        <View className="flex-row items-center">
          <Text className="text-base text-primary-500 mr-1">{getDisplayTime()}</Text>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M9 18l6-6-6-6"
              stroke="#9ca3af"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      </Pressable>

      {/* 시간 선택 모달 */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable
            className="bg-white dark:bg-gray-800 rounded-t-3xl max-h-[60%]"
            onPress={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <Pressable onPress={() => setIsModalVisible(false)}>
                <Text className="text-base text-gray-500">취소</Text>
              </Pressable>
              <Text className="text-base font-bold text-gray-900 dark:text-white">
                식사 시작 시간
              </Text>
              <View className="w-10" />
            </View>

            {/* 시간 목록 */}
            <View className="py-2">
              {TIME_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => handleSelectTime(option.value)}
                  className={`px-4 py-3 active:bg-gray-50 dark:active:bg-gray-700 ${
                    option.value === value ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                >
                  <Text
                    className={`text-base ${
                      option.value === value
                        ? 'text-primary-500 font-medium'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
