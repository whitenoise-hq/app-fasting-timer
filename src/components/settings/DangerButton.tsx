import { useState } from 'react';
import { Text, Pressable } from 'react-native';
import { Modal } from '../common';

interface DangerButtonProps {
  /** 버튼 텍스트 */
  title: string;
  /** 확인 메시지 */
  confirmMessage: string;
  /** 확인 후 실행할 함수 */
  onConfirm: () => void;
}

/** 위험 작업 버튼 (확인 모달 포함) */
export default function DangerButton({
  title,
  confirmMessage,
  onConfirm,
}: DangerButtonProps) {
  const [visible, setVisible] = useState(false);

  const handleConfirm = () => {
    setVisible(false);
    onConfirm();
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="bg-surface rounded-2xl px-4 py-3 items-center active:bg-accent-red/10"
      >
        <Text className="font-sans text-base text-accent-red">{title}</Text>
      </Pressable>

      <Modal
        visible={visible}
        type="confirm"
        emoji="⚠️"
        title="확인"
        message={confirmMessage}
        confirmText="확인"
        cancelText="취소"
        onConfirm={handleConfirm}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}
