import { formatDate } from "@/utils/dateFormatter";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface RenderHeaderProps {
  currentKm: number;
  toggleModal: (modalName: any, value: boolean) => void;
  toggleView: () => void;
  isCompactView: boolean;
  isRTL: boolean;
  directionLoaded: boolean;
}

const RenderHeader: React.FC<RenderHeaderProps> = ({
  currentKm,
  toggleModal,
  toggleView,
  isCompactView,
  isRTL,
  directionLoaded,
}) => {
  const getText = (key: string): string => {
    const textMap: { [key: string]: string } = {
      filter: isRTL ? "تصفية" : "Filter",
    };
    return textMap[key] || key;
  };

  if (!directionLoaded) {
    return null;
  }

  return (
    <View className="bg-white shadow-sm px-4 py-3">
      <View
        className="flex flex-row flex-wrap gap-y-2 justify-between items-center mb-3"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <View className="flex-row items-center gap-1">
          <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-xl">
            <Text
              className="text-gray-700 font-medium text-base"
              style={{
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {formatDate(new Date().toISOString(), isRTL ? "ar-SA" : "en-US")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleModal("km", true)}
            className="bg-gray-100 px-4 py-2 rounded-xl flex-row items-center gap-1"
          >
            <Ionicons name="speedometer-outline" size={18} color="#4B5563" />
            <Text
              className="text-gray-700 font-medium text-base"
              style={{
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {currentKm} {isRTL ? "كم" : "km"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center gap-1">
          <TouchableOpacity
            onPress={() => toggleModal("filter", true)}
            className="bg-violet-100 px-5 py-2 rounded-xl flex-row items-center gap-1"
          >
            <Ionicons name="filter" size={18} color="#7C3AED" />
            <Text
              className="text-violet-700 font-medium"
              style={{
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {getText("filter")}
            </Text>
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
