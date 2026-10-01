import { newId } from "@/lib/db/store";

/**
 * Gestión de identidad y sesión local basada en el dispositivo.
 * Guarda el ID único del dispositivo en localStorage para identificar al usuario
 * y al administrador de grupos sin necesidad de formularios de registro externos.
 */

export type LocalUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

const AUTH_STORAGE_KEY = "chatly.session.user";
const DEVICE_ID_KEY = "chatly.device.id";
const listeners = new Set<(user: LocalUser | null) => void>();

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server_device";
  try {
    let id = window.localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      // Si ya existía un usuario previo, reutilizar su ID
      const stored = getStoredUser();
      id = stored?.uid || newId();
      window.localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return newId();
  }
}

function getStoredUser(): LocalUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as LocalUser;

    // Auto-inicializar usuario con el ID del dispositivo
    const deviceId = getOrCreateDeviceId();
    const defaultUser: LocalUser = {
      uid: deviceId,
      displayName: "Administrador",
      email: null,
      photoURL: null,
    };
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  } catch {
    return null;
  }
}

function setStoredUser(user: LocalUser | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      window.localStorage.setItem(DEVICE_ID_KEY, user.uid);
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // almacenamiento local no disponible
  }
  listeners.forEach((cb) => cb(user));
}

/** Inicia la sesión guardándola en la sesión local. */
export async function signIn(): Promise<LocalUser> {
  const current = getStoredUser();
  if (current) return current;

  const deviceId = getOrCreateDeviceId();
  const newUser: LocalUser = {
    uid: deviceId,
    displayName: "Administrador",
    email: null,
    photoURL: null,
  };
  setStoredUser(newUser);
  return newUser;
}

/** Resuelve cualquier redirección pendiente. */
export async function resolveRedirect(): Promise<LocalUser | null> {
  return null;
}

export async function signOut(): Promise<void> {
  setStoredUser(null);
}

export function currentUser(): LocalUser | null {
  return getStoredUser();
}

/** Escucha los cambios de sesión. */
export function watchUser(cb: (user: LocalUser | null) => void) {
  listeners.add(cb);
  cb(getStoredUser());
  return () => {
    listeners.delete(cb);
  };
}
