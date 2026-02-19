import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 px-6 pt-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          설정
        </Text>
        <Text className="mt-2 text-gray-500 dark:text-gray-400">
          앱 설정이 여기에 표시됩니다
        </Text>
      </View>
    </SafeAreaView>
  );
}
