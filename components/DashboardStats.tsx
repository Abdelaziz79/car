import React from "react";
import { View, Text } from "react-native";

const DashboardStats = () => {
  return (
    <View className="flex-row justify-between px-6 py-4 bg-white shadow-sm mb-6">
      <View className="items-center">
        <Text className="text-2xl font-bold text-violet-600">3</Text>
        <Text className="text-sm text-gray-600">مهام اليوم</Text>
      </View>
      <View className="items-center">
        <Text className="text-2xl font-bold text-sky-600">12</Text>
        <Text className="text-sm text-gray-600">قادمة</Text>
      </View>
      <View className="items-center">
        <Text className="text-2xl font-bold text-teal-600">45</Text>
        <Text className="text-sm text-gray-600">مكتملة</Text>
      </View>
    </View>
  );
};

export default DashboardStats;
