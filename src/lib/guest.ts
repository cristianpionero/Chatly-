import { useEffect, useState } from "react";

import { nameFromEmail, type UserProfile } from "@/lib/app-settings";
import type { UsuarioSeguro } from "@/lib/security";

/**
 * Modo explorador (visitante sin cuenta).
 *
 * El país y el apodo del explorador se guardan en el localStorage del
 * navegador para no volver a pedirlos en cada grupo. Además se marca la
 * pestaña con sessionStorage: si el usuario cierra la pestaña y vuelve a
 * abrir, el dato local se descarta y se le pregunta el país otra vez.
 */

const GUEST_KEY = "chatly.guest";
const TAB_KEY = "chatly.guest.tab";
export const GUEST_EVENT = "chatly:guest";

export type GuestIdentity = {
  /** País elegido por el explorador (mismo texto que usan los grupos). */
  countryLabel: string;
  /** Bandera del país. */
  countryFlag: string;
  /** Apodo con el que lo verán en los chats. */
  name: string;
};

const emptyGuest: GuestIdentity = { countryLabel: "", countryFlag: "", name: "" };

function emit() {
  window.dispatchEvent(new Event(GUEST_EVENT));
}

/** Borra el explorador guardado si esta es una pestaña nueva del navegador. */
function ensureSameTab() {
  if (typeof window === "undefined") return;
  try {
    if (window.sessionStorage.getItem(TAB_KEY) === "1") return;
    window.sessionStorage.setItem(TAB_KEY, "1");
    window.localStorage.removeItem(GUEST_KEY);
  } catch {
    // Si el navegador bloquea el almacenamiento, seguimos sin recordar nada.
  }
}

export function readGuest(): GuestIdentity {
  if (typeof window === "undefined") return emptyGuest;
  ensureSameTab();
  try {
    const raw = window.localStorage.getItem(GUEST_KEY);
    if (!raw) return emptyGuest;
    return { ...emptyGuest, ...(JSON.parse(raw) as Partial<GuestIdentity>) };
  } catch {
    return emptyGuest;
  }
}

export function saveGuest(patch: Partial<GuestIdentity>) {
  if (typeof window === "undefined") return;
  const next = { ...readGuest(), ...patch };
  try {
    window.localStorage.setItem(GUEST_KEY, JSON.stringify(next));
  } catch {
    // sin almacenamiento el modo explorador funciona solo en esta pantalla
  }
  emit();
}

export function clearGuest() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(GUEST_KEY);
  emit();
}

/** El explorador ya tiene país y apodo: no hay que preguntarle nada. */
export function guestReady(guest: GuestIdentity) {
  return Boolean(guest.countryLabel && guest.name.trim());
}

export function useGuest() {
  const [guest, setGuest] = useState<GuestIdentity>(emptyGuest);
  useEffect(() => {
    setGuest(readGuest());
    const sync = () => setGuest(readGuest());
    window.addEventListener(GUEST_EVENT, sync);
    return () => window.removeEventListener(GUEST_EVENT, sync);
  }, []);
  return guest;
}

/**
 * Identidad que usan las reglas de seguridad: la cuenta registrada si existe,
 * y si no, el país verificado del explorador.
 */
export function usuarioSeguro(profile: UserProfile, guest: GuestIdentity): UsuarioSeguro {
  if (profile.signedIn) return profile;
  if (guest.countryLabel) {
    return { uid: "", countryLabel: guest.countryLabel, signedIn: true, esInvitado: true };
  }
  return { uid: "", countryLabel: "", signedIn: false };
}

/** Nombre visible en el chat (cuenta registrada o apodo del explorador). */
export function nombreVisible(profile: UserProfile, guest: GuestIdentity) {
  if (profile.signedIn) return profile.name;
  return guest.name.trim() || "Explorador";
}

/**
 * Nombre que ve el administrador en el panel.
 * Si la persona ya se registró, el nombre se extrae de su correo; si entró
 * como invitado, se muestra el apodo que escribió.
 */
export function nombreDePanel(profile: UserProfile, guest: GuestIdentity) {
  if (profile.signedIn && profile.email) return nameFromEmail(profile.email) || profile.email;
  if (profile.signedIn) return profile.name;
  return guest.name.trim() || "Invitado";
}
