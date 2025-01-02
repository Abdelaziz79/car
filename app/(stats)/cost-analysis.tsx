import Header from "@/components/Header";
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { MaintenanceItem } from "@/types/allTypes";
import { ChartHelpers } from "@/utils/MaintenanceChartHelpers";
import { StorageManager } from "@/utils/storageHelpers";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CostAnalysis() {
  const [data, setData] = useState<MaintenanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isRTL, directionLoaded } = useDirectionManager();

  useEffect(() => {
    StorageManager.getMaintenanceData().then((items) => {
      setData(items);
      setLoading(false);
    });
  }, []);

  if (loading || !directionLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const pieData = ChartHelpers.getCostAnalysisData(data);
  const { width, height } = ChartHelpers.getChartDimensions();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title={isRTL ? "تحليل التكلفة" : "Cost Analysis"}
        subtitle={
          isRTL ? "توزيع التكلفة حسب النوع" : "Cost Distribution by Type"
        }
      />
      {data && data.length !== 0 ? (
        <View className="flex-1 p-4">
          <View className="bg-white rounded-xl p-4 shadow-sm">
            <PieChart
              data={pieData}
              width={width}
              height={height}
              chartConfig={ChartHelpers.baseChartConfig}
              accessor="cost"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
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
