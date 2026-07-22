export type Period = 'morning' | 'afternoon' | 'night';

export type Task = {
  id: string;
  name: string;
  period: Period;
  time?: string;
  checked: boolean;
  notes?: string;
  color?: string;
};
