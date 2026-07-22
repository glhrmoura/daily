export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden">
            <img src="/logo.png" alt="Daily" className="w-full h-full object-cover" />
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
