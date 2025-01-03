import { MaintenanceRecord } from "@/types/allTypes";
import React from "react";
import { Text, View } from "react-native";
const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

const RenderSummary = ({
  filteredRecords,
  isRTL,
}: {
  isRTL: boolean;
  filteredRecords: MaintenanceRecord[];
}) => {
  const totalCost = filteredRecords.reduce(
    (sum, record) => sum + (record.cost || 0),
    0
  );
  const avgCost = totalCost / (filteredRecords.length || 1);
  const recentCosts =
    filteredRecords
      .sort(
        (a, b) =>
          new Date(b.completionDate).getTime() -
          new Date(a.completionDate).getTime()
      )
      .slice(0, 1)[0]?.cost || 0;

  return (
    <View
      className="flex-row justify-between bg-white rounded-xl shadow-sm p-4 mb-4"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <View className="items-center">
        <Text className="text-gray-500 text-sm">
          {isRTL ? "التكلفة الإجمالية" : "Total Cost"}
        </Text>
        <Text className="text-gray-800 font-bold">
          {formatCurrency(totalCost)}
        </Text>
      </View>
      <View className="items-center">
        <Text className="text-gray-500 text-sm">
          {isRTL ? "متوسط التكلفة" : "Avg Cost"}
        </Text>
        <Text className="text-gray-800 font-bold">
          {formatCurrency(avgCost)}
        </Text>
      </View>
      <View className="items-center">
        <Text className="text-gray-500 text-sm">
          {isRTL ? "آخر تكلفة" : "Latest Cost"}
        </Text>
        <Text className="text-gray-800 font-bold">
          {formatCurrency(recentCosts)}
        </Text>
      </View>
    </View>
  );
};

export default RenderSummary;
