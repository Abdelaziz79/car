import { predefinedTags } from "@/data/predefined";
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
}

const Tag = ({ tag, isSelected, onToggle, onRemove, theme }: TagProps) => (
  <View className="flex-row items-center">
    <TouchableOpacity
      onPress={() => onToggle(tag)}
      className={`px-4 py-2 ${onRemove ? "rounded-l-full" : "rounded-full"} ${
        isSelected ? theme.primary : "bg-slate-100"
      }`}
    >
      <Text className={isSelected ? "text-white" : "text-slate-700"}>
        {tag}
      </Text>
    </TouchableOpacity>
    {onRemove && (
      <TouchableOpacity
        onPress={() => onRemove(tag)}
        className="bg-rose-100 p-2 rounded-r-full"
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
  const [customTags, setCustomTags] = useState<Tags[]>([]);
  const [newTagText, setNewTagText] = useState("");

  useEffect(() => {
    loadCustomTags();
  }, []);

  const loadCustomTags = async () => {
    try {
      const saved = (await StorageManager.getCustomTags()) || [];
      // Filter out any predefined tags that might have been saved as custom
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
      Alert.alert("تنبيه", "هذا التصنيف موجود مسبقاً في التصنيفات الأساسية");
      setNewTagText("");
      return;
    }

    if (customTags.includes(trimmedTag)) {
      Alert.alert("تنبيه", "هذا التصنيف موجود مسبقاً في التصنيفات المخصصة");
      setNewTagText("");
      return;
    }

    try {
      await StorageManager.saveCustomTag(trimmedTag);
      setCustomTags((prev) => [...prev, trimmedTag]);
      handleToggleTag(trimmedTag);
      setNewTagText("");
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء حفظ التصنيف المخصص");
    }
  };

  const handleRemoveCustomTag = async (tag: Tags) => {
    try {
      //   await StorageManager.removeCustomTag(tag);
      setCustomTags((prev) => prev.filter((t) => t !== tag));
      if (selectedTags.includes(tag)) {
        handleToggleTag(tag);
      }
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء حذف التصنيف المخصص");
    }
  };

  const isCustomTag = (tag: Tags) =>
    !predefinedTags.includes(tag) && customTags.includes(tag);

  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-slate-800 mb-2">
        التصنيفات
      </Text>

      <View className="flex-row items-center gap-2 mb-3">
        <TextInput
          value={newTagText}
          onChangeText={setNewTagText}
          onSubmitEditing={handleAddCustomTag}
          className="flex-1 bg-white px-4 py-3 rounded-xl border border-slate-200 text-slate-800"
          placeholder="أضف تصنيف مخصص"
        />
        <TouchableOpacity
          onPress={handleAddCustomTag}
          className={`${theme.secondary} p-3 rounded-xl`}
        >
          <Ionicons name="add" size={24} color="#7c3aed" />
        </TouchableOpacity>
      </View>

      <ScrollView showsHorizontalScrollIndicator={false}>
        <View className="flex-row flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Tag
              key={`selected-${tag}`}
              tag={tag}
              isSelected={true}
              onToggle={handleToggleTag}
              onRemove={isCustomTag(tag) ? handleRemoveCustomTag : undefined}
              theme={theme}
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
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TagsSection;
