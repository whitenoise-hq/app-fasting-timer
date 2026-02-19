import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PlanCard,
  GuideSection,
  AllowedForbiddenList,
  TimeWindowCard,
  WarningCard,
  FAQItem,
} from '../../src/components/guide';
import { DEFAULT_PLANS } from '../../src/constants/plans';
import {
  ALLOWED_ITEMS,
  FORBIDDEN_ITEMS,
  RECOMMENDED_EATING_WINDOWS,
  WARNINGS,
  FAQ_ITEMS,
} from '../../src/constants/guide';

export default function GuideScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View className="mb-6">
          <Text className="text-2xl font-extrabold text-text-primary dark:text-text-primary-dark mb-1">
            단식 가이드
          </Text>
          <Text className="text-sm text-text-muted dark:text-text-muted-dark">
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
