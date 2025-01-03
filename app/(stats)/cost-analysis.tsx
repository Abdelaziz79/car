import RenderChart from "@/components/charts/RenderChart";
import RenderSummary from "@/components/charts/RenderSummary";
import DateRangeSelector from "@/components/DateRangeSelector";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import { useDirectionManager } from "@/hooks/useDirectionManager";
import { ChartView, DateRange, MaintenanceItem } from "@/types/allTypes";
import { MaintenanceStats } from "@/utils/statsHelpers";
import { StorageManager } from "@/utils/storageHelpers";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CostAnalysisComp() {
  const [data, setData] = useState<MaintenanceItem[]>([]);
  const [selectedView, setSelectedView] = useState<ChartView>("type");
  const [loading, setLoading] = useState(true);
  const { isRTL, directionLoaded } = useDirectionManager();
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(),
    allTime: true,
  });

  useEffect(() => {
    StorageManager.getMaintenanceData().then((items) => {
      setData(items);
      setLoading(false);
    });
  }, []);

  if (loading || !directionLoaded) {
    return <Loading />;
  }

  const records = MaintenanceStats.getRecords(data);

  // Get filtered records based on date range
  const filteredRecords = records.filter((record) => {
    if (dateRange.allTime) return true;
    const recordDate = new Date(record.completionDate);
    return recordDate >= dateRange.startDate && recordDate <= dateRange.endDate;
  });

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <Header
        title={isRTL ? "تحليل التكلفة" : "Cost Analysis"}
        subtitle={isRTL ? "تحليل تفصيلي للتكاليف" : "Detailed Cost Analysis"}
        variant="secondary"
      />

      {data && data.length !== 0 ? (
        <ScrollView className="flex-1 p-4">
          <DateRangeSelector
            onDateRangeChange={setDateRange}
            initialDateRange={dateRange}
          />
          <RenderSummary filteredRecords={filteredRecords} isRTL={isRTL} />
          <RenderViewFilter
            setSelectedView={setSelectedView}
            selectedView={selectedView}
            isRTL={isRTL}
          />

          <RenderChart
            data={data}
            filteredRecords={filteredRecords}
            isRTL={isRTL}
            selectedView={selectedView}
          />
        </ScrollView>
      ) : (
        <View>
          <Text className="text-center text-gray-600 mt-4">
            {isRTL ? "لا يوجد بيانات" : "No data available"}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const RenderViewFilter = ({
  isRTL,
  setSelectedView,
  selectedView,
}: {
  isRTL: boolean;
  setSelectedView: (view: "type" | "daily" | "monthly") => void;
  selectedView: "type" | "daily" | "monthly";
}) => {
  const getViewLabel = (view: "type" | "daily" | "monthly") => {
    const labels = {
      type: { ar: "النوع", en: "Type" },
      daily: { ar: "يومي", en: "Daily" },
      monthly: { ar: "شهري", en: "Monthly" },
    };
    return isRTL ? labels[view].ar : labels[view].en;
  };

  return (
    <View
      className="flex-row justify-center flex-wrap gap-3 p-4 bg-white rounded-lg"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      {(["type", "daily", "monthly"] as const).map((view) => (
        <TouchableOpacity
          key={view}
          onPress={() => setSelectedView(view)}
          className="rounded-full"
          style={{ overflow: "hidden" }}
        >
          <View
            className={`px-6 py-2 ${
              selectedView === view ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-base font-medium ${
                selectedView === view ? "text-white" : "text-gray-700"
              }`}
            >
              {getViewLabel(view)}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};
