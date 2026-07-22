export type Period = 'morning' | 'afternoon' | 'night';

export type Task = {
  id: string;
  name: string;
  period: Period;
  checked: boolean;
  notes?: string;
  color?: string;
};
