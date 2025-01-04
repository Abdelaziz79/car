import { Tags } from "@/types/allTypes";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

interface CustomTagsProps {
  setCustomTags: (tags: Tags[] | ((prev: Tags[]) => Tags[])) => void;
  customTags: Tags[];
  selectedTags: Tags[];
  setSelectedTags: (tags: Tags[] | ((prev: Tags[]) => Tags[])) => void;
  isRTL: boolean;
  directionLoaded: boolean;
  className?: string;
}

const CustomTags: React.FC<CustomTagsProps> = ({
  setCustomTags,
  customTags,
  selectedTags,
  setSelectedTags,
  isRTL,
  directionLoaded,
  className = "",
}) => {
  if (!directionLoaded) {
    return null;
  }

  const getAlertMessages = () => ({
    error_title: isRTL ? "خطأ" : "Error",
    error_message: isRTL
      ? "حدث خطأ أثناء حذف التصنيف المخصص"
      : "Error removing custom tag",
  });

  const handleTagToggle = (tag: Tags) => {
    setSelectedTags((prev: Tags[]) => {
      if (prev.includes?.(tag)) {
        return prev.length > 1 ? prev.filter((t) => t !== tag) : prev;
      }
      return [...prev, tag];
    });
  };

  const handleRemoveCustomTag = async (tag: Tags) => {
    const messages = getAlertMessages();
    try {
      setCustomTags((prev: Tags[]) => prev.filter((t) => t !== tag));
      setSelectedTags((prev: Tags[]) => prev.filter((t) => t !== tag));
      // You might want to also remove it from storage
      // await StorageManager.removeCustomTag(tag);
    } catch (error) {
      console.error("Error removing custom tag:", error);
      Alert.alert(messages.error_title, messages.error_message);
    }
  };

  return (
    <View
      className={`flex-row flex-wrap gap-2 ${className}`}
      style={{
        direction: isRTL ? "rtl" : "ltr",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      {customTags.map((tag) => (
        <View key={`custom-${tag}`} className="flex-row items-center">
          <TouchableOpacity
            onPress={() => handleTagToggle(tag)}
            className={`px-4 py-2 ${
              isRTL ? "rounded-r-full" : "rounded-l-full"
            }  ${
              selectedTags.includes?.(tag) ? "bg-violet-600" : "bg-slate-200"
            }`}
          >
            <Text
              className={`${
                selectedTags.includes?.(tag) ? "text-white" : "text-slate-700"
              } font-medium`}
            >
              {tag}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRemoveCustomTag(tag)}
            className={`bg-rose-100 p-2 ${
              isRTL ? "rounded-l-full" : "rounded-r-full"
            }`}
          >
            <Ionicons name="close" size={20} color="#e11d48" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default CustomTags;
