import {
  FilterState,
  MaintenanceInterval,
  MaintenanceItem,
  MaintenanceType,
  Tags,
} from "@/types/allTypes";
import React, { useMemo, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  type: MaintenanceType;
  items: MaintenanceItem[];
}

export default function FilterModal({
  visible,
  onClose,
  onApply,
  type,
  items,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    tags: [],
    interval: undefined,
    kilometers: undefined,
  });

  // Extract unique values from items
  const uniqueValues = useMemo(() => {
    const tags = new Set<Tags>();
    const intervals = new Set<MaintenanceInterval>();
    const distances = new Set<number>();

    items.forEach((item) => {
      // Collect tags
      item.tags?.forEach((tag) => tags.add(tag));

      // Collect intervals
      if (item.interval) {
        intervals.add(item.interval);
      }

      // Collect distances
      if (item.kilometers) {
        distances.add(item.kilometers);
      }
    });

    return {
      tags: Array.from(tags),
      intervals: Array.from(intervals),
      distances: Array.from(distances).sort((a, b) => a - b),
    };
  }, [items]);

  const toggleTag = (tag: Tags) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const toggleInterval = (interval: MaintenanceInterval) => {
    setFilters((prev) => ({
      ...prev,
      interval: prev.interval === interval ? undefined : interval,
    }));
  };

  const toggleKilometers = (km: number) => {
    setFilters((prev) => ({
      ...prev,
      kilometers: prev.kilometers === km ? undefined : km,
    }));
  };

  const resetFilters = () => {
    setFilters({ tags: [], interval: undefined, kilometers: undefined });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50">
        <View className="bg-white rounded-t-3xl mt-auto p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold">تصفية</Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text className="text-violet-600">إعادة تعيين</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-[70vh]">
            {/* Tags Filter */}
            {uniqueValues.tags.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-bold mb-3">التصنيفات</Text>
                <View className="flex-row flex-wrap gap-2">
                  {uniqueValues.tags.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full border ${
                        filters.tags.includes(tag)
                          ? "bg-violet-500 border-violet-500"
                          : "border-gray-300"
                      }`}
                    >
                      <Text
                        className={
                          filters.tags.includes(tag)
                            ? "text-white"
                            : "text-gray-700"
                        }
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Dynamic Time/Distance Based Filters */}
            {type === "time-based" && uniqueValues.intervals.length > 0 ? (
              <View className="mb-6">
                <Text className="text-lg font-bold mb-3">الفترة</Text>
                <View className="flex-row flex-wrap gap-2">
                  {uniqueValues.intervals.map((interval) => (
                    <TouchableOpacity
                      key={interval}
                      onPress={() => toggleInterval(interval)}
                      className={`px-4 py-2 rounded-full border ${
                        filters.interval === interval
                          ? "bg-violet-500 border-violet-500"
                          : "border-gray-300"
                      }`}
                    >
                      <Text
                        className={
                          filters.interval === interval
                            ? "text-white"
                            : "text-gray-700"
                        }
                      >
                        {interval}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : type === "distance-based" &&
              uniqueValues.distances.length > 0 ? (
              <View className="mb-6">
                <Text className="text-lg font-bold mb-3">المسافة</Text>
                <View className="flex-row flex-wrap gap-2">
                  {uniqueValues.distances.map((km) => (
                    <TouchableOpacity
                      key={km}
                      onPress={() => toggleKilometers(km)}
                      className={`px-4 py-2 rounded-full border ${
                        filters.kilometers === km
                          ? "bg-violet-500 border-violet-500"
                          : "border-gray-300"
                      }`}
                    >
                      <Text
                        className={
                          filters.kilometers === km
                            ? "text-white"
                            : "text-gray-700"
                        }
                      >
                        {km.toLocaleString()} كم
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : null}
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row gap-4 mt-6">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 py-3 rounded-lg border border-gray-300"
            >
              <Text className="text-center text-gray-700 font-medium">
                إلغاء
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onApply(filters);
                onClose();
              }}
              className="flex-1 py-3 rounded-lg bg-violet-600"
            >
              <Text className="text-center text-white font-medium">تطبيق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
