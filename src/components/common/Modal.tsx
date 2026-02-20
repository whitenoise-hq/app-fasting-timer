import { useEffect, useRef, type ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal as RNModal,
  Animated,
  Dimensions,
} from 'react-native';

/**
 * 공통 모달 컴포넌트
 *
 * @example
 * // Alert 타입 - 안내/알림용 (확인 버튼만)
 * <Modal
 *   visible={showAlert}
 *   type="alert"
 *   emoji="💪"
 *   title="단식 시작"
 *   message="단식이 시작되었습니다! 목표까지 화이팅!"
 *   onConfirm={() => setShowAlert(false)}
 * />
 *
 * @example
 * // Confirm 타입 - 확인/취소 선택용
 * <Modal
 *   visible={showConfirm}
 *   type="confirm"
 *   emoji="🗑️"
 *   title="기록 삭제"
 *   message="이 기록을 삭제하시겠습니까?"
 *   confirmText="삭제"
 *   cancelText="취소"
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowConfirm(false)}
 * />
 *
 * @example
 * // Custom 타입 - 자유 콘텐츠
 * <Modal
 *   visible={showCustom}
 *   type="custom"
 *   onConfirm={() => setShowCustom(false)}
 *   onCancel={() => setShowCustom(false)}
 * >
 *   <View className="items-center">
 *     <Text className="text-6xl mb-4">🎉</Text>
 *     <Text className="text-xl font-heading">축하합니다!</Text>
 *     <Text className="text-text-secondary mt-2">16시간 단식을 완료했어요</Text>
 *   </View>
 * </Modal>
 */

type ModalType = 'alert' | 'confirm' | 'custom';

interface ModalProps {
  /** 모달 표시 여부 */
  visible: boolean;
  /** 모달 타입 */
  type: ModalType;
  /** 제목 (선택) */
  title?: string;
  /** 메시지 (선택) */
  message?: string;
  /** 상단 이모지 (선택) */
  emoji?: string;
  /** 확인 버튼 텍스트 */
  confirmText?: string;
  /** 취소 버튼 텍스트 */
  cancelText?: string;
  /** 확인 버튼 클릭 핸들러 */
  onConfirm: () => void;
  /** 취소 버튼 클릭 핸들러 (confirm, custom 타입용) */
  onCancel?: () => void;
  /** 커스텀 콘텐츠 (custom 타입용) */
  children?: ReactNode;
  /** 배경 탭으로 닫기 비활성화 */
  disableBackdropClose?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MODAL_WIDTH = Math.min(SCREEN_WIDTH - 48, 320);

export default function Modal({
  visible,
  type,
  title,
  message,
  emoji,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
  children,
  disableBackdropClose = false,
}: ModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  /** 배경 탭 핸들러 */
  const handleBackdropPress = () => {
    if (disableBackdropClose) return;

    if (type === 'alert') {
      onConfirm();
    } else {
      onCancel?.();
    }
  };

  /** 확인 버튼 렌더링 */
  const renderConfirmButton = () => (
    <Pressable
      onPress={onConfirm}
      className="flex-1 py-3.5 bg-btn-primary rounded-full items-center justify-center active:opacity-80"
    >
      <Text className="text-white font-heading text-base">{confirmText}</Text>
    </Pressable>
  );

  /** 취소 버튼 렌더링 */
  const renderCancelButton = () => (
    <Pressable
      onPress={onCancel}
      className="flex-1 py-3.5 border border-border-custom rounded-full items-center justify-center active:opacity-80 mr-3"
    >
      <Text className="text-text-primary font-heading text-base">{cancelText}</Text>
    </Pressable>
  );

  /** 버튼 영역 렌더링 */
  const renderButtons = () => {
    if (type === 'alert') {
      return <View className="mt-6">{renderConfirmButton()}</View>;
    }

    return (
      <View className="flex-row mt-6">
        {renderCancelButton()}
        {renderConfirmButton()}
      </View>
    );
  };

  /** 콘텐츠 렌더링 */
  const renderContent = () => {
    if (type === 'custom') {
      return (
        <>
          {children}
          {renderButtons()}
        </>
      );
    }

    return (
      <>
        {emoji && (
          <Text className="text-5xl text-center mb-4">{emoji}</Text>
        )}
        {title && (
          <Text className="text-lg font-heading text-text-primary text-center">
            {title}
          </Text>
        )}
        {message && (
          <Text className="text-sm font-sans text-text-secondary text-center mt-2">
            {message}
          </Text>
        )}
        {renderButtons()}
      </>
    );
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={type === 'alert' ? onConfirm : onCancel}
    >
      <View className="flex-1">
        {/* 배경 오버레이 */}
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="absolute inset-0 bg-black/50"
        >
          <Pressable
            onPress={handleBackdropPress}
            className="flex-1"
          />
        </Animated.View>

        {/* 모달 카드 */}
        <View className="flex-1 items-center justify-center px-6">
          <Animated.View
            style={{
              width: MODAL_WIDTH,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}
            className="bg-surface rounded-2xl p-6 shadow-lg"
          >
            {renderContent()}
          </Animated.View>
        </View>
      </View>
    </RNModal>
  );
}
