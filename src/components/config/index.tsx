import { PRIMARY_COLORS } from './constants';

type Props = {
  primary: string;
  onPrimaryChange: (primary: string) => void;
};

export function ConfigPage({ primary, onPrimaryChange }: Props) {
  return (
    <div className="container mx-auto max-w-2xl space-y-6 p-4 pt-[calc(5.5rem+env(safe-area-inset-top,0px))] pb-24">
      <header>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Configurações</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Personalize a aparência do Daily.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Cor principal</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Define botões, progresso e destaques do app.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {PRIMARY_COLORS.map((color) => (
            <button
              key={color.v}
              type="button"
              onClick={() => onPrimaryChange(color.v)}
              aria-label={color.label}
              aria-pressed={primary === color.v}
              className={`h-10 w-10 rounded-full border-2 transition ${
                primary === color.v
                  ? 'scale-110 border-foreground'
                  : 'border-border hover:border-border-strong'
              }`}
              style={{ backgroundColor: color.v }}
            />
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3">
          <div className="h-10 flex-1 overflow-hidden rounded-full border border-border bg-background">
            <div className="h-full w-2/3 rounded-full bg-primary" />
          </div>
          <button
            type="button"
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Exemplo
          </button>
        </div>
      </section>
    </div>
  );
}
