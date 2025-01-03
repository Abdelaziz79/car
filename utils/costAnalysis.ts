import {
  MaintenanceItem,
  MaintenanceRecord,
  MaintenanceType,
  Tags,
} from "@/types/allTypes";

interface DailyCosts {
  date: string;
  cost: number;
  count: number;
  types: Record<MaintenanceType, number>;
  tags: Record<string, number>;
}

interface MonthlyCosts {
  month: string;
  cost: number;
  count: number;
  types: Record<MaintenanceType, number>;
  tags: Record<string, number>;
}

interface YearlyCosts {
  year: string;
  cost: number;
  count: number;
  types: Record<MaintenanceType, number>;
  tags: Record<string, number>;
}

export const CostAnalysis = {
  getDailyCosts: (records: MaintenanceRecord[]): DailyCosts[] => {
    if (!records?.length) return [];

    const dailyCosts: Record<string, DailyCosts> = {};

    records.forEach((record) => {
      const date = new Date(record.completionDate).toISOString().split("T")[0];

      if (!dailyCosts[date]) {
        dailyCosts[date] = {
          date,
          cost: 0,
          count: 0,
          types: {
            "time-based": 0,
            "distance-based": 0,
            undefined: 0,
          },
          tags: {},
        };
      }

      dailyCosts[date].cost += record.cost || 0;
      dailyCosts[date].count += 1;
      if (record.type) {
        dailyCosts[date].types[record.type] += record.cost || 0;
      }
    });

    return Object.values(dailyCosts).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  },

  getMonthlyCosts: (records: MaintenanceRecord[]): MonthlyCosts[] => {
    if (!records?.length) return [];

    const monthlyCosts: Record<string, MonthlyCosts> = {};

    records.forEach((record) => {
      const date = new Date(record.completionDate);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyCosts[monthKey]) {
        monthlyCosts[monthKey] = {
          month: monthKey,
          cost: 0,
          count: 0,
          types: {
            "time-based": 0,
            "distance-based": 0,
            undefined: 0,
          },
          tags: {},
        };
      }

      monthlyCosts[monthKey].cost += record.cost || 0;
      monthlyCosts[monthKey].count += 1;
      if (record.type) {
        monthlyCosts[monthKey].types[record.type] += record.cost || 0;
      }
    });

    return Object.values(monthlyCosts).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  },

  getYearlyCosts: (records: MaintenanceRecord[]): YearlyCosts[] => {
    if (!records?.length) return [];

    const yearlyCosts: Record<string, YearlyCosts> = {};

    records.forEach((record) => {
      const year = new Date(record.completionDate).getFullYear().toString();

      if (!yearlyCosts[year]) {
        yearlyCosts[year] = {
          year,
          cost: 0,
          count: 0,
          types: {
            "time-based": 0,
            "distance-based": 0,
            undefined: 0,
          },
          tags: {},
        };
      }

      yearlyCosts[year].cost += record.cost || 0;
      yearlyCosts[year].count += 1;
      if (record.type) {
        yearlyCosts[year].types[record.type] += record.cost || 0;
      }
    });

    return Object.values(yearlyCosts).sort((a, b) =>
      a.year.localeCompare(b.year)
    );
  },

  getCostTrends: (
    records: MaintenanceRecord[],
    period: "day" | "month" | "year" = "month"
  ) => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));

    const filteredRecords = records.filter(
      (record) => new Date(record.completionDate) >= sixMonthsAgo
    );

    switch (period) {
      case "day":
        return CostAnalysis.getDailyCosts(filteredRecords);
      case "month":
        return CostAnalysis.getMonthlyCosts(filteredRecords);
      case "year":
        return CostAnalysis.getYearlyCosts(filteredRecords);
    }
  },

  getTaggedCostAnalysis: (
    items: MaintenanceItem[]
  ): Record<
    Tags,
    {
      totalCost: number;
      averageCost: number;
      count: number;
      monthlyAverage: number;
    }
  > => {
    if (!items?.length) return {};

    const tagStats: Record<
      string,
      {
        totalCost: number;
        count: number;
        dates: Date[];
      }
    > = {};

    items.forEach((item) => {
      if (!item.tags?.length || !item.completionHistory?.length) return;

      item.completionHistory.forEach((record) => {
        const costPerTag = (record.cost || 0) / item.tags!.length;

        item.tags!.forEach((tag) => {
          if (!tagStats[tag]) {
            tagStats[tag] = { totalCost: 0, count: 0, dates: [] };
          }
          tagStats[tag].totalCost += costPerTag;
          tagStats[tag].count += 1;
          tagStats[tag].dates.push(new Date(record.completionDate));
        });
      });
    });

    const result: Record<Tags, any> = {};

    Object.entries(tagStats).forEach(([tag, stats]) => {
      const oldestDate = Math.min(...stats.dates.map((d) => d.getTime()));
      const newestDate = Math.max(...stats.dates.map((d) => d.getTime()));
      const monthsDiff = Math.max(
        1,
        Math.ceil((newestDate - oldestDate) / (1000 * 60 * 60 * 24 * 30))
      );

      result[tag as Tags] = {
        totalCost: Number(stats.totalCost.toFixed(2)),
        averageCost: Number((stats.totalCost / stats.count).toFixed(2)),
        count: stats.count,
        monthlyAverage: Number((stats.totalCost / monthsDiff).toFixed(2)),
      };
    });

    return result;
  },
};
