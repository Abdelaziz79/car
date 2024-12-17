import { MaintenanceInterval, MaintenanceStatus } from "@/types/allTypes";

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
  return date.toISOString().split("T")[0];
};

export const calculateStatus = (
  nextDate?: string,
  nextKm?: number,
  currentKm?: number
): MaintenanceStatus => {
  if (!nextDate && !nextKm) return "pending";

  const today = new Date();
  const next = nextDate ? new Date(nextDate) : undefined;

  if (next && next < today) return "overdue";
  if (nextKm && currentKm && nextKm <= currentKm) return "overdue";
  if (next && next.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000)
    return "upcoming";
  if (nextKm && currentKm && nextKm - currentKm <= 500) return "upcoming";

  return "pending";
};
