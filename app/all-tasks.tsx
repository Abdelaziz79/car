import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FilterModal from "@/components/FilterModal";
import GradientFAB from "@/components/GradientFAB";
import Header from "@/components/Header";
import MaintenanceCard from "@/components/MaintenanceCard";
import MaintenanceDetailsModal from "@/components/MaintenanceDetailsModal";

import CompactMaintenanceCard from "@/components/CompactMaintenanceCard";
import RenderHeader from "@/components/RenderHeader";
import RenderKmModal from "@/components/RenderKmModal";
import { CompletionData, MaintenanceItem } from "@/types/allTypes";
import { initializeStorage, StorageManager } from "@/utils/storageHelpers";

const TaskScreen = () => {
  const router = useRouter();

  // State Management
  const [currentKm, setCurrentKm] = useState(0);
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>(
    []
  );
  const [filteredItems, setFilteredItems] = useState<MaintenanceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MaintenanceItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isCompactView, setIsCompactView] = useState(false);
  // Modal visibility states
  const [modals, setModals] = useState({
    filter: false,
    km: false,
    date: false,
  });
  const [refreshing, setRefreshing] = useState(false);

  const toggleView = () => {
    setIsCompactView(!isCompactView);
  };

  // Helper function to toggle modals
  const toggleModal = (modalName: keyof typeof modals, value: boolean) => {
    setModals((prev) => ({ ...prev, [modalName]: value }));
  };

  // Load initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [km, items] = await Promise.all([
        StorageManager.getCurrentKm(),
        StorageManager.getMaintenanceData(),
      ]);

      setCurrentKm(km);
      setMaintenanceItems(items);
      setFilteredItems([]);
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  const handleComplete = async (id: string, completionData: CompletionData) => {
    try {
      await StorageManager.saveCompletion(
        id,
        completionData.kilometers,
        completionData.completionDate,
        completionData.notes
      );

      const updatedItems = await StorageManager.getMaintenanceData();
      setMaintenanceItems(updatedItems);
      setFilteredItems((prev) =>
        prev.map(
          (item) =>
            updatedItems.find((updated) => updated.id === item.id) || item
        )
      );

      Alert.alert("نجاح", "تم إكمال المهمة بنجاح");
    } catch (error) {
      console.error("Error completing task:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء إكمال المهمة");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedItems = maintenanceItems.filter((item) => item.id !== id);
      await StorageManager.saveMaintenanceData(updatedItems);
      setMaintenanceItems(updatedItems);
      setFilteredItems((prev) => prev.filter((item) => item.id !== id));
      Alert.alert("نجاح", "تم حذف المهمة بنجاح");
    } catch (error) {
      console.error("Error deleting task:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء حذف المهمة");
    }
  };

  const handleUpdateTask = async (
    taskId: string,
    updates: Partial<MaintenanceItem>,
    setLoading?: (loading: boolean) => void,
    onSuccess?: () => void
  ) => {
    try {
      if (setLoading) {
        setLoading(true);
      }

      const updatedTask = await StorageManager.updateTask(taskId, updates);

      // Show success message
      Alert.alert("تم التحديث", "تم تحديث المهمة بنجاح", [
        {
          text: "حسناً",
          onPress: () => {
            if (onSuccess) {
              onSuccess();
            }
          },
        },
      ]);

      return updatedTask;
    } catch (error) {
      // Show error message
      Alert.alert(
        "خطأ",
        "حدث خطأ أثناء تحديث المهمة. الرجاء المحاولة مرة أخرى.",
        [{ text: "حسناً" }]
      );
      console.error("Error updating task:", error);
    } finally {
      if (setLoading) {
        setLoading(false);
      }
    }
  };

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

  const displayItems =
    filteredItems.length > 0 ? filteredItems : maintenanceItems;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title="مهام الصيانة"
        subtitle="تتبع صيانة سيارتك بسهولة وفعالية"
      />

      <RenderHeader
        currentKm={currentKm}
        toggleModal={toggleModal}
        toggleView={toggleView}
        isCompactView={isCompactView}
      />

      <ScrollView
        className="flex-1 px-4 pt-4 "
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4F46E5"]}
            tintColor="#4F46E5"
          />
        }
      >
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-slate-600">جاري التحميل...</Text>
          </View>
        ) : displayItems.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-slate-600 text-lg">لا توجد مهام</Text>
          </View>
        ) : (
          <View className="mb-5">
            {displayItems.map((item) => {
              return isCompactView ? (
                <CompactMaintenanceCard
                  key={item.id}
                  item={item}
                  onPress={setSelectedItem}
                  currentKm={currentKm}
                  onDelete={handleDelete}
                  onComplete={handleComplete}
                  handleUpdateTask={handleUpdateTask}
                  onRefresh={onRefresh}
                />
              ) : (
                <MaintenanceCard
                  key={item.id}
                  item={item}
                  onPress={setSelectedItem}
                  onComplete={handleComplete}
                  onDelete={handleDelete}
                  currentKm={currentKm}
                  handleUpdateTask={handleUpdateTask}
                  onRefresh={onRefresh}
                />
              );
            })}
          </View>
        )}
      </ScrollView>

      <GradientFAB onPress={() => router.push("/add")} />

      <MaintenanceDetailsModal
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        onComplete={handleComplete}
        onDelete={handleDelete}
        currentKm={currentKm}
        handleUpdateTask={handleUpdateTask}
        onRefresh={onRefresh}
      />

      <RenderKmModal
        currentKm={currentKm}
        setCurrentKm={setCurrentKm}
        modals={modals}
        toggleModal={toggleModal}
      />

      <FilterModal
        visible={modals.filter}
        onClose={() => toggleModal("filter", false)}
        maintenanceItems={maintenanceItems}
        setFilteredItems={setFilteredItems}
      />
    </SafeAreaView>
  );
};

export default TaskScreen;
