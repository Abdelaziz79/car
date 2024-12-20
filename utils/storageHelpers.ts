import { maintenanceData } from "@/data/maintenanceData";
import {
  MaintenanceHistory,
  MaintenanceItem,
  MaintenanceRecord,
  MaintenanceStatus,
} from "@/types/allTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateNextDate } from "./maintenanceHelpers";

const STORAGE_KEYS = {
  MAINTENANCE_HISTORY: "maintenance_history",
  CURRENT_KM: "current_km",
};

export const StorageManager = {
  // Save completion record
  saveCompletion: async (
    taskId: string,
    currentKm: number,
    notes?: string
  ): Promise<void> => {
    try {
      // Get existing data
      const data = await StorageManager.getMaintenanceData();
      const task = data.find((item) => item.id === taskId);

      if (!task) throw new Error("Task not found");

      // Create completion record
      const newRecord: MaintenanceRecord = {
        taskId,
        completionDate: new Date().toISOString(),
        nextDate: null,
        nextKm: null,
        notes,
        kmAtCompletion: currentKm,
      };

      // Calculate next maintenance point
      if (task.type === "time-based" && task.interval) {
        newRecord.nextDate = calculateNextDate(
          newRecord.completionDate,
          task.interval
        );
        task.lastDate = newRecord.completionDate;
        task.nextDate = newRecord.nextDate;
      } else if (task.type === "distance-based" && task.kilometers) {
        newRecord.nextKm = currentKm + task.kilometers;
        task.lastKm = currentKm;
        task.nextKm = newRecord.nextKm;
      }

      // Update task history
      task.completionHistory = [...(task.completionHistory || []), newRecord];

      // Update task in data
      const updatedData = data.map((item) =>
        item.id === taskId ? task : item
      );

      // Save updated data
      await StorageManager.saveMaintenanceData(updatedData);
      await StorageManager.setCurrentKm(currentKm);
    } catch (error) {
      console.error("Error saving completion:", error);
      throw error;
    }
  },
  // Get all maintenance history
  getMaintenanceHistory: async (): Promise<MaintenanceHistory> => {
    try {
      const historyString = await AsyncStorage.getItem(
        STORAGE_KEYS.MAINTENANCE_HISTORY
      );
      return historyString ? JSON.parse(historyString) : {};
    } catch (error) {
      console.error("Error getting maintenance history:", error);
      return {};
    }
  },

  // Get task completion history
  getTaskHistory: async (taskId: string): Promise<MaintenanceRecord[]> => {
    try {
      const history = await StorageManager.getMaintenanceHistory();
      return history[taskId] || [];
    } catch (error) {
      console.error("Error getting task history:", error);
      return [];
    }
  },

  // Get latest completion record for a task
  getLatestCompletion: async (
    taskId: string
  ): Promise<MaintenanceRecord | null> => {
    try {
      const history = await StorageManager.getMaintenanceHistory();
      const taskHistory = history[taskId] || [];
      return taskHistory.length > 0
        ? taskHistory[taskHistory.length - 1]
        : null;
    } catch (error) {
      console.error("Error getting latest completion:", error);
      return null;
    }
  },

  // Set current kilometer reading
  setCurrentKm: async (km: number): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_KM, km.toString());
    } catch (error) {
      console.error("Error setting current km:", error);
      throw error;
    }
  },

  // Get current kilometer reading
  getCurrentKm: async (): Promise<number> => {
    try {
      const km = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_KM);
      return km ? parseInt(km, 10) : 0;
    } catch (error) {
      console.error("Error getting current km:", error);
      return 0;
    }
  },

  // Save maintenance data
  saveMaintenanceData: async (data: MaintenanceItem[]): Promise<void> => {
    try {
      await AsyncStorage.setItem("maintenance_data", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving maintenance data:", error);
      throw error;
    }
  },

  // Get maintenance data
  getMaintenanceData: async (): Promise<MaintenanceItem[]> => {
    try {
      const data = await AsyncStorage.getItem("maintenance_data");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting maintenance data:", error);
      return [];
    }
  },

  // Calculate task status based on history
  calculateTaskStatus: async (
    task: MaintenanceItem,
    currentKm: number
  ): Promise<MaintenanceStatus> => {
    try {
      const latestCompletion = await StorageManager.getLatestCompletion(
        task.id
      );

      if (!latestCompletion) {
        return "pending";
      }

      const now = new Date();

      if (task.type === "time-based" && latestCompletion.nextDate) {
        const nextDate = new Date(latestCompletion.nextDate);
        if (now > nextDate) {
          return "overdue";
        }

        // If within 7 days of next maintenance
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        if (nextDate.getTime() - now.getTime() < sevenDays) {
          return "upcoming";
        }
      } else if (task.type === "distance-based" && latestCompletion.nextKm) {
        if (currentKm > latestCompletion.nextKm) {
          return "overdue";
        }

        // If within 500km of next maintenance
        if (latestCompletion.nextKm - currentKm < 500) {
          return "upcoming";
        }
      }

      return "completed";
    } catch (error) {
      console.error("Error calculating task status:", error);
      return "pending";
    }
  },

  // Get all upcoming tasks
  getUpcomingTasks: async (): Promise<MaintenanceItem[]> => {
    try {
      const tasks = await StorageManager.getMaintenanceData();
      const currentKm = await StorageManager.getCurrentKm();

      const tasksWithStatus = await Promise.all(
        tasks.map(async (task) => {
          const status = await StorageManager.calculateTaskStatus(
            task,
            currentKm
          );
          return { ...task, status };
        })
      );

      return tasksWithStatus.filter((task) => task.status === "upcoming");
    } catch (error) {
      console.error("Error getting upcoming tasks:", error);
      return [];
    }
  },
};

export const initializeStorage = async () => {
  try {
    // Check if maintenance data already exists
    const existingDataStr = await AsyncStorage.getItem("maintenance_data");

    if (!existingDataStr || existingDataStr === "[]") {
      // If no data exists or is empty, initialize with default maintenance data
      await AsyncStorage.setItem(
        "maintenance_data",
        JSON.stringify(maintenanceData)
      );
    }

    // Initialize current km if not set
    const currentKm = await AsyncStorage.getItem("current_km");
    if (!currentKm) {
      await AsyncStorage.setItem("current_km", "0");
    }

    // Initialize maintenance history if not exists
    const maintenanceHistory = await AsyncStorage.getItem(
      "maintenance_history"
    );
    if (!maintenanceHistory) {
      await AsyncStorage.setItem("maintenance_history", JSON.stringify({}));
    }
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
};

export const addUserTask = async (
  newTask: Omit<MaintenanceItem, "id" | "status">
) => {
  try {
    // Get existing maintenance data
    const existingDataStr = await AsyncStorage.getItem("maintenance_data");
    const existingData: MaintenanceItem[] = existingDataStr
      ? JSON.parse(existingDataStr)
      : [];

    // Generate unique ID for the new task
    const newTaskWithId: MaintenanceItem = {
      ...newTask,
      id: `user_${Date.now()}`, // Unique ID
      status: "upcoming",
    };

    // Add new task to existing data
    const updatedData = [...existingData, newTaskWithId];

    // Save updated data back to storage
    await AsyncStorage.setItem("maintenance_data", JSON.stringify(updatedData));

    return newTaskWithId;
  } catch (error) {
    console.error("Error adding user task:", error);
    throw error;
  }
};
