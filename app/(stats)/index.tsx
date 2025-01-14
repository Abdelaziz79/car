import MaintenanceHeatmap from "@/components/charts/MaintenanceHeatmap";
import DateRangeSelector from "@/components/DateRangeSelector";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import StatCard from "@/components/StatCard";
import TagCostCard from "@/components/TagCostCard";
import { useDirectionManager } from "@/hooks/useDirectionManager";
import {
  DateRange,
  MaintenanceItem,
  MaintenanceRecord,
} from "@/types/allTypes";
import {
  MaintenanceStats,
  getTasksInDateRange,
  getTasksWithHistory,
} from "@/utils/statsHelpers";
import { StorageManager } from "@/utils/storageHelpers";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

export default function Stats() {
  const [currentKm, setCurrentKm] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredTasks, setFilteredTasks] = useState<MaintenanceItem[]>([]);
  const [allRecords, setAllRecords] = useState<MaintenanceRecord[]>([]);

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(),
    allTime: true,
  });

  const { isRTL, directionLoaded } = useDirectionManager();

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [km, history] = await Promise.all([
          StorageManager.getCurrentKm(),
          getTasksWithHistory(),
        ]);
        setCurrentKm(km);
      } catch (error) {
        setError(isRTL ? "حدث خطأ أثناء تحميل البيانات" : "Error loading data");
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isRTL]);

  // Filter tasks based on date range
  useEffect(() => {
    const filterTasks = async () => {
      try {
        let filtered: MaintenanceItem[];

        if (dateRange.allTime) {
          filtered = await getTasksWithHistory();
        } else {
          // Ensure we're working with local dates
          const startDate = new Date(dateRange.startDate);
          const endDate = new Date(dateRange.endDate);

          // Format dates in YYYY-MM-DD format using local time
          const formattedStartDate = [
            startDate.getFullYear(),
            String(startDate.getMonth() + 1).padStart(2, "0"),
            String(startDate.getDate()).padStart(2, "0"),
          ].join("-");

          const formattedEndDate = [
            endDate.getFullYear(),
            String(endDate.getMonth() + 1).padStart(2, "0"),
            String(endDate.getDate()).padStart(2, "0"),
          ].join("-");

          filtered = await getTasksInDateRange(
            formattedStartDate,
            formattedEndDate
          );
        }

        setFilteredTasks(filtered);

        setAllRecords(MaintenanceStats.getRecords(filtered));
      } catch (error) {
        console.error("Error filtering tasks:", error);
        setFilteredTasks([]);
        setAllRecords([]);
      }
    };
    filterTasks();
  }, [dateRange]);

  if (loading || !directionLoaded) {
    return <Loading />;
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
        <Text className="text-red-500 text-lg">{error}</Text>
      </SafeAreaView>
    );
  }

  const totalCosts = MaintenanceStats.getTotalCosts(allRecords);
  const averageCost = MaintenanceStats.getAverageCostPerMaintenance(allRecords);
  const costsByType = MaintenanceStats.getCostsByType(filteredTasks);
  const costsByTag = MaintenanceStats.getCostsByTag(filteredTasks);

  const hasData = allRecords.length > 0;
  const displayNoDataMessage = !hasData && !filteredTasks.length;

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <Header
        title={isRTL ? "التقارير" : "Reports"}
        variant="secondary"
        subtitle={
          isRTL
            ? "عرض تقارير الصيانة والتكاليف"
            : "View maintenance reports and costs"
        }
      />

      <ScrollView className="flex-1 p-4">
        <DateRangeSelector
          onDateRangeChange={setDateRange}
          initialDateRange={dateRange}
        />

        {displayNoDataMessage ? (
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-center text-slate-500 text-lg">
              {isRTL
                ? "لا توجد بيانات متاحة خلال هذا المدى الزمني."
                : "No data available for this date range."}
            </Text>
          </View>
        ) : (
          <View>
            <View className="mb-6">
              <MaintenanceHeatmap
                tasks={filteredTasks}
                isRTL={isRTL}
                dateRange={dateRange}
              />
            </View>
            <View className="flex-row flex-wrap justify-between mb-6">
              <StatCard
                title={isRTL ? "اجمالي المصاريف" : "Total Expenses"}
                value={formatCurrency(totalCosts)}
              />
              <StatCard
                title={isRTL ? "المسافة الكلية" : "Total Distance"}
                value={`${currentKm} ${isRTL ? "كم" : "km"}`}
              />

              <StatCard
                title={isRTL ? "متوسط التكلفة" : "Average Cost"}
                value={formatCurrency(averageCost)}
                subtitle={isRTL ? "لكل صيانة" : "per maintenance"}
              />
            </View>

            <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <Text className="text-lg font-semibold mb-4 text-slate-800">
                {isRTL ? "تكاليف حسب النوع" : "Costs by Type"}
              </Text>
              {Object.entries(costsByType).map(([type, cost]) => (
                <View key={type} className="flex-row justify-between mb-2">
                  <Text className="text-slate-600">
                    {type === "time-based"
                      ? isRTL
                        ? "على أساس الوقت"
                        : "Time Based"
                      : type === "distance-based"
                      ? isRTL
                        ? "على أساس المسافة"
                        : "Distance Based"
                      : isRTL
                      ? "غير محدد"
                      : "Un Specified"}
                  </Text>
                  <Text className="font-medium text-slate-800">
                    {formatCurrency(cost)}
                  </Text>
                </View>
              ))}
            </View>

            <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <Text className="text-lg font-semibold mb-4 text-slate-800">
                {isRTL ? "تكاليف حسب العلامة" : "Costs by Tag"}
              </Text>
              {Object.entries(costsByTag).map(([tag, cost]) => (
                <TagCostCard key={tag} tag={tag} cost={cost} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
