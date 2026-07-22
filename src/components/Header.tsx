export function Header() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-2xl px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg">
            <img src="/logo.png" alt="Daily" className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Daily</h1>
            <p className="text-xs text-muted-foreground">Checklist diário</p>
          </div>
        </div>
      </div>
    </header>
  );
}
