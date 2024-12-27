import React from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const Description = ({
  description,
  setDescription,
  className = "mb-6",
  text,
  placeholder,
}: {
  description: string;
  setDescription: any;
  className?: string;
  text?: string;
  placeholder?: string;
}) => {
  return (
    <View className={`${className}`}>
      <Text className="text-lg font-bold text-slate-800 mb-2">
        {text || "الوصف"}
      </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        className="bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
        multiline
        numberOfLines={4}
        placeholder={placeholder || "أدخل وصف المهمة"}
        textAlignVertical="top"
      />
    </View>
  );
};

export default Description;
