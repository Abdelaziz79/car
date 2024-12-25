import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

const TagElement = ({ tagName }: { tagName: string }) => {
  return (
    <View className="flex-row items-center bg-violet-100 px-4 py-2 rounded-full shadow-sm border border-violet-200">
      <Ionicons name="pricetag" size={18} color="#8B5CF6" />
      <Text className="text-violet-700 mx-2 font-medium">{tagName}</Text>
    </View>
  );
};

export default TagElement;
