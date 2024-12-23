import GradientButton from "@/components/GradientButton";
import Header from "@/components/Header";
import { maintenanceData } from "@/data/maintenanceData";
import { STORAGE_KEYS, StorageManager } from "@/utils/storageHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Setting = () => {
  const [currentKm, setCurrentKm] = useState<number>(0);
  const [newKm, setNewKm] = useState<string>("");

  useEffect(() => {
    loadCurrentKm();
  }, []);

  const loadCurrentKm = async () => {
    const km = await StorageManager.getCurrentKm();
    setCurrentKm(km);
  };

  const updateKilometers = async () => {
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
      Alert.alert("نجاح", "تم تحديث عداد المسافات بنجاح");
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء تحديث عداد المسافات");
    }
  };

  const clearUserTasks = async () => {
    Alert.alert("حذف المهام", "هل أنت متأكد من حذف جميع المهام المخصصة؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          try {
            const allTasks = await StorageManager.getMaintenanceData();
            const systemTasks = allTasks.filter((task) => !task.createdByUser);
            await StorageManager.saveMaintenanceData(systemTasks);
            Alert.alert("نجاح", "تم حذف المهام المخصصة بنجاح");
          } catch (error) {
            Alert.alert("خطأ", "حدث خطأ أثناء حذف المهام");
          }
        },
      },
    ]);
  };

  const resetAllData = async () => {
    Alert.alert(
      "إعادة تعيين",
      "هل أنت متأكد من إعادة تعيين جميع البيانات؟ سيتم حذف جميع السجلات والمهام المخصصة",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "إعادة تعيين",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear all storage
              await AsyncStorage.clear();

              // Reinitialize with default data
              await StorageManager.saveMaintenanceData(maintenanceData);
              await AsyncStorage.setItem(
                STORAGE_KEYS.MAINTENANCE_HISTORY,
                JSON.stringify({})
              );
              await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_KM, "0");
              await AsyncStorage.setItem(
                STORAGE_KEYS.CUSTOM_TAGS,
                JSON.stringify([])
              );
              await AsyncStorage.setItem(
                STORAGE_KEYS.CUSTOM_INTERVALS,
                JSON.stringify([])
              );

              // Update UI state
              setCurrentKm(0);
              setNewKm("");

              Alert.alert("نجاح", "تم إعادة تعيين جميع البيانات بنجاح");
            } catch (error) {
              console.error("Reset error:", error);
              Alert.alert("خطأ", "حدث خطأ أثناء إعادة تعيين البيانات");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header title="الإعدادات" subtitle="إدارة إعدادات التطبيق" />
      <View className="flex-1 px-6 py-4">
        {/* Current KM Display */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            عداد المسافات الحالي
          </Text>
          <Text className="text-3xl font-bold text-violet-600 mb-4">
            {currentKm} كم
          </Text>

          {/* KM Update Section */}
          <View className="flex-row items-center gap-2">
            <TextInput
              className="flex-1 bg-gray-50 p-2 rounded-lg border border-gray-200 text-right"
              keyboardType="numeric"
              placeholder="أدخل قراءة العداد الجديدة"
              value={newKm}
              onChangeText={setNewKm}
            />
            <GradientButton
              onPress={updateKilometers}
              title="تحديث"
              icon="save-outline"
              size="small"
            />
          </View>
        </View>

        {/* Actions */}
        <View className="flex-col gap-4">
          <GradientButton
            onPress={clearUserTasks}
            title="حذف المهام المخصصة"
            icon="trash-outline"
            colors={["#F87171", "#EF4444"]}
          />

          <GradientButton
            onPress={resetAllData}
            title="إعادة تعيين جميع البيانات"
            icon="refresh-outline"
            colors={["#60A5FA", "#3B82F6"]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Setting;
