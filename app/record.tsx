import Header from "@/components/Header";
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { MaintenanceRecord } from "@/types/allTypes";
import { getTasksWithHistory } from "@/utils/maintenanceHelpers";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  const loadStatistics = async () => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);

    const monthlyCount = records.filter(
      (record) => new Date(record.completionDate) >= firstDayOfMonth
    ).length;

    const yearlyCount = records.filter(
      (record) => new Date(record.completionDate) >= firstDayOfYear
    ).length;

    setStatistics({
      totalTasks: records.length,
      completedThisMonth: monthlyCount,
      completedThisYear: yearlyCount,
    });
  };

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

  const getFilterLabel = (filter: "all" | "month" | "year") => {
    const labels = {
      all: { ar: "الكل", en: "All" },
      month: { ar: "الشهر", en: "Month" },
      year: { ar: "السنة", en: "Year" },
    };
    return isRTL ? labels[filter].ar : labels[filter].en;
  };

  const renderStatistics = () => (
    <View
      className="flex-row justify-between bg-white p-4 rounded-lg mb-4 mx-4 mt-4"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <View className="items-center">
        <Text className="text-gray-600">{isRTL ? "الكل" : "All"}</Text>
        <Text className="text-lg font-bold">{statistics.totalTasks}</Text>
      </View>
      <View className="items-center">
        <Text className="text-gray-600">
          {isRTL ? "هذا الشهر" : "This Month"}
        </Text>
        <Text className="text-lg font-bold">
          {statistics.completedThisMonth}
        </Text>
      </View>
      <View className="items-center">
        <Text className="text-gray-600">
          {isRTL ? "هذا العام" : "This Year"}
        </Text>
        <Text className="text-lg font-bold">
          {statistics.completedThisYear}
        </Text>
      </View>
    </View>
  );

  const renderTimeFilter = () => (
    <View
      className="flex-row justify-center gap-2 p-4 bg-white"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {(["all", "month", "year"] as const).map((filter) => (
        <TouchableOpacity
          key={filter}
          onPress={() => setTimeFilter(filter)}
          className={`px-4 py-2 rounded-full ${
            timeFilter === filter ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          <Text
            className={`${
              timeFilter === filter ? "text-white" : "text-gray-600"
            }`}
          >
            {getFilterLabel(filter)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRecord = ({ item }: { item: MaintenanceRecord }) => (
    <View
      className="bg-white p-4 rounded-lg mb-4 shadow-sm"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
      <View className="flex-row justify-between mt-2">
        <View>
          <Text className="text-gray-600">
            {isRTL ? "آخر فحص:" : "Last Check:"}
          </Text>
          <Text className="text-gray-800">
            {new Date(item.completionDate).toLocaleDateString(
              isRTL ? "ar-SA" : "en-US"
            )}
          </Text>
        </View>
        <View>
          <Text className="text-gray-600">
            {isRTL ? "الفحص القادم:" : "Next Check:"}
          </Text>
          <Text className="text-gray-800">
            {item.nextDate
              ? new Date(item.nextDate).toLocaleDateString(
                  isRTL ? "ar-SA" : "en-US"
                )
              : item.nextKm
              ? `${item.nextKm} ${isRTL ? "كم" : "km"}`
              : isRTL
              ? "غير محدد"
              : "Not specified"}
          </Text>
        </View>
      </View>
      {item.kmAtCompletion !== null && item.kmAtCompletion !== undefined && (
        <Text className="text-gray-600 mt-2">
          {isRTL ? "عداد المسافة: " : "Odometer: "}
          {item.kmAtCompletion} {isRTL ? "كم" : "km"}
        </Text>
      )}
      {item.notes && (
        <Text className="text-gray-600 mt-2">
          {isRTL ? "ملاحظات: " : "Notes: "}
          {item.notes}
        </Text>
      )}
    </View>
  );

  if (!directionLoaded) {
    return null;
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
      />
      {renderTimeFilter()}
      {!loading && renderStatistics()}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">
            {isRTL ? "جاري التحميل..." : "Loading..."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={records}
          renderItem={renderRecord}
          keyExtractor={(item) => `${item.taskId}-${item.completionDate}`}
          contentContainerClassName="p-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View
              className="flex-1 justify-center items-center py-8"
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            >
              <Text className="text-gray-600 text-lg">
                {isRTL ? "لا يوجد سجلات صيانة" : "No maintenance records found"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Record;
