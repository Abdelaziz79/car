import GradientButton from "@/components/GradientButton";
import Header from "@/components/Header";
import { maintenanceDataAr, maintenanceDataEn } from "@/data/maintenanceData";
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { STORAGE_KEYS } from "@/types/allTypes";
import { StorageManager } from "@/utils/storageHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AlertTexts {
  title: string;
  message: string;
  cancel: string;
  confirm: string;
}

const Setting = () => {
  const [currentKm, setCurrentKm] = useState<number>(0);
  const [newKm, setNewKm] = useState<string>("");
  const { isRTL, directionLoaded, toggleDirection } = useDirectionManager();

  useEffect(() => {
    loadCurrentKm();
  }, []);

  const loadCurrentKm = async () => {
    const km = await StorageManager.getCurrentKm();
    setCurrentKm(km);
  };

  const getAlertTexts = (): AlertTexts => {
    return isRTL
      ? {
          title: "خطأ",
          message: "الرجاء إدخال رقم صحيح",
          cancel: "إلغاء",
          confirm: "تأكيد",
        }
      : {
          title: "Error",
          message: "Please enter a valid number",
          cancel: "Cancel",
          confirm: "Confirm",
        };
  };

  const updateKilometers = async () => {
    const kmNumber = Number(newKm);
    const texts = getAlertTexts();

    if (isNaN(kmNumber)) {
      Alert.alert(texts.title, texts.message);
      return;
    }

    if (kmNumber < currentKm) {
      Alert.alert(
        texts.title,
        isRTL
          ? "لا يمكن إدخال قيمة أقل من العداد الحالي"
          : "Cannot enter a value less than current odometer"
      );
      return;
    }

    try {
      await StorageManager.setCurrentKm(kmNumber);
      setCurrentKm(kmNumber);
      setNewKm("");
      Alert.alert(
        isRTL ? "نجاح" : "Success",
        isRTL ? "تم تحديث عداد المسافات بنجاح" : "Odometer updated successfully"
      );
    } catch (error) {
      Alert.alert(
        texts.title,
        isRTL ? "حدث خطأ أثناء تحديث عداد المسافات" : "Error updating odometer"
      );
    }
  };

  const clearUserTasks = async () => {
    Alert.alert(
      isRTL ? "حذف المهام" : "Delete Tasks",
      isRTL
        ? "هل أنت متأكد من حذف جميع المهام المخصصة؟"
        : "Are you sure you want to delete all custom tasks?",
      [
        { text: isRTL ? "إلغاء" : "Cancel", style: "cancel" },
        {
          text: isRTL ? "حذف" : "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const allTasks = await StorageManager.getMaintenanceData();
              const systemTasks = allTasks.filter(
                (task) => !task.createdByUser
              );
              await StorageManager.saveMaintenanceData(systemTasks);
              Alert.alert(
                isRTL ? "نجاح" : "Success",
                isRTL
                  ? "تم حذف المهام المخصصة بنجاح"
                  : "Custom tasks deleted successfully"
              );
            } catch (error) {
              Alert.alert(
                isRTL ? "خطأ" : "Error",
                isRTL ? "حدث خطأ أثناء حذف المهام" : "Error deleting tasks"
              );
            }
          },
        },
      ]
    );
  };

  const resetAllData = async () => {
    Alert.alert(
      isRTL ? "إعادة تعيين" : "Reset",
      isRTL
        ? "هل أنت متأكد من إعادة تعيين جميع البيانات؟ سيتم حذف جميع السجلات والمهام"
        : "Are you sure you want to reset all data? All records and tasks will be deleted",
      [
        { text: isRTL ? "إلغاء" : "Cancel", style: "cancel" },
        {
          text: isRTL ? "إعادة تعيين" : "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              // Initialize with empty arrays/objects instead of default data
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
              // Initialize maintenance data as empty array
              await StorageManager.saveMaintenanceData([]);
              await AsyncStorage.setItem("isRTL", isRTL.toString());
              setCurrentKm(0);
              setNewKm("");

              Alert.alert(
                isRTL ? "نجاح" : "Success",
                isRTL
                  ? "تم إعادة تعيين جميع البيانات بنجاح"
                  : "All data reset successfully"
              );
            } catch (error) {
              console.error("Reset error:", error);
              Alert.alert(
                isRTL ? "خطأ" : "Error",
                isRTL
                  ? "حدث خطأ أثناء إعادة تعيين البيانات"
                  : "Error resetting data"
              );
            }
          },
        },
      ]
    );
  };

  const loadDefaultTasks = async () => {
    Alert.alert(
      isRTL ? "تحميل المهام الافتراضية" : "Load Default Tasks",
      isRTL
        ? "هل أنت متأكد من تحميل المهام الافتراضية؟"
        : "Are you sure you want to load default tasks?",
      [
        { text: isRTL ? "إلغاء" : "Cancel", style: "cancel" },
        {
          text: isRTL ? "تحميل" : "Load",
          onPress: async () => {
            try {
              const maintenanceData = isRTL
                ? maintenanceDataAr
                : maintenanceDataEn;
              const currentTasks = await StorageManager.getMaintenanceData();
              // Merge default tasks with existing custom tasks
              const mergedTasks = [
                ...currentTasks.filter((task) => task.createdByUser),
                ...maintenanceData,
              ];

              await StorageManager.saveMaintenanceData(mergedTasks);
              Alert.alert(
                isRTL ? "نجاح" : "Success",
                isRTL
                  ? "تم تحميل المهام الافتراضية بنجاح"
                  : "Default tasks loaded successfully"
              );
            } catch (error) {
              console.error("Load default tasks error:", error);
              Alert.alert(
                isRTL ? "خطأ" : "Error",
                isRTL
                  ? "حدث خطأ أثناء تحميل المهام الافتراضية"
                  : "Error loading default tasks"
              );
            }
          },
        },
      ]
    );
  };

  if (!directionLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title={isRTL ? "الإعدادات" : "Settings"}
        subtitle={isRTL ? "إدارة إعدادات التطبيق" : "Manage app settings"}
      />
      <View
        className="flex-1 px-6 py-4"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            {isRTL ? "عداد المسافات الحالي" : "Current Odometer"}
          </Text>
          <Text className="text-3xl font-bold text-violet-600 mb-4">
            {currentKm} {isRTL ? "كم" : "km"}
          </Text>

          <View className="flex-row items-center gap-2">
            <TextInput
              className="flex-1 bg-gray-50 p-2 rounded-lg border border-gray-200"
              style={{ textAlign: isRTL ? "right" : "left" }}
              keyboardType="numeric"
              placeholder={
                isRTL
                  ? "أدخل قراءة العداد الجديدة"
                  : "Enter new odometer reading"
              }
              value={newKm}
              onChangeText={setNewKm}
            />
            <GradientButton
              onPress={updateKilometers}
              title={isRTL ? "تحديث" : "Update"}
              icon="save-outline"
              size="small"
            />
          </View>
        </View>

        <View className="flex-col gap-4">
          <GradientButton
            onPress={toggleDirection}
            title={isRTL ? "switch to English" : "التغير للعربية"}
            icon="swap-horizontal-outline"
            colors={["#10B981", "#059669"]}
          />

          <GradientButton
            onPress={loadDefaultTasks}
            title={isRTL ? "تحميل المهام الافتراضية" : "Load Default Tasks"}
            icon="download-outline"
            colors={["#8B5CF6", "#7C3AED"]}
          />

          <GradientButton
            onPress={resetAllData}
            title={isRTL ? "إعادة تعيين جميع البيانات" : "Reset All Data"}
            icon="refresh-outline"
            colors={["#F87171", "#EF4444"]}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Setting;
