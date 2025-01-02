import { DateRange, MaintenanceItem } from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import { ChartHelpers } from "@/utils/MaintenanceChartHelpers";
import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import Heatmap from "./Heatmap";

interface MaintenanceHeatmapProps {
  tasks: MaintenanceItem[];
  dateRange: DateRange;
  isRTL?: boolean;
}

const MaintenanceHeatmap = ({
  tasks,
  dateRange,
  isRTL = false,
}: MaintenanceHeatmapProps) => {
  const stats = useMemo(() => {
    const data = ChartHelpers.getDailyMaintenanceCount(tasks, dateRange);
    return {
      totalDays: data.length,
      totalMaintenance: data.reduce((sum, day) => sum + day.count, 0),
      maxPerDay: Math.max(...data.map((day) => day.count), 0),
      activeDays: data.filter((day) => day.count > 0).length,
      avgPerDay: data.length
        ? Number(
            (
              data.reduce((sum, day) => sum + day.count, 0) / data.length
            ).toFixed(1)
          )
        : 0,
    };
  }, [tasks, dateRange]);

  const colors = [
    "#f3f4f6",
    "#bbd9ff",
    "#59a7ff",
    "#166fff",
    "#0039d6",
    "#002eb0",
    "#00238a",
    "#001964",
  ];

  const contributionData = useMemo(() => {
    const data = ChartHelpers.getDailyMaintenanceCount(
      tasks,
      dateRange.allTime
        ? {
            startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
            endDate: new Date(),
            allTime: true,
          }
        : dateRange
    );
    return data.map(({ date, count }) => ({ date, count }));
  }, [tasks, dateRange]);

  const dateTitle = dateRange.allTime
    ? isRTL
      ? "كل الوقت"
      : "All Time"
    : `${formatDate(
        dateRange.startDate.toString(),
        isRTL ? "ar-SA" : "en-US"
      )} - ${formatDate(
        dateRange.endDate.toString(),
        isRTL ? "ar-SA" : "en-US"
      )}`;

  return (
    <ScrollView
      horizontal={false}
      showsVerticalScrollIndicator={false}
      className="bg-white rounded-2xl shadow-sm"
    >
      <View className="p-4">
        <View className="flex-row flex-wrap gap-y-2 justify-between items-center mb-2">
          <Text className="text-xl font-bold text-gray-900">
            {isRTL ? "سجل الصيانة" : "Maintenance History"}
          </Text>
          <View className="bg-gray-100 px-3 py-1 rounded-full">
            <Text className="text-sm text-gray-600">{dateTitle}</Text>
          </View>
        </View>

        <Heatmap
          data={contributionData}
          isRTL={isRTL}
          colorScale={colors}
          dateRange={dateRange}
        />

        <View className="h-px bg-gray-200 my-4" />

        <View className="flex-row justify-between mb-4">
          <View className="items-center">
            <Text className="text-2xl font-bold text-sky-600">
              {stats.totalMaintenance}
            </Text>
            <Text className="text-sm text-gray-500">
              {isRTL ? "إجمالي الصيانة" : "Total"}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-sky-600">
              {stats.maxPerDay}
            </Text>
            <Text className="text-sm text-gray-500">
              {isRTL ? "أقصى عدد" : "Max/Day"}
            </Text>
          </View>
        </View>

        <View className="h-px bg-gray-200 mb-4" />

        <Text className="text-sm font-medium text-gray-900 mb-2">
          {isRTL ? "مستوى النشاط" : "Activity Level"}
        </Text>
        <View className="flex-row  gap-2 items-center justify-center">
          <Text className="text-sm">
            {isRTL ? "اقل نشاطا" : "less activity"}
          </Text>
          {colors.map((color) => (
            <View key={color} className="flex-row items-center gap-1">
              <View
                className="w-5 h-5 rounded "
                style={{ backgroundColor: color }}
              />
            </View>
          ))}
          <Text className="text-sm">
            {isRTL ? "اكثر نشاطا" : "more activity"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default MaintenanceHeatmap;
