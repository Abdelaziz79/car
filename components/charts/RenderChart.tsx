import {
  ChartView,
  MaintenanceItem,
  MaintenanceRecord,
} from "@/types/allTypes";
import { CostAnalysis } from "@/utils/costAnalysis";
import { ChartHelpers } from "@/utils/MaintenanceChartHelpers";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";

const RenderChart = ({
  selectedView,
  isRTL,
  data,
  filteredRecords,
}: {
  selectedView: ChartView;
  isRTL: boolean;
  data: MaintenanceItem[];
  filteredRecords: MaintenanceRecord[];
}) => {
  const { width, height } = ChartHelpers.getChartDimensions();
  const [dailyView, setDailyView] = useState("bar");
  const pieData = ChartHelpers.getCostAnalysisData(data);

  const monthlyData = CostAnalysis.getCostTrends(filteredRecords, "month");
  const dailyData = CostAnalysis.getCostTrends(filteredRecords, "day");

  // Line chart data for monthly trends
  const monthlyChartData = {
    labels: monthlyData.map((m) => {
      const [year, month] = (m as { month: string }).month.split("-");
      return month;
    }),
    datasets: [
      {
        data: monthlyData.map((m) => (m as any).cost),
      },
    ],
  };

  // Bar chart data for daily costs
  const dailyChartData = {
    labels: dailyData.slice(-7).map((d) => {
      const date = new Date((d as { date: string }).date);
      return date.getDate().toString();
    }),
    datasets: [
      {
        data: dailyData.slice(-7).map((d) => (d as any).cost),
      },
    ],
  };

  switch (selectedView) {
    case "type":
      return (
        <View className="bg-white rounded-xl shadow-sm p-4">
          <Text className="text-center text-gray-700 mb-4">
            {isRTL ? "توزيع التكلفة حسب النوع" : "Cost Distribution by Type"}
          </Text>
          <PieChart
            data={pieData}
            width={width - 32}
            height={height}
            chartConfig={ChartHelpers.baseChartConfig}
            accessor="cost"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      );

    case "monthly":
      return (
        <View className="bg-white rounded-xl shadow-sm p-4">
          <Text className="text-center text-gray-700 mb-4">
            {isRTL ? "تحليل التكلفة الشهري" : "Monthly Cost Analysis"}
          </Text>
          <LineChart
            data={monthlyChartData}
            width={width - 32}
            height={height}
            chartConfig={ChartHelpers.baseChartConfig}
            bezier
          />
        </View>
      );

    case "daily":
      return (
        <View className="bg-white rounded-xl shadow-sm p-4">
          <Text className="text-center text-gray-700 mb-4">
            {isRTL ? "التكاليف اليومية" : "Daily Costs"}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setDailyView((prev) => (prev === "line" ? "bar" : "line"))
            }
          >
            <Text className="text-center text-gray-700 mb-4">
              {isRTL ? "عرض البيانات" : "View Data"}
            </Text>
          </TouchableOpacity>
          {dailyView === "bar" && (
            <BarChart
              data={dailyChartData}
              width={width - 32}
              height={height}
              chartConfig={ChartHelpers.baseChartConfig}
              verticalLabelRotation={0}
              yAxisLabel="$"
              yAxisSuffix=""
            />
          )}
          {dailyView === "line" && (
            <LineChart
              data={dailyChartData}
              width={width - 32}
              height={height}
              chartConfig={ChartHelpers.baseChartConfig}
            />
          )}
        </View>
      );
  }
};

export default RenderChart;
