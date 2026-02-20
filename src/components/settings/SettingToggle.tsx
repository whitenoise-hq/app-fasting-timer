import { useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { THEME, ACCENT } from '../../constants/colors';

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 26;
const THUMB_SIZE = 20;
const THUMB_MARGIN = 3;

interface SettingToggleProps {
  /** 토글 제목 */
  title: string;
  /** 토글 설명 */
  description?: string;
  /** 현재 값 */
  value: boolean;
  /** 변경 핸들러 */
  onValueChange: (value: boolean) => void;
}

/** 설정 토글 스위치 */
export default function SettingToggle({
  title,
  description,
  value,
  onValueChange,
}: SettingToggleProps) {
  const animValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      friction: 8,
      tension: 60,
    }).start();
  }, [value, animValue]);

  const thumbTranslateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_MARGIN, TRACK_WIDTH - THUMB_SIZE - THUMB_MARGIN],
  });

  const trackColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [THEME.progressTrack, ACCENT.green],
  });

  return (
    <View>
      <View className="flex-row items-center justify-between px-4 py-3">
        <View className="flex-1 mr-3">
          <Text className="font-sans text-base text-text-primary">{title}</Text>
          {description && (
            <Text className="font-sans text-sm text-text-muted mt-0.5">
              {description}
            </Text>
          )}
        </View>
        <Pressable onPress={() => onValueChange(!value)}>
          <Animated.View
            style={{
              width: TRACK_WIDTH,
              height: TRACK_HEIGHT,
              borderRadius: TRACK_HEIGHT / 2,
              backgroundColor: trackColor,
              justifyContent: 'center',
            }}
          >
            <Animated.View
              style={{
                width: THUMB_SIZE,
                height: THUMB_SIZE,
                borderRadius: THUMB_SIZE / 2,
                backgroundColor: '#FFFFFF',
                transform: [{ translateX: thumbTranslateX }],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 2,
                elevation: 2,
              }}
            />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}
