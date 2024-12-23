import { maintenanceData } from "@/data/maintenanceData";
import {
  MaintenanceHistory,
  MaintenanceInterval,
  MaintenanceItem,
  MaintenanceRecord,
  Tags,
} from "@/types/allTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateNextDate } from "./maintenanceHelpers";

export const STORAGE_KEYS = {
  MAINTENANCE_HISTORY: "maintenance_history",
  CURRENT_KM: "current_km",
  CUSTOM_TAGS: "custom_tags",
  CUSTOM_INTERVALS: "custom_intervals",
};

export const StorageManager = {
  // Save completion record with enhanced record type
  saveCompletion: async (
    taskId: string,
    currentKm: number,
    date: string,
    notes?: string
  ): Promise<void> => {
    try {
      const data = await StorageManager.getMaintenanceData();
      const task = data.find((item) => item.id === taskId);

      if (!task) throw new Error("Task not found");

      // Create completion record with additional fields
      const newRecord: MaintenanceRecord = {
        taskId,
        completionDate: date,
        nextDate: null,
        nextKm: null,
        notes,
        kmAtCompletion: currentKm,
        title: task.title,
        type: task.type,
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

      task.completionHistory = [...(task.completionHistory || []), newRecord];

      const updatedData = data.map((item) =>
        item.id === taskId ? task : item
      );

      await StorageManager.saveMaintenanceData(updatedData);
      await StorageManager.setCurrentKm(currentKm);
    } catch (error) {
      console.error("Error saving completion:", error);
      throw error;
    }
  },

  // Custom tags management
  getCustomTags: async (): Promise<Tags[]> => {
    try {
      const tags = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_TAGS);
      return tags ? JSON.parse(tags) : [];
    } catch (error) {
      console.error("Error getting custom tags:", error);
      return [];
    }
  },

  saveCustomTag: async (newTag: Tags): Promise<void> => {
    try {
      const existingTags = await StorageManager.getCustomTags();
      if (!existingTags.includes(newTag)) {
        const updatedTags = [...existingTags, newTag];
        await AsyncStorage.setItem(
          STORAGE_KEYS.CUSTOM_TAGS,
          JSON.stringify(updatedTags)
        );
      }
    } catch (error) {
      console.error("Error saving custom tag:", error);
      throw error;
    }
  },

  // Custom intervals management
  getCustomIntervals: async (): Promise<MaintenanceInterval[]> => {
    try {
      const intervals = await AsyncStorage.getItem(
        STORAGE_KEYS.CUSTOM_INTERVALS
      );
      return intervals ? JSON.parse(intervals) : [];
    } catch (error) {
      console.error("Error getting custom intervals:", error);
      return [];
    }
  },

  saveCustomInterval: async (
    newInterval: MaintenanceInterval
  ): Promise<void> => {
    try {
      const existingIntervals = await StorageManager.getCustomIntervals();
      if (!existingIntervals.includes(newInterval)) {
        const updatedIntervals = [...existingIntervals, newInterval];
        await AsyncStorage.setItem(
          STORAGE_KEYS.CUSTOM_INTERVALS,
          JSON.stringify(updatedIntervals)
        );
      }
    } catch (error) {
      console.error("Error saving custom interval:", error);
      throw error;
    }
  },

  // Enhanced maintenance data methods
  saveMaintenanceData: async (data: MaintenanceItem[]): Promise<void> => {
    try {
      await AsyncStorage.setItem("maintenance_data", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving maintenance data:", error);
      throw error;
    }
  },

  getMaintenanceData: async (): Promise<MaintenanceItem[]> => {
    try {
      const data = await AsyncStorage.getItem("maintenance_data");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error getting maintenance data:", error);
      return [];
    }
  },

  // Other existing methods remain the same
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

  getTaskHistory: async (taskId: string): Promise<MaintenanceRecord[]> => {
    try {
      const history = await StorageManager.getMaintenanceHistory();
      return history[taskId] || [];
    } catch (error) {
      console.error("Error getting task history:", error);
      return [];
    }
  },

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

  setCurrentKm: async (km: number): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_KM, km.toString());
    } catch (error) {
      console.error("Error setting current km:", error);
      throw error;
    }
  },

  getCurrentKm: async (): Promise<number> => {
    try {
      const km = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_KM);
      return km ? parseInt(km, 10) : 0;
    } catch (error) {
      console.error("Error getting current km:", error);
      return 0;
    }
  },
};

export const initializeStorage = async () => {
  try {
    // Initialize maintenance data
    const existingDataStr = await AsyncStorage.getItem("maintenance_data");
    if (!existingDataStr || existingDataStr === "[]") {
      await AsyncStorage.setItem(
        "maintenance_data",
        JSON.stringify(maintenanceData)
      );
    }

    // Initialize all storage keys with default values
    const initializationMap = {
      [STORAGE_KEYS.CURRENT_KM]: "0",
      [STORAGE_KEYS.MAINTENANCE_HISTORY]: "{}",
      [STORAGE_KEYS.CUSTOM_TAGS]: "[]",
      [STORAGE_KEYS.CUSTOM_INTERVALS]: "[]",
    };

    await Promise.all(
      Object.entries(initializationMap).map(async ([key, defaultValue]) => {
        const existing = await AsyncStorage.getItem(key);
        if (!existing) {
          await AsyncStorage.setItem(key, defaultValue);
        }
      })
    );
  } catch (error) {
    console.error("Error initializing storage:", error);
  }
};

export const addUserTask = async (
  newTask: Omit<MaintenanceItem, "id" | "completionHistory">
): Promise<MaintenanceItem> => {
  try {
    const existingData = await StorageManager.getMaintenanceData();

    // Create new task with required fields
    const newTaskWithId: MaintenanceItem = {
      ...newTask,
      id: `user_${Date.now()}`,
      createdByUser: true,
      completionHistory: [],
      tasks: newTask.tasks || [],
      tags: newTask.tags || ["غير محدد"],
      isRecurring: newTask.isRecurring ?? true,
    };

    // Save any custom tags
    if (newTask.tags) {
      await Promise.all(
        newTask.tags.map((tag) => StorageManager.saveCustomTag(tag))
      );
    }

    // Save custom interval if provided
    if (newTask.interval) {
      await StorageManager.saveCustomInterval(newTask.interval);
    }

    const updatedData = [...existingData, newTaskWithId];
    await StorageManager.saveMaintenanceData(updatedData);

    return newTaskWithId;
  } catch (error) {
    console.error("Error adding user task:", error);
    throw error;
  }
};
