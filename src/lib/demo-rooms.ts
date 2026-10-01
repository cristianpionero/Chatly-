import { readCreatedRooms } from "@/lib/created-rooms";

/**
 * Sala del directorio (demo o creada por un usuario) ya normalizada.
 * Cuando exista base de datos, `demoRooms` desaparece y esta lista vendrá
 * del servidor con el mismo orden: los primeros publicados van primero.
 */
export type RoomItem = {
  id: string;
  emoji: string;
  name: string;
  topic: string;
  country: string;
  countryLabel: string;
  people: number;
  bridges: string[];
  /** Creada por un usuario (entra al chat interno). */
  mine: boolean;
  /** Orden de publicación: menor = publicado antes. */
  order: number;
};

/** Máximo de salas visibles en la pantalla de inicio. */
export const HOME_LIMIT = 20;
/** Salas por página en la pantalla "Ver todos". */
export const PAGE_SIZE = 30;

/** Ya no hay grupos de demostración: el directorio viene de la base de datos. */
export const demoRooms: RoomItem[] = [];

/** Salas creadas por usuarios, en orden de publicación (primero publicado, primero). */
export function readMyRoomItems(): RoomItem[] {
  return readCreatedRooms()
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((r, i) => ({
      id: r.id,
      emoji: r.emoji,
      name: r.name,
      topic: r.topic,
      country: r.country,
      countryLabel: r.countryLabel,
      people: r.people,
      bridges: r.bridges,
      mine: true,
      order: i,
    }));
}

/** Directorio completo: publicadas por usuarios primero, luego demos. */
export function readAllRooms(): RoomItem[] {
  return [...readMyRoomItems(), ...demoRooms];
}
