export interface AlarmItem {
  id: string;
  name: string;
  system: number;
  review: number | string;
  status: 'normal' | 'warning' | 'danger';
  category: 'seal' | 'return';
}

export interface MessagePrompt {
  id: string;
  time: string;
  content: string;
  type: 'info' | 'warning' | 'danger';
}

export interface GradingData {
  name: string;
  value: number;
  color: string;
  subItems?: { name: string; value: number }[];
}

export interface DeductionItem {
  name: string;
  value: number;
  unit: string;
}

export interface MonitoringPoint {
  id: string;
  name: string;
  plate: string;
  status: 'normal' | 'warning';
}

export type DashboardActionType = 'abnormal' | 'end' | 'leave';
