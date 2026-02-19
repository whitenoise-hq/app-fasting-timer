import { View, Text } from 'react-native';

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
      <View className="flex-1 bg-accent-green/10 rounded-2xl p-4">
        <View className="flex-row items-center mb-3">
          <Text className="text-lg mr-2">✅</Text>
          <Text className="text-base font-bold text-accent-green">
            허용
          </Text>
        </View>
        {allowedItems.map((item) => (
          <View key={item.id} className="mb-2">
            <Text className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
              {item.name}
            </Text>
            <Text className="text-xs text-text-muted dark:text-text-muted-dark">
              {item.description}
            </Text>
          </View>
        ))}
      </View>

      {/* 금지 목록 */}
      <View className="flex-1 bg-accent-red/10 rounded-2xl p-4">
        <View className="flex-row items-center mb-3">
          <Text className="text-lg mr-2">❌</Text>
          <Text className="text-base font-bold text-accent-red">
            금지
          </Text>
        </View>
        {forbiddenItems.map((item) => (
          <View key={item.id} className="mb-2">
            <Text className="text-sm font-medium text-text-primary dark:text-text-primary-dark">
              {item.name}
            </Text>
            <Text className="text-xs text-text-muted dark:text-text-muted-dark">
              {item.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
