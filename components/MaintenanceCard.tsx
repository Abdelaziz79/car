import { CompletionData, MaintenanceItem } from "@/types/allTypes";
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
  const [isSwipeableOpen, setIsSwipeableOpen] = useState(false);
  const swipeableRef = useRef<Swipeable>(null);

  const getText = (key: string): string => {
    const textMap: { [key: string]: string } = {
      tasks: isRTL ? "المهام" : "Tasks",
      lastMaintenance: isRTL ? "آخر صيانة" : "Last Maintenance",
      nextMaintenance: isRTL ? "الموعد القادم" : "Next Maintenance",
      nextDistance: isRTL ? "المسافة القادمة" : "Next Distance",
      delete: isRTL ? "حذف" : "Delete",
      complete: isRTL ? "إكمال" : "Complete",
      confirmDelete: isRTL ? "تأكيد الحذف" : "Confirm Delete",
      deleteMessage: isRTL
        ? "هل أنت متأكد من حذف هذه المهمة؟"
        : "Are you sure you want to delete this task?",
      cancel: isRTL ? "إلغاء" : "Cancel",
    };
    return textMap[key] || key;
  };

  if (!directionLoaded) {
    return null;
  }

  const themeColors: Record<
    any,
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
    undefined: {
      primary: "bg-gray-500",
      secondary: "bg-gray-50",
      accent: "bg-gray-100",
      text: "text-gray-900",
      border: "border-gray-200",
      shadow: "shadow-gray-100",
    },
  };

  let colors;
  if (item.createdByUser) colors = themeColors["user-based"];
  else colors = themeColors[item.type];

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
    <View className="bg-red-500 flex items-center justify-center w-24 rounded-2xl mb-6">
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={24}
        color="white"
      />
      <Text className="text-white text-sm font-medium mt-1">
        {getText("delete")}
      </Text>
    </View>
  );

  const renderLeftActions = () => (
    <View className="bg-green-500 flex items-center justify-center w-24 rounded-2xl mb-6">
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={24}
        color="white"
      />
      <Text className="text-white text-sm font-medium mt-1">
        {getText("complete")}
      </Text>
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
          onPress={() => !isSwipeableOpen && onPress(item)}
          className={`mb-6 rounded-2xl border ${colors.border} ${colors.secondary} 
                    shadow-lg ${colors.shadow}`}
          style={{ direction: isRTL ? "rtl" : "ltr" }}
          activeOpacity={isSwipeableOpen ? 1 : 0.8}
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
                        {item.lastKm.toString()} {isRTL ? "كم" : "km"}
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
                        {item.nextKm.toString()} {isRTL ? "كم" : "km"}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
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
    </GestureHandlerRootView>
  );
};

export default MaintenanceCard;
