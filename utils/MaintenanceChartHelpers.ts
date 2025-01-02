import {
  DateRange,
  MaintenanceItem,
  MaintenanceRecord,
  MaintenanceType,
  Tags,
} from "@/types/allTypes";
import { format } from "date-fns";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

interface DailyMaintenanceCount {
  date: string;
  count: number;
}

interface ChartConfig {
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  color: (opacity?: number) => string;
  labelColor: (opacity?: number) => string;
}

interface PieChartData {
  name: string;
  cost: number;
  color: string;
  legendFontColor: string;
}

interface ChartDataset {
  labels: string[];
  datasets: Array<{ data: number[] }>;
}

interface TypeCosts {
  "time-based": number;
  "distance-based": number;
  undefined: number;
}

export const ChartHelpers = {
  baseChartConfig: {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  } as ChartConfig,

  getChartDimensions() {
    return {
      width: screenWidth - 32,
      height: 220,
    };
  },

  // Cost Analysis Helpers
  getCostAnalysisData(data: MaintenanceItem[]): PieChartData[] {
    const costsByType = this.getCostsByType(data);
    return Object.entries(costsByType).map(([name, value]) => ({
      name: this.formatTypeName(name as MaintenanceType),
      cost: value,
      color: this.getColorByType(name as MaintenanceType),
      legendFontColor: "#666666",
    }));
  },

  formatTypeName(type: MaintenanceType): string {
    const nameMap: Record<MaintenanceType, string> = {
      "time-based": "Time Based",
      "distance-based": "Distance Based",
      undefined: "Undefined",
    };
    return nameMap[type] || "Undefined";
  },

  getCostsByType(data: MaintenanceItem[]): TypeCosts {
    const initialCosts: TypeCosts = {
      "time-based": 0,
      "distance-based": 0,
      undefined: 0,
    };

    return data.reduce((acc, item) => {
      const history = item.completionHistory || [];
      const totalCost = history.reduce(
        (sum, record) => sum + (record.cost || 0),
        0
      );
      acc[item.type] = (acc[item.type] || 0) + totalCost;
      return acc;
    }, initialCosts);
  },

  getColorByType(type: MaintenanceType): string {
    const colorMap: Record<MaintenanceType, string> = {
      "time-based": "#4F46E5",
      "distance-based": "#10B981",
      undefined: "#EF4444",
    };
    return colorMap[type];
  },

  // Monthly Trend Helpers
  getMonthlyTrendData(data: MaintenanceItem[]): ChartDataset {
    const monthlyData: Record<string, number> = {};

    data.forEach((item) => {
      (item.completionHistory || []).forEach((record) => {
        const date = new Date(record.completionDate);
        const month = format(date, "MMM");
        monthlyData[month] = (monthlyData[month] || 0) + (record.cost || 0);
      });
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const monthsOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return monthsOrder.indexOf(a) - monthsOrder.indexOf(b);
    });

    return {
      labels: sortedMonths,
      datasets: [{ data: sortedMonths.map((month) => monthlyData[month]) }],
    };
  },

  // Task Frequency Helpers
  getTaskFrequencyData(tasksWithHistory: MaintenanceItem[]): ChartDataset {
    const taskCompletionRate = tasksWithHistory.reduce<Record<string, number>>(
      (acc, task) => {
        const completions = task.completionHistory?.length || 0;
        // Truncate long titles and add ellipsis
        const truncatedTitle =
          task.title.length > 10
            ? `${task.title.substring(0, 7)}...`
            : task.title;
        acc[truncatedTitle] = completions;
        return acc;
      },
      {}
    );

    return {
      labels: Object.keys(taskCompletionRate),
      datasets: [{ data: Object.values(taskCompletionRate) }],
    };
  },

  // Date Range Helpers
  isWithinDateRange(date: Date, dateRange: DateRange): boolean {
    return (
      dateRange.allTime ||
      (date >= dateRange.startDate && date <= dateRange.endDate)
    );
  },

  getDailyMaintenanceCount(
    tasks: MaintenanceItem[],
    dateRange: DateRange
  ): DailyMaintenanceCount[] {
    const dailyCount: Record<string, number> = {};

    tasks.forEach((task) => {
      (task.completionHistory || []).forEach((record) => {
        const date = new Date(record.completionDate);
        if (!this.isWithinDateRange(date, dateRange)) return;

        const dateKey = format(date, "yyyy-MM-dd");
        dailyCount[dateKey] = (dailyCount[dateKey] || 0) + 1;
      });
    });

    return Object.entries(dailyCount)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  // Additional Helper Functions
  getTagStatistics(data: MaintenanceItem[]): Record<Tags, number> {
    const tagStats: Record<string, number> = {};

    data.forEach((item) => {
      (item.tags || []).forEach((tag) => {
        const completions = item.completionHistory?.length || 0;
        tagStats[tag] = (tagStats[tag] || 0) + completions;
      });
    });

    return tagStats as Record<Tags, number>;
  },

  getCostByDateRange(
    data: MaintenanceItem[],
    dateRange: DateRange
  ): Record<string, number> {
    const costsByDate: Record<string, number> = {};

    data.forEach((item) => {
      (item.completionHistory || []).forEach((record) => {
        const date = new Date(record.completionDate);
        if (!this.isWithinDateRange(date, dateRange)) return;

        const dateKey = format(date, "yyyy-MM-dd");
        costsByDate[dateKey] = (costsByDate[dateKey] || 0) + (record.cost || 0);
      });
    });

    return costsByDate;
  },

  getAverageCostByType(
    data: MaintenanceItem[]
  ): Record<MaintenanceType, number> {
    const costsByType = this.getCostsByType(data);
    const countByType = data.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<MaintenanceType, number>);

    return Object.entries(costsByType).reduce((acc, [type, totalCost]) => {
      const count = countByType[type as MaintenanceType] || 1;
      acc[type as MaintenanceType] = totalCost / count;
      return acc;
    }, {} as Record<MaintenanceType, number>);
  },
};
