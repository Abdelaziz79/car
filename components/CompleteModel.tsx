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

const CompleteModel = ({
  item,
  currentKm,
  onComplete,
  colors,
  completionModalVisible,
  setCompletionModalVisible,
}: any) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [completionDate, setCompletionDate] = useState(new Date());
  const [completionKm, setCompletionKm] = useState(currentKm.toString());
  const [notes, setNotes] = useState("");

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
  );
};

export default CompleteModel;
