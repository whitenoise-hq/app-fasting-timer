import { View, Text } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ACCENT } from '../../constants/colors';

interface Warning {
  id: string;
  title: string;
  items: string[];
}

interface WarningCardProps {
  warning: Warning;
}

/** 주의사항 카드 */
export default function WarningCard({ warning }: WarningCardProps) {
  return (
    <View className="bg-accent-red/10 border border-accent-red rounded-2xl p-4">
      <View className="flex-row items-center mb-3">
        <View className="w-8 h-8 bg-accent-red/20 rounded-full items-center justify-center mr-2">
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke={ACCENT.red}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
        <Text className="text-base font-heading text-accent-red flex-1">
          {warning.title}
        </Text>
      </View>

      {warning.items.map((item, index) => (
        <View key={index} className="flex-row items-start ml-2 mb-1.5">
          <Text className="font-sans text-accent-red mr-2">•</Text>
          <Text className="font-sans text-sm text-text-secondary dark:text-text-secondary-dark flex-1">
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}
