// types/maintenanceTypes.ts

export type MaintenanceInterval =
  | "biweekly"
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "annual"
  | "biennial"
  | "triennial";

export type MaintenanceStatus =
  | "pending"
  | "upcoming"
  | "completed"
  | "overdue"
  | "all";

export type MaintenanceType = "time-based" | "distance-based" | "user-based";

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
  // status: MaintenanceStatus;
  tags?: Tags[];
  tasks: string[];
  createdByUser?: boolean;
  completionHistory?: MaintenanceRecord[];
  isRecurring?: boolean;
}

export interface MaintenanceRecord {
  taskId: string;
  completionDate: string;
  nextDate: string | null;
  nextKm: number | null;
  notes?: string;
  kmAtCompletion?: number;
  title?: string; // Add this to store task title
  type?: MaintenanceType; // Add this to store task type
}

export interface MaintenanceHistory {
  [taskId: string]: MaintenanceRecord[];
}

export interface FilterOption {
  value: MaintenanceStatus;
  label: string;
  color: string;
}

export const FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "الكل", color: "bg-slate-500" },
  { value: "upcoming", label: "القادمة", color: "bg-sky-500" },
  { value: "completed", label: "المكتملة", color: "bg-teal-500" },
  { value: "overdue", label: "متأخرة", color: "bg-rose-500" },
];
