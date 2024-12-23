import FilterModal from "@/components/FilterModal";
import GradientButton from "@/components/GradientButton";
import GradientFAB from "@/components/GradientFAB";
import Header from "@/components/Header";
import MaintenanceCard from "@/components/MaintenanceCard";
import { FilterState, MaintenanceItem } from "@/types/allTypes";
import { formatDate } from "@/utils/dateFormatter";
import { initializeStorage, StorageManager } from "@/utils/storageHelpers";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
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

const TaskScreen = () => {
  const navigate = useRouter();

  const [currentKm, setCurrentKm] = useState(0);
  const [newKm, setNewKm] = useState("");
  const [newDate, setNewDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>(
    []
  );
  const [filteredItems, setFilteredItems] = useState<MaintenanceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MaintenanceItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [kmModalVisible, setKmModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const handleFilterApply = (filters: FilterState) => {
    const filtered = maintenanceItems.filter((item) => {
      // If no filters are applied, show all items
      if (
        filters.tags.length === 0 &&
        !filters.interval &&
        !filters.kilometers
      ) {
        return true;
      }

      // Tags filter (OR logic between tags)
      const hasMatchingTag =
        filters.tags.length === 0 ||
        filters.tags.some((tag) => item.tags?.includes(tag));

      // If we only have tags filter
      if (filters.tags.length > 0 && !filters.interval && !filters.kilometers) {
        return hasMatchingTag;
      }

      // If we have interval filter (AND logic with tags)
      if (filters.interval) {
        // Must match both the interval AND (any of the tags if tags are selected)
        if (item.interval !== filters.interval) return false;
        return filters.tags.length === 0 || hasMatchingTag;
      }

      // If we have kilometers filter (AND logic with tags)
      if (filters.kilometers) {
        // Must match both the kilometers AND (any of the tags if tags are selected)
        if (item.kilometers !== filters.kilometers) return false;
        return filters.tags.length === 0 || hasMatchingTag;
      }

      return true;
    });
    if (filtered.length === 0) {
      Alert.alert("لا توجد مهام", "لا توجد مهام تطابق البحث الخاص بك");
      setFilteredItems([]);
    } else {
      setFilteredItems(filtered);
    }
  };

  const updateKilometersAndDate = async () => {
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
      setKmModalVisible(false);
      Alert.alert("نجاح", "تم تحديث عداد المسافات والتاريخ بنجاح");
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء تحديث عداد المسافات والتاريخ");
    }
  };

  const updateDate = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || newDate;
    setShowDatePicker(false);
    setNewDate(currentDate);
    setDateModalVisible(false);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Load current KM
      const km = await StorageManager.getCurrentKm();
      setCurrentKm(km);

      // Load and filter maintenance items
      const items = await StorageManager.getMaintenanceData();

      setMaintenanceItems(items);
      setFilteredItems([]); // Reset filtered items when loading new data
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

  const handleComplete = async (id: string) => {
    try {
      // Save to AsyncStorage first
      await StorageManager.saveCompletion(id, currentKm, newDate.toISOString());

      // Get updated data from storage
      const updatedItems = await StorageManager.getMaintenanceData();

      // Update UI states
      setMaintenanceItems(updatedItems);
      setFilteredItems((prevFiltered) =>
        prevFiltered.map(
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

  const displayItems =
    filteredItems.length > 0 ? filteredItems : maintenanceItems;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title={"مهام الصيانة"}
        subtitle="تتبع صيانة سيارتك بسهولة وفعالية"
      />

      <View className="flex flex-row justify-between items-center mt-2 py-4 border-b border-gray-300 px-2">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => setDateModalVisible(true)}
            className="bg-slate-200 px-3 py-1.5 rounded-lg"
          >
            <Text className="text-slate-600 text-center text-lg">
              {formatDate(newDate.toISOString())}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setKmModalVisible(true)}
            className="bg-slate-200 px-3 py-1.5 rounded-lg"
          >
            <Text className="text-slate-600 text-center text-lg">
              {currentKm} KM
            </Text>
          </TouchableOpacity>
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

      {/* Kilometer Update Modal */}
      <Modal
        visible={kmModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setKmModalVisible(false)}
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
              onPress={updateKilometersAndDate}
              title="تحديث"
              icon="save-outline"
            />
            <GradientButton
              onPress={() => setKmModalVisible(false)}
              title="إلغاء"
              icon="close-outline"
              colors={["#F87171", "#EF4444"]}
              className="mt-4"
            />
          </View>
        </View>
      </Modal>

      {/* Date Update Modal */}
      <Modal
        visible={dateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/30">
          <View className="bg-white rounded-xl p-6 w-3/4">
            <Text className="text-xl font-bold text-slate-800 mb-4">
              تحديث التاريخ
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-gray-50 p-2 rounded-lg border border-gray-200 text-right mb-4"
            >
              <Text className="text-slate-600 text-center text-lg">
                {formatDate(newDate.toISOString())}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newDate}
                mode="date"
                display="default"
                onChange={updateDate}
              />
            )}
            <GradientButton
              onPress={() => setDateModalVisible(false)}
              title="إلغاء"
              icon="close-outline"
              colors={["#F87171", "#EF4444"]}
              className="mt-4"
            />
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleFilterApply}
        items={maintenanceItems}
      />
    </SafeAreaView>
  );
};

export default TaskScreen;
