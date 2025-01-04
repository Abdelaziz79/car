import React from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface DescriptionProps {
  description: string;
  setDescription: (text: string) => void;
  className?: string;
  text?: string;
  placeholder?: string;
  childClassName?: string;
  isRTL: boolean;
  directionLoaded: boolean;
}

const Description: React.FC<DescriptionProps> = ({
  description,
  setDescription,
  className = "mb-6",
  text,
  placeholder,
  childClassName,
  isRTL,
  directionLoaded,
}) => {
  if (!directionLoaded) {
    return null;
  }

  const getPlaceholder = () => {
    return (
      placeholder || (isRTL ? "أدخل وصف المهمة" : "Enter task description")
    );
  };

  const getLabel = () => {
    return text || (isRTL ? "الوصف" : "Description");
  };

  return (
    <View
      className={`flex flex-col ${className}`}
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <Text className="text-lg font-bold text-slate-800 mb-2">
        {getLabel()}
      </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        className={`bg-white px-4 w-full py-3 rounded-xl border border-slate-200 text-slate-800 ${childClassName}`}
        multiline
        numberOfLines={4}
        placeholder={getPlaceholder()}
        textAlignVertical="top"
        style={{
          minHeight: 100, // Ensure enough space for multiline input
        }}
      />
    </View>
  );
};

export default Description;
