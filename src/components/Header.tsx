import { Link, useRouterState } from '@tanstack/react-router';
import { ArrowLeft, ClipboardList } from 'lucide-react';

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isReport = pathname === '/relatorio';

  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-2xl px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg">
              <img src="/logo.png" alt="Daily" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Daily</h1>
              <p className="text-xs text-muted-foreground">Checklist diário</p>
            </div>
          </Link>
          {isReport ? (
            <Link
              to="/"
              aria-label="Voltar para home"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-border-strong hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          ) : (
            <Link
              to="/relatorio"
              aria-label="Relatório de não concluídos"
              className="rounded-xl border border-border bg-surface p-2.5 text-muted-foreground transition hover:border-border-strong hover:text-foreground"
            >
              <ClipboardList className="h-5 w-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
