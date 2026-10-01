import { useEffect, useState } from "react";

/**
 * Detecta si la app se está ejecutando instalada (PWA en modo standalone)
 * en lugar de dentro del navegador web.
 *
 * Devuelve `null` mientras no se sabe (SSR / primer render) para evitar
 * diferencias de hidratación.
 */
export function useStandalone(): boolean | null {
  const [standalone, setStandalone] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    const compute = () =>
      media.matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.startsWith("android-app://");

    setStandalone(compute());
    const onChange = () => setStandalone(compute());
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return standalone;
}
