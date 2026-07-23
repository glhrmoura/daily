import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';

type Mode = 'export' | 'import';

type Props = {
  open: boolean;
  mode: Mode;
  onCancel: () => void;
  onSubmit: (password: string) => void;
  onExportPlain?: () => void;
};

export function BackupPasswordDialog({
  open,
  mode,
  onCancel,
  onSubmit,
  onExportPlain,
}: Props) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!open) return;
    setPassword('');
    setConfirmPassword('');
    setSubmitError('');
  }, [open]);

  const liveError = useMemo(() => {
    if (mode !== 'export') return '';
    if (password.length === 0 && confirmPassword.length === 0) return '';
    if (password.trim().length === 0) return t('config.passwordRequired');
    if (confirmPassword.length === 0) return '';
    if (password !== confirmPassword) return t('config.passwordMismatch');
    return '';
  }, [mode, password, confirmPassword, t]);

  const error = liveError || submitError;
  const canSubmitEncrypted =
    mode === 'import'
      ? password.trim().length > 0
      : password.trim().length > 0 && password === confirmPassword;

  if (!open) return null;

  const handleSubmit = () => {
    if (!password.trim()) {
      setSubmitError(t('config.passwordRequired'));
      return;
    }

    if (mode === 'export' && password !== confirmPassword) {
      setSubmitError(t('config.passwordMismatch'));
      return;
    }

    setSubmitError('');
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 animate-in zoom-in-95 duration-200">
        <h3 className="text-base font-semibold">
          {mode === 'export' ? t('config.exportPasswordTitle') : t('config.importPasswordTitle')}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {mode === 'export'
            ? t('config.exportPasswordDescription')
            : t('config.importPasswordDescription')}
        </p>

        <div className="mt-4 flex w-full flex-col gap-3">
          <Input
            type="password"
            autoFocus
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setSubmitError('');
            }}
            placeholder={t('config.passwordPlaceholder')}
            aria-label={t('config.passwordPlaceholder')}
            className="h-12 w-full px-4 text-base"
          />
          {mode === 'export' && (
            <Input
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                setSubmitError('');
              }}
              placeholder={t('config.passwordConfirmPlaceholder')}
              aria-label={t('config.passwordConfirmPlaceholder')}
              className="h-12 w-full px-4 text-base"
            />
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 whitespace-nowrap rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:border-border-strong"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmitEncrypted}
              className="flex-1 whitespace-nowrap rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
            >
              {mode === 'export' ? t('config.exportEncrypted') : t('config.unlockImport')}
            </button>
          </div>
          {mode === 'export' && onExportPlain && (
            <button
              type="button"
              onClick={onExportPlain}
              className="w-full whitespace-nowrap rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:border-border-strong"
            >
              {t('config.exportPlain')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
