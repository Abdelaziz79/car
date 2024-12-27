import { predefinedTags } from "@/data/predefined";
import { Tags } from "@/types/allTypes";
import { StorageManager } from "@/utils/storageHelpers";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

export const CustomTagInput = ({
  className,
  setCustomTags,
  customTags,
  setSelectedTags,
}: {
  className?: string;
  setCustomTags: any;
  customTags: Tags[];
  setSelectedTags: any;
}) => {
  const [newTagText, setNewTagText] = React.useState("");
  const handleAddCustomTag = async () => {
    const trimmedTag = newTagText.trim() as Tags;

    // Validate the new tag
    if (!trimmedTag) {
      return;
    }

    // Check if tag already exists in predefined tags
    if (predefinedTags.includes(trimmedTag)) {
      Alert.alert("تنبيه", "هذا التصنيف موجود مسبقاً في التصنيفات الأساسية");
      setNewTagText("");
      return;
    }

    // Check if tag already exists in custom tags
    if (customTags.includes(trimmedTag)) {
      Alert.alert("تنبيه", "هذا التصنيف موجود مسبقاً في التصنيفات المخصصة");
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
      Alert.alert("خطأ", "حدث خطأ أثناء حفظ التصنيف المخصص");
    }
  };

  return (
    <View className={`flex-row items-center gap-2 mb-3 ${className}`}>
      <TextInput
        value={newTagText}
        onChangeText={setNewTagText}
        onSubmitEditing={handleAddCustomTag}
        className="flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
        placeholder="أضف تصنيف مخصص"
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
export default Tags;
