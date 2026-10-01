/**
 * Almacén local del prototipo.
 *
 * Sustituye a la base de datos remota: todo vive en el navegador
 * (localStorage) mientras se elige una base de datos nueva. La API pública
 * de `grupos.ts` y `usuarios.ts` se mantiene igual, así que el día que
 * exista base de datos solo hay que cambiar esos dos archivos.
 */

const PREFIX = "chatly.proto.";

export function readTable<T>(name: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PREFIX + name);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function writeTable<T>(name: string, rows: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + name, JSON.stringify(rows));
  } catch {
    // almacenamiento lleno: el prototipo sigue funcionando en memoria
  }
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
