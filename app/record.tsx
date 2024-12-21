import Header from "@/components/Header";
import { MaintenanceRecord } from "@/types/allTypes";
import { StorageManager } from "@/utils/storageHelpers";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Record = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const maintenanceData = await StorageManager.getMaintenanceData();
      const allRecords = maintenanceData
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
      setRecords(allRecords);
    } catch (error) {
      console.error("Error loading records:", error);
    } finally {
      setLoading(false);
    }
  };

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
