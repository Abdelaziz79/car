import {
  CustomDayInterval,
  intervalLabels,
  MaintenanceInterval,
  PredefinedInterval,
} from "@/types/allTypes";

export const calculateNextDate = (
  lastDate: string,
  interval: MaintenanceInterval
): string => {
  const date = new Date(lastDate);

  // Handle custom day-based intervals
  if (interval.endsWith("_days")) {
    const days = parseInt(interval.split("_")[0]);
    if (!isNaN(days)) {
      date.setDate(date.getDate() + days);
      return date.toISOString();
    }
  }

  // Handle predefined intervals
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

// Helper to validate and format custom day interval
export const formatCustomDayInterval = (
  days: number
): CustomDayInterval | null => {
  if (isNaN(days) || days <= 0) return null;
  return `${days}_days` as CustomDayInterval;
};

// Helper to extract days from custom interval
export const getDaysFromInterval = (
  interval: MaintenanceInterval
): number | null => {
  if (interval.endsWith("_days")) {
    const days = parseInt(interval.split("_")[0]);
    return isNaN(days) ? null : days;
  }
  return null;
};

// Helper to format interval for display
export const formatIntervalDisplay = (
  interval: MaintenanceInterval
): string => {
  if (interval.endsWith("_days")) {
    const days = parseInt(interval.split("_")[0]);
    return `كل ${days} يوم`;
  }

  const intervalDisplayMap: Record<string, string> = {
    biweekly: "كل أسبوعين",
    monthly: "شهري",
    quarterly: "ربع سنوي",
    semiannual: "نصف سنوي",
    annual: "سنوي",
    biennial: "كل سنتين",
    triennial: "كل ثلاث سنوات",
  };

  return intervalDisplayMap[interval] || interval;
};

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
