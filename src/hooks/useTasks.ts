import { useCallback, useEffect, useRef, useState } from 'react';
import type { Task } from '@/types/task';
import { loadDailyStore, resetChecksIfNewDay, saveDailyStore } from '@/lib/storage';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lastReset, setLastReset] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const tasksRef = useRef(tasks);
  const lastResetRef = useRef(lastReset);

  tasksRef.current = tasks;
  lastResetRef.current = lastReset;

  useEffect(() => {
    const store = loadDailyStore();
    setTasks(store.tasks);
    setLastReset(store.lastReset);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !lastReset) return;
    saveDailyStore({ tasks, lastReset });
  }, [tasks, lastReset, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    const applyDailyReset = () => {
      const next = resetChecksIfNewDay(tasksRef.current, lastResetRef.current);
      if (!next) return;
      setTasks(next.tasks);
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

  return { tasks, hydrated, addTask, updateTask, deleteTask, toggleChecked };
}
