import {
  MaintenanceInterval,
  MaintenanceItem,
  MaintenanceStatus,
} from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MaintenanceCardProps {
  item: MaintenanceItem;
  onPress: (item: MaintenanceItem) => void;
  onComplete: (id: string) => void;
}

const getIntervalLabel = (interval: MaintenanceInterval): string =>
  ({
    biweekly: "كل أسبوعين",
    monthly: "شهرياً",
    quarterly: "ربع سنوي",
    semiannual: "نصف سنوي",
    annual: "سنوي",
    biennial: "كل سنتين",
    triennial: "كل ثلاث سنوات",
  }[interval]);

export const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  item,
  onPress,
  onComplete,
}) => {
  const themeColors: Record<
    MaintenanceStatus,
    {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      border: string;
      shadow: string;
    }
  > = {
    pending: {
      primary: "bg-violet-500",
      secondary: "bg-violet-50",
      accent: "bg-violet-100",
      text: "text-violet-900",
      border: "border-violet-200",
      shadow: "shadow-violet-100",
    },
    upcoming: {
      primary: "bg-sky-500",
      secondary: "bg-sky-50",
      accent: "bg-sky-100",
      text: "text-sky-900",
      border: "border-sky-200",
      shadow: "shadow-sky-100",
    },
    completed: {
      primary: "bg-teal-500",
      secondary: "bg-teal-50",
      accent: "bg-teal-100",
      text: "text-teal-900",
      border: "border-teal-200",
      shadow: "shadow-teal-100",
    },
    overdue: {
      primary: "bg-rose-500",
      secondary: "bg-rose-50",
      accent: "bg-rose-100",
      text: "text-rose-900",
      border: "border-rose-200",
      shadow: "shadow-rose-100",
    },
    all: {
      primary: "bg-slate-500",
      secondary: "bg-slate-50",
      accent: "bg-slate-100",
      text: "text-slate-900",
      border: "border-slate-200",
      shadow: "shadow-slate-100",
    },
  };

  const statusLabels: Record<MaintenanceStatus, string> = {
    pending: "قيد الانتظار",
    upcoming: "قادم",
    completed: "مكتمل",
    overdue: "متأخر",
    all: "الكل",
  };

  const colors = themeColors[item.status];

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className={`mb-6 rounded-2xl border ${colors.border} ${colors.secondary} 
                  shadow-lg ${colors.shadow}`}
    >
      {/* Status Bar */}
      <View className={`h-2 rounded-t-2xl ${colors.primary}`} />

      {/* Main Content */}
      <View className="p-5">
        {/* Header */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className={`text-2xl font-bold ${colors.text} mb-2`}>
              {item.title}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <View className={`rounded-full px-3 py-1 ${colors.accent}`}>
                <Text className={`text-sm font-medium ${colors.text}`}>
                  {statusLabels[item.status]}
                </Text>
              </View>
              {item.interval ? (
                <View className="rounded-full px-3 py-1 bg-gray-100">
                  <Text className="text-sm font-medium text-gray-700">
                    {getIntervalLabel(item.interval)}
                  </Text>
                </View>
              ) : (
                <View className="rounded-full px-3 py-1 bg-gray-100">
                  <Text className="text-sm font-medium text-gray-700">
                    {item.kilometers} كيلومتر
                  </Text>
                </View>
              )}
              <View className={`rounded-full px-3 py-1 bg-gray-100`}>
                <Text className="text-sm font-medium text-gray-700">
                  {item.type === "time-based"
                    ? "على أساس الوقت"
                    : "على أساس المسافة"}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => onComplete(item.id)}
            className={`${colors.primary} px-4 py-2.5 rounded-xl shadow-sm`}
            disabled={item.status === "completed"}
          >
            <Text className="text-white font-bold">
              {item.status === "completed" ? "تم" : "إكمال"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <Text className="text-gray-700 text-base leading-6 mb-4">
          {item.description}
        </Text>

        {/* Tasks Section */}
        {item.tasks && item.tasks.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">المهام</Text>
            <View className={`rounded-xl ${colors.secondary} p-3`}>
              {item.tasks.map((task, index) => (
                <View
                  key={index}
                  className="flex-row items-center mb-2 last:mb-0"
                >
                  <View
                    className={`w-2 h-2 rounded-full ${colors.primary} mr-3`}
                  />
                  <Text className="text-gray-700">{task}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        <View className={`mt-2 pt-4 border-t ${colors.border}`}>
          {item.type === "time-based" && (
            <View className="space-y-2">
              {item.completionHistory && item.completionHistory?.length > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">آخر صيانة:</Text>
                  <Text className="font-medium text-gray-700">
                    {formatDate(
                      item.lastDate ||
                        item.completionHistory[
                          item.completionHistory.length - 1
                        ].completionDate
                    )}
                  </Text>
                </View>
              )}
              {item.nextDate && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">الموعد القادم:</Text>
                  <Text className={`font-medium ${colors.text}`}>
                    {formatDate(item.nextDate)}
                  </Text>
                </View>
              )}
            </View>
          )}

          {item.type === "distance-based" && (
            <View className="space-y-2">
              {item.lastKm !== undefined && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">آخر صيانة:</Text>
                  <Text className="font-medium text-gray-700">
                    {item.lastKm.toLocaleString()} كم
                  </Text>
                </View>
              )}
              {item.nextKm !== undefined && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">المسافة القادمة:</Text>
                  <Text className={`font-medium ${colors.text}`}>
                    {item.nextKm.toLocaleString()} كم
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
