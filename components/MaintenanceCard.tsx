import {
  CompletionData,
  MaintenanceItem,
  MaintenanceType,
} from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import { getColorValue } from "@/utils/helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import CompleteModel from "./CompleteModel";
import EditModel from "./EditModel";
import MenuModel from "./MenuModel";

interface MaintenanceCardProps {
  item: MaintenanceItem;
  onPress: (item: MaintenanceItem) => void;
  onComplete: (id: string, completionData: CompletionData) => void;
  onDelete: (id: string) => void;
  currentKm: number;
  handleUpdateTask: (
    id: string,
    updates: Partial<MaintenanceItem>,
    setLoading?: (loading: boolean) => void,
    onSuccess?: () => void
  ) => any;
  onRefresh: () => void;
  isRTL: boolean;
  directionLoaded: boolean;
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  item,
  onPress,
  onComplete,
  onDelete,
  currentKm,
  handleUpdateTask,
  onRefresh,
  isRTL,
  directionLoaded,
}) => {
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const getText = (key: string): string => {
    const textMap: { [key: string]: string } = {
      tasks: isRTL ? "المهام" : "Tasks",
      lastMaintenance: isRTL ? "آخر صيانة" : "Last Maintenance",
      nextMaintenance: isRTL ? "الموعد القادم" : "Next Maintenance",
      nextDistance: isRTL ? "المسافة القادمة" : "Next Distance",
    };
    return textMap[key] || key;
  };

  if (!directionLoaded) {
    return null;
  }

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
    <>
      <TouchableOpacity
        onPress={() => onPress(item)}
        className={`mb-6 rounded-2xl border ${colors.border} ${colors.secondary} 
                    shadow-lg ${colors.shadow}`}
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <View className={`h-2 rounded-t-2xl ${colors.primary}`} />
        <View className="p-5">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text
                className={`text-2xl font-bold ${colors.text} mb-2`}
                style={{
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {item.title}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {item.tags?.map((tagName, index) => (
                  <View
                    key={index}
                    className="rounded-full px-3 py-1 bg-gray-100"
                  >
                    <Text
                      className="text-sm font-medium text-gray-700"
                      style={{
                        writingDirection: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {tagName}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            {/* Menu */}
            <View>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setMenuVisible(true);
                }}
              >
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={24}
                  color={getColorValue(colors.text)}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text
            className="text-gray-700 text-base leading-6 mb-4"
            style={{
              writingDirection: isRTL ? "rtl" : "ltr",
            }}
          >
            {item.description}
          </Text>

          {item.tasks && item.tasks.length > 0 && (
            <View className="mb-4">
              <Text
                className="text-lg font-semibold mb-2"
                style={{
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {getText("tasks")}
              </Text>
              <View className={`rounded-xl ${colors.secondary} p-3`}>
                {item.tasks.map((task, index) => (
                  <View
                    key={index}
                    className="flex-row items-center mb-2 last:mb-0"
                  >
                    <View
                      className={`w-2 h-2 rounded-full ${colors.primary} mx-2`}
                    />
                    <Text
                      className="text-gray-700"
                      style={{
                        writingDirection: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {task}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View className={`mt-2 pt-4 border-t ${colors.border}`}>
            {item.type === "time-based" && (
              <View className="space-y-2">
                {item.lastDate && (
                  <View className="flex-row justify-between">
                    <Text
                      className="text-gray-500"
                      style={{
                        writingDirection: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {getText("lastMaintenance")}:
                    </Text>
                    <Text
                      className="font-medium text-gray-700"
                      style={{
                        writingDirection: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {formatDate(item.lastDate, isRTL ? "ar-SA" : "en-US")}
                    </Text>
                  </View>
                )}
                {item.nextDate && (
                  <View className="flex-row justify-between">
                    <Text
                      className="text-gray-500"
                      style={{
                        writingDirection: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {getText("nextMaintenance")}:
                    </Text>
                    <Text
                      className={`font-medium ${colors.text}`}
                      style={{
                        writingDirection: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {formatDate(item.nextDate, isRTL ? "ar-SA" : "en-US")}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {item.type === "distance-based" && (
              <View className="space-y-2">
                {item.lastKm !== undefined && (
                  <View className="flex-row justify-between">
                    <Text
                      className="text-gray-500"
                      style={{
                        writingDirection: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {getText("lastMaintenance")}:
                    </Text>
                    <Text
                      className="font-medium text-gray-700"
                      style={{
                        writingDirection: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {item.lastKm.toLocaleString()} كم
                    </Text>
                  </View>
                )}
                {item.nextKm !== undefined && (
                  <View className="flex-row justify-between">
                    <Text
                      className="text-gray-500"
                      style={{
                        writingDirection: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {getText("nextDistance")}:
                    </Text>
                    <Text
                      className={`font-medium ${colors.text}`}
                      style={{
                        writingDirection: isRTL ? "rtl" : "ltr",
                      }}
                    >
                      {item.nextKm.toLocaleString()} كم
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
      <MenuModel
        item={item}
        onDelete={onDelete}
        menuVisible={menuVisible}
        setCompletionModalVisible={setCompletionModalVisible}
        setMenuVisible={setMenuVisible}
        setUpdateModalVisible={setUpdateModalVisible}
        directionLoaded={directionLoaded}
        isRTL={isRTL}
      />
      <CompleteModel
        item={item}
        currentKm={currentKm}
        onComplete={onComplete}
        colors={colors}
        completionModalVisible={completionModalVisible}
        setCompletionModalVisible={setCompletionModalVisible}
        directionLoaded={directionLoaded}
        isRTL={isRTL}
      />
      <EditModel
        item={item}
        onUpdate={handleUpdateTask}
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        onRefresh={onRefresh}
      />
    </>
  );
};

export default MaintenanceCard;
