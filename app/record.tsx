import Header from "@/components/Header";
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

  const loadStatistics = async () => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);

    // Calculate statistics based on completion dates
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

      // Get all records first
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

      // Apply time filter
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

      // Calculate statistics based on all records, not filtered ones
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

  const renderStatistics = () => (
    <View className="flex-row justify-between bg-white p-4 rounded-lg mb-4 mx-4 mt-4">
      <View className="items-center">
        <Text className="text-gray-600">الكل</Text>
        <Text className="text-lg font-bold">{statistics.totalTasks}</Text>
      </View>
      <View className="items-center">
        <Text className="text-gray-600">هذا الشهر</Text>
        <Text className="text-lg font-bold">
          {statistics.completedThisMonth}
        </Text>
      </View>
      <View className="items-center">
        <Text className="text-gray-600">هذا العام</Text>
        <Text className="text-lg font-bold">
          {statistics.completedThisYear}
        </Text>
      </View>
    </View>
  );

  const renderTimeFilter = () => (
    <View className="flex-row justify-center gap-2 p-4 bg-white">
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
            {filter === "all" ? "الكل" : filter === "month" ? "الشهر" : "السنة"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRecord = ({ item }: { item: MaintenanceRecord }) => (
    <View className="bg-white p-4 rounded-lg mb-4 shadow-sm">
      <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
      <View className="flex-row justify-between mt-2">
        <View>
          <Text className="text-gray-600">آخر فحص:</Text>
          <Text className="text-gray-800">
            {new Date(item.completionDate).toLocaleDateString("ar-SA")}
          </Text>
        </View>
        <View>
          <Text className="text-gray-600">الفحص القادم:</Text>
          <Text className="text-gray-800">
            {item.nextDate
              ? new Date(item.nextDate).toLocaleDateString("ar-SA")
              : item.nextKm
              ? `${item.nextKm} كم`
              : "غير محدد"}
          </Text>
        </View>
      </View>
      {item.kmAtCompletion !== null && item.kmAtCompletion !== undefined && (
        <Text className="text-gray-600 mt-2">
          عداد المسافة: {item.kmAtCompletion} كم
        </Text>
      )}
      {item.notes && (
        <Text className="text-gray-600 mt-2">ملاحظات: {item.notes}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header title="سجل الصيانة" subtitle="سجل جميع عمليات الصيانة السابقة" />
      {renderTimeFilter()}
      {!loading && renderStatistics()}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">جاري التحميل...</Text>
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
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-gray-600 text-lg">لا يوجد سجلات صيانة</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Record;
