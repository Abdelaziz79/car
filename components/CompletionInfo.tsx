import { formatDate } from "@/utils/dateFormatter";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

interface CompletionData {
  completionDate: string;
  kmAtCompletion?: number;
  notes?: string;
}

interface Props {
  completionData: CompletionData | null;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Animated.View
    entering={FadeInRight.delay(200)}
    className="flex-row items-center justify-between bg-gray-50 p-3 rounded-xl"
  >
    <Text className="font-semibold text-gray-700">{label}</Text>
    <Text className="text-gray-600">{value}</Text>
  </Animated.View>
);

const CompletionInfo: React.FC<Props> = ({ completionData }) => {
  if (!completionData) return null;

  const formattedDate = formatDate(completionData.completionDate);
  const { kmAtCompletion, notes } = completionData;

  return (
    <Animated.View
      entering={FadeInDown}
      className="p-4 bg-white rounded-3xl shadow-lg border border-gray-100"
    >
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-xl font-bold text-gray-800">آخر إتمام</Text>
          <View className="bg-blue-500 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">جديد</Text>
          </View>
        </View>
      </View>

      <View className="flex-col gap-2">
        <InfoRow label="التاريخ" value={formattedDate} />

        {kmAtCompletion && (
          <InfoRow
            label="الكيلومترات"
            value={`${kmAtCompletion.toLocaleString()} كم`}
          />
        )}

        {notes && (
          <Animated.View
            entering={FadeInRight.delay(400)}
            className="bg-gray-50 p-3 rounded-xl"
          >
            <Text className="font-semibold text-gray-700 mb-2">ملاحظات</Text>
            <Text className="text-gray-600 leading-5">{notes}</Text>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

export default CompletionInfo;
