import { predefinedTagsAr, predefinedTagsEn } from "@/data/predefined";
import { useDirectionManager } from "@/hooks/useDirectionManager"; // Add this import
import { Tags } from "@/types/allTypes";
import { StorageManager } from "@/utils/storageHelpers";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface TagProps {
  tag: Tags;
  isSelected: boolean;
  onToggle: (tag: Tags) => void;
  onRemove?: (tag: Tags) => void;
  theme: {
    primary: string;
    secondary: string;
  };
  isRTL: boolean;
}

const Tag = ({
  tag,
  isSelected,
  onToggle,
  onRemove,
  theme,
  isRTL,
}: TagProps) => (
  <View className="flex-row items-center">
    <TouchableOpacity
      onPress={() => onToggle(tag)}
      className={`px-4 py-2 ${
        onRemove
          ? isRTL
            ? "rounded-r-full"
            : "rounded-l-full"
          : "rounded-full"
      } ${isSelected ? theme.primary : "bg-slate-100"}`}
    >
      <Text
        className={isSelected ? "text-white" : "text-slate-700"}
        style={{ textAlign: isRTL ? "right" : "left" }}
      >
        {tag}
      </Text>
    </TouchableOpacity>
    {onRemove && (
      <TouchableOpacity
        onPress={() => onRemove(tag)}
        className={`bg-rose-100 p-2 ${
          isRTL ? "rounded-l-full" : "rounded-r-full"
        }`}
      >
        <Ionicons name="close" size={20} color="#e11d48" />
      </TouchableOpacity>
    )}
  </View>
);

const TagsSection = ({
  selectedTags,
  onTagsChange,
  theme = {
    primary: "bg-violet-600",
    secondary: "bg-violet-50",
  },
}: {
  selectedTags: Tags[];
  onTagsChange: (tags: Tags[]) => void;
  theme?: {
    primary: string;
    secondary: string;
  };
}) => {
  const { isRTL, directionLoaded } = useDirectionManager();
  const [customTags, setCustomTags] = useState<Tags[]>([]);
  const [newTagText, setNewTagText] = useState("");

  const predefinedTags = isRTL ? predefinedTagsAr : predefinedTagsEn;
  useEffect(() => {
    loadCustomTags();
  }, []);

  const loadCustomTags = async () => {
    try {
      const saved = (await StorageManager.getCustomTags()) || [];
      const filteredCustomTags = saved.filter(
        (tag) => !predefinedTags.includes(tag)
      );
      setCustomTags(filteredCustomTags);
    } catch (error) {
      console.error("Error loading custom tags:", error);
    }
  };

  const handleToggleTag = (tag: Tags) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  const handleAddCustomTag = async () => {
    const trimmedTag = newTagText.trim() as Tags;
    if (!trimmedTag) return;

    if (predefinedTags.includes(trimmedTag)) {
      Alert.alert(
        isRTL ? "تنبيه" : "Alert",
        isRTL
          ? "هذا التصنيف موجود مسبقاً في التصنيفات الأساسية"
          : "This tag already exists in predefined tags"
      );
      setNewTagText("");
      return;
    }

    if (customTags.includes(trimmedTag)) {
      Alert.alert(
        isRTL ? "تنبيه" : "Alert",
        isRTL
          ? "هذا التصنيف موجود مسبقاً في التصنيفات المخصصة"
          : "This tag already exists in custom tags"
      );
      setNewTagText("");
      return;
    }

    try {
      await StorageManager.saveCustomTag(trimmedTag);
      setCustomTags((prev) => [...prev, trimmedTag]);
      handleToggleTag(trimmedTag);
      setNewTagText("");
    } catch (error) {
      Alert.alert(
        isRTL ? "خطأ" : "Error",
        isRTL ? "حدث خطأ أثناء حفظ التصنيف المخصص" : "Error saving custom tag"
      );
    }
  };

  const handleRemoveCustomTag = async (tag: Tags) => {
    try {
      setCustomTags((prev) => prev.filter((t) => t !== tag));
      if (selectedTags.includes(tag)) {
        handleToggleTag(tag);
      }
    } catch (error) {
      Alert.alert(
        isRTL ? "خطأ" : "Error",
        isRTL ? "حدث خطأ أثناء حذف التصنيف المخصص" : "Error removing custom tag"
      );
    }
  };

  const isCustomTag = (tag: Tags) =>
    !predefinedTags.includes(tag) && customTags.includes(tag);

  if (!directionLoaded) {
    return null;
  }

  return (
    <View className="mb-6" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <Text className="text-lg font-semibold text-slate-800 mb-2">
        {isRTL ? "التصنيفات" : "Tags"}
      </Text>

      <View className={`flex-row items-center gap-2 mb-3 `}>
        <TextInput
          value={newTagText}
          onChangeText={setNewTagText}
          onSubmitEditing={handleAddCustomTag}
          className="flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
          placeholder={isRTL ? "أضف تصنيف مخصص" : "Add custom tag"}
        />
        <TouchableOpacity
          onPress={handleAddCustomTag}
          className={`${theme.secondary} p-3 rounded-xl`}
        >
          <Ionicons name="add" size={24} color="#7c3aed" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <View className="flex-row flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Tag
              key={`selected-${tag}`}
              tag={tag}
              isSelected={true}
              onToggle={handleToggleTag}
              onRemove={isCustomTag(tag) ? handleRemoveCustomTag : undefined}
              theme={theme}
              isRTL={isRTL}
            />
          ))}
          {predefinedTags
            .filter((tag) => !selectedTags.includes(tag))
            .map((tag) => (
              <Tag
                key={`predefined-${tag}`}
                tag={tag}
                isSelected={false}
                onToggle={handleToggleTag}
                theme={theme}
                isRTL={isRTL}
              />
            ))}
          {customTags
            .filter((tag) => !selectedTags.includes(tag))
            .map((tag) => (
              <Tag
                key={`custom-${tag}`}
                tag={tag}
                isSelected={false}
                onToggle={handleToggleTag}
                onRemove={handleRemoveCustomTag}
                theme={theme}
                isRTL={isRTL}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TagsSection;
