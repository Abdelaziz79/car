import { predefinedTags } from "@/data/predefined";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Tags from "./CustomTagInput";

const PredefinedTags = ({
  selectedTags,
  setSelectedTags,
}: {
  selectedTags: string[];
  setSelectedTags: any;
}) => {
  const handleTagToggle = (tag: Tags) => {
    setSelectedTags((prev: Tags[]) => {
      if (prev.includes?.(tag)) {
        return prev.length > 1 ? prev.filter((t) => t !== tag) : prev;
      }
      return [...prev, tag];
    });
  };

  return (
    <View className="flex-row flex-wrap gap-2 mb-2">
      {predefinedTags.map((tag) => (
        <TouchableOpacity
          key={`predefined-${tag}`}
          onPress={() => handleTagToggle(tag)}
          className={`px-4 py-2 rounded-full ${
            selectedTags?.includes?.(tag) ? "bg-violet-600" : "bg-slate-200"
          }`}
        >
          <Text
            className={`${
              selectedTags?.includes?.(tag) ? "text-white" : "text-slate-700"
            } font-medium`}
          >
            {tag}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PredefinedTags;
