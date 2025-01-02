import { Text, View } from "react-native";

const TagCostCard = ({ tag, cost }: { tag: string; cost: number }) => (
  <View className="flex-row justify-between mb-2">
    <Text className="text-slate-600">{tag}</Text>
    <Text className="font-medium text-slate-800">${cost.toFixed(2)}</Text>
  </View>
);

export default TagCostCard;
