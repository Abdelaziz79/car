import GradientButton from "@/components/GradientButton";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { maintenanceDataAr, maintenanceDataEn } from "@/data/maintenanceData";
import { useCardView } from "@/hooks/useCardView";
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { STORAGE_KEYS } from "@/types/allTypes";
import { exportTasksToCSV, importTasksFromCSV } from "@/utils/import-export";
import { StorageManager } from "@/utils/storageHelpers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Setting = () => {
  const [currentKm, setCurrentKm] = useState<number>(0);
  const [newKm, setNewKm] = useState<string>("");
  const { isRTL, directionLoaded, toggleDirection } = useDirectionManager();
  const { setIsCompactView } = useCardView();

  useEffect(() => {
    loadCurrentKm();
  }, []);

  const loadCurrentKm = async () => {
    const km = await StorageManager.getCurrentKm();
    setCurrentKm(km);
  };

  const updateKilometers = async () => {
    const kmNumber = Number(newKm);
    if (isNaN(kmNumber) || kmNumber < currentKm) {
      Alert.alert(
        isRTL ? "خطأ" : "Error",
        isRTL
          ? "الرجاء إدخال رقم صحيح أكبر من العداد الحالي"
          : "Please enter a valid number greater than current odometer"
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
        isRTL ? "خطأ" : "Error",
        isRTL ? "حدث خطأ أثناء تحديث عداد المسافات" : "Error updating odometer"
      );
    }
  };

  const resetAllData = async () => {
    const resetAction = async () => {
      try {
        await AsyncStorage.clear();
        await Promise.all([
          AsyncStorage.setItem(
            STORAGE_KEYS.MAINTENANCE_HISTORY,
            JSON.stringify({})
          ),
          AsyncStorage.setItem(STORAGE_KEYS.CURRENT_KM, "0"),
          AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_TAGS, JSON.stringify([])),
          AsyncStorage.setItem(
            STORAGE_KEYS.CUSTOM_INTERVALS,
            JSON.stringify([])
          ),
          StorageManager.saveMaintenanceData([]),
          AsyncStorage.setItem("isRTL", isRTL.toString()),
        ]);

        setCurrentKm(0);
        setNewKm("");
        setIsCompactView(false);
        Alert.alert(
          isRTL ? "نجاح" : "Success",
          isRTL
            ? "تم إعادة تعيين جميع البيانات بنجاح"
            : "All data reset successfully"
        );
      } catch (error) {
        Alert.alert(
          isRTL ? "خطأ" : "Error",
          isRTL ? "حدث خطأ أثناء إعادة تعيين البيانات" : "Error resetting data"
        );
      }
    };

    Alert.alert(
      isRTL ? "إعادة تعيين" : "Reset",
      isRTL
        ? "هل أنت متأكد من إعادة تعيين جميع البيانات؟"
        : "Are you sure you want to reset all data?",
      [
        { text: isRTL ? "إلغاء" : "Cancel", style: "cancel" },
        {
          text: isRTL ? "إعادة تعيين" : "Reset",
          style: "destructive",
          onPress: resetAction,
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
              const currentTasks = await StorageManager.getMaintenanceData();
              const defaultTasks = isRTL
                ? maintenanceDataAr
                : maintenanceDataEn;
              const mergedTasks = [
                ...currentTasks.filter((task) => task.createdByUser),
                ...defaultTasks,
              ];
              await StorageManager.saveMaintenanceData(mergedTasks);
              Alert.alert(
                isRTL ? "نجاح" : "Success",
                isRTL
                  ? "تم تحميل المهام الافتراضية بنجاح"
                  : "Default tasks loaded successfully"
              );
            } catch (error) {
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

  const handleOpenLink = (page: "privacy" | "terms" | "about") => {
    const lang = isRTL ? "ar" : "en";
    const urls = {
      privacy: `https://maintainx-azeez.vercel.app/${lang}/privacy`,
      terms: `https://maintainx-azeez.vercel.app/${lang}/terms`,
      about: `https://maintainx-azeez.vercel.app/${lang}/about`,
    };
    Linking.openURL(urls[page]);
  };

  if (!directionLoaded) return <Loading />;

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title={isRTL ? "الإعدادات" : "Settings"}
        subtitle={isRTL ? "إدارة إعدادات التطبيق" : "Manage app settings"}
        variant="secondary"
      />
      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="py-4"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="bg-white rounded-2xl p-6 mb-6 shadow-sm"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <Text className="text-lg font-bold text-gray-800 mb-2">
            {isRTL ? "عداد المسافات الحالي" : "Current Odometer"}
          </Text>
          <View className="flex-row items-baseline mb-4">
            <Text className="text-4xl font-bold text-violet-600">
              {currentKm}
            </Text>
            <Text className="text-lg text-violet-400 mx-1">
              {isRTL ? "كم" : "km"}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <TextInput
              className="flex-1 bg-gray-50 p-2 rounded-xl border border-gray-200"
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
              variant="primary"
            />
          </View>
        </View>

        <View className="flex-col gap-y-3">
          <GradientButton
            onPress={toggleDirection}
            title={isRTL ? "Switch to English" : "التغير للعربية"}
            icon="language-outline"
            variant="secondary"
          />
          <GradientButton
            onPress={loadDefaultTasks}
            title={isRTL ? "تحميل المهام الافتراضية" : "Load Default Tasks"}
            icon="download-outline"
            variant="secondary"
          />
          <GradientButton
            onPress={() => exportTasksToCSV(isRTL)}
            title={isRTL ? "تصدير المهام" : "Export Tasks"}
            icon="share-outline"
            variant="secondary"
          />
          <GradientButton
            onPress={() => importTasksFromCSV(isRTL)}
            title={isRTL ? "استيراد المهام" : "Import Tasks"}
            icon="folder-open-outline"
            variant="secondary"
          />
          <GradientButton
            onPress={resetAllData}
            title={isRTL ? "إعادة تعيين جميع البيانات" : "Reset All Data"}
            icon="trash-outline"
            variant="danger"
          />

          {/* New links section */}
          <View className="mt-4" style={{ direction: isRTL ? "rtl" : "ltr" }}>
            <Text className="text-lg font-bold text-gray-800 mb-2">
              {isRTL ? "روابط مهمة" : "Important Links"}
            </Text>
            <View className="flex-col gap-y-3">
              <GradientButton
                onPress={() => handleOpenLink("privacy")}
                title={isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
                icon="shield-outline"
                variant="secondary"
              />
              <GradientButton
                onPress={() => handleOpenLink("terms")}
                title={isRTL ? "شروط الاستخدام" : "Terms of Service"}
                icon="document-text-outline"
                variant="secondary"
              />
              <GradientButton
                onPress={() => handleOpenLink("about")}
                title={isRTL ? "من نحن" : "About Us"}
                icon="information-circle-outline"
                variant="secondary"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;
