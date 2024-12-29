import React from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface TitleProps {
  title: string;
  setTitle: (text: string) => void;
  text?: string;
  className?: string;
  childClassName?: string;
  isRTL: boolean;
  directionLoaded: boolean;
}

const Title: React.FC<TitleProps> = ({
  title,
  setTitle,
  text,
  className = "mb-6",
  childClassName,
  isRTL,
  directionLoaded,
}) => {
  if (!directionLoaded) {
    return null;
  }

  const getPlaceholder = () => {
    return isRTL ? "أدخل عنوان المهمة" : "Enter task title";
  };

  const getLabel = () => {
    return isRTL ? "عنوان المهمة" : "Task Title";
  };

  return (
    <View className={`flex flex-col  ${className}`}>
      <Text
        className="text-lg font-bold text-slate-800 mb-2"
        style={{
          textAlign: isRTL ? "right" : "left",
        }}
      >
        {text || getLabel()}
      </Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        className={`bg-white px-4 py-3 w-full rounded-xl border border-slate-200 text-slate-800 ${childClassName}`}
        placeholder={getPlaceholder()}
        style={{
          textAlign: isRTL ? "right" : "left",
          writingDirection: isRTL ? "rtl" : "ltr",
        }}
        textAlign={isRTL ? "right" : "left"}
      />
    </View>
  );
};

export default Title;
