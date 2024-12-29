import { formatDate } from "@/utils/dateFormatter";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

interface CompletionData {
  completionDate: string;
  kmAtCompletion?: number;
  notes?: string;
}

interface Props {
  completionData: CompletionData | null;
  isRTL: boolean;
  directionLoaded: boolean;
}

const InfoRow = ({
  label,
  value,
  isRTL,
}: {
  label: string;
  value: string;
  isRTL: boolean;
}) => (
  <Animated.View
    entering={FadeInRight.delay(200)}
    className={`flex-row items-center justify-between bg-gray-50 p-3 rounded-xl ${
      isRTL ? "flex-row-reverse" : "flex-row"
    }`}
  >
    <Text
      className="font-semibold text-gray-700"
      style={{ textAlign: isRTL ? "right" : "left" }}
    >
      {label}
    </Text>
    <Text
      className="text-gray-600"
      style={{ textAlign: isRTL ? "left" : "right" }}
    >
      {value}
    </Text>
  </Animated.View>
);

const CompletionInfo: React.FC<Props> = ({
  completionData,
  isRTL,
  directionLoaded,
}) => {
  const getText = (key: string): string => {
    const textMap: { [key: string]: string } = {
      lastCompletion: isRTL ? "آخر إتمام" : "Last Completion",
      new: isRTL ? "جديد" : "New",
      date: isRTL ? "التاريخ" : "Date",
      kilometers: isRTL ? "الكيلومترات" : "Kilometers",
      notes: isRTL ? "ملاحظات" : "Notes",
    };
    return textMap[key] || key;
  };

  if (!directionLoaded) {
    return null;
  }
  if (!completionData) return null;

  const formattedDate = formatDate(
    completionData.completionDate,
    isRTL ? "ar-SA" : "en-US"
  );
  const { kmAtCompletion, notes } = completionData;

  return (
    <Animated.View
      entering={FadeInDown}
      className="p-4 bg-white rounded-3xl shadow-lg border border-gray-100"
    >
      <View
        className="flex-row items-center justify-between mb-4"
        style={
          isRTL ? { flexDirection: "row-reverse" } : { flexDirection: "row" }
        }
      >
        <View className="flex-row items-center gap-2">
          <Text
            className="text-xl font-bold text-gray-800"
            style={{
              writingDirection: isRTL ? "rtl" : "ltr",
            }}
          >
            {getText("lastCompletion")}
          </Text>
          <View className="bg-blue-500 px-3 py-1 rounded-full">
            <Text
              className="text-white text-xs font-bold"
              style={{
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {getText("new")}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-col gap-2">
        <InfoRow label={getText("date")} value={formattedDate} isRTL={isRTL} />

        {kmAtCompletion !== null && kmAtCompletion !== undefined && (
          <InfoRow
            label={getText("kilometers")}
            value={`${kmAtCompletion.toLocaleString()} ${isRTL ? "كم" : "km"}`}
            isRTL={isRTL}
          />
        )}

        {notes !== null && notes !== undefined && notes !== "" && (
          <Animated.View
            entering={FadeInRight.delay(400)}
            className={`bg-gray-50 p-3 rounded-xl ${
              isRTL ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <Text
              className="font-semibold text-gray-700 mb-2"
              style={{
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {getText("notes")}
            </Text>
            <Text
              className="text-gray-600 leading-5"
              style={{
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {notes}
            </Text>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

export default CompletionInfo;
