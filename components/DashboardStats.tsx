import { useDirectionManager } from "@/hooks/useDirectionManager"; // Make sure this path is correct
import { getTasksWithHistory } from "@/utils/maintenanceHelpers";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface StatItemProps {
  value: number | string;
  label: {
    ar: string;
    en: string;
  };
  color: string;
  onPress: () => void;
}

const StatItem = ({ value, label, color, onPress }: StatItemProps) => {
  const { isRTL } = useDirectionManager();

  return (
    <TouchableOpacity onPress={onPress}>
      <View className="items-center">
        <Text className={`text-2xl font-bold ${color}`}>{value}</Text>
        <Text className="text-sm text-gray-600">
          {isRTL ? label.ar : label.en}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const DashboardStats = () => {
  const [completeTasks, setCompleteTasks] = useState(0);
  const navigation = useRouter();
  const { isRTL, directionLoaded } = useDirectionManager();

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const allTasks = await getTasksWithHistory();
        setCompleteTasks(allTasks.length);
      };

      loadData();
    }, [])
  );

  // Wait until the direction is loaded
  if (!directionLoaded) {
    return null;
  }

  const stats = [
    {
      value: 0,
      label: { ar: "مهام اليوم", en: "Today's Tasks" },
      color: "text-violet-600",
    },
    {
      value: completeTasks,
      label: { ar: "قادمة", en: "Upcoming" },
      color: "text-sky-600",
    },
    {
      value: completeTasks,
      label: { ar: "مكتملة", en: "Completed" },
      color: "text-teal-600",
    },
  ];

  return (
    <View
      className="flex-row justify-between px-6 py-4 bg-white shadow-sm mb-6"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {stats.map((stat, index) => (
        <StatItem
          key={index}
          value={stat.value}
          label={stat.label}
          color={stat.color}
          onPress={() => navigation.push("/record")}
        />
      ))}
    </View>
  );
};

export default DashboardStats;
