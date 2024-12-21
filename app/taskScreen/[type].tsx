import FilterModal from "@/components/FilterModal";
import GradientButton from "@/components/GradientButton";
import GradientFAB from "@/components/GradientFAB";
import Header from "@/components/Header";
import MaintenanceCard from "@/components/MaintenanceCard";
import {
  FilterState,
  MaintenanceItem,
  MaintenanceType,
} from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import { initializeStorage, StorageManager } from "@/utils/storageHelpers";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TaskScreen = () => {
  const { type } = useLocalSearchParams();
  const navigate = useRouter();

  const [currentKm, setCurrentKm] = useState(0);
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>(
    []
  );
  const [filteredItems, setFilteredItems] = useState<MaintenanceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MaintenanceItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const handleFilterApply = (filters: FilterState) => {
    const filtered = maintenanceItems.filter((item) => {
      // Check tags
      if (
        filters.tags.length > 0 &&
        !filters.tags.some((tag) => item.tags?.includes(tag))
      ) {
        return false;
      }

      // Check interval for time-based
      if (filters.interval && item.interval !== filters.interval) {
        return false;
      }

      // Check kilometers for distance-based
      if (filters.kilometers && item.kilometers !== filters.kilometers) {
        return false;
      }

      return true;
    });

    setFilteredItems(filtered);
  };
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Load current KM
      const km = await StorageManager.getCurrentKm();
      setCurrentKm(km);

      // Load and filter maintenance items
      const items = await StorageManager.getMaintenanceData();
      const itemsWithStatus = await Promise.all(
        items.map(async (item) => ({
          ...item,
          status: await StorageManager.calculateTaskStatus(item, km),
        }))
      );

      // Filter items based on type
      const filteredItems = itemsWithStatus.filter((item) => {
        switch (type) {
          case "time-based":
            return item.type === "time-based";
          case "distance-based":
            return item.type === "distance-based";
          case "user-based":
            return item.createdByUser === true;
          default:
            return true;
        }
      });

      setMaintenanceItems(filteredItems);
      setFilteredItems([]); // Reset filtered items when loading new data
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    const initApp = async () => {
      try {
        await initializeStorage();
        await loadData();
      } catch (error) {
        console.error("Error initializing app:", error);
        Alert.alert("خطأ", "حدث خطأ أثناء تهيئة التطبيق");
      }
    };

    initApp();
  }, [loadData]);

  const handleComplete = async (id: string) => {
    try {
      await StorageManager.saveCompletion(id, currentKm);
      // await loadData();
      Alert.alert("نجاح", "تم إكمال المهمة بنجاح");
    } catch (error) {
      console.error("Error completing task:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء إكمال المهمة");
    }
  };

  const getScreenTitle = () => {
    switch (type) {
      case "time-based":
        return "المهام حسب الوقت";
      case "distance-based":
        return "المهام حسب المسافة";
      case "user-based":
        return "المهام الخاصة بي";
      default:
        return "نظام صيانة السيارة";
    }
  };

  const displayItems =
    filteredItems.length > 0 ? filteredItems : maintenanceItems;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title={getScreenTitle()}
        subtitle="تتبع صيانة سيارتك بسهولة وفعالية"
      />

      <View className="flex flex-row justify-between items-center mt-2 py-4 border-b border-gray-300 px-2">
        <View className="flex-row items-center gap-2">
          <View className="bg-slate-200 px-3 py-1.5 rounded-lg">
            <Text className="text-slate-600 text-center text-lg">
              {formatDate(new Date().toISOString())}
            </Text>
          </View>

          <View className="bg-slate-200 px-3 py-1.5 rounded-lg">
            <Text className="text-slate-600 text-center text-lg">
              {currentKm} KM
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setFilterModalVisible(true)}
          className="flex-row items-center bg-violet-100 px-4 py-2 rounded-lg"
        >
          <Ionicons name="filter" size={20} color="#7C3AED" />
          <Text className="text-violet-600 mr-2">تصفية</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-slate-600">جاري التحميل...</Text>
          </View>
        ) : displayItems.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-slate-600 text-lg">لا توجد مهام</Text>
          </View>
        ) : (
          displayItems.map((item) => (
            <MaintenanceCard
              key={item.id}
              item={item}
              onPress={setSelectedItem}
              onComplete={handleComplete}
            />
          ))
        )}
      </ScrollView>

      <GradientFAB onPress={() => navigate.push("/add")} />

      {/* Details Modal */}
      <Modal
        visible={!!selectedItem}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedItem(null)}
      >
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-slate-800">
                تفاصيل الصيانة
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedItem(null)}
                className="p-2 rounded-full bg-slate-100"
              >
                <Ionicons name="close" size={24} color="#475569" />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <View>
                <Text className="text-xl font-bold text-slate-800 mb-2">
                  {selectedItem.title}
                </Text>
                <Text className="text-slate-600 text-base mb-6 leading-6">
                  {selectedItem.description}
                </Text>

                <Text className="text-lg font-bold text-slate-800 mb-3">
                  المهام:
                </Text>
                <View className="bg-slate-50 rounded-xl p-4 mb-6">
                  {selectedItem.tasks.map((task, index) => (
                    <View
                      key={index}
                      className="flex-row items-center mb-3 last:mb-0"
                    >
                      <View className="w-2 h-2 rounded-full bg-violet-500 mr-3" />
                      <Text className="text-slate-700">{task}</Text>
                    </View>
                  ))}
                </View>

                <GradientButton
                  onPress={() => setSelectedItem(null)}
                  title="إغلاق"
                  icon="close"
                />
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleFilterApply}
        type={type as MaintenanceType}
        items={maintenanceItems}
      />
    </SafeAreaView>
  );
};

export default TaskScreen;
