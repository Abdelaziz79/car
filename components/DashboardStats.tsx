import { getTasksWithHistory } from "@/utils/maintenanceHelpers";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const DashboardStats = () => {
  const [completeTasks, setCompleteTasks] = useState(0);
  const navigation = useRouter();
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const allTasks = await getTasksWithHistory();
        setCompleteTasks(allTasks.length);
      };

      loadData();
    }, [])
  );

  return (
    <View className="flex-row justify-between px-6 py-4 bg-white shadow-sm mb-6">
      <TouchableOpacity onPress={() => navigation.push("/record")}>
        <View className="items-center">
          <Text className="text-2xl font-bold text-violet-600">0</Text>
          <Text className="text-sm text-gray-600">مهام اليوم</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.push("/record")}>
        <View className="items-center">
          <Text className="text-2xl font-bold text-sky-600">
            {completeTasks}
          </Text>
          <Text className="text-sm text-gray-600">قادمة</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.push("/record")}>
        <View className="items-center">
          <Text className="text-2xl font-bold text-teal-600">
            {completeTasks}
          </Text>
          <Text className="text-sm text-gray-600">مكتملة</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardStats;
