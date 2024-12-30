import {
  FilterState,
  MaintenanceInterval,
  MaintenanceItem,
  Tags,
} from "@/types/allTypes";
import { formatIntervalDisplay } from "@/utils/storageHelpers";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  maintenanceItems: MaintenanceItem[];
  setFilteredItems: (items: MaintenanceItem[]) => void;
  isRTL: boolean;
  directionLoaded: boolean;
}

export default function FilterModal({
  visible,
  onClose,
  maintenanceItems,
  setFilteredItems,
  isRTL,
  directionLoaded,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    tags: [],
    interval: undefined,
    kilometers: undefined,
  });

  const getText = (key: string): string => {
    const textMap: { [key: string]: string } = {
      filter: isRTL ? "تصفية" : "Filter",
      noFilter: isRTL ? "لا توجد عناصر للتصفية" : "No items to filter",
      close: isRTL ? "إغلاق" : "Close",
      reset: isRTL ? "إعادة تعيين" : "Reset",
      tags: isRTL ? "التصنيفات" : "Tags",
      interval: isRTL ? "الفترة" : "Interval",
      distance: isRTL ? "المسافة" : "Distance",
      cancel: isRTL ? "إلغاء" : "Cancel",
      apply: isRTL ? "تطبيق" : "Apply",
      noTasksMatch: isRTL
        ? "لا توجد مهام تطابق البحث الخاص بك"
        : "No tasks match your search",
    };
    return textMap[key] || key;
  };

  const handleFilterApply = useCallback(
    (filters: FilterState) => {
      const filtered = maintenanceItems.filter((item) => {
        const hasMatchingTag =
          filters.tags.length === 0 ||
          filters.tags.some((tag) => item.tags?.includes?.(tag));

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
        Alert.alert(getText("filter"), getText("noTasksMatch"));
        setFilteredItems([]);
        resetFilters();
      } else {
        setFilteredItems(filtered);
      }
    },
    [maintenanceItems]
  );
  // Extract unique values from items
  const uniqueValues = useMemo(() => {
    const tags = new Set<Tags>();
    const intervals = new Set<MaintenanceInterval>();
    const distances = new Set<number>();

    maintenanceItems.forEach((item) => {
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
  }, [maintenanceItems]);

  const toggleTag = (tag: Tags) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes?.(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const toggleInterval = (interval: MaintenanceInterval) => {
    setFilters((prev) => ({
      ...prev,
      interval: prev.interval === interval ? undefined : interval,
      kilometers: undefined, // Clear kilometers when interval is selected
    }));
  };

  const toggleKilometers = (km: number) => {
    setFilters((prev) => ({
      ...prev,
      kilometers: prev.kilometers === km ? undefined : km,
      interval: undefined, // Clear interval when kilometers is selected
    }));
  };

  const resetFilters = () => {
    setFilters({
      tags: [],
      interval: undefined,
      kilometers: undefined,
    });
  };

  const hasAnyFilters =
    uniqueValues.tags.length > 0 ||
    uniqueValues.intervals.length > 0 ||
    uniqueValues.distances.length > 0;

  if (!directionLoaded) {
    return null;
  }

  if (!hasAnyFilters) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View
          className="flex-1 bg-black/50"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <View className="bg-white rounded-t-3xl mt-auto p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text
                className="text-xl font-bold"
                style={{
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {getText("filter")}
              </Text>
            </View>
            <View className="items-center justify-center py-8">
              <Text
                className="text-gray-500 text-lg"
                style={{
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {getText("noFilter")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="py-3 rounded-lg bg-violet-600"
            >
              <Text
                className="text-center text-white font-medium"
                style={{
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {getText("close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        className="flex-1 bg-black/50"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <View className="bg-white rounded-t-3xl mt-auto p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text
              className="text-xl font-bold"
              style={{
                writingDirection: isRTL ? "rtl" : "ltr",
              }}
            >
              {getText("filter")}
            </Text>
            <TouchableOpacity onPress={resetFilters}>
              <View className="flex-row items-center gap-1">
                <Ionicons name="refresh" size={16} color="#8B5CF6" />
                <Text className="text-violet-600">{getText("reset")}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-[70vh]">
            {/* Tags Filter */}
            {uniqueValues.tags.length > 0 && (
              <View className="mb-6">
                <Text
                  className="text-lg font-bold mb-3"
                  style={{
                    writingDirection: isRTL ? "rtl" : "ltr",
                  }}
                >
                  {getText("tags")}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {uniqueValues.tags.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full border ${
                        filters.tags.includes?.(tag)
                          ? "bg-violet-500 border-violet-500"
                          : "border-gray-300"
                      }`}
                    >
                      <View
                        className="flex-row items-center"
                        style={
                          isRTL
                            ? { flexDirection: "row-reverse" }
                            : { flexDirection: "row" }
                        }
                      >
                        <Ionicons
                          name="pricetag"
                          size={16}
                          color={`${
                            filters.tags.includes?.(tag) ? "#ffffff" : "#8B5CF6"
                          }`}
                        />
                        <Text
                          className={`${
                            filters.tags.includes?.(tag)
                              ? "text-white"
                              : "text-gray-700"
                          } mx-2 font-medium`}
                          style={{
                            writingDirection: isRTL ? "rtl" : "ltr",
                          }}
                        >
                          {tag}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Dynamic Time/Distance Based Filters */}
            {uniqueValues.intervals.length > 0 && (
              <View className="mb-6">
                <Text
                  className="text-lg font-bold mb-3"
                  style={{
                    writingDirection: isRTL ? "rtl" : "ltr",
                  }}
                >
                  {getText("interval")}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {uniqueValues.intervals.map((interval) => (
                    <TouchableOpacity
                      key={interval}
                      onPress={() => toggleInterval(interval)}
                      className={`px-4 py-2 rounded-full border ${
                        filters.interval === interval
                          ? "bg-violet-500 border-violet-500"
                          : `border-gray-300 ${
                              filters.kilometers !== undefined
                                ? "opacity-50"
                                : ""
                            }`
                      }`}
                      disabled={filters.kilometers !== undefined}
                    >
                      <Text
                        className={
                          filters.interval === interval
                            ? "text-white"
                            : "text-gray-700"
                        }
                        style={{
                          writingDirection: isRTL ? "rtl" : "ltr",
                        }}
                      >
                        {formatIntervalDisplay(interval, isRTL ? "ar" : "en")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {uniqueValues.distances.length > 0 && (
              <View className="mb-6">
                <Text
                  className="text-lg font-bold mb-3"
                  style={{
                    writingDirection: isRTL ? "rtl" : "ltr",
                  }}
                >
                  {getText("distance")}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {uniqueValues.distances.map((km) => (
                    <TouchableOpacity
                      key={km}
                      onPress={() => toggleKilometers(km)}
                      className={`px-4 py-2 rounded-full border ${
                        filters.kilometers === km
                          ? "bg-violet-500 border-violet-500"
                          : `border-gray-300 ${
                              filters.interval !== undefined ? "opacity-50" : ""
                            }`
                      }`}
                      disabled={filters.interval !== undefined}
                    >
                      <Text
                        className={
                          filters.kilometers === km
                            ? "text-white"
                            : "text-gray-700"
                        }
                        style={{
                          writingDirection: isRTL ? "rtl" : "ltr",
                        }}
                      >
                        {km.toString()} {isRTL ? "كم" : "km"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row gap-4 mt-6">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 py-3 rounded-lg border border-gray-300"
            >
              <Text
                className="text-center text-gray-700 font-medium"
                style={{
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {getText("cancel")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleFilterApply(filters);
                onClose();
              }}
              className="flex-1 py-3 rounded-lg bg-violet-600"
            >
              <Text
                className="text-center text-white font-medium"
                style={{
                  writingDirection: isRTL ? "rtl" : "ltr",
                }}
              >
                {getText("apply")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
