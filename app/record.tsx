import Header from "@/components/Header";
import Loading from "@/components/Loading";
import RenderRecord from "@/components/RenderRecord";
import RenderStatistics from "@/components/RenderStatistics";
import RenderTimeFilter from "@/components/RenderTimeFilter";
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { MaintenanceRecord } from "@/types/allTypes";
import { getTasksWithHistory } from "@/utils/statsHelpers";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Record = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "year">("all");
  const [statistics, setStatistics] = useState({
    totalTasks: 0,
    completedThisMonth: 0,
    completedThisYear: 0,
  });
  const { isRTL, directionLoaded } = useDirectionManager();

  const loadRecords = async () => {
    try {
      setLoading(true);
      const currentDate = new Date();
      let filteredRecords: MaintenanceRecord[] = [];
      const allTasks = await getTasksWithHistory();

      const allRecords = allTasks
        .flatMap((item) =>
          (item.completionHistory || []).map((record) => ({
            ...record,
            title: item.title,
            type: item.type,
          }))
        )
        .sort(
          (a, b) =>
            new Date(b.completionDate).getTime() -
            new Date(a.completionDate).getTime()
        );

      switch (timeFilter) {
        case "month": {
          const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );
          filteredRecords = allRecords.filter(
            (record) => new Date(record.completionDate) >= firstDayOfMonth
          );
          break;
        }
        case "year": {
          const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
          filteredRecords = allRecords.filter(
            (record) => new Date(record.completionDate) >= firstDayOfYear
          );
          break;
        }
        default:
          filteredRecords = allRecords;
      }

      setRecords(filteredRecords);

      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);

      setStatistics({
        totalTasks: allRecords.length,
        completedThisMonth: allRecords.filter(
          (record) => new Date(record.completionDate) >= firstDayOfMonth
        ).length,
        completedThisYear: allRecords.filter(
          (record) => new Date(record.completionDate) >= firstDayOfYear
        ).length,
      });
    } catch (error) {
      console.error("Error loading records:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecords();
    setRefreshing(false);
  }, [timeFilter]);

  useEffect(() => {
    loadRecords();
  }, [timeFilter]);

  if (!directionLoaded) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title={isRTL ? "سجل الصيانة" : "Maintenance Record"}
        subtitle={
          isRTL
            ? "سجل جميع عمليات الصيانة السابقة"
            : "Record of all previous maintenance operations"
        }
        variant="secondary"
      />
      <RenderTimeFilter
        isRTL={isRTL}
        setTimeFilter={setTimeFilter}
        timeFilter={timeFilter}
      />
      {!loading && <RenderStatistics statistics={statistics} isRTL={isRTL} />}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </Text>
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {records.length > 0 ? (
            <View>
              {records.map((record, index) => (
                <RenderRecord key={index} item={record} isRTL={isRTL} />
              ))}
            </View>
          ) : (
            <View
              className="flex-1 justify-center items-center py-8"
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            >
              <Text className="text-gray-600 text-lg">
                {isRTL ? "لا يوجد سجلات صيانة" : "No maintenance records found"}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Record;
