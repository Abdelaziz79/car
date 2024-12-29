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
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { CompletionData, MaintenanceItem } from "@/types/allTypes";
import { StorageManager } from "@/utils/storageHelpers";

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
  const { isRTL, directionLoaded } = useDirectionManager();
  const toggleView = () => {
    setIsCompactView(!isCompactView);
  };

  const toggleModal = (modalName: keyof typeof modals, value: boolean) => {
    setModals((prev) => ({ ...prev, [modalName]: value }));
  };

  const getText = (key: string): string => {
    const textMap: { [key: string]: string } = {
      maintenaceTasks: isRTL ? "مهام الصيانة" : "Maintenance Tasks",
      subTitle: isRTL
        ? "تتبع صيانة سيارتك بسهولة وفعالية"
        : "Track your car maintenance easily and effectively",
      loading: isRTL ? "جاري التحميل..." : "Loading...",
      noTasks: isRTL ? "لا توجد مهام" : "No tasks available",
      success: isRTL ? "نجاح" : "Success",
      taskComplete: isRTL
        ? "تم إكمال المهمة بنجاح"
        : "Task completed successfully",
      error: isRTL ? "خطأ" : "Error",
      loadError: isRTL
        ? "حدث خطأ أثناء تحميل البيانات"
        : "An error occurred while loading the data",
      completeError: isRTL
        ? "حدث خطأ أثناء إكمال المهمة"
        : "An error occurred while completing the task",
      deleteTaskSuccess: isRTL
        ? "تم حذف المهمة بنجاح"
        : "Task deleted successfully",
      deleteTaskError: isRTL
        ? "حدث خطأ أثناء حذف المهمة"
        : "An error occurred while deleting the task",
      taskUpdateSuccess: isRTL
        ? "تم تحديث المهمة بنجاح"
        : "Task updated successfully",
      taskUpdateError: isRTL
        ? "حدث خطأ أثناء تحديث المهمة. الرجاء المحاولة مرة أخرى."
        : "An error occurred while updating the task. Please try again.",
      ok: isRTL ? "حسناً" : "OK",
    };
    return textMap[key] || key;
  };

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
      Alert.alert(getText("error"), getText("loadError"));
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

      Alert.alert(getText("success"), getText("taskComplete"));
    } catch (error) {
      console.error("Error completing task:", error);
      Alert.alert(getText("error"), getText("completeError"));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const updatedItems = maintenanceItems.filter((item) => item.id !== id);
      await StorageManager.saveMaintenanceData(updatedItems);
      setMaintenanceItems(updatedItems);
      setFilteredItems((prev) => prev.filter((item) => item.id !== id));
      Alert.alert(getText("success"), getText("deleteTaskSuccess"));
    } catch (error) {
      console.error("Error deleting task:", error);
      Alert.alert(getText("error"), getText("deleteTaskError"));
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
      Alert.alert(getText("taskUpdateSuccess"), getText("taskUpdateSuccess"), [
        {
          text: getText("ok"),
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
      Alert.alert(getText("error"), getText("taskUpdateError"), [
        { text: getText("ok") },
      ]);
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
        // Remove the initializeStorage call since we don't want to auto-initialize with default data
        await loadData();
      } catch (error) {
        console.error("Error initializing app:", error);
        Alert.alert(getText("error"), getText("loadError"));
      }
    };

    initApp();
  }, [loadData]);

  const displayItems =
    filteredItems.length > 0 ? filteredItems : maintenanceItems;

  if (!directionLoaded) {
    return null;
  }
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title={getText("maintenaceTasks")}
        subtitle={getText("subTitle")}
      />

      <RenderHeader
        currentKm={currentKm}
        toggleModal={toggleModal}
        toggleView={toggleView}
        isCompactView={isCompactView}
        directionLoaded={directionLoaded}
        isRTL={isRTL}
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
            <Text
              className="text-slate-600"
              style={{
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {getText("loading")}
            </Text>
          </View>
        ) : displayItems.length === 0 ? (
          <View className="flex-1 justify-center items-center py-8">
            <Text
              className="text-slate-600 text-lg"
              style={{
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {getText("noTasks")}
            </Text>
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
                  directionLoaded={directionLoaded}
                  isRTL={isRTL}
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
                  directionLoaded={directionLoaded}
                  isRTL={isRTL}
                />
              );
            })}
          </View>
        )}
      </ScrollView>

      <GradientFAB
        directionLoaded={directionLoaded}
        isRTL={isRTL}
        onPress={() => router.push("/add")}
      />

      <MaintenanceDetailsModal
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
        onComplete={handleComplete}
        onDelete={handleDelete}
        currentKm={currentKm}
        handleUpdateTask={handleUpdateTask}
        onRefresh={onRefresh}
        directionLoaded={directionLoaded}
        isRTL={isRTL}
      />

      <RenderKmModal
        currentKm={currentKm}
        setCurrentKm={setCurrentKm}
        modals={modals}
        toggleModal={toggleModal}
        directionLoaded={directionLoaded}
        isRTL={isRTL}
      />

      <FilterModal
        visible={modals.filter}
        onClose={() => toggleModal("filter", false)}
        maintenanceItems={maintenanceItems}
        setFilteredItems={setFilteredItems}
        directionLoaded={directionLoaded}
        isRTL={isRTL}
      />
    </SafeAreaView>
  );
};

export default TaskScreen;
