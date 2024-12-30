import {
  MaintenanceItem,
  MaintenanceRecord,
  MaintenanceType,
  Tags,
} from "@/types/allTypes";

import { StorageManager } from "./storageHelpers";

export const MaintenanceStats = {
  getTotalCosts: (records: MaintenanceRecord[]): number => {
    return records.reduce((sum, record) => sum + record.cost, 0);
  },

  getAverageCostPerMaintenance: (records: MaintenanceRecord[]): number => {
    return records.length
      ? MaintenanceStats.getTotalCosts(records) / records.length
      : 0;
  },

  getCostsByType: (
    items: MaintenanceItem[]
  ): Record<MaintenanceType, number> => {
    const costs: Record<MaintenanceType, number> = {
      "time-based": 0,
      "distance-based": 0,
      undefined: 0,
    };

    items.forEach((item) => {
      const totalCost =
        item.completionHistory?.reduce((sum, record) => sum + record.cost, 0) ||
        0;
      costs[item.type] += totalCost;
    });

    return costs;
  },

  getCostsByTag: (items: MaintenanceItem[]): Record<Tags, number> => {
    const costsByTag: Record<string, number> = {};

    items.forEach((item) => {
      const totalCost =
        item.completionHistory?.reduce((sum, record) => sum + record.cost, 0) ||
        0;
      item.tags?.forEach((tag) => {
        costsByTag[tag] =
          (costsByTag[tag] || 0) + totalCost / (item.tags?.length || 1);
      });
    });

    return costsByTag;
  },

  getMaintenanceFrequency: (records: MaintenanceRecord[]): number => {
    if (records.length < 2) return 0;

    const sortedRecords = [...records].sort(
      (a, b) =>
        new Date(a.completionDate).getTime() -
        new Date(b.completionDate).getTime()
    );

    const firstDate = new Date(sortedRecords[0].completionDate);
    const lastDate = new Date(
      sortedRecords[sortedRecords.length - 1].completionDate
    );
    const daysDiff =
      (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);

    return records.length / (daysDiff / 30); // Average maintenances per month
  },

  getKilometerStats: (records: MaintenanceRecord[]) => {
    const sortedRecords = [...records].sort(
      (a, b) => a.kmAtCompletion - b.kmAtCompletion
    );

    if (records.length < 2)
      return {
        averageKmBetweenMaintenance: 0,
        totalKmCovered: 0,
      };

    const totalKmCovered =
      sortedRecords[sortedRecords.length - 1].kmAtCompletion -
      sortedRecords[0].kmAtCompletion;

    return {
      averageKmBetweenMaintenance: totalKmCovered / (records.length - 1),
      totalKmCovered,
    };
  },

  getPendingMaintenanceCount: (
    items: MaintenanceItem[],
    currentDate: Date,
    currentKm: number
  ): number => {
    return items.filter((item) => {
      if (item.type === "time-based" && item.nextDate) {
        return new Date(item.nextDate) <= currentDate;
      } else if (item.type === "distance-based" && item.nextKm) {
        return item.nextKm <= currentKm;
      }
      return false;
    }).length;
  },

  getMaintenanceCompliance: (
    items: MaintenanceItem[],
    currentDate: Date,
    currentKm: number
  ): number => {
    const dueItems = items.filter((item) => {
      if (!item.isRecurring) return false;

      if (item.type === "time-based" && item.nextDate) {
        return new Date(item.nextDate) <= currentDate;
      } else if (item.type === "distance-based" && item.nextKm) {
        return item.nextKm <= currentKm;
      }
      return false;
    });

    return dueItems.length
      ? ((items.length - dueItems.length) / items.length) * 100
      : 100;
  },
};

// =========================================================== NEW FUNCTIONS   ===========================================================

// Get all tasks with completion history
export const getTasksWithHistory = async (): Promise<MaintenanceItem[]> => {
  try {
    const data = await StorageManager.getMaintenanceData();
    return data.filter(
      (task) => task.completionHistory && task.completionHistory.length > 0
    );
  } catch (error) {
    console.error("Error getting tasks with history:", error);
    return [];
  }
};

// Get tasks completed within date range
export const getTasksInDateRange = async (
  startDate: string,
  endDate: string
): Promise<MaintenanceItem[]> => {
  try {
    const tasksWithHistory = await getTasksWithHistory();
    return tasksWithHistory.filter((task) =>
      task.completionHistory?.some(
        (record) =>
          record.completionDate >= startDate && record.completionDate <= endDate
      )
    );
  } catch (error) {
    console.error("Error getting tasks in date range:", error);
    return [];
  }
};

// Get tasks by completion count
export const getTasksByCompletionCount = async (
  minCompletions: number
): Promise<MaintenanceItem[]> => {
  try {
    const tasksWithHistory = await getTasksWithHistory();
    return tasksWithHistory.filter(
      (task) => (task.completionHistory?.length ?? 0) >= minCompletions
    );
  } catch (error) {
    console.error("Error getting tasks by completion count:", error);
    return [];
  }
};

// Get tasks due for maintenance
export const getTasksDueForMaintenance = async (): Promise<
  MaintenanceItem[]
> => {
  try {
    const currentKm = await StorageManager.getCurrentKm();
    const currentDate = new Date().toISOString().split("T")[0];
    const tasksWithHistory = await getTasksWithHistory();

    return tasksWithHistory.filter((task) => {
      if (task.type === "time-based" && task.nextDate) {
        return task.nextDate <= currentDate;
      } else if (task.type === "distance-based" && task.nextKm) {
        return currentKm >= task.nextKm;
      }
      return false;
    });
  } catch (error) {
    console.error("Error getting due tasks:", error);
    return [];
  }
};

// Get completion statistics for a task
export const getTaskStatistics = async (
  taskId: string
): Promise<{
  totalCompletions: number;
  averageInterval: number;
  lastCompletion: MaintenanceRecord | null;
  nextDueDate: string | null;
}> => {
  try {
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

    const history = task.completionHistory;
    const intervals = history.slice(1).map((record, index) => {
      const prevDate = new Date(history[index].completionDate);
      const currentDate = new Date(record.completionDate);
      return (
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );
    });

    return {
      totalCompletions: history.length,
      averageInterval: intervals.length
        ? intervals.reduce((sum, interval) => sum + interval, 0) /
          intervals.length
        : 0,
      lastCompletion: history[history.length - 1],
      nextDueDate: task.nextDate || null,
    };
  } catch (error) {
    console.error("Error getting task statistics:", error);
    throw error;
  }
};
