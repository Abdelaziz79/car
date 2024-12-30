import {
  CompletionData,
  MaintenanceItem,
  MaintenanceType,
} from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import { getColorValue } from "@/utils/helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
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

const CompactMaintenanceCard = ({
  item,
  onPress,
  currentKm,
  onDelete,
  onComplete,
  handleUpdateTask,
  onRefresh,
  isRTL,
  directionLoaded,
}: MaintenanceCardProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [isSwipeableOpen, setIsSwipeableOpen] = useState(false);
  const swipeableRef = useRef<Swipeable>(null);

  if (!directionLoaded) return null;

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
    undefined: {
      primary: "bg-gray-500",
      secondary: "bg-gray-50",
      text: "text-gray-900",
      border: "border-gray-200",
    },
  };

  const colors = item.createdByUser
    ? themeColors["user-based"]
    : themeColors[item.type as MaintenanceType];

  const getText = (key: string): string => {
    const textMap: { [key: string]: string } = {
      confirmDelete: isRTL ? "تأكيد الحذف" : "Confirm Delete",
      deleteMessage: isRTL
        ? "هل أنت متأكد من حذف هذه المهمة؟"
        : "Are you sure you want to delete this task?",
      cancel: isRTL ? "إلغاء" : "Cancel",
      delete: isRTL ? "حذف" : "Delete",
      complete: isRTL ? "إكمال" : "Complete",
    };
    return textMap[key] || key;
  };

  const handleDelete = () => {
    Alert.alert(getText("confirmDelete"), getText("deleteMessage"), [
      {
        text: getText("cancel"),
        style: "cancel",
        onPress: () => {
          swipeableRef.current?.close();
          setIsSwipeableOpen(false);
        },
      },
      {
        text: getText("delete"),
        onPress: () => {
          onDelete(item.id);
          setMenuVisible(false);
          setIsSwipeableOpen(false);
        },
        style: "destructive",
      },
    ]);
  };

  const handleComplete = () => {
    setCompletionModalVisible(true);
    swipeableRef.current?.close();
    setIsSwipeableOpen(false);
  };

  const renderRightActions = () => (
    <View className="bg-red-500 flex items-end  rounded-lg mb-[11px] w-full">
      <View className="mx-5 mt-2 items-center">
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={24}
          color="white"
        />
        <Text className="text-white text-sm font-medium mt-1">
          {getText("delete")}
        </Text>
      </View>
    </View>
  );

  const renderLeftActions = () => (
    <View className="bg-green-500 flex items-start w-full rounded-lg mb-[11px]">
      <View className="mx-5 mt-2 items-center">
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={24}
          color="white"
        />
        <Text className="text-white text-sm font-medium mt-1">
          {getText("complete")}
        </Text>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        friction={1}
        overshootFriction={8}
        containerStyle={{ marginHorizontal: 8 }}
        onSwipeableRightOpen={() => {
          setIsSwipeableOpen(true);
          handleDelete();
        }}
        onSwipeableLeftOpen={() => {
          setIsSwipeableOpen(true);
          handleComplete();
        }}
        onSwipeableClose={() => {
          setIsSwipeableOpen(false);
        }}
      >
        <TouchableOpacity
          activeOpacity={isSwipeableOpen ? 1 : 0.8}
          onPress={() => !isSwipeableOpen && onPress(item)}
          className={`mb-3 rounded-lg border ${colors.border} ${colors.secondary}`}
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <View className="flex-row items-center p-3">
            <View className={`w-2 h-10 rounded-full ${colors.primary} mx-2`} />

            <View className="flex-1">
              <Text className={`text-base font-semibold ${colors.text}`}>
                {item.title}
              </Text>

              <View className="flex-row items-center mt-1">
                {item.type === "time-based" && item.nextDate && (
                  <Text className="text-sm text-gray-600">
                    {formatDate(item.nextDate, isRTL ? "ar-SA" : "en-US")}
                  </Text>
                )}
                {item.type === "distance-based" && item.nextKm && (
                  <Text className="text-sm text-gray-600">
                    {item.nextKm.toString()} {isRTL ? "كم" : "km"}
                  </Text>
                )}
              </View>
            </View>

            <View className="flex-row items-center gap-2">
              {item.tags?.[0] && (
                <View className={`${colors.secondary} px-2 py-1 rounded-full`}>
                  <Text className={`text-xs ${colors.text}`}>
                    {item.tags[0]}
                  </Text>
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
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default CompactMaintenanceCard;
