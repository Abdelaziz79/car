import {
  intervalLabels,
  MaintenanceInterval,
  MaintenanceItem,
  MaintenanceRecord,
  PredefinedInterval,
} from "@/types/allTypes";
import { StorageManager } from "./storageHelpers";

export const getIntervalLabel = (interval: MaintenanceInterval): string => {
  // Check if it's a predefined interval
  if (interval in intervalLabels) {
    return intervalLabels[interval as PredefinedInterval];
  }

  // Handle custom intervals (e.g., "custom_14days")
  if (interval.endsWith("_days")) {
    const days = interval.replace("_", "").replace("days", "");
    return `كل ${days} يوم`;
  }

  // Return empty string for empty interval or undefined
  return "";
};

export const removeDuplicateIntervals = (
  intervals: MaintenanceInterval[]
): MaintenanceInterval[] => {
  return Array.from(new Set(intervals));
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
