import GradientButton from "@/components/GradientButton";
import GradientFAB from "@/components/GradientFAB";
import Header from "@/components/Header";
import { MaintenanceCard } from "@/components/MaintenanceCard";
import {
  FILTER_OPTIONS,
  MaintenanceItem,
  MaintenanceStatus,
} from "@/types/allTypes";
import { initializeStorage, StorageManager } from "@/utils/storageHelpers";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TaskScreen = () => {
  const { type } = useLocalSearchParams();
  const [selectedFilter, setSelectedFilter] =
    useState<MaintenanceStatus>("all");
  const [currentKm, setCurrentKm] = useState(0);
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>(
    []
  );
  const [selectedItem, setSelectedItem] = useState<MaintenanceItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useRouter();

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
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [type]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

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
      await loadData();
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

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title={getScreenTitle()}
        subtitle="تتبع صيانة سيارتك بسهولة وفعالية"
      />

      <View className="flex flex-row justify-between items-center mt-2 py-4 border-b border-gray-300 px-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
        >
          {FILTER_OPTIONS.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              onPress={() => setSelectedFilter(filter.value)}
              className={`px-4 py-2 rounded-xl border ml-2 ${
                selectedFilter === filter.value
                  ? `${filter.color} border-transparent`
                  : "border-gray-200 bg-white"
              }`}
            >
              <Text
                className={`text-lg ${
                  selectedFilter === filter.value
                    ? "text-white font-medium"
                    : "text-gray-700"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="bg-slate-200 px-3 py-1.5 rounded-lg">
          <Text className="text-slate-600 text-center">{currentKm} KM</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-slate-600">جاري التحميل...</Text>
          </View>
        ) : maintenanceItems.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-slate-600 text-lg">لا توجد مهام</Text>
          </View>
        ) : (
          maintenanceItems
            .filter(
              (item) =>
                selectedFilter === "all" || item.status === selectedFilter
            )
            .map((item) => (
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
    </SafeAreaView>
  );
};

export default TaskScreen;
