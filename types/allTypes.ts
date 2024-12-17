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

export type MaintenanceType = "time-based" | "distance-based";

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
  status: MaintenanceStatus;
  tasks: string[];
}
