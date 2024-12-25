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
import MenuModel from "./MenuModel";

interface MaintenanceCardProps {
  item: MaintenanceItem;
  onPress: (item: MaintenanceItem) => void;
  onComplete: (id: string, completionData: CompletionData) => void;
  onDelete: (id: string) => void;
  currentKm: number;
}

const CompactMaintenanceCard = ({
  item,
  onPress,
  currentKm,
  onDelete,
  onComplete,
}: MaintenanceCardProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [completionModalVisible, setCompletionModalVisible] = useState(false);

  const themeColors = {
    "time-based": {
      primary: "bg-violet-500",
      secondary: "bg-violet-50",
      text: "text-violet-900",
      border: "border-violet-200",
    },
    "distance-based": {
      primary: "bg-blue-500",
      secondary: "bg-blue-50",
      text: "text-blue-900",
      border: "border-blue-200",
    },
    "user-based": {
      primary: "bg-sky-500",
      secondary: "bg-sky-50",
      text: "text-sky-900",
      border: "border-sky-200",
    },
  };

  const colors = item.createdByUser
    ? themeColors["user-based"]
    : themeColors[item.type as MaintenanceType];

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className={`mb-3 mx-2 rounded-lg border ${colors.border} ${colors.secondary}`}
    >
      <View className="flex-row items-center p-3">
        <View className={`w-2 h-10 rounded-full ${colors.primary} mr-3`} />

        <View className="flex-1">
          <Text className={`text-base font-semibold ${colors.text}`}>
            {item.title}
          </Text>

          <View className="flex-row items-center mt-1">
            {item.type === "time-based" && item.nextDate && (
              <Text className="text-sm text-gray-600">
                {formatDate(item.nextDate)}
              </Text>
            )}
            {item.type === "distance-based" && item.nextKm && (
              <Text className="text-sm text-gray-600">
                {item.nextKm.toLocaleString()} كم
              </Text>
            )}
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {item.tags?.[0] && (
            <View className={`${colors.secondary} px-2 py-1 rounded-full`}>
              <Text className={`text-xs ${colors.text}`}>{item.tags[0]}</Text>
            </View>
          )}

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

      <MenuModel
        onDelete={onDelete}
        item={item}
        menuVisible={menuVisible}
        setMenuVisible={setMenuVisible}
        setCompletionModalVisible={setCompletionModalVisible}
      />
      <CompleteModel
        item={item}
        currentKm={currentKm}
        onComplete={onComplete}
        colors={colors}
        completionModalVisible={completionModalVisible}
        setCompletionModalVisible={setCompletionModalVisible}
      />
    </TouchableOpacity>
  );
};

export default CompactMaintenanceCard;
