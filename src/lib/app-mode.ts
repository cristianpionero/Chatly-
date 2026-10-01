import { useEffect, useState } from "react";

/**
 * Modos de la aplicación.
 *
 * - "whatsapp": directorio verde, los grupos llevan al enlace de WhatsApp (modo por defecto).
 *
 * Se guarda en el navegador. Cuando exista base de datos, este valor se
 * guardará en la cuenta del usuario para que al volver a entrar la aplicación
 * lo encuentre exactamente en el modo que lo dejó.
 */
export type AppMode = "whatsapp";

export const DEFAULT_MODE: AppMode = "whatsapp";

const KEY = "chatly.mode";
const EVENT = "chatly:mode";

export const modeMeta: Record<
  AppMode,
  { id: AppMode; name: string; provider: string; cta: string }
> = {
  whatsapp: { id: "whatsapp", name: "Modo WhatsApp", provider: "WhatsApp", cta: "Unirme al grupo" },
};

export function readMode(): AppMode {
  if (typeof window === "undefined") return DEFAULT_MODE;
  return "whatsapp";
}

export function applyMode(mode: AppMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("mode-whatsapp", mode === "whatsapp");
}

export function setMode(mode: AppMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, mode);
  applyMode(mode);
  window.dispatchEvent(new Event(EVENT));
}

/** Modo activo, sincronizado entre pantallas. */
export function useAppMode(): AppMode {
  const [mode, setModeState] = useState<AppMode>(DEFAULT_MODE);
  useEffect(() => {
    const initial = readMode();
    setModeState(initial);
    applyMode(initial);
    const sync = () => {
      const v = readMode();
      setModeState(v);
      applyMode(v);
    };
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  return mode;
}
