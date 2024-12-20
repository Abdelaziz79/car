import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MaintenanceItem,
  MaintenanceRecord,
  MaintenanceInterval,
  MaintenanceStatus,
} from "@/types/allTypes";

const STORAGE_KEYS = {
  MAINTENANCE_DATA: "maintenance_data",
  MAINTENANCE_HISTORY: "maintenance_history",
  CURRENT_KM: "current_km",
};

export const calculateNextDate = (
  lastDate: string,
  interval: MaintenanceInterval
): string => {
  const date = new Date(lastDate);

  switch (interval) {
    case "biweekly":
      date.setDate(date.getDate() + 14);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    case "semiannual":
      date.setMonth(date.getMonth() + 6);
      break;
    case "annual":
      date.setFullYear(date.getFullYear() + 1);
      break;
    case "biennial":
      date.setFullYear(date.getFullYear() + 2);
      break;
    case "triennial":
      date.setFullYear(date.getFullYear() + 3);
      break;
  }

  return date.toISOString();
};

export const calculateStatus = async (
  item: MaintenanceItem,
  currentKm: number
): Promise<MaintenanceStatus> => {
  const history = item.completionHistory || [];
  const lastCompletion = history[history.length - 1];

  if (!lastCompletion) return "pending";

  const now = new Date();
  const nextDate = lastCompletion.nextDate
    ? new Date(lastCompletion.nextDate)
    : undefined;

  if (item.type === "time-based" && nextDate) {
    if (now > nextDate) return "overdue";
    if (nextDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000)
      return "upcoming";
  } else if (item.type === "distance-based" && lastCompletion.nextKm) {
    if (currentKm > lastCompletion.nextKm) return "overdue";
    if (lastCompletion.nextKm - currentKm < 500) return "upcoming";
  }

  return "completed";
};

export const completeTask = async (
  taskId: string,
  currentKm: number,
  notes?: string
): Promise<void> => {
  try {
    // Get existing data
    const dataStr = await AsyncStorage.getItem(STORAGE_KEYS.MAINTENANCE_DATA);
    const items: MaintenanceItem[] = dataStr ? JSON.parse(dataStr) : [];

    const item = items.find((i) => i.id === taskId);
    if (!item) throw new Error("Task not found");

    // Create completion record
    const record: MaintenanceRecord = {
      taskId,
      completionDate: new Date().toISOString(),
      nextDate: null,
      nextKm: null,
      notes,
      kmAtCompletion: currentKm,
    };

    // Calculate next maintenance point if recurring
    if (item.isRecurring) {
      if (item.type === "time-based" && item.interval) {
        record.nextDate = calculateNextDate(
          record.completionDate,
          item.interval
        );
      } else if (item.type === "distance-based" && item.kilometers) {
        record.nextKm = currentKm + item.kilometers;
      }
    }

    // Update history
    const history = item.completionHistory || [];
    item.completionHistory = [...history, record];

    // Update item status
    item.status = await calculateStatus(item, currentKm);

    // Save updated data
    await AsyncStorage.setItem(
      STORAGE_KEYS.MAINTENANCE_DATA,
      JSON.stringify(items)
    );
    await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_KM, currentKm.toString());
  } catch (error) {
    console.error("Error completing task:", error);
    throw error;
  }
};

export const getFilteredItems = async (
  filter: MaintenanceStatus,
  type: string,
  currentKm: number
): Promise<MaintenanceItem[]> => {
  const dataStr = await AsyncStorage.getItem(STORAGE_KEYS.MAINTENANCE_DATA);
  let items: MaintenanceItem[] = dataStr ? JSON.parse(dataStr) : [];

  // Filter by type
  items = items.filter((item) => {
    if (type === "user-based") return item.createdByUser;
    return item.type === type;
  });

  // Update status for all items
  items = await Promise.all(
    items.map(async (item) => ({
      ...item,
      status: await calculateStatus(item, currentKm),
    }))
  );

  // Apply status filter
  return filter === "all"
    ? items
    : items.filter((item) => item.status === filter);
};
