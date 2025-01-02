import {
  MaintenanceItem,
  MaintenanceRecord,
  MaintenanceType,
  Tags,
} from "@/types/allTypes";
import { StorageManager } from "./storageHelpers";

export const MaintenanceStats = {
  getTotalCosts: (records: MaintenanceRecord[]): number => {
    if (!records?.length) return 0;
    return records.reduce((sum, record) => sum + (record.cost || 0), 0);
  },

  getAverageCostPerMaintenance: (records: MaintenanceRecord[]): number => {
    if (!records?.length) return 0;
    const totalCost = MaintenanceStats.getTotalCosts(records);
    return Number((totalCost / records.length).toFixed(2));
  },

  getCostsByType: (
    items: MaintenanceItem[]
  ): Record<MaintenanceType, number> => {
    if (!items?.length) {
      return {
        "time-based": 0,
        "distance-based": 0,
        undefined: 0,
      };
    }

    const costs: Record<MaintenanceType, number> = {
      "time-based": 0,
      "distance-based": 0,
      undefined: 0,
    };

    items.forEach((item) => {
      if (!item.type) return;
      const totalCost =
        item.completionHistory?.reduce(
          (sum, record) => sum + (record.cost || 0),
          0
        ) || 0;
      costs[item.type] += totalCost;
    });

    return costs;
  },

  getCostsByTag: (items: MaintenanceItem[]): Record<Tags, number> => {
    if (!items?.length) return {};

    const costsByTag: Record<string, number> = {};

    items.forEach((item) => {
      if (!item.tags?.length) return;

      const totalCost =
        item.completionHistory?.reduce(
          (sum, record) => sum + (record.cost || 0),
          0
        ) || 0;

      const costPerTag = totalCost / item.tags.length;

      item.tags.forEach((tag) => {
        costsByTag[tag] = Number(
          ((costsByTag[tag] || 0) + costPerTag).toFixed(2)
        );
      });
    });

    return costsByTag;
  },

  getKilometerStats: (records: MaintenanceRecord[]) => {
    if (!records?.length || records.length < 2) {
      return {
        averageKmBetweenMaintenance: 0,
        totalKmCovered: 0,
      };
    }

    const sortedRecords = [...records].sort(
      (a, b) => (a.kmAtCompletion || 0) - (b.kmAtCompletion || 0)
    );

    const totalKmCovered =
      (sortedRecords[sortedRecords.length - 1].kmAtCompletion || 0) -
      (sortedRecords[0].kmAtCompletion || 0);

    return {
      averageKmBetweenMaintenance: Number(
        (totalKmCovered / (records.length - 1)).toFixed(2)
      ),
      totalKmCovered: Number(totalKmCovered.toFixed(2)),
    };
  },
};

export const getTasksWithHistory = async (): Promise<MaintenanceItem[]> => {
  try {
    const data = await StorageManager.getMaintenanceData();
    return data.filter(
      (task) => task?.completionHistory && task.completionHistory.length > 0
    );
  } catch (error) {
    console.error("Error getting tasks with history:", error);
    return [];
  }
};

export const getTasksInDateRange = async (
  startDate: string,
  endDate: string
): Promise<MaintenanceItem[]> => {
  try {
    if (!startDate || !endDate) {
      throw new Error("Start date and end date are required");
    }

    const tasksWithHistory = await getTasksWithHistory();

    // Create dates at the start and end of the day in local time
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T23:59:59.999");

    return tasksWithHistory
      .filter((task) => {
        if (!task.completionHistory?.length) return false;

        const filteredHistory = task.completionHistory.filter((record) => {
          if (!record.completionDate) return false;

          // Create a local date from the completion date
          const recordDate = new Date(record.completionDate);

          // Compare using local time
          const recordLocalDate = new Date(
            recordDate.getFullYear(),
            recordDate.getMonth(),
            recordDate.getDate()
          );

          const isInRange = recordLocalDate >= start && recordLocalDate <= end;

          return isInRange;
        });

        if (filteredHistory.length > 0) {
          return {
            ...task,
            completionHistory: filteredHistory,
          };
        }

        return false;
      })
      .filter(Boolean) as MaintenanceItem[];
  } catch (error) {
    console.error("Error getting tasks in date range:", error);
    return [];
  }
};

export const getTaskStatistics = async (
  taskId: string
): Promise<{
  totalCompletions: number;
  averageInterval: number;
  lastCompletion: MaintenanceRecord | null;
  nextDueDate: string | null;
}> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const task = (await StorageManager.getMaintenanceData()).find(
      (t) => t.id === taskId
    );

    if (!task?.completionHistory?.length) {
      return {
        totalCompletions: 0,
        averageInterval: 0,
        lastCompletion: null,
        nextDueDate: null,
      };
    }

    const history = [...task.completionHistory].sort(
      (a, b) =>
        new Date(a.completionDate).getTime() -
        new Date(b.completionDate).getTime()
    );

    const intervals = history.slice(1).map((record, index) => {
      const prevDate = new Date(history[index].completionDate);
      const currentDate = new Date(record.completionDate);
      return Number(
        (
          (currentDate.getTime() - prevDate.getTime()) /
          (1000 * 60 * 60 * 24)
        ).toFixed(2)
      );
    });

    return {
      totalCompletions: history.length,
      averageInterval: intervals.length
        ? Number(
            (
              intervals.reduce((sum, interval) => sum + interval, 0) /
              intervals.length
            ).toFixed(2)
          )
        : 0,
      lastCompletion: history[history.length - 1],
      nextDueDate: task.nextDate || null,
    };
  } catch (error) {
    console.error("Error getting task statistics:", error);
    throw error;
  }
};
