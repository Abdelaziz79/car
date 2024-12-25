import {
  CompletionData,
  MaintenanceItem,
  MaintenanceType,
} from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import CompleteModel from "./CompleteModel";

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

  const getColorValue = (colorClass: string) => {
    if (colorClass.includes("violet")) return "#7C3AED";
    if (colorClass.includes("blue")) return "#3B82F6";
    if (colorClass.includes("sky")) return "#0EA5E9";
    return "#000000";
  };

  const handleDelete = () => {
    Alert.alert("تأكيد الحذف", "هل أنت متأكد من حذف هذه المهمة؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        onPress: () => {
          onDelete(item.id);
          setMenuVisible(false);
        },
        style: "destructive",
      },
    ]);
  };

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

      <Modal
        visible={menuVisible}
        transparent
        onRequestClose={() => setMenuVisible(false)}
        animationType="fade"
      >
        <TouchableOpacity
          className="flex-1  bg-black/30"
          onPress={() => setMenuVisible(false)}
        >
          <View className="bg-white rounded-xl w-11/12 max-w-md mx-auto mt-72 overflow-hidden">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-lg font-bold text-center text-gray-800">
                {item.title}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setMenuVisible(false);
                setCompletionModalVisible(true);
              }}
              className="p-4 flex-row items-center justify-center border-b border-gray-100"
            >
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={24}
                color="#3B82F6"
              />
              <Text className="text-blue-600 text-lg font-medium mr-2">
                إكمال المهمة
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="p-4 flex-row items-center justify-center"
            >
              <MaterialCommunityIcons
                name="delete-outline"
                size={24}
                color="#EF4444"
              />
              <Text className="text-red-600 text-lg font-medium mr-2">
                حذف المهمة
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMenuVisible(false)}
              className="p-4 border-t border-gray-100"
            >
              <Text className="text-gray-600 text-center font-medium">
                إلغاء
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
