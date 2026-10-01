import { useCallback, useEffect, useState } from "react";

/**
 * Ajustes locales de la aplicación (tema oscuro, idioma y perfil del usuario).
 * Por ahora se guardan en el navegador; cuando exista base de datos estos
 * valores viajarán con la cuenta del usuario.
 */

const THEME_KEY = "chatly.dark";
const LANG_KEY = "chatly.lang";
const PROFILE_KEY = "chatly.profile";

export type UserProfile = {
  /** Identificador del usuario en toda la app. */
  uid: string;
  name: string;
  handle: string;
  email: string;
  /** Foto de la cuenta de Google. */
  photo: string;
  countryFlag: string;
  countryLabel: string;
  /** Sesión iniciada. */
  signedIn: boolean;
};

export const guestProfile: UserProfile = {
  uid: "",
  name: "Invitado",
  handle: "@invitado",
  email: "",
  photo: "",
  countryFlag: "",
  countryLabel: "",
  signedIn: false,
};

/** Compatibilidad con importaciones antiguas. */
export const defaultProfile = guestProfile;

function emit(name: string) {
  window.dispatchEvent(new Event(name));
}

/* ---------------- modo oscuro ---------------- */

export function readDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(THEME_KEY) === "1";
}

export function applyDark(dark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", dark);
}

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const initial = readDark();
    setDark(initial);
    applyDark(initial);
    const sync = () => {
      const v = readDark();
      setDark(v);
      applyDark(v);
    };
    window.addEventListener("chatly:dark", sync);
    return () => window.removeEventListener("chatly:dark", sync);
  }, []);

  const toggle = useCallback(() => {
    const next = !readDark();
    window.localStorage.setItem(THEME_KEY, next ? "1" : "0");
    applyDark(next);
    emit("chatly:dark");
  }, []);

  return { dark, toggle };
}

/* ---------------- idioma ---------------- */

export function readLang(): string {
  if (typeof window === "undefined") return "es";
  return window.localStorage.getItem(LANG_KEY) ?? "es";
}

export function setLang(code: string) {
  window.localStorage.setItem(LANG_KEY, code);
  emit("chatly:lang");
}

export function useLang() {
  const [lang, setLangState] = useState("es");
  useEffect(() => {
    setLangState(readLang());
    const sync = () => setLangState(readLang());
    window.addEventListener("chatly:lang", sync);
    return () => window.removeEventListener("chatly:lang", sync);
  }, []);
  return lang;
}

/* ---------------- perfil / sesión ---------------- */

export function readProfile(): UserProfile {
  if (typeof window === "undefined") return guestProfile;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return guestProfile;
    return { ...guestProfile, ...(JSON.parse(raw) as Partial<UserProfile>) };
  } catch {
    return guestProfile;
  }
}

export function saveProfile(patch: Partial<UserProfile>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...readProfile(), ...patch }));
  emit("chatly:profile");
}

/** El nombre se extrae del correo (como hará el proveedor real). */
export function nameFromEmail(email: string) {
  const raw = email.split("@")[0] ?? "";
  return raw
    .split(/[._-]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

/**
 * Guarda en el navegador la sesión real (cuenta local del prototipo).
 * El país llega de la base de datos, donde es inmutable.
 */
export function applySession(data: {
  uid: string;
  name: string;
  email: string;
  photo?: string | null;
  countryFlag: string;
  countryLabel: string;
}) {
  saveProfile({
    uid: data.uid,
    name: data.name,
    handle: `@${(data.email.split("@")[0] || data.name).toLowerCase().replace(/\s+/g, "")}`,
    email: data.email,
    photo: data.photo ?? "",
    countryFlag: data.countryFlag,
    countryLabel: data.countryLabel,
    signedIn: true,
  });
}

/** Borra solo el perfil guardado en el navegador (sin cerrar la sesión local). */
export function clearLocalProfile() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_KEY);
  emit("chatly:profile");
}

/**
 * Cierra la sesión de verdad: borra el perfil guardado y cierra la cuenta local. Al terminar la app queda como invitado, con el botón de Google
 * disponible para volver a entrar.
 */
export async function signOutProfile() {
  if (typeof window === "undefined") return;
  try {
    const { signOut } = await import("@/lib/local-auth");
    await signOut();
  } catch {
    // aunque falle, la sesión local se limpia igual
  }
  window.localStorage.removeItem(PROFILE_KEY);
  // Limpia también los avisos por sala para que la próxima cuenta empiece limpia.
  for (const key of Object.keys(window.localStorage)) {
    if (key.startsWith("chatly.join.")) window.localStorage.removeItem(key);
  }
  emit("chatly:profile");
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(guestProfile);
  useEffect(() => {
    setProfile(readProfile());
    const sync = () => setProfile(readProfile());
    window.addEventListener("chatly:profile", sync);
    return () => window.removeEventListener("chatly:profile", sync);
  }, []);
  return profile;
}
