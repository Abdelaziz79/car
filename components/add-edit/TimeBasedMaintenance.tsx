import { predefinedIntervals } from "@/data/predefined";
import { MaintenanceInterval } from "@/types/allTypes";
import {
  formatCustomDayInterval,
  formatIntervalDisplay,
} from "@/utils/storageHelpers";
import { StorageManager } from "@/utils/storageHelpers";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface TimeBasedMaintenanceProps {
  interval?: MaintenanceInterval;
  setInterval: (interval: MaintenanceInterval) => void;
  isRTL: boolean;
  directionLoaded: boolean;
  className?: string;
}

const TimeBasedMaintenance: React.FC<TimeBasedMaintenanceProps> = ({
  interval,
  setInterval,
  isRTL,
  directionLoaded,
  className = "",
}) => {
  const [customDays, setCustomDays] = useState("");
  const [customIntervals, setCustomIntervals] = useState<MaintenanceInterval[]>(
    []
  );
  const [preSavedIntervals, setPreSavedIntervals] = useState<
    MaintenanceInterval[]
  >([]);

  useEffect(() => {
    const fetchPreSavedIntervals = async () => {
      try {
        const savedIntervals = await StorageManager.getCustomIntervals();
        setPreSavedIntervals(savedIntervals);
      } catch (error) {
        console.error("Error fetching pre-saved intervals:", error);
      }
    };
    fetchPreSavedIntervals();
  }, []);

  if (!directionLoaded) {
    return null;
  }

  const getMessages = () => ({
    title: isRTL ? "الفترة" : "Interval",
    placeholder: isRTL ? "أدخل عدد الأيام" : "Enter number of days",
    error_title: isRTL ? "خطأ" : "Error",
    invalid_days: isRTL
      ? "يرجى إدخال عدد أيام صحيح"
      : "Please enter a valid number of days",
    save_error: isRTL
      ? "حدث خطأ أثناء حفظ الفترة المخصصة"
      : "Error saving custom interval",
    duplicate_error: isRTL
      ? "هذة الفترة موجودة مسبقاً في التصنيفات المخصصة."
      : "This interval already exists in custom intervals.",
  });

  const handleAddCustomDayInterval = async () => {
    const messages = getMessages();
    const days = parseInt(customDays);

    if (isNaN(days) || days <= 0) {
      Alert.alert(messages.error_title, messages.invalid_days);
      return;
    }

    const customInterval = formatCustomDayInterval(days);
    if (!customInterval) return;
    const isDuplicate = preSavedIntervals.includes(customInterval);

    if (isDuplicate) {
      Alert.alert(messages.error_title, messages.duplicate_error);
      return;
    }
    try {
      await StorageManager.saveCustomInterval(customInterval);
      setCustomIntervals((prev: MaintenanceInterval[]) => [
        ...prev,
        customInterval,
      ]);
      setInterval(customInterval);
      setCustomDays("");
    } catch (error) {
      console.error("Error saving custom interval:", error);
      Alert.alert(messages.error_title, messages.save_error);
    }
  };

  const renderIntervalPicker = (
    customIntervals: MaintenanceInterval[],
    setInterval: (interval: MaintenanceInterval) => void,
    currentInterval?: MaintenanceInterval,
    preSavedIntervals: MaintenanceInterval[] = []
  ) => {
    const allIntervals = [
      ...predefinedIntervals,
      ...customIntervals,
      ...preSavedIntervals,
    ];
    const uniqueIntervals = Array.from(new Set(allIntervals));

    return (
      <Picker
        selectedValue={currentInterval}
        onValueChange={(itemValue) => setInterval(itemValue)}
        style={{
          direction: isRTL ? "rtl" : "ltr",
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {uniqueIntervals.map((int) => (
          <Picker.Item
            key={int}
            label={formatIntervalDisplay(int, isRTL ? "ar" : "en")}
            value={int}
            style={{
              textAlign: isRTL ? "right" : "left",
            }}
          />
        ))}
      </Picker>
    );
  };

  return (
    <View className={`mb-6 ${className}`}>
      <Text
        className="text-lg font-bold text-slate-800 mb-2"
        style={{
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {getMessages().title}
      </Text>
      <View
        className="flex-row items-center gap-2 mb-3"
        style={{
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        <TextInput
          value={customDays}
          onChangeText={setCustomDays}
          keyboardType="numeric"
          className="flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
          placeholder={getMessages().placeholder}
          style={{
            textAlign: isRTL ? "right" : "left",
            writingDirection: isRTL ? "rtl" : "ltr",
          }}
        />
        <TouchableOpacity
          onPress={handleAddCustomDayInterval}
          className="bg-violet-100 p-3 rounded-xl"
        >
          <Ionicons name="add" size={24} color="#7c3aed" />
        </TouchableOpacity>
      </View>
      <View className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {renderIntervalPicker(
          customIntervals,
          setInterval,
          interval,
          preSavedIntervals
        )}
      </View>
    </View>
  );
};

export default TimeBasedMaintenance;
