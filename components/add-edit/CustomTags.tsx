import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Tags from "./CustomTagInput";

const CustomTags = ({
  setCustomTags,
  customTags,
  selectedTags,
  setSelectedTags,
}: {
  setCustomTags: any;
  customTags: Tags[];
  selectedTags: string[];
  setSelectedTags: any;
}) => {
  // Tag management
  const handleTagToggle = (tag: Tags) => {
    setSelectedTags((prev: Tags[]) => {
      if (prev.includes?.(tag)) {
        return prev.length > 1 ? prev.filter((t) => t !== tag) : prev;
      }
      return [...prev, tag];
    });
  };

  const handleRemoveCustomTag = async (tag: Tags) => {
    try {
      // Remove from custom tags
      setCustomTags((prev: Tags[]) => prev.filter((t) => t !== tag));
      // Remove from selected tags if it was selected
      setSelectedTags((prev: Tags[]) => prev.filter((t) => t !== tag));
      // You might want to also remove it from storage
      // Assuming StorageManager has a method for this
      // await StorageManager.removeCustomTag(tag);
    } catch (error) {
      console.error("Error removing custom tag:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء حذف التصنيف المخصص");
    }
  };

  return (
    <View className="flex-row flex-wrap gap-2">
      {customTags.map((tag) => (
        <View key={`custom-${tag}`} className="flex-row items-center">
          <TouchableOpacity
            onPress={() => handleTagToggle(tag)}
            className={`px-4 py-2 rounded-l-full ${
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
            className="bg-rose-100 p-2 rounded-r-full"
          >
            <Ionicons name="close" size={20} color="#e11d48" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default CustomTags;
