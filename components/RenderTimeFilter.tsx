import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

const RenderTimeFilter = ({
  isRTL,
  setTimeFilter,
  timeFilter,
}: {
  isRTL: boolean;
  setTimeFilter: (filter: "all" | "month" | "year") => void;
  timeFilter: "all" | "month" | "year";
}) => {
  const getFilterLabel = (filter: "all" | "month" | "year") => {
    const labels = {
      all: { ar: "الكل", en: "All" },
      month: { ar: "الشهر", en: "Month" },
      year: { ar: "السنة", en: "Year" },
    };
    return isRTL ? labels[filter].ar : labels[filter].en;
  };

  return (
    <View
      className="flex-row justify-center gap-3 p-4 bg-white rounded-lg shadow-lg"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {(["all", "month", "year"] as const).map((filter) => (
        <TouchableOpacity
          key={filter}
          onPress={() => setTimeFilter(filter)}
          className={`rounded-full ${
            timeFilter === filter ? "shadow-md" : "shadow-sm"
          }`}
          style={{
            overflow: "hidden",
          }}
        >
          {timeFilter === filter ? (
            <LinearGradient
              colors={["#4c669f", "#3b5998", "#192f6a"]}
              start={[0, 0]}
              end={[1, 1]}
              className="px-6 py-2"
            >
              <Text className="text-white text-base font-semibold">
                {getFilterLabel(filter)}
              </Text>
            </LinearGradient>
          ) : (
            <View className="px-6 py-2 bg-gray-200">
              <Text className="text-gray-700 text-base font-medium">
                {getFilterLabel(filter)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RenderTimeFilter;
