import { useEffect } from "react";
import { listarGrupos } from "@/lib/db/grupos";
import { replaceCreatedRooms, type CreatedRoom } from "@/lib/created-rooms";

/** Trae todos los grupos guardados y refresca la caché local del navegador. */
export async function syncRooms(): Promise<CreatedRoom[]> {
  try {
    const rooms = await listarGrupos();
    replaceCreatedRooms(rooms);
    return rooms;
  } catch {
    return [];
  }
}

/** Sincroniza al montar y vuelve a renderizar cuando la caché cambia. */
export function useRoomsSync(onChange: () => void) {
  useEffect(() => {
    void syncRooms().then(onChange);
    const handler = () => onChange();
    window.addEventListener("chatly:rooms", handler);
    return () => window.removeEventListener("chatly:rooms", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
