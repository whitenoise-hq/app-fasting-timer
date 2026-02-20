import { useRef, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import {
  PlanCard,
  GuideSection,
  AllowedForbiddenList,
  TimeWindowCard,
  WarningCard,
  FAQItem,
} from '@/components/guide';
import { DEFAULT_PLANS } from '@/constants/plans';
import {
  ALLOWED_ITEMS,
  FORBIDDEN_ITEMS,
  RECOMMENDED_EATING_WINDOWS,
  WARNINGS,
  FAQ_ITEMS,
} from '@/constants/guide';

export default function GuideScreen() {
  const scrollViewRef = useRef<ScrollViewType>(null);
  const navigation = useNavigation();
  const isFocusedRef = useRef(false);

  // 현재 탭을 다시 누르면 스크롤 최상단으로 이동
  useEffect(() => {
    const unsubscribeFocus = (navigation as any).addListener('focus', () => {
      isFocusedRef.current = true;
    });
    const unsubscribeBlur = (navigation as any).addListener('blur', () => {
      isFocusedRef.current = false;
    });
    const unsubscribeTabPress = (navigation as any).addListener('tabPress', () => {
      if (isFocusedRef.current) {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
    });
    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
      unsubscribeTabPress();
    };
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View className="mb-6">
          <Text className="text-2xl font-heading text-text-primary mb-1">
            단식 가이드
          </Text>
          <Text className="font-sans text-sm text-text-muted">
            간헐적 단식의 모든 것을 알려드려요
          </Text>
        </View>

        {/* 단식 방법 소개 */}
        <GuideSection title="단식 방법">
          <View className="gap-3">
            {DEFAULT_PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </View>
        </GuideSection>

        {/* 공복 가이드 */}
        <GuideSection title="공복 시 허용/금지 음식">
          <AllowedForbiddenList
            allowedItems={ALLOWED_ITEMS}
            forbiddenItems={FORBIDDEN_ITEMS}
          />
        </GuideSection>

        {/* 추천 식사 시간대 */}
        <GuideSection title="추천 식사 시간대">
          <View className="gap-3">
            {RECOMMENDED_EATING_WINDOWS.map((window, index) => (
              <TimeWindowCard
                key={window.id}
                timeWindow={window}
                isRecommended={index === 0}
              />
            ))}
          </View>
        </GuideSection>

        {/* 주의사항 */}
        <GuideSection title="주의사항">
          <View className="gap-3">
            {WARNINGS.map((warning) => (
              <WarningCard key={warning.id} warning={warning} />
            ))}
          </View>
        </GuideSection>

        {/* FAQ */}
        <GuideSection title="자주 묻는 질문">
          <View className="gap-2">
            {FAQ_ITEMS.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </View>
        </GuideSection>

        {/* 하단 여백 */}
        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}
