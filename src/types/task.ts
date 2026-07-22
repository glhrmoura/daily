export type Period = 'morning' | 'afternoon' | 'night';

export type Task = {
  id: string;
  name: string;
  period: Period;
  checked: boolean;
  notes?: string;
  color?: string;
};

export type MissedItem = {
  taskId: string;
  name: string;
  period: Period;
  notes?: string;
  color?: string;
};

export type DayMissedReport = {
  date: string;
  items: MissedItem[];
};
