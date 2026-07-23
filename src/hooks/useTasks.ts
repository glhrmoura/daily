import { useCallback, useEffect, useRef, useState } from 'react';
import type { DayMissedReport, Task } from '@/types/task';
import type { DailyStore } from '@/lib/storage';
import { loadDailyStore, resetChecksIfNewDay, saveDailyStore } from '@/lib/storage';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [missed, setMissed] = useState<DayMissedReport[]>([]);
  const [lastReset, setLastReset] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const tasksRef = useRef(tasks);
  const lastResetRef = useRef(lastReset);
  const missedRef = useRef(missed);

  tasksRef.current = tasks;
  lastResetRef.current = lastReset;
  missedRef.current = missed;

  useEffect(() => {
    const store = loadDailyStore();
    setTasks(store.tasks);
    setMissed(store.missed);
    setLastReset(store.lastReset);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !lastReset) return;
    saveDailyStore({ tasks, lastReset, missed });
  }, [tasks, lastReset, missed, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    const applyDailyReset = () => {
      const next = resetChecksIfNewDay(
        tasksRef.current,
        lastResetRef.current,
        missedRef.current,
      );
      if (!next) return;
      setTasks(next.tasks);
      setMissed(next.missed);
      setLastReset(next.lastReset);
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') applyDailyReset();
    };

    window.addEventListener('focus', applyDailyReset);
    document.addEventListener('visibilitychange', onVisibility);
    const interval = window.setInterval(applyDailyReset, 60_000);

    return () => {
      window.removeEventListener('focus', applyDailyReset);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearInterval(interval);
    };
  }, [hydrated]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'checked'>) => {
    setTasks((prev) => [...prev, { ...task, id: crypto.randomUUID(), checked: false }]);
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleChecked = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, checked: !task.checked } : task)),
    );
  }, []);

  const removeMissedItem = useCallback((date: string, index: number) => {
    setMissed((prev) =>
      prev
        .map((report) => {
          if (report.date !== date) return report;
          return {
            ...report,
            items: report.items.filter((_, itemIndex) => itemIndex !== index),
          };
        })
        .filter((report) => report.items.length > 0),
    );
  }, []);

  const removeMissedDay = useCallback((date: string) => {
    setMissed((prev) => prev.filter((report) => report.date !== date));
  }, []);

  const getStore = useCallback((): DailyStore => {
    return {
      tasks: tasksRef.current,
      lastReset: lastResetRef.current,
      missed: missedRef.current,
    };
  }, []);

  const replaceStore = useCallback((store: DailyStore) => {
    saveDailyStore(store);
    setTasks(store.tasks);
    setMissed(store.missed);
    setLastReset(store.lastReset);
  }, []);

  return {
    tasks,
    missed,
    hydrated,
    addTask,
    updateTask,
    deleteTask,
    toggleChecked,
    removeMissedItem,
    removeMissedDay,
    getStore,
    replaceStore,
  };
}
