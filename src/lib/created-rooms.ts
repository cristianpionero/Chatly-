import type { SeguridadAvanzada } from "@/lib/security";

export type CreatedRoom = {
  id: string;
  /** Configuración de seguridad avanzada del grupo. */
  security?: SeguridadAvanzada;

  emoji: string;
  name: string;
  topic: string;
  country: string;
  countryLabel: string;
  people: number;
  bridges: string[];
  /** Proveedores con su enlace de invitación. */
  links?: { id: string; label: string; link: string }[];
  /** Foto de perfil del chat (data URL). Solo el administrador podrá cambiarla con base de datos. */
  avatar?: string;
  /** Estilo (tema) del chat. Solo el administrador dueño del grupo podrá cambiarlo. */
  theme?: string;
  description: string;
  audience: string;
  /** Países permitidos cuando la audiencia es "algunos países". */
  allowedCountries?: string[];
  /** Identificador del administrador dueño del grupo. */
  adminId?: string;
  /** PIN de 6 dígitos para entrar al panel del grupo. */
  pin?: string;
  /** Grupo bloqueado por fallos de PIN: no aparece en el inicio. */
  blocked?: boolean;
  createdAt: number;
  /**
   * Modos donde el administrador acepta prestar su grupo (se preguntó al crear).
   * Solo estos entran al directorio del modo WhatsApp.
   */
  shareModes?: "whatsapp"[];
};

const KEY = "chatly.rooms";

/** Aviso local de que la caché de grupos cambió. */
export function emitRoomsChanged() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("chatly:rooms"));
}

export function readCreatedRooms(): CreatedRoom[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CreatedRoom[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Guarda la sala nueva al inicio de la caché local. */
export function saveCreatedRoom(room: CreatedRoom) {
  if (typeof window === "undefined") return;
  const next = [room, ...readCreatedRooms().filter((r) => r.id !== room.id)];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  emitRoomsChanged();
}

/** Reemplaza la caché local con lo que hay en la base de datos. */
export function replaceCreatedRooms(rooms: CreatedRoom[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(rooms));
  emitRoomsChanged();
}

export function findCreatedRoom(id: string): CreatedRoom | undefined {
  return readCreatedRooms().find((r) => r.id === id);
}

/** Actualiza una sala en la caché local (la base de datos se actualiza aparte). */
export function updateCreatedRoom(id: string, patch: Partial<CreatedRoom>) {
  if (typeof window === "undefined") return;
  const next = readCreatedRooms().map((r) => (r.id === id ? { ...r, ...patch } : r));
  window.localStorage.setItem(KEY, JSON.stringify(next));
  emitRoomsChanged();
}

/** Solo el administrador dueño del grupo puede editar su perfil. */
export function canEditRoom(roomId: string, uid?: string): boolean {
  const room = findCreatedRoom(roomId);
  if (!room?.adminId) return true;
  return Boolean(uid) && room.adminId === uid;
}

/** Elimina un grupo de la caché local de salas. */
export function deleteCreatedRoom(id: string) {
  if (typeof window === "undefined") return;
  const next = readCreatedRooms().filter((r) => r.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  emitRoomsChanged();
}
