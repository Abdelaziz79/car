import { Text, View } from "react-native";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle }) => (
  <View className="w-[48%] bg-white rounded-xl p-4 mb-4 shadow-sm">
    <Text className="text-sm text-slate-500">{title}</Text>
    <Text className="text-2xl font-bold text-slate-800">{value}</Text>
    {subtitle && (
      <Text className="text-xs text-slate-500 mt-1">{subtitle}</Text>
    )}
  </View>
);

export default StatCard;
