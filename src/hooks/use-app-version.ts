import { useEffect, useState } from 'react';

export function useAppVersion() {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    let cancelled = false;

    const readVersion = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const worker = registration.active ?? registration.waiting ?? registration.installing;
        if (!worker) return;

        const versionFromWorker = await new Promise<string | null>((resolve) => {
          const channel = new MessageChannel();
          const timeout = window.setTimeout(() => resolve(null), 2000);

          channel.port1.onmessage = (event) => {
            window.clearTimeout(timeout);
            const value = event.data?.version;
            resolve(typeof value === 'string' ? value : null);
          };

          worker.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
        });

        if (!cancelled) setVersion(versionFromWorker);
      } catch {
        if (!cancelled) setVersion(null);
      }
    };

    void readVersion();

    return () => {
      cancelled = true;
    };
  }, []);

  return version;
}
