import { MaintenanceItem, MaintenanceType } from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import { getIntervalLabel } from "@/utils/maintenanceHelpers";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface MaintenanceCardProps {
  item: MaintenanceItem;
  onPress: (item: MaintenanceItem) => void;
  onComplete: (id: string) => void;
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  item,
  onPress,
  onComplete,
}) => {
  const themeColors: Record<
    MaintenanceType,
    {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
      border: string;
      shadow: string;
    }
  > = {
    "time-based": {
      primary: "bg-violet-500",
      secondary: "bg-violet-50",
      accent: "bg-violet-100",
      text: "text-violet-900",
      border: "border-violet-200",
      shadow: "shadow-violet-100",
    },
    "distance-based": {
      primary: "bg-blue-500",
      secondary: "bg-blue-50",
      accent: "bg-blue-100",
      text: "text-blue-900",
      border: "border-blue-200",
      shadow: "shadow-blue-100",
    },
    "user-based": {
      primary: "bg-sky-500",
      secondary: "bg-sky-50",
      accent: "bg-sky-100",
      text: "text-sky-900",
      border: "border-sky-200",
      shadow: "shadow-sky-100",
    },
  };

  let colors;
  if (item.createdByUser) colors = themeColors["user-based"];
  else colors = themeColors[item.type];

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
              {item.createdByUser && (
                <View className="rounded-full px-3 py-1 bg-gray-100">
                  <Text className="text-sm font-medium text-gray-700">
                    مهام المستخدم
                  </Text>
                </View>
              )}
              {item.tags &&
                item.tags?.length > 0 &&
                item.tags.map((tagName, index) => (
                  <View
                    key={index}
                    className="rounded-full px-3 py-1 bg-gray-100"
                  >
                    <Text className="text-sm font-medium text-gray-700">
                      {tagName}
                    </Text>
                  </View>
                ))}
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
          >
            <Text className="text-white font-bold">إكمال</Text>
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

export default MaintenanceCard;
