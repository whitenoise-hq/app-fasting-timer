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
      <View className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
        <View className="flex-row items-center mb-3">
          <Text className="text-lg mr-2">✅</Text>
          <Text className="text-base font-bold text-green-700 dark:text-green-300">
            허용
          </Text>
        </View>
        {allowedItems.map((item) => (
          <View key={item.id} className="mb-2">
            <Text className="text-sm font-medium text-gray-900 dark:text-white">
              {item.name}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {item.description}
            </Text>
          </View>
        ))}
      </View>

      {/* 금지 목록 */}
      <View className="flex-1 bg-red-50 dark:bg-red-900/20 rounded-2xl p-4">
        <View className="flex-row items-center mb-3">
          <Text className="text-lg mr-2">❌</Text>
          <Text className="text-base font-bold text-red-700 dark:text-red-300">
            금지
          </Text>
        </View>
        {forbiddenItems.map((item) => (
          <View key={item.id} className="mb-2">
            <Text className="text-sm font-medium text-gray-900 dark:text-white">
              {item.name}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {item.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
