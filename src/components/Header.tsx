import { Link, useRouterState } from '@tanstack/react-router';
import { ArrowLeft, ClipboardList, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Header() {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isSecondaryPage = pathname === '/report' || pathname === '/config';

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto max-w-2xl px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
              <img src="/logo.png" alt={t('app.name')} className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t('app.name')}</h1>
              <p className="text-xs text-muted-foreground">{t('app.tagline')}</p>
            </div>
          </Link>
          {isSecondaryPage ? (
            <Link
              to="/home"
              aria-label={t('nav.backHome')}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-border-strong hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('nav.back')}
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/report"
                aria-label={t('nav.report')}
                className="rounded-xl border border-border bg-surface p-2.5 text-muted-foreground transition hover:border-border-strong hover:text-foreground"
              >
                <ClipboardList className="h-5 w-5" />
              </Link>
              <Link
                to="/config"
                aria-label={t('nav.settings')}
                className="rounded-xl border border-border bg-surface p-2.5 text-muted-foreground transition hover:border-border-strong hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
