import { MaintenanceInterval } from "@/types/allTypes";

export const formatDate = (date: string, locale: string = "ar-SA") => {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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
