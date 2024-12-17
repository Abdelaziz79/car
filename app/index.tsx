import GradientButton from "@/components/GradientButton";
import GradientFAB from "@/components/GradientFAB";
import Header from "@/components/Header";
import { MaintenanceCard } from "@/components/MaintenanceCard";
import { maintenanceData } from "@/data/maintenanceData";
import { MaintenanceItem, MaintenanceStatus } from "@/types/allTypes";
import { calculateNextDate } from "@/utils/maintenanceHelpers";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [selectedFilter, setSelectedFilter] =
    useState<MaintenanceStatus>("all");
  const [currentKm, setCurrentKm] = useState(0);
  const [maintenanceItems, setMaintenanceItems] =
    useState<MaintenanceItem[]>(maintenanceData);
  const [selectedItem, setSelectedItem] = useState<MaintenanceItem | null>(
    null
  );

  const filterOptions: {
    value: MaintenanceStatus;
    label: string;
    color: string;
  }[] = [
    { value: "all", label: "الكل", color: "bg-slate-500" },
    { value: "upcoming", label: "القادمة", color: "bg-sky-500" },
    { value: "completed", label: "المكتملة", color: "bg-teal-500" },
    { value: "overdue", label: "متأخرة", color: "bg-rose-500" },
  ];
  const navigate = useRouter();

  const handleComplete = (id: string) => {
    setMaintenanceItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newItem = { ...item };
          if (item.type === "time-based" && item.interval) {
            newItem.lastDate = new Date().toISOString().split("T")[0];
            newItem.nextDate = calculateNextDate(
              newItem.lastDate,
              item.interval
            );
          } else if (item.type === "distance-based" && item.kilometers) {
            newItem.lastKm = currentKm;
            newItem.nextKm = currentKm + item.kilometers;
          }
          newItem.status = "completed";
          return newItem;
        }
        return item;
      })
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <Header
        title="نظام صيانة السيارة"
        subtitle="تتبع صيانة سيارتك بسهولة وفعالية"
      />
      {/* Filters */}
      <View className="px-4 py-3 bg-white shadow-sm">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              onPress={() => setSelectedFilter(filter.value)}
              className={`px-4 py-2 rounded-xl border ml-2  ${
                selectedFilter === filter.value
                  ? `${filter.color} border-transparent `
                  : "border-gray-200 bg-white "
              }`}
            >
              <Text
                className={`${
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
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 pt-4">
        {maintenanceItems
          .filter(
            (item) => selectedFilter === "all" || item.status === selectedFilter
          )
          .map((item) => (
            <MaintenanceCard
              key={item.id}
              item={item}
              onPress={setSelectedItem}
              onComplete={handleComplete}
            />
          ))}
      </ScrollView>

      {/* FAB */}
      <GradientFAB
        onPress={() => {
          navigate.push("/add");
        }}
      />

      {/* Detail Modal */}
      <Modal
        visible={!!selectedItem}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedItem(null)}
      >
        <View className="flex-1 justify-end bg-black/30">
          <View className="bg-white rounded-t-3xl p-6">
            {/* Modal Header */}
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
              <>
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
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
