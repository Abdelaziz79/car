import {
  intervalLabels,
  MaintenanceInterval,
  PredefinedInterval,
} from "@/types/allTypes";

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
