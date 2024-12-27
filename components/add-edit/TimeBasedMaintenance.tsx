import { predefinedIntervals } from "@/data/predefined";
import { MaintenanceInterval } from "@/types/allTypes";
import {
  formatCustomDayInterval,
  formatIntervalDisplay,
} from "@/utils/maintenanceHelpers";
import { StorageManager } from "@/utils/storageHelpers";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const TimeBasedMaintenance = ({
  interval,
  setInterval,
}: {
  interval?: MaintenanceInterval;
  setInterval: (interval: MaintenanceInterval) => void;
}) => {
  const [customDays, setCustomDays] = useState("");
  const [customIntervals, setCustomIntervals] = useState<MaintenanceInterval[]>(
    []
  );
  // Interval management
  const handleAddCustomDayInterval = async () => {
    const days = parseInt(customDays);
    if (isNaN(days) || days <= 0) {
      Alert.alert("خطأ", "يرجى إدخال عدد أيام صحيح");
      return;
    }

    const customInterval = formatCustomDayInterval(days);
    if (!customInterval) return;

    try {
      await StorageManager.saveCustomInterval(customInterval);
      setCustomIntervals((prev: any) => [...prev, customInterval]);
      setInterval(customInterval); // Set the newly created interval as selected
      setCustomDays("");
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء حفظ الفترة المخصصة");
    }
  };
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-slate-800 mb-2">الفترة</Text>
      <View className="flex-row items-center gap-2 mb-3">
        <TextInput
          value={customDays}
          onChangeText={setCustomDays}
          keyboardType="numeric"
          className="flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
          placeholder="أدخل عدد الأيام"
        />
        <TouchableOpacity
          onPress={handleAddCustomDayInterval}
          className="bg-violet-100 p-3 rounded-xl"
        >
          <Ionicons name="add" size={24} color="#7c3aed" />
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {renderIntervalPicker(customIntervals, setInterval, interval)}
      </View>
    </View>
  );
};
const renderIntervalPicker = (
  customIntervals: MaintenanceInterval[],
  setInterval: (interval: MaintenanceInterval) => void, // Add this param
  interval?: MaintenanceInterval
) => {
  const allIntervals = [...predefinedIntervals, ...customIntervals];
  const uniqueIntervals = Array.from(new Set(allIntervals)); // Remove duplicates

  return (
    <Picker
      selectedValue={interval}
      onValueChange={(itemValue) => setInterval(itemValue)}
    >
      {uniqueIntervals.map((int) => (
        <Picker.Item key={int} label={formatIntervalDisplay(int)} value={int} />
      ))}
    </Picker>
  );
};

export default TimeBasedMaintenance;
