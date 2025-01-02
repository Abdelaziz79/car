import { formatDate } from "@/utils/dateFormatter";
import { Ionicons } from "@expo/vector-icons";
import {
  addDays,
  addMonths,
  differenceInDays,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
  subMonths,
} from "date-fns";
import React, { useEffect, useState } from "react";
import { Text, ToastAndroid, TouchableOpacity, View } from "react-native";

interface HeatmapProps {
  data: Array<{ date: string; count: number }>;
  colorScale?: string[];
  isRTL?: boolean;
  onDayPress?: (date: string, count: number) => void;
  dateRange: {
    startDate: Date;
    endDate: Date;
    allTime: boolean;
  };
}

const defaultColorScale = [
  "#f3f4f6",
  "#bbd9ff",
  "#59a7ff",
  "#166fff",
  "#0039d6",
  "#002eb0",
  "#00238a",
  "#001964",
];

export const Heatmap: React.FC<HeatmapProps> = ({
  data,
  colorScale = defaultColorScale,
  isRTL = false,
  onDayPress,
  dateRange,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getColor = (count: number): string => {
    if (count === 0) return colorScale[0];
    if (count === 1) return colorScale[1];
    if (count === 2) return colorScale[2];
    if (count === 3) return colorScale[3];
    if (count === 4) return colorScale[4];
    if (count === 5) return colorScale[5];
    return colorScale[6];
  };

  const calculateDays = (baseDate: Date) => {
    const firstDayOfMonth = startOfMonth(baseDate);
    const lastDayOfMonth = endOfMonth(baseDate);
    const totalDays = differenceInDays(lastDayOfMonth, firstDayOfMonth) + 1;

    const days = Array.from({ length: totalDays }, (_, i) =>
      addDays(firstDayOfMonth, i)
    ).filter((day) => isSameMonth(day, baseDate));

    return days.map((day: Date) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dataPoint = data.find((d) => d.date === dateStr);
      return {
        date: dateStr,
        count: dataPoint ? dataPoint.count : 0,
        fullDate: day,
      };
    });
  };

  const handleDayPress = (date: string, count: number) => {
    if (onDayPress) {
      onDayPress(date, count);
    } else {
      ToastAndroid.show(
        `${formatDate(date, isRTL ? "ar-SA" : "en-US")}: ${
          isRTL ? count.toLocaleString() : count
        } ${isRTL ? "صيانات" : "maintenances"}`,
        ToastAndroid.SHORT
      );
    }
  };

  const navigateMonth = (direction: "next" | "prev") => {
    setCurrentDate((prev) =>
      direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)
    );
  };

  useEffect(() => {
    if (!dateRange.allTime) {
      setCurrentDate(dateRange.startDate);
    }
  }, [dateRange]);

  const days = calculateDays(currentDate);

  function getPrevDisabled(currentDate: Date, startDate: Date) {
    if (!dateRange.allTime) {
      return subMonths(currentDate, 1) < startDate;
    }
    return false;
  }

  function getNextDisabled(currentDate: Date, endDate: Date) {
    if (!dateRange.allTime) {
      return addMonths(currentDate, 1) > endDate;
    }
    return false;
  }

  return (
    <View className="flex-1">
      <View
        className="flex-row items-center justify-between mb-4 px-2"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <TouchableOpacity
          onPress={() => navigateMonth("prev")}
          disabled={
            getPrevDisabled(currentDate, dateRange.startDate) ? true : false
          }
          className={`p-2 border border-gray-200 rounded-lg ${
            getPrevDisabled(currentDate, dateRange.startDate)
              ? "opacity-20"
              : ""
          }`}
        >
          {isRTL ? (
            <Ionicons name="chevron-forward" size={24} color="#000000" />
          ) : (
            <Ionicons name="chevron-back" size={24} color="#000000" />
          )}
        </TouchableOpacity>
        <Text className="text-lg font-semibold">
          {formatDate(currentDate.toString(), isRTL ? "ar-SA" : "en-US", {
            year: "numeric",
            month: "long",
          })}
        </Text>
        <TouchableOpacity
          onPress={() => navigateMonth("next")}
          disabled={
            getNextDisabled(currentDate, dateRange.endDate) ? true : false
          }
          className={`p-2 border border-gray-200 rounded-lg ${
            getNextDisabled(currentDate, dateRange.endDate) ? "opacity-20" : ""
          }`}
        >
          {isRTL ? (
            <Ionicons name="chevron-back" size={24} color="#000000" />
          ) : (
            <Ionicons name="chevron-forward" size={24} color="#000000" />
          )}
        </TouchableOpacity>
      </View>

      <View className="border border-gray-200 rounded-lg p-4">
        <View className="flex-row flex-wrap ">
          {days.map((day, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDayPress(day.date, day.count)}
              className="m-0.5"
            >
              <View
                className="w-8 h-8 rounded"
                style={{ backgroundColor: getColor(day.count) }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Heatmap;
