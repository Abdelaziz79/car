import { useDirectionManager } from "@/hooks/useDirectionManager";
import { formatDate } from "@/utils/dateFormatter";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

interface DateRange {
  startDate: Date;
  endDate: Date;
  allTime: boolean;
}

interface DateRangeSelectorProps {
  initialDateRange?: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  initialDateRange,
  onDateRangeChange,
}) => {
  const { isRTL } = useDirectionManager();
  const [fadeAnim] = useState(new Animated.Value(1));

  const [dateRange, setDateRange] = useState<DateRange>(
    initialDateRange || {
      startDate: new Date(new Date().getFullYear(), 0, 1),
      endDate: new Date(),
      allTime: true,
    }
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const handleDateChange = (
    type: "start" | "end",
    _event: any,
    selectedDate: Date | undefined
  ) => {
    const setShowPicker =
      type === "start" ? setShowStartDatePicker : setShowEndDatePicker;
    setShowPicker(false);

    if (selectedDate) {
      const newDateRange = {
        ...dateRange,
        [type === "start" ? "startDate" : "endDate"]: selectedDate,
        allTime: false,
      };

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      setDateRange(newDateRange);
      onDateRangeChange(newDateRange);
    }
  };

  const handleAllTimeSelect = () => {
    const newDateRange = { ...dateRange, allTime: !dateRange.allTime };
    setDateRange(newDateRange);
    onDateRangeChange(newDateRange);
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        direction: isRTL ? "rtl" : "ltr",
      }}
      className="bg-white rounded-lg shadow-sm p-4 mb-4"
    >
      <TouchableOpacity
        className="flex-row items-center justify-between mb-4 p-2 bg-slate-50 rounded-md"
        onPress={handleAllTimeSelect}
      >
        <View
          className="flex-row items-center gap-x-2"
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          <Text className="font-semibold text-slate-700">
            {isRTL ? "كل الوقت" : "All Time"}
          </Text>
        </View>
        <View
          className={`w-5 h-5 rounded-md items-center justify-center ${
            dateRange.allTime ? "bg-indigo-600" : "border-2 border-slate-300"
          }`}
        >
          {dateRange.allTime && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </View>
      </TouchableOpacity>

      <View className={`gap-y-3 ${dateRange.allTime ? "hidden" : "flex"}`}>
        <TouchableOpacity
          className="flex-row items-center justify-between p-3 bg-slate-50 rounded-md"
          onPress={() => setShowStartDatePicker(true)}
          disabled={dateRange.allTime}
        >
          <View
            className="flex-row items-center gap-x-2"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            <Ionicons name="calendar-outline" size={18} color="#475569" />
            <Text className="font-medium text-slate-700">
              {isRTL ? "من: " : "From: "}
              {formatDate(
                dateRange.startDate.toString(),
                isRTL ? "ar-SA" : "en-US"
              )}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between p-3 bg-slate-50 rounded-md"
          onPress={() => setShowEndDatePicker(true)}
          disabled={dateRange.allTime}
        >
          <View
            className="flex-row items-center gap-x-2"
            style={{ direction: isRTL ? "rtl" : "ltr" }}
          >
            <Ionicons name="calendar-outline" size={18} color="#475569" />
            <Text className="font-medium text-slate-700">
              {isRTL ? "إلى: " : "To: "}
              {formatDate(
                dateRange.endDate.toString(),
                isRTL ? "ar-SA" : "en-US"
              )}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={dateRange.startDate}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange("start", event, date)}
          maximumDate={dateRange.endDate}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={dateRange.endDate}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange("end", event, date)}
          minimumDate={dateRange.startDate}
        />
      )}
    </Animated.View>
  );
};

export default DateRangeSelector;
