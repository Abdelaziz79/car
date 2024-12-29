import { predefinedTags } from "@/data/predefined";
import { Tags } from "@/types/allTypes";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PredefinedTagsProps {
  selectedTags: Tags[];
  setSelectedTags: (tags: Tags[] | ((prev: Tags[]) => Tags[])) => void;
  isRTL: boolean;
  directionLoaded: boolean;
  className?: string;
}

const PredefinedTags: React.FC<PredefinedTagsProps> = ({
  selectedTags,
  setSelectedTags,
  isRTL,
  directionLoaded,
  className = "",
}) => {
  if (!directionLoaded) {
    return null;
  }

  const handleTagToggle = (tag: Tags) => {
    setSelectedTags((prev: Tags[]) => {
      // Prevent deselecting if it's the last tag
      if (prev.includes?.(tag)) {
        return prev.length > 1 ? prev.filter((t) => t !== tag) : prev;
      }
      return [...prev, tag];
    });
  };

  return (
    <View
      className={`flex-row flex-wrap gap-2 mb-2 ${className}`}
      style={{
        direction: isRTL ? "rtl" : "ltr",
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      {predefinedTags.map((tag) => (
        <TouchableOpacity
          key={`predefined-${tag}`}
          onPress={() => handleTagToggle(tag)}
          className={`px-4 py-2 rounded-full ${
            selectedTags?.includes?.(tag) ? "bg-violet-600" : "bg-slate-200"
          }`}
          style={{
            flexDirection: isRTL ? "row-reverse" : "row",
          }}
        >
          <Text
            className={`${
              selectedTags?.includes?.(tag) ? "text-white" : "text-slate-700"
            } font-medium`}
            style={{
              textAlign: isRTL ? "right" : "left",
              writingDirection: isRTL ? "rtl" : "ltr",
            }}
          >
            {tag}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Add a displayName for debugging purposes
PredefinedTags.displayName = "PredefinedTags";

export default PredefinedTags;
