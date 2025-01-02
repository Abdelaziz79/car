import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { MaintenanceItem } from "@/types/allTypes";
import { ChartHelpers } from "@/utils/MaintenanceChartHelpers";
import { getTasksWithHistory } from "@/utils/statsHelpers";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TaskFrequency() {
  const [tasksWithHistory, setTasksWithHistory] = useState<MaintenanceItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const { isRTL, directionLoaded } = useDirectionManager();

  useEffect(() => {
    getTasksWithHistory().then((history) => {
      setTasksWithHistory(history);
      setLoading(false);
    });
  }, []);

  if (loading || !directionLoaded) {
    return <Loading />;
  }

  const taskBarData = ChartHelpers.getTaskFrequencyData(tasksWithHistory);
  const { width, height } = ChartHelpers.getChartDimensions();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title={isRTL ? "تكرار المهام" : "Task Frequency"}
        subtitle={isRTL ? "عدد مرات تكرار كل مهمة" : "Task Completion Count"}
      />
      {tasksWithHistory && tasksWithHistory.length !== 0 ? (
        <View className="flex-1 p-4">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <BarChart
              data={taskBarData}
              width={width}
              height={height}
              chartConfig={ChartHelpers.baseChartConfig}
              verticalLabelRotation={30}
              showValuesOnTopOfBars
              yAxisLabel="a"
              yAxisSuffix="a"
            />
          </View>
        </View>
      ) : (
        <View>
          <Text className="text-center text-gray-600 mt-4">
            {isRTL ? "لا يوجد بيانات" : "No data available"}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
