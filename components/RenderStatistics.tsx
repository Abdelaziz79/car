import { Text, View } from "react-native";

const RenderStatistics = ({
  statistics,
  isRTL,
}: {
  statistics: {
    totalTasks: number;
    completedThisMonth: number;
    completedThisYear: number;
  };
  isRTL: boolean;
}) => (
  <View
    className="flex-row justify-between bg-white p-6 rounded-xl shadow-lg mx-4 my-4"
    style={{ direction: isRTL ? "rtl" : "ltr" }}
  >
    {[
      { label: isRTL ? "الكل" : "All", value: statistics.totalTasks },
      {
        label: isRTL ? "هذا الشهر" : "This Month",
        value: statistics.completedThisMonth,
      },
      {
        label: isRTL ? "هذا العام" : "This Year",
        value: statistics.completedThisYear,
      },
    ].map(({ label, value }, index) => (
      <View key={index} className="items-center">
        <Text className="text-sm text-gray-500 font-medium mb-2">{label}</Text>
        <Text className="text-2xl font-extrabold text-blue-600">{value}</Text>
      </View>
    ))}
  </View>
);

export default RenderStatistics;
