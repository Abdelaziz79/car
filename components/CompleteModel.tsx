import { CompletionData, MaintenanceItem } from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import { generateId } from "@/utils/helpers";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CompletionInfo from "./CompletionInfo";

interface CompleteModelProps {
  item: MaintenanceItem;
  currentKm: number;
  onComplete: (id: string, completionData: CompletionData) => void;
  colors?: any;
  completionModalVisible: boolean;
  setCompletionModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  action?: () => void;
  isRTL: boolean;
  directionLoaded: boolean;
}

const CompleteModel: React.FC<CompleteModelProps> = ({
  item,
  currentKm,
  onComplete,
  colors = {
    primary: "bg-violet-500",
    secondary: "bg-violet-50",
    accent: "bg-violet-100",
    text: "text-violet-900",
    border: "border-violet-200",
    shadow: "shadow-violet-100",
  },
  completionModalVisible,
  setCompletionModalVisible,
  action,
  isRTL,
  directionLoaded,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [completionDate, setCompletionDate] = useState(new Date());
  const [completionKm, setCompletionKm] = useState(currentKm.toString());
  const [notes, setNotes] = useState("");
  const [cost, setCost] = useState("0");

  const getText = (key: string): string => {
    const textMap: { [key: string]: string } = {
      completeTask: isRTL ? "إكمال المهمة" : "Complete Task",
      date: isRTL ? "التاريخ" : "Date",
      odometerReading: isRTL ? "عداد الكيلومترات" : "Odometer Reading",
      cost: isRTL ? "التكلفة" : "Cost",
      notesOptional: isRTL ? "ملاحظات (اختياري)" : "Notes (Optional)",
      confirm: isRTL ? "تأكيد" : "Confirm",
      cancel: isRTL ? "إلغاء" : "Cancel",
      correctKilometers: isRTL
        ? "الرجاء إدخال رقم صحيح للكيلومترات"
        : "Please enter a correct number for kilometers",
      correctCost: isRTL
        ? "الرجاء إدخال رقم صحيح للتكلفة"
        : "Please enter a correct number for cost",
      greaterThanCurrentOdometer: isRTL
        ? "لا يمكن إدخال قيمة أقل من العداد الحالي"
        : "Cannot enter a value less than the current odometer",
    };
    return textMap[key] || key;
  };

  if (!directionLoaded) {
    return null;
  }

  const handleConfirmComplete = () => {
    const kmNumber = parseInt(completionKm);
    const costNumber = Number(cost);

    if (isNaN(kmNumber)) {
      Alert.alert(getText("error"), getText("correctKilometers"));
      return;
    }
    if (isNaN(costNumber)) {
      Alert.alert(getText("error"), getText("correctCost"));
      return;
    }

    if (kmNumber < currentKm) {
      Alert.alert(getText("error"), getText("greaterThanCurrentOdometer"));
      return;
    }

    onComplete(item.id, {
      id: generateId(),
      completionDate: completionDate.toISOString(),
      kmAtCompletion: kmNumber,
      notes: notes.trim(),
      cost: costNumber,
    });
    setCompletionModalVisible(false);
    resetForm();
    if (action) {
      action();
    }
  };

  const resetForm = () => {
    setCompletionDate(new Date());
    setCompletionKm(currentKm.toString());
    setNotes("");
    setCost("0");
  };

  const updateDate = (event: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setCompletionDate(selectedDate);
    }
  };
  const lastCompletionData =
    item.completionHistory && item.completionHistory.length > 0
      ? item.completionHistory[item.completionHistory.length - 1]
      : null;

  return (
    <Modal
      visible={completionModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setCompletionModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/30 py-10">
        <View
          className="bg-white rounded-xl p-6 w-11/12 max-w-md"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <Text
            className="text-xl font-bold text-slate-800 mb-6"
            style={{
              writingDirection: isRTL ? "rtl" : "ltr",
            }}
          >
            {getText("completeTask")}
          </Text>

          <ScrollView style={{ direction: isRTL ? "rtl" : "ltr" }}>
            {lastCompletionData && (
              <View className="mb-4">
                <CompletionInfo
                  completionData={lastCompletionData}
                  directionLoaded={directionLoaded}
                  isRTL={isRTL}
                />
              </View>
            )}
            <View className="mb-4">
              <Text
                className="text-slate-700 mb-1"
                style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
              >
                {getText("date")}:
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <Text
                  className="text-slate-600"
                  style={{
                    writingDirection: isRTL ? "rtl" : "ltr",
                  }}
                >
                  {formatDate(
                    completionDate.toISOString(),
                    isRTL ? "ar-SA" : "en-US"
                  )}
                </Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={completionDate}
                mode="date"
                display="default"
                onChange={updateDate}
              />
            )}
            <View className="mb-4">
              <Text
                className="text-slate-700 mb-1"
                style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
              >
                {getText("cost")}:
              </Text>
              <TextInput
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                keyboardType="numeric"
                placeholder={getText("cost")}
                value={cost}
                onChangeText={setCost}
                style={{ textAlign: isRTL ? "right" : "left" }}
              />
            </View>
            <View className="mb-4">
              <Text
                className="text-slate-700 mb-1"
                style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
              >
                {getText("odometerReading")}:
              </Text>
              <TextInput
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                keyboardType="numeric"
                placeholder={getText("odometerReading")}
                value={completionKm}
                onChangeText={setCompletionKm}
                style={{ textAlign: isRTL ? "right" : "left" }}
              />
            </View>
            <View className="mb-6">
              <Text
                className="text-slate-700 mb-1"
                style={{ writingDirection: isRTL ? "rtl" : "ltr" }}
              >
                {getText("notesOptional")}:
              </Text>
              <TextInput
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                placeholder={getText("notesOptional")}
                multiline
                numberOfLines={3}
                value={notes}
                onChangeText={setNotes}
                style={{ textAlign: isRTL ? "right" : "left" }}
              />
            </View>
            <TouchableOpacity
              onPress={handleConfirmComplete}
              className={`${colors.primary} px-4 py-3 rounded-xl mb-3`}
            >
              <Text
                className="text-white font-bold text-center"
                style={{
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {getText("confirm")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setCompletionModalVisible(false);
                resetForm();
              }}
              className="bg-gray-200 px-4 py-3 rounded-xl"
            >
              <Text
                className="text-gray-700 font-bold text-center"
                style={{
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {getText("cancel")}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CompleteModel;
