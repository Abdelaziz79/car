import { MaintenanceRecord } from "@/types/allTypes";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

interface RenderRecordProps {
  item: MaintenanceRecord;
  isRTL: boolean;
  onPress?: (item: MaintenanceRecord) => void;
}

const RenderRecord: React.FC<RenderRecordProps> = ({
  item,
  isRTL,
  onPress,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
    onPress?.(item);
  };

  const getStatusColor = () => {
    const today = new Date();
    const nextDate = item.nextDate ? new Date(item.nextDate) : null;

    if (!nextDate) return "#9CA3AF"; // gray-400
    return nextDate < today ? "#EF4444" : "#10B981"; // red-500 : emerald-500
  };

  return (
    <Pressable onPress={toggleExpand} className="mb-6 mx-3">
      <View
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
        style={{
          direction: isRTL ? "rtl" : "ltr",
        }}
      >
        <View
          className={`p-4 ${isRTL ? "border-r-4" : "border-l-4"} `}
          style={{ borderColor: getStatusColor() }}
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center gap-x-2">
              <MaterialIcons name="build" size={20} color="#4B5563" />
              <Text className="text-xl font-bold text-gray-800">
                {item.title}
              </Text>
            </View>
            <View className="bg-gray-100 rounded-full p-2">
              <MaterialIcons
                name={expanded ? "expand-less" : "expand-more"}
                size={24}
                color="#4B5563"
              />
            </View>
          </View>

          <View className="flex-row justify-between mt-2">
            <View className="flex-1">
              <Text className="text-gray-500 text-sm">
                {isRTL ? "آخر فحص:" : "Last Check"}
              </Text>
              <Text className="text-gray-900 font-semibold">
                {new Date(item.completionDate).toLocaleDateString(
                  isRTL ? "ar-SA" : "en-US",
                  { day: "numeric", month: "short", year: "numeric" }
                )}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 text-sm">
                {isRTL ? "الفحص القادم:" : "Next Check"}
              </Text>
              <Text
                className="font-semibold"
                style={{ color: getStatusColor() }}
              >
                {item.nextDate
                  ? new Date(item.nextDate).toLocaleDateString(
                      isRTL ? "ar-SA" : "en-US",
                      { day: "numeric", month: "short", year: "numeric" }
                    )
                  : item.nextKm
                  ? `${item.nextKm} ${isRTL ? "كم" : "km"}`
                  : isRTL
                  ? "غير محدد"
                  : "Not specified"}
              </Text>
            </View>
          </View>

          {expanded && (
            <View>
              {item.kmAtCompletion !== null && (
                <View className="mt-4 bg-gray-50 p-3 rounded-lg">
                  <Text className="text-gray-600">
                    {isRTL ? "عداد المسافة: " : "Odometer: "}
                    <Text className="font-semibold text-gray-900">
                      {item.kmAtCompletion.toString()} {isRTL ? "كم" : "km"}
                    </Text>
                  </Text>
                </View>
              )}
              {item.notes && (
                <View className="mt-3 bg-gray-50 p-3 rounded-lg">
                  <Text className="text-gray-600">
                    {isRTL ? "ملاحظات: " : "Notes: "}
                    <Text className="font-semibold text-gray-900">
                      {item.notes}
                    </Text>
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export default RenderRecord;
