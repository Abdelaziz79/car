import { CompletionData } from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import React from "react";
import { Text, View } from "react-native";

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
  <View className={` bg-gray-50 p-3 rounded-xl `}>
    <View className="flex-row items-center justify-between ">
      <Text
        className="font-semibold text-gray-700"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        {label}
      </Text>
      <Text
        className="text-gray-600"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        {value}
      </Text>
    </View>
  </View>
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
      cost: isRTL ? "التكلفة" : "Cost",
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
  const { kmAtCompletion, notes, cost } = completionData;

  return (
    <View className="p-4 bg-white rounded-3xl shadow-lg border border-gray-100">
      <View
        className="flex-row items-center justify-between mb-4"
        style={{
          direction: isRTL ? "rtl" : "ltr",
        }}
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
            value={`${kmAtCompletion.toString()} ${isRTL ? "كم" : "km"}`}
            isRTL={isRTL}
          />
        )}
        <InfoRow
          label={getText("cost")}
          value={`${cost.toString()} $`}
          isRTL={isRTL}
        />

        {notes !== null && notes !== undefined && notes !== "" && (
          <View className={`bg-gray-50 p-3 rounded-xl `}>
            <View className="" style={{ direction: isRTL ? "rtl" : "ltr" }}>
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
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default CompletionInfo;
