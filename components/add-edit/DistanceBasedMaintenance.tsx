import React from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface DistanceBasedMaintenanceProps {
  kilometers: string;
  setKilometers: (value: string) => void;
  isRTL: boolean;
  directionLoaded: boolean;
  className?: string;
}

const DistanceBasedMaintenance: React.FC<DistanceBasedMaintenanceProps> = ({
  kilometers,
  setKilometers,
  isRTL,
  directionLoaded,
  className = "",
}) => {
  if (!directionLoaded) {
    return null;
  }

  const getMessages = () => ({
    title: isRTL ? "المسافة (كم)" : "Distance (km)",
    placeholder: isRTL
      ? "أدخل المسافة بالكيلومترات"
      : "Enter distance in kilometers",
  });

  const handleTextChange = (text: string) => {
    // Only allow numbers and a single decimal point
    const sanitizedText = text.replace(/[^0-9.]/g, "");
    // Prevent multiple decimal points
    const decimalCount = sanitizedText.split(".").length - 1;
    if (decimalCount <= 1) {
      setKilometers(sanitizedText);
    }
  };

  return (
    <View className={`mb-6 ${className}`}>
      <Text
        className="text-lg font-bold text-slate-800 mb-2"
        style={{
          textAlign: isRTL ? "right" : "left",
          writingDirection: isRTL ? "rtl" : "ltr",
        }}
      >
        {getMessages().title}
      </Text>
      <TextInput
        value={kilometers}
        onChangeText={handleTextChange}
        keyboardType="numeric"
        className="bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
        placeholder={getMessages().placeholder}
        style={{
          textAlign: isRTL ? "right" : "left",
          writingDirection: isRTL ? "rtl" : "ltr",
        }}
      />
    </View>
  );
};

export default DistanceBasedMaintenance;
