/**
 * Borrador del formulario de "crear grupo".
 *
 * Si la persona tiene que iniciar sesión a mitad del proceso, se guarda todo
 * lo que había escrito y al volver la pantalla queda exactamente igual.
 */

export type CrearDraft = {
  name: string;
  waLink: string;
  category: string;
  countryFlag: string;
  countryLabel: string;
  description: string;
  audience: "mine" | "some" | "all";
  someCountries: string[];
  terms: boolean;
};

const KEY = "chatly.crear.draft";

export function saveCrearDraft(draft: CrearDraft) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // sin almacenamiento simplemente no se recuerda el borrador
  }
}

export function readCrearDraft(): CrearDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CrearDraft) : null;
  } catch {
    return null;
  }
}

export function clearCrearDraft() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    // nada que limpiar
  }
}
