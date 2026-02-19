import { Text, Pressable, Alert } from 'react-native';

interface DangerButtonProps {
  /** 버튼 텍스트 */
  title: string;
  /** 확인 메시지 */
  confirmMessage: string;
  /** 확인 후 실행할 함수 */
  onConfirm: () => void;
}

/** 위험 작업 버튼 (확인 Alert 포함) */
export default function DangerButton({
  title,
  confirmMessage,
  onConfirm,
}: DangerButtonProps) {
  const handlePress = () => {
    Alert.alert(
      '확인',
      confirmMessage,
      [
        { text: '취소', style: 'cancel' },
        { text: '확인', style: 'destructive', onPress: onConfirm },
      ],
      { cancelable: true }
    );
  };

  return (
    <Pressable
      onPress={handlePress}
      className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 items-center active:bg-red-50 dark:active:bg-red-900/20"
    >
      <Text className="text-base text-red-500 font-medium">{title}</Text>
    </Pressable>
  );
}
