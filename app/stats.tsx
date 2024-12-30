import Header from "@/components/Header";
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { MaintenanceItem } from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import { MaintenanceStats } from "@/utils/statsHelpers";
import { StorageManager } from "@/utils/storageHelpers";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;
const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 0,
};

const Stats = () => {
  const [data, setData] = useState<MaintenanceItem[]>([]);
  const [currentKm, setCurrentKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isRTL, directionLoaded } = useDirectionManager();

  useEffect(() => {
    const loadData = async () => {
      const [items, km] = await Promise.all([
        StorageManager.getMaintenanceData(),
        StorageManager.getCurrentKm(),
      ]);
      setData(items);
      setCurrentKm(km);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const totalCosts = MaintenanceStats.getTotalCosts(
    data.flatMap((item) => item.completionHistory || [])
  );
  const costsByType = MaintenanceStats.getCostsByType(data);

  const pieData = Object.entries(costsByType).map(([name, value]) => ({
    name: name.replace("-", " "),
    cost: value,
    color:
      name === "time-based"
        ? "#4F46E5"
        : name === "distance-based"
        ? "#10B981"
        : name === "user-based"
        ? "#F59E0B"
        : "#EF4444",
    legendFontColor: "#666666",
  }));

  const monthlyData = data
    .flatMap((item) => item.completionHistory || [])
    .reduce((acc, record) => {
      const month = new Date(record.completionDate).toString().slice(4, 7);
      acc[month] = (acc[month] || 0) + record.cost;
      return acc;
    }, {} as Record<string, number>);

  const lineData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        data: Object.values(monthlyData),
      },
    ],
  };

  if (!directionLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title={`${isRTL ? "التقارير" : "Reports"}`}
        subtitle={`${isRTL ? "نظام صيانة السيارة" : "Car Maintenance System"}`}
      />

      <ScrollView className="flex-1 p-4">
        <View
          className="flex-row flex-wrap justify-between mb-6"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <View className="w-[48%] bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-sm text-slate-500">
              {isRTL ? "اجمالي المصاريف" : "Total Expenses"}
            </Text>
            <Text className="text-2xl font-bold text-slate-800">
              ${totalCosts.toString()}
            </Text>
          </View>
          <View className="w-[48%] bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-sm text-slate-500">
              {isRTL ? "المسافة الكلية" : "Total Distance"}
            </Text>
            <Text className="text-2xl font-bold text-slate-800">
              {currentKm.toString()} {isRTL ? "كم" : "km"}
            </Text>
          </View>
        </View>

        {totalCosts > 0 && (
          <View
            className="bg-white rounded-xl  mb-6 shadow-sm"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            <Text className="text-lg font-semibold mb-4 text-slate-800 p-4">
              {isRTL ? "توزيع التكلفة" : "Cost Distribution"}
            </Text>
            <PieChart
              data={pieData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              accessor="cost"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}
        {totalCosts > 0 && (
          <View
            className="bg-white rounded-xl  mb-6 shadow-sm"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            <Text className="text-lg font-semibold mb-4 text-slate-800 p-4">
              {isRTL ? "التكلفة الشهرية" : "Monthly Costs Trend"}
            </Text>
            <LineChart
              data={lineData}
              width={screenWidth - 32}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: 12,
              }}
            />
          </View>
        )}
        <View
          className="bg-white rounded-xl p-4 mb-6 shadow-sm"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <Text className="text-lg font-semibold mb-4 text-slate-800">
            {isRTL ? "آخر الصيانات" : "Recent Maintenance"}
          </Text>
          {data
            .flatMap((item) =>
              (item.completionHistory || []).map((record) => ({
                ...record,
                title: item.title,
              }))
            )
            .sort(
              (a, b) =>
                new Date(b.completionDate).getTime() -
                new Date(a.completionDate).getTime()
            )
            .slice(0, 5)
            .map((record) => (
              <View
                key={record.id}
                className="mb-3 border-b border-slate-100 pb-2"
              >
                <Text className="font-medium text-slate-800">
                  {record.title}
                </Text>
                <View className="flex-row justify-between mt-1">
                  <Text className="text-sm text-slate-500">
                    {formatDate(
                      new Date(record.completionDate).toString(),
                      isRTL ? "ar-SA" : "en-US"
                    )}
                  </Text>
                  <Text className="text-sm font-medium text-slate-600">
                    ${record.cost.toString()}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Stats;
