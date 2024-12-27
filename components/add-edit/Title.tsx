import React from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const Title = ({
  title,
  setTitle,
  text,
  className = "mb-6",
  childClassName,
}: {
  title: string;
  setTitle: any;
  text?: string;
  className?: string;
  childClassName?: string;
}) => {
  return (
    <View className={`${className}`}>
      <Text className="text-lg font-bold text-slate-800 mb-2">
        {text || "عنوان المهمة"}
      </Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        className={`bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800 ${childClassName}`}
        placeholder="أدخل عنوان المهمة"
      />
    </View>
  );
};

export default Title;
