export type PredefinedInterval =
  | "biweekly"
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "annual"
  | "biennial"
  | "triennial"
  | "";

export type CustomDayInterval = `${number}_days`;

export type MaintenanceInterval = PredefinedInterval | string;

export const intervalLabels: Record<PredefinedInterval, string> = {
  biweekly: "كل أسبوعين",
  monthly: "شهرياً",
  quarterly: "ربع سنوي",
  semiannual: "نصف سنوي",
  annual: "سنوي",
  biennial: "كل سنتين",
  triennial: "كل ثلاث سنوات",
  "": "",
};

export type MaintenanceType = "time-based" | "distance-based" | "undefined";

export type Tags =
  | "المكيف"
  | "الطلاء"
  | "تنظيف"
  | "الإطارات"
  | "الزجاج"
  | "الضمان"
  | "الزيوت"
  | "المحرك"
  | "غير محدد"
  | string;

export interface MaintenanceItem {
  id: string;
  title: string;
  description: string;
  type: MaintenanceType;
  interval?: MaintenanceInterval;
  kilometers?: number;
  lastDate?: string;
  nextDate?: string;
  lastKm?: number;
  nextKm?: number;
  tags?: Tags[];
  tasks: string[];
  createdByUser?: boolean;
  completionHistory?: MaintenanceRecord[];
  isRecurring?: boolean;
}

export interface MaintenanceRecord {
  id: string;
  taskId: string;
  completionDate: string;
  kmAtCompletion: number;
  cost: number;
  nextDate: string | null;
  nextKm: number | null;
  notes?: string;
  title?: string;
  type?: MaintenanceType;
}

export interface MaintenanceHistory {
  [taskId: string]: MaintenanceRecord[];
}

export interface FilterState {
  tags: Tags[];
  interval?: MaintenanceInterval;
  kilometers?: number;
}

export interface CompletionData {
  id: string;
  cost: number;
  completionDate: string;
  kmAtCompletion: number;
  notes?: string;
}

export type Language = "en" | "ar";

export const STORAGE_KEYS = {
  MAINTENANCE_HISTORY: "maintenance_history",
  CURRENT_KM: "current_km",
  CUSTOM_TAGS: "custom_tags",
  CUSTOM_INTERVALS: "custom_intervals",
};

export interface DateRange {
  startDate: Date;
  endDate: Date;
  allTime: boolean;
}

export type ChartView = "type" | "daily" | "monthly";
