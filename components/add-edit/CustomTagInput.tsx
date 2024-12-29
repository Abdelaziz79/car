import { predefinedTagsAr, predefinedTagsEn } from "@/data/predefined";
import { Tags } from "@/types/allTypes";
import { StorageManager } from "@/utils/storageHelpers";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface CustomTagInputProps {
  className?: string;
  setCustomTags: (tags: Tags[] | ((prev: Tags[]) => Tags[])) => void;
  customTags: Tags[];
  setSelectedTags: (tags: Tags[] | ((prev: Tags[]) => Tags[])) => void;
  isRTL: boolean;
  directionLoaded: boolean;
}

export const CustomTagInput: React.FC<CustomTagInputProps> = ({
  className = "",
  setCustomTags,
  customTags,
  setSelectedTags,
  isRTL,
  directionLoaded,
}) => {
  const [newTagText, setNewTagText] = React.useState("");
  const predefinedTags = isRTL ? predefinedTagsAr : predefinedTagsEn;

  if (!directionLoaded) {
    return null;
  }

  const getAlertMessages = () => {
    return {
      predefinedExists: isRTL
        ? "هذا التصنيف موجود مسبقاً في التصنيفات الأساسية"
        : "This tag already exists in predefined tags",
      customExists: isRTL
        ? "هذا التصنيف موجود مسبقاً في التصنيفات المخصصة"
        : "This tag already exists in custom tags",
      error: isRTL
        ? "حدث خطأ أثناء حفظ التصنيف المخصص"
        : "Error saving custom tag",
      alert: isRTL ? "تنبيه" : "Alert",
      error_title: isRTL ? "خطأ" : "Error",
    };
  };

  const handleAddCustomTag = async () => {
    const trimmedTag = newTagText.trim() as Tags;
    const messages = getAlertMessages();

    // Validate the new tag
    if (!trimmedTag) {
      return;
    }

    // Check if tag already exists in predefined tags
    if (predefinedTags.includes?.(trimmedTag)) {
      Alert.alert(messages.alert, messages.predefinedExists);
      setNewTagText("");
      return;
    }

    // Check if tag already exists in custom tags
    if (customTags.includes?.(trimmedTag)) {
      Alert.alert(messages.alert, messages.customExists);
      setNewTagText("");
      return;
    }

    try {
      await StorageManager.saveCustomTag(trimmedTag);
      setCustomTags((prev: Tags[]) => [...prev, trimmedTag]);
      setSelectedTags((prev: Tags[]) => [...prev, trimmedTag]);
      setNewTagText("");
    } catch (error) {
      console.error("Error saving custom tag:", error);
      Alert.alert(messages.error_title, messages.error);
    }
  };

  return (
    <View
      className={`flex-row items-center gap-2 mb-3 ${className}`}
      style={{
        flexDirection: isRTL ? "row-reverse" : "row",
      }}
    >
      <TextInput
        value={newTagText}
        onChangeText={setNewTagText}
        onSubmitEditing={handleAddCustomTag}
        className="flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
        placeholder={isRTL ? "أضف تصنيف مخصص" : "Add custom tag"}
        style={{
          textAlign: isRTL ? "right" : "left",
          writingDirection: isRTL ? "rtl" : "ltr",
        }}
        textAlign={isRTL ? "right" : "left"}
      />
      <TouchableOpacity
        onPress={handleAddCustomTag}
        className="bg-violet-100 p-3 rounded-xl"
      >
        <Ionicons name="add" size={24} color="#7c3aed" />
      </TouchableOpacity>
    </View>
  );
};

export default CustomTagInput;
