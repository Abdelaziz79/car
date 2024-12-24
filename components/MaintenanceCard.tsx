import {
  CompletionData,
  MaintenanceItem,
  MaintenanceType,
} from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface MaintenanceCardProps {
  item: MaintenanceItem;
  onPress: (item: MaintenanceItem) => void;
  onComplete: (id: string, completionData: CompletionData) => void;
  onDelete: (id: string) => void;
  currentKm: number;
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  item,
  onPress,
  onComplete,
  onDelete,
  currentKm,
}) => {
  const [completionModalVisible, setCompletionModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [completionDate, setCompletionDate] = useState(new Date());
  const [completionKm, setCompletionKm] = useState(currentKm.toString());
  const [notes, setNotes] = useState("");

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

  const handleConfirmComplete = () => {
    const kmNumber = parseInt(completionKm);

    if (isNaN(kmNumber)) {
      Alert.alert("خطأ", "الرجاء إدخال رقم صحيح للكيلومترات");
      return;
    }

    if (kmNumber < currentKm) {
      Alert.alert("خطأ", "لا يمكن إدخال قيمة أقل من العداد الحالي");
      return;
    }

    onComplete(item.id, {
      completionDate: completionDate.toISOString(),
      kilometers: kmNumber,
      notes: notes.trim(),
    });
    setCompletionModalVisible(false);
    resetForm();
  };

  const handleDelete = () => {
    Alert.alert("تأكيد الحذف", "هل أنت متأكد من حذف هذه المهمة؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        onPress: () => onDelete(item.id),
        style: "destructive",
      },
    ]);
  };

  const resetForm = () => {
    setCompletionDate(new Date());
    setCompletionKm(currentKm.toString());
    setNotes("");
  };

  const updateDate = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setCompletionDate(selectedDate);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => onPress(item)}
        className={`mb-6 rounded-2xl border ${colors.border} ${colors.secondary} 
                    shadow-lg ${colors.shadow}`}
      >
        <View className={`h-2 rounded-t-2xl ${colors.primary}`} />
        <View className="p-5">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className={`text-2xl font-bold ${colors.text} mb-2`}>
                {item.title}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {item.tags?.map((tagName, index) => (
                  <View
                    key={index}
                    className="rounded-full px-3 py-1 bg-gray-100"
                  >
                    <Text className="text-sm font-medium text-gray-700">
                      {tagName}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setCompletionModalVisible(true)}
                className={`${colors.primary} px-4 py-2.5 rounded-xl shadow-sm`}
              >
                <Text className="text-white font-bold">إكمال</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                className="bg-red-500 px-4 py-2.5 rounded-xl shadow-sm"
              >
                <Text className="text-white font-bold">حذف</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-gray-700 text-base leading-6 mb-4">
            {item.description}
          </Text>

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

          <View className={`mt-2 pt-4 border-t ${colors.border}`}>
            {item.type === "time-based" && (
              <View className="space-y-2">
                {item.lastDate && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500">آخر صيانة:</Text>
                    <Text className="font-medium text-gray-700">
                      {formatDate(item.lastDate)}
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

      <Modal
        visible={completionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCompletionModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white rounded-xl p-6 w-11/12 max-w-md">
            <Text className="text-xl font-bold text-slate-800 mb-6">
              إكمال المهمة
            </Text>

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4"
            >
              <Text className="text-slate-600">
                التاريخ: {formatDate(completionDate.toISOString())}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={completionDate}
                mode="date"
                display="default"
                onChange={updateDate}
              />
            )}

            <TextInput
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 text-right"
              keyboardType="numeric"
              placeholder="عداد الكيلومترات"
              value={completionKm}
              onChangeText={setCompletionKm}
            />

            <TextInput
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 text-right"
              placeholder="ملاحظات (اختياري)"
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity
              onPress={handleConfirmComplete}
              className={`${colors.primary} px-4 py-3 rounded-xl mb-3`}
            >
              <Text className="text-white font-bold text-center">تأكيد</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setCompletionModalVisible(false);
                resetForm();
              }}
              className="bg-gray-200 px-4 py-3 rounded-xl"
            >
              <Text className="text-gray-700 font-bold text-center">إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MaintenanceCard;
