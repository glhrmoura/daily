import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, ListChecks, Moon, Plus, Sun, Sunrise } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import type { Task } from '@/types/task';
import { Header } from '@/components/Header';
import { TaskForm } from '@/components/task/TaskForm';
import { ConfirmDialog } from '@/components/task/ConfirmDialog';
import { PeriodSection } from '@/components/task/PeriodSection';

export const Route = createFileRoute('/')({
  component: Index,
});

function sortByName(a: Task, b: Task) {
  return a.name.localeCompare(b.name);
}

function Index() {
  const { t, i18n } = useTranslation();
  const { tasks, hydrated, addTask, updateTask, deleteTask, toggleChecked } = useTasks();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [toDelete, setToDelete] = useState<Task | null>(null);

  const grouped = useMemo(() => {
    const sorted = [...tasks].sort(sortByName);
    return {
      morning: sorted.filter((m) => m.period === 'morning'),
      afternoon: sorted.filter((m) => m.period === 'afternoon'),
      night: sorted.filter((m) => m.period === 'night'),
    };
  }, [tasks]);

  const total = tasks.length;
  const done = tasks.filter((m) => m.checked).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  const today = new Date().toLocaleDateString(i18n.language, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (m: Task) => {
    setEditing(m);
    setFormOpen(true);
  };
  const handleSave = (data: Omit<Task, 'id' | 'checked'>, id?: string) => {
    if (id) updateTask(id, data);
    else addTask(data);
  };

  return (
    <div
      className={`min-h-dvh bg-background ${
        total > 0 ? 'pb-[calc(8rem+env(safe-area-inset-bottom,0px))] sm:pb-10' : 'pb-24 sm:pb-10'
      }`}
    >
      <Header />
      <div className="container mx-auto max-w-2xl space-y-6 px-4 pb-4 pt-[calc(5.5rem+env(safe-area-inset-top,0px))]">
        <header>
          <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="uppercase text-[11px]">{today}</span>
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">{t('home.title')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t('home.description')}</p>
        </header>

        {hydrated && total === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-strong bg-surface/40 p-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-surface text-primary">
              <ListChecks className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{t('home.emptyTitle')}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t('home.emptyDescription')}</p>
            <button
              onClick={openNew}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110"
            >
              <Plus className="h-4 w-4" /> {t('home.addTask')}
            </button>
          </div>
        ) : (
          <div className="space-y-7">
            <PeriodSection
              title={t('periods.morning')}
              icon={<Sunrise className="h-4 w-4 text-morning" />}
              accent="bg-surface"
              tasks={grouped.morning}
              onToggle={toggleChecked}
              onEdit={openEdit}
              onDelete={setToDelete}
            />
            <PeriodSection
              title={t('periods.afternoon')}
              icon={<Sun className="h-4 w-4 text-afternoon" />}
              accent="bg-surface"
              tasks={grouped.afternoon}
              onToggle={toggleChecked}
              onEdit={openEdit}
              onDelete={setToDelete}
            />
            <PeriodSection
              title={t('periods.night')}
              icon={<Moon className="h-4 w-4 text-night" />}
              accent="bg-surface"
              tasks={grouped.night}
              onToggle={toggleChecked}
              onEdit={openEdit}
              onDelete={setToDelete}
            />
            {total > 0 && (
              <div className="hidden rounded-2xl border border-border bg-surface p-5 sm:block">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-2xl font-semibold tracking-tight">
                      {done}{' '}
                      <span className="text-muted-foreground">
                        {t('home.of')} {total}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                      {t('home.completedToday')}
                    </div>
                  </div>
                  <div className="text-2xl font-semibold tracking-tight text-primary">
                    {progress}%
                  </div>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full border border-border bg-background">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+1.25rem)] pt-4 backdrop-blur-md sm:hidden">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-semibold tracking-tight">
                  {done}{' '}
                  <span className="text-muted-foreground">
                    {t('home.of')} {total}
                  </span>
                </div>
                <div className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
                  {t('home.completedToday')}
                </div>
              </div>
              <div className="text-2xl font-semibold tracking-tight text-primary">{progress}%</div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full border border-border bg-background">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <button
        onClick={openNew}
        aria-label={t('home.addTask')}
        className={`fixed right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-border-strong bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95 ${
          total > 0
            ? 'bottom-[calc(9.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-6'
            : 'bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-6'
        }`}
      >
        <Plus className="h-6 w-6" />
      </button>

      <TaskForm
        open={formOpen}
        initial={editing}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!toDelete}
        title={t('home.deleteTitle')}
        description={toDelete ? t('home.deleteDescription', { name: toDelete.name }) : undefined}
        confirmLabel={t('home.deleteConfirm')}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteTask(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
