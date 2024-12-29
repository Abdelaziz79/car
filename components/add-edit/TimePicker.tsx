import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Text, View } from "react-native";

const TimePicker = ({
  type,
  setType,
  isRTL,
}: {
  type: string;
  setType: any;
  isRTL: boolean;
}) => {
  return (
    <View className="mb-6" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <Text className="text-lg font-bold text-slate-800 mb-2">
        {isRTL ? "نوع الصيانة" : "Maintenance Type"}
      </Text>
      <View className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Picker
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue)}
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <Picker.Item
            label={isRTL ? "حسب الوقت" : "Time-based"}
            value="time-based"
          />
          <Picker.Item
            label={isRTL ? "حسب المسافة" : "Distance-based"}
            value="distance-based"
          />
        </Picker>
      </View>
    </View>
  );
};

export default TimePicker;
