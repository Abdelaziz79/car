import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FilterModal from "@/components/FilterModal";
import GradientButton from "@/components/GradientButton";
import GradientFAB from "@/components/GradientFAB";
import Header from "@/components/Header";
import MaintenanceCard from "@/components/MaintenanceCard";
import MaintenanceDetailsModal from "@/components/MaintenanceDetailsModal";

import { CompletionData, FilterState, MaintenanceItem } from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import { initializeStorage, StorageManager } from "@/utils/storageHelpers";

const TaskScreen = () => {
  const router = useRouter();

  // State Management
  const [currentKm, setCurrentKm] = useState(0);
  const [newKm, setNewKm] = useState("");
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>(
    []
  );
  const [filteredItems, setFilteredItems] = useState<MaintenanceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MaintenanceItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Modal visibility states
  const [modals, setModals] = useState({
    filter: false,
    km: false,
    date: false,
  });

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

  // Handlers
  const handleFilterApply = useCallback(
    (filters: FilterState) => {
      const filtered = maintenanceItems.filter((item) => {
        const hasMatchingTag =
          filters.tags.length === 0 ||
          filters.tags.some((tag) => item.tags?.includes(tag));

        // No filters applied
        if (
          filters.tags.length === 0 &&
          !filters.interval &&
          !filters.kilometers
        ) {
          return true;
        }

        // Only tags filter
        if (
          filters.tags.length > 0 &&
          !filters.interval &&
          !filters.kilometers
        ) {
          return hasMatchingTag;
        }

        // Interval filter with tags
        if (filters.interval && item.interval !== filters.interval) {
          return false;
        }

        // Kilometers filter with tags
        if (filters.kilometers && item.kilometers !== filters.kilometers) {
          return false;
        }

        return filters.tags.length === 0 || hasMatchingTag;
      });

      if (filtered.length === 0) {
        Alert.alert("لا توجد مهام", "لا توجد مهام تطابق البحث الخاص بك");
        setFilteredItems([]);
      } else {
        setFilteredItems(filtered);
      }
    },
    [maintenanceItems]
  );

  const handleKmUpdate = async () => {
    const kmNumber = parseInt(newKm);

    if (isNaN(kmNumber)) {
      Alert.alert("خطأ", "الرجاء إدخال رقم صحيح");
      return;
    }

    if (kmNumber < currentKm) {
      Alert.alert("خطأ", "لا يمكن إدخال قيمة أقل من العداد الحالي");
      return;
    }

    try {
      await StorageManager.setCurrentKm(kmNumber);
      setCurrentKm(kmNumber);
      setNewKm("");
      toggleModal("km", false);
      Alert.alert("نجاح", "تم تحديث عداد المسافات بنجاح");
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء تحديث عداد المسافات");
    }
  };

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

  // Render helper components
  const renderKmModal = () => (
    <Modal
      visible={modals.km}
      animationType="slide"
      transparent={true}
      onRequestClose={() => toggleModal("km", false)}
    >
      <View className="flex-1 justify-center items-center bg-black/30">
        <View className="bg-white rounded-xl p-6 w-3/4">
          <Text className="text-xl font-bold text-slate-800 mb-4">
            تحديث عداد المسافات
          </Text>
          <TextInput
            className="bg-gray-50 p-2 rounded-lg border border-gray-200 text-right mb-4"
            keyboardType="numeric"
            placeholder="أدخل قراءة العداد الجديدة"
            value={newKm}
            onChangeText={setNewKm}
          />
          <GradientButton
            onPress={handleKmUpdate}
            title="تحديث"
            icon="save-outline"
          />
          <GradientButton
            onPress={() => toggleModal("km", false)}
            title="إلغاء"
            icon="close-outline"
            colors={["#F87171", "#EF4444"]}
            className="mt-4"
          />
        </View>
      </View>
    </Modal>
  );

  const renderHeader = () => (
    <View className="flex flex-row justify-between items-center mt-2 py-4 border-b border-gray-300 px-2">
      <View className="flex-row items-center gap-2">
        <TouchableOpacity className="bg-slate-200 px-3 py-1.5 rounded-lg">
          <Text className="text-slate-600 text-center text-lg">
            {formatDate(new Date().toISOString())}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleModal("km", true)}
          className="bg-slate-200 px-3 py-1.5 rounded-lg flex-row items-center"
        >
          <Ionicons
            name="speedometer-outline"
            size={20}
            color="#475569"
            className="mx-1"
          />
          <Text className="text-slate-600 text-center text-lg">
            {currentKm} كم
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => toggleModal("filter", true)}
        className="flex-row items-center bg-violet-100 px-4 py-2 rounded-lg"
      >
        <Ionicons name="filter" size={20} color="#7C3AED" />
        <Text className="text-violet-600 mx-2">تصفية</Text>
      </TouchableOpacity>
    </View>
  );

  const displayItems =
    filteredItems.length > 0 ? filteredItems : maintenanceItems;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title="مهام الصيانة"
        subtitle="تتبع صيانة سيارتك بسهولة وفعالية"
      />

      {renderHeader()}

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
              onDelete={handleDelete}
              currentKm={currentKm}
            />
          ))
        )}
      </ScrollView>

      <GradientFAB onPress={() => router.push("/add")} />

      <MaintenanceDetailsModal
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {renderKmModal()}

      <FilterModal
        visible={modals.filter}
        onClose={() => toggleModal("filter", false)}
        onApply={handleFilterApply}
        items={maintenanceItems}
      />
    </SafeAreaView>
  );
};

export default TaskScreen;
