import { formatDate } from "@/utils/dateFormatter";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const RenderHeader = ({
  currentKm,
  toggleModal,
  toggleView,
  isCompactView,
}: {
  currentKm: number;
  toggleModal: (modalName: any, value: boolean) => void;
  toggleView: () => void;
  isCompactView: boolean;
}) => {
  return (
    <View className="bg-white shadow-sm px-4 py-3">
      <View className="flex flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-1">
          <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-xl">
            <Text className="text-gray-700 font-medium text-base">
              {formatDate(new Date().toISOString())}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleModal("km", true)}
            className="bg-gray-100 px-4 py-2 rounded-xl flex-row items-center gap-1"
          >
            <Ionicons name="speedometer-outline" size={18} color="#4B5563" />
            <Text className="text-gray-700 font-medium text-base">
              {currentKm} كم
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            onPress={() => toggleModal("filter", true)}
            className="bg-violet-100 px-5 py-2 rounded-xl flex-row items-center gap-1"
          >
            <Ionicons name="filter" size={18} color="#7C3AED" />
            <Text className="text-violet-700 font-medium">تصفية</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleView}
            className="bg-violet-100 p-2 rounded-xl"
          >
            <Ionicons
              name={isCompactView ? "list" : "grid"}
              size={18}
              color="#7C3AED"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RenderHeader;
