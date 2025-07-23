// components/ui/WelcomeBanner.tsx
import { View, Text } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
};

export default function WelcomeBanner({ title, subtitle }: Props) {
  return (
    <View className="p-4 bg-green-100 rounded-xl shadow-md">
      <Text className="text-xl font-bold text-green-800">{title}</Text>
      {subtitle && (
        <Text className="text-sm text-green-700 mt-1">{subtitle}</Text>
      )}
    </View>
  );
}
