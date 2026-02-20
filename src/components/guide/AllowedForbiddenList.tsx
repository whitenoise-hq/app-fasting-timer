import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ACCENT } from '@/constants/colors';

interface Item {
  id: string;
  name: string;
  description: string;
}

interface AllowedForbiddenListProps {
  /** 허용 항목 */
  allowedItems: Item[];
  /** 금지 항목 */
  forbiddenItems: Item[];
}

/** 허용/금지 목록 컴포넌트 */
export default function AllowedForbiddenList({
  allowedItems,
  forbiddenItems,
}: AllowedForbiddenListProps) {
  return (
    <View className="flex-row gap-3">
      {/* 허용 목록 */}
      <View className="flex-1 bg-accent-green/10 border border-accent-green rounded-2xl p-4">
        <View className="flex-row items-center mb-3">
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" className="mr-2">
            <Path
              d="M5 13l4 4L19 7"
              stroke={ACCENT.green}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text className="text-base font-heading text-accent-green">
            허용
          </Text>
        </View>
        {allowedItems.map((item) => (
          <View key={item.id} className="mb-2">
            <Text className="font-sans text-sm text-text-primary">
              {item.name}
            </Text>
            <Text className="font-sans text-xs text-text-muted">
              {item.description}
            </Text>
          </View>
        ))}
      </View>

      {/* 금지 목록 */}
      <View className="flex-1 bg-accent-red/10 border border-accent-red rounded-2xl p-4">
        <View className="flex-row items-center mb-3">
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" className="mr-2">
            <Path
              d="M6 6l12 12M18 6L6 18"
              stroke={ACCENT.red}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text className="text-base font-heading text-accent-red">
            금지
          </Text>
        </View>
        {forbiddenItems.map((item) => (
          <View key={item.id} className="mb-2">
            <Text className="font-sans text-sm text-text-primary">
              {item.name}
            </Text>
            <Text className="font-sans text-xs text-text-muted">
              {item.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
