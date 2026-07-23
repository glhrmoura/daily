import { useRef, useState, type ChangeEvent } from 'react';
import { Download, Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { AppLanguage } from '@/lib/settings';
import type { DailyStore } from '@/lib/storage';
import type { EncryptedBackupEnvelope } from '@/lib/backup';
import {
  createBackup,
  decryptBackupEnvelope,
  downloadBackup,
  downloadEncryptedBackup,
  readBackupFile,
} from '@/lib/backup';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/task/ConfirmDialog';
import { BackupPasswordDialog } from './components/BackupPasswordDialog';
import { PRIMARY_COLORS } from './constants';

type Props = {
  primary: string;
  language: AppLanguage;
  onPrimaryChange: (primary: string) => void;
  onLanguageChange: (language: AppLanguage) => void;
  getStore: () => DailyStore;
  onImportStore: (store: DailyStore) => void;
};

const LANGUAGES: { value: AppLanguage; labelKey: 'langPt' | 'langEn' | 'langEs' }[] = [
  { value: 'pt-BR', labelKey: 'langPt' },
  { value: 'en-US', labelKey: 'langEn' },
  { value: 'es-ES', labelKey: 'langEs' },
];

export function ConfigPage({
  primary,
  language,
  onPrimaryChange,
  onLanguageChange,
  getStore,
  onImportStore,
}: Props) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [importPasswordOpen, setImportPasswordOpen] = useState(false);
  const [pendingEncrypted, setPendingEncrypted] = useState<EncryptedBackupEnvelope | null>(null);
  const [pendingImport, setPendingImport] = useState<DailyStore | null>(null);

  const handleExportPlain = () => {
    try {
      downloadBackup(createBackup(getStore()));
      setExportOpen(false);
      toast.success(t('config.exportSuccess'));
    } catch {
      toast.error(t('config.exportError'));
    }
  };

  const handleExportEncrypted = async (password: string) => {
    try {
      await downloadEncryptedBackup(createBackup(getStore()), password);
      setExportOpen(false);
      toast.success(t('config.exportSuccess'));
    } catch {
      toast.error(t('config.exportError'));
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const inspected = await readBackupFile(file);
      if (inspected.type === 'encrypted') {
        setPendingEncrypted(inspected.envelope);
        setImportPasswordOpen(true);
        return;
      }
      setPendingImport(inspected.store);
    } catch {
      toast.error(t('config.importInvalid'));
    }
  };

  const handleUnlockImport = async (password: string) => {
    if (!pendingEncrypted) return;

    try {
      const store = await decryptBackupEnvelope(pendingEncrypted, password);
      setPendingEncrypted(null);
      setImportPasswordOpen(false);
      setPendingImport(store);
    } catch (error) {
      if (error instanceof Error && error.message === 'password') {
        toast.error(t('config.importWrongPassword'));
        return;
      }
      toast.error(t('config.importInvalid'));
    }
  };

  const handleConfirmImport = () => {
    if (!pendingImport) return;
    try {
      onImportStore(pendingImport);
      setPendingImport(null);
      toast.success(t('config.importSuccess'));
    } catch {
      toast.error(t('config.importError'));
    }
  };

  return (
    <div className="container mx-auto flex max-w-2xl flex-col gap-6 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-[calc(5.5rem+env(safe-area-inset-top,0px))]">
      <header>
        <h2 className="text-xl font-semibold tracking-tight">{t('config.title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('config.description')}</p>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">{t('config.language')}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('config.languageDescription')}</p>
        </div>
        <Select
          value={language}
          onValueChange={(value) => onLanguageChange(value as AppLanguage)}
        >
          <SelectTrigger
            aria-label={t('config.language')}
            className="h-12 w-auto min-w-48 rounded-xl border-border bg-background px-5"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(`config.${option.labelKey}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">{t('config.backup')}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('config.backupDescription')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={handleImportClick}>
            <Upload />
            {t('config.import')}
          </Button>
          <Button type="button" variant="outline" onClick={() => setExportOpen(true)}>
            <Download />
            {t('config.export')}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">{t('config.primaryColor')}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t('config.primaryColorDescription')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 overflow-hidden p-0.5">
          {PRIMARY_COLORS.map((color) => (
            <button
              key={color.v}
              type="button"
              onClick={() => onPrimaryChange(color.v)}
              aria-label={color.label}
              aria-pressed={primary === color.v}
              className={`h-10 w-10 rounded-full border-2 transition ${
                primary === color.v
                  ? 'border-foreground'
                  : 'border-border hover:border-border-strong'
              }`}
              style={{ backgroundColor: color.v }}
            />
          ))}
        </div>

        <div className="mt-6 border-t border-border pt-5">
          <h3 className="text-sm font-semibold">{t('config.example')}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('config.exampleDescription')}</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-10 flex-1 overflow-hidden rounded-full border border-border bg-background">
              <div className="h-full w-2/3 rounded-full bg-primary" />
            </div>
            <button
              type="button"
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {t('config.exampleButton')}
            </button>
          </div>
        </div>
      </section>

      <BackupPasswordDialog
        open={exportOpen}
        mode="export"
        onCancel={() => setExportOpen(false)}
        onExportPlain={handleExportPlain}
        onSubmit={handleExportEncrypted}
      />

      <BackupPasswordDialog
        open={importPasswordOpen}
        mode="import"
        onCancel={() => {
          setImportPasswordOpen(false);
          setPendingEncrypted(null);
        }}
        onSubmit={handleUnlockImport}
      />

      <ConfirmDialog
        open={!!pendingImport}
        title={t('config.importTitle')}
        description={t('config.importDescription', {
          count: pendingImport?.tasks.length ?? 0,
        })}
        confirmLabel={t('config.importConfirm')}
        onCancel={() => setPendingImport(null)}
        onConfirm={handleConfirmImport}
      />
    </div>
  );
}
