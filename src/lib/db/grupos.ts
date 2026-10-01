import { emitRoomsChanged, type CreatedRoom } from "@/lib/created-rooms";
import type { SeguridadAvanzada } from "@/lib/security";
import { readTable, writeTable, newId } from "@/lib/db/store";
import { supabase } from "@/lib/supabase";

export type { SeguridadAvanzada };

/** Grupos publicados en la base de datos de la aplicación. */
export type DbGrupo = {
  id: string;
  nombre: string;
  categoria: string;
  emoji: string;
  pais: string;
  pais_flag: string;
  descripcion: string;
  admin_id: string;
  proveedores: { id: string; label: string; link: string }[];
  seguridad: { audiencia?: string; paises?: string[]; avanzada?: SeguridadAvanzada };
  estilo: string | null;
  avatar: string | null;
  personas: number;
  modos: string[];
  creado_en: string;
  /** PIN único de 15 dígitos del panel del grupo. */
  pin?: string;
  /** Bloqueado tras intentos fallidos o baneo. */
  bloqueado?: boolean;
};

const COL = "grupos";

function localGrupos() {
  return readTable<DbGrupo>(COL);
}

function guardarGrupoLocal(grupo: DbGrupo) {
  const rows = localGrupos();
  const index = rows.findIndex((row) => row.id === grupo.id);
  if (index >= 0) rows[index] = grupo;
  else rows.unshift(grupo);
  writeTable(COL, rows);
  emitRoomsChanged();
}

function supabaseRowToDbGrupo(row: Record<string, unknown>): DbGrupo {
  return {
    id: String(row.id || ""),
    nombre: String(row.name || ""),
    categoria: String(row.topic || "Otros"),
    emoji: String(row.emoji || "💬"),
    pais: String(row.country_label || "Colombia"),
    pais_flag: String(row.country || "🇨🇴"),
    descripcion: String(row.description || ""),
    admin_id: String(row.owner_id || ""),
    proveedores: Array.isArray(row.links)
      ? (row.links as { id: string; label: string; link: string }[])
      : [],
    seguridad: {
      audiencia: String(row.audience || "all"),
      paises: Array.isArray(row.allowed_countries) ? (row.allowed_countries as string[]) : [],
      avanzada: (row.security as SeguridadAvanzada) || undefined,
    },
    estilo: row.theme ? String(row.theme) : null,
    avatar: row.avatar ? String(row.avatar) : null,
    personas: Number(row.people) || 1,
    modos: Array.isArray(row.share_modes) ? (row.share_modes as string[]) : ["whatsapp"],
    creado_en: String(row.created_at || new Date().toISOString()),
    pin: row.pin ? String(row.pin) : undefined,
    bloqueado: Boolean(row.blocked),
  };
}

export function grupoToRoom(g: DbGrupo): CreatedRoom {
  const room: CreatedRoom = {
    id: g.id,
    emoji: g.emoji || "💬",
    name: g.nombre,
    topic: g.categoria,
    country: g.pais_flag,
    countryLabel: g.pais,
    people: g.personas || 1,
    bridges: (g.proveedores ?? []).map((p) => p.label),
    links: g.proveedores ?? [],
    description: g.descripcion,
    audience: g.seguridad?.audiencia ?? "",
    allowedCountries: g.seguridad?.paises ?? [],
    adminId: g.admin_id,
    createdAt: new Date(g.creado_en).getTime(),
    shareModes: (g.modos ?? []) as NonNullable<CreatedRoom["shareModes"]>,
  };
  if (g.seguridad?.avanzada) room.security = g.seguridad.avanzada;
  if (g.avatar) room.avatar = g.avatar;
  if (g.estilo) room.theme = g.estilo;
  if (g.pin) room.pin = g.pin;
  if (g.bloqueado) room.blocked = true;
  return room;
}

/** PIN único de 15 dígitos. */
export function generarPin(): string {
  let pin = "";
  for (let i = 0; i < 15; i++) {
    pin += Math.floor(Math.random() * 10).toString();
  }
  return pin;
}

export class LinkDuplicadoError extends Error {
  constructor(public link: string) {
    super("Ese enlace ya está publicado en otro grupo.");
  }
}

/** Todos los grupos publicados, sincronizados desde Supabase. */
export async function listarGrupos(): Promise<CreatedRoom[]> {
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("blocked", false)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const gruposRemotos = data.map(supabaseRowToDbGrupo);
      writeTable(COL, gruposRemotos);
      return gruposRemotos.map(grupoToRoom);
    }
  } catch (err) {
    console.warn("Error obteniendo grupos de Supabase, usando local:", err);
  }

  return localGrupos()
    .filter((g) => !g.bloqueado)
    .sort((a, b) => b.creado_en.localeCompare(a.creado_en))
    .map(grupoToRoom);
}

export async function listarGruposDeAdmin(adminId: string): Promise<CreatedRoom[]> {
  if (!adminId) return [];
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("owner_id", adminId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map(supabaseRowToDbGrupo).map(grupoToRoom);
    }
  } catch (err) {
    console.warn("Error obteniendo grupos de admin en Supabase:", err);
  }

  const rows = localGrupos().filter((row) => row.admin_id === adminId);
  return rows.sort((a, b) => b.creado_en.localeCompare(a.creado_en)).map(grupoToRoom);
}

export async function obtenerGrupo(id: string): Promise<CreatedRoom | null> {
  if (!id) return null;
  try {
    const { data, error } = await supabase.from("groups").select("*").eq("id", id).maybeSingle();

    if (!error && data) {
      const dbGrupo = supabaseRowToDbGrupo(data);
      guardarGrupoLocal(dbGrupo);
      return grupoToRoom(dbGrupo);
    }
  } catch (err) {
    console.warn("Error consultando grupo en Supabase:", err);
  }

  const local = localGrupos().find((row) => row.id === id);
  return local ? grupoToRoom(local) : null;
}

/** ¿Alguno de estos enlaces ya está usado por otro grupo? */
export async function enlaceRepetido(
  links: string[],
  ignorarGrupoId?: string,
): Promise<string | null> {
  const limpios = links.map((l) => l.trim().toLowerCase()).filter(Boolean);
  if (limpios.length === 0) return null;

  try {
    const { data, error } = await supabase.from("groups").select("id, links");
    if (!error && data) {
      for (const g of data) {
        if (g.id === ignorarGrupoId) continue;
        const provs = Array.isArray(g.links) ? g.links : [];
        for (const p of provs) {
          if (limpios.includes((p.link || "").trim().toLowerCase())) return p.link;
        }
      }
      return null;
    }
  } catch {
    // Fallback a chequeo local
  }

  for (const g of localGrupos()) {
    if (g.id === ignorarGrupoId) continue;
    for (const p of g.proveedores ?? []) {
      if (limpios.includes(p.link.trim().toLowerCase())) return p.link;
    }
  }
  return null;
}

export type NuevoGrupo = {
  nombre: string;
  categoria: string;
  emoji: string;
  pais: string;
  paisFlag: string;
  descripcion: string;
  adminId: string;
  proveedores: { id: string; label: string; link: string }[];
  seguridad: { audiencia: string; paises: string[]; avanzada?: SeguridadAvanzada };
  estilo?: string | null;
  modos: string[];
};

/** Crea el grupo validando que ningún enlace esté repetido y guardándolo en Supabase. */
export async function crearGrupo(input: NuevoGrupo): Promise<CreatedRoom> {
  const links = input.proveedores.map((p) => p.link);
  const repetido = await enlaceRepetido(links);
  if (repetido) throw new LinkDuplicadoError(repetido);

  const id = newId();
  const pin15 = generarPin();
  const grupo: DbGrupo = {
    id,
    nombre: input.nombre,
    categoria: input.categoria,
    emoji: input.emoji,
    pais: input.pais,
    pais_flag: input.paisFlag,
    descripcion: input.descripcion,
    admin_id: input.adminId,
    proveedores: input.proveedores,
    seguridad: {
      audiencia: input.seguridad.audiencia,
      paises: input.seguridad.paises,
      ...(input.seguridad.avanzada ? { avanzada: input.seguridad.avanzada } : {}),
    },
    estilo: input.estilo ?? null,
    avatar: null,
    personas: 1,
    modos: input.modos,
    creado_en: new Date().toISOString(),
    pin: pin15,
    bloqueado: false,
  };

  // 1. Asegurar primero que el usuario exista en la tabla app_users
  try {
    await supabase.from("app_users").upsert(
      {
        id: input.adminId,
        name: "Administrador",
        country_label: input.pais,
        country_flag: input.paisFlag,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  } catch (uErr) {
    console.warn("Error al registrar app_users antes de crear grupo:", uErr);
  }

  // 2. Guardar en Supabase (public.groups)
  try {
    const { error: insertError } = await supabase.from("groups").insert({
      id: grupo.id,
      owner_id: grupo.admin_id,
      name: grupo.nombre,
      description: grupo.descripcion,
      topic: grupo.categoria,
      country: grupo.pais_flag,
      country_label: grupo.pais,
      emoji: grupo.emoji,
      links: grupo.proveedores,
      audience: grupo.seguridad.audiencia || "all",
      allowed_countries: grupo.seguridad.paises || [],
      people: grupo.personas,
      bridges: (grupo.proveedores || []).map((p) => p.label),
      avatar: grupo.avatar,
      theme: grupo.estilo,
      pin: grupo.pin,
      blocked: false,
      share_modes: grupo.modos,
      security: grupo.seguridad.avanzada || {},
      created_at: grupo.creado_en,
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      console.warn("Error insertando grupo en Supabase:", insertError.message);
    }
  } catch (err) {
    console.warn("Excepción al guardar grupo en Supabase:", err);
  }

  // 3. Guardar en memoria local
  guardarGrupoLocal(grupo);
  return grupoToRoom(grupo);
}

/**
 * Devuelve el PIN de 15 dígitos del grupo; si no tiene o es de menos de 15 dígitos, le crea uno nuevo.
 */
export async function asegurarPinGrupo(id: string): Promise<string | null> {
  const local = localGrupos().find((row) => row.id === id);
  if (local?.pin && local.pin.length === 15) return local.pin;
  const pin = generarPin();
  if (local) guardarGrupoLocal({ ...local, pin });
  try {
    await supabase.from("groups").update({ pin }).eq("id", id);
  } catch {
    //
  }
  return pin;
}

/** Cambia el nombre del grupo (auto-guardado desde el Panel). */
export async function actualizarNombreGrupo(id: string, nuevoNombre: string): Promise<void> {
  const limpio = nuevoNombre.trim();
  if (!limpio) return;

  const local = localGrupos().find((row) => row.id === id);
  if (local) {
    guardarGrupoLocal({ ...local, nombre: limpio });
  }

  try {
    await supabase
      .from("groups")
      .update({ name: limpio, updated_at: new Date().toISOString() })
      .eq("id", id);
  } catch (err) {
    console.warn("Error actualizando nombre en Supabase:", err);
  }
}

/** Cambia el enlace de WhatsApp del grupo (auto-guardado tras validar). */
export async function actualizarEnlaceGrupo(id: string, nuevoLink: string): Promise<void> {
  const limpio = nuevoLink.trim();
  if (!limpio) return;

  const repetido = await enlaceRepetido([limpio], id);
  if (repetido) throw new LinkDuplicadoError(repetido);

  const proveedores = [{ id: "whatsapp", label: "WhatsApp", link: limpio }];
  const local = localGrupos().find((row) => row.id === id);
  if (local) {
    guardarGrupoLocal({ ...local, proveedores });
  }

  try {
    await supabase
      .from("groups")
      .update({
        links: proveedores,
        bridges: ["WhatsApp"],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  } catch (err) {
    console.warn("Error actualizando enlace en Supabase:", err);
  }
}

/** Cambia la audiencia de quién puede unirse (auto-guardado desde el Panel). */
export async function actualizarAudienciaGrupo(
  id: string,
  audiencia: string,
  paisesPermitidos: string[],
): Promise<void> {
  const local = localGrupos().find((row) => row.id === id);
  if (local) {
    const seguridad = {
      ...(local.seguridad ?? {}),
      audiencia,
      paises: paisesPermitidos,
    };
    guardarGrupoLocal({ ...local, seguridad });
  }

  try {
    await supabase
      .from("groups")
      .update({
        audience: audiencia,
        allowed_countries: paisesPermitidos,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  } catch (err) {
    console.warn("Error actualizando audiencia en Supabase:", err);
  }
}

/** Bloquea el grupo: deja de aparecer en el inicio de la aplicación. */
export async function bloquearGrupo(id: string): Promise<void> {
  const local = localGrupos().find((row) => row.id === id);
  if (local) guardarGrupoLocal({ ...local, bloqueado: true });
  try {
    await supabase.from("groups").update({ blocked: true }).eq("id", id);
  } catch {
    //
  }
}

/** Cambia el nombre del grupo (compatibilidad). */
export async function renombrarGrupo(id: string, nombre: string): Promise<void> {
  return actualizarNombreGrupo(id, nombre);
}

/**
 * Cambia el enlace de invitación y republica el grupo.
 */
export async function republicarConEnlace(id: string, link: string): Promise<string> {
  const limpio = link.trim();
  const repetido = await enlaceRepetido([limpio], id);
  if (repetido) throw new LinkDuplicadoError(repetido);

  const creado_en = new Date().toISOString();
  const proveedores = [{ id: "whatsapp", label: "WhatsApp", link: limpio }];
  const local = localGrupos().find((row) => row.id === id);
  if (local) guardarGrupoLocal({ ...local, proveedores, creado_en });

  try {
    await supabase
      .from("groups")
      .update({
        links: proveedores,
        created_at: creado_en,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  } catch {
    //
  }
  return creado_en;
}

/** Guarda la lista de países que todavía pueden unirse. */
export async function actualizarPaisesPermitidos(id: string, paises: string[]): Promise<void> {
  return actualizarAudienciaGrupo(id, "some", paises);
}

/**
 * Realiza un cambio rápido del enlace de un grupo usando su PIN de 15 dígitos.
 * Verifica que el PIN exista, que el nuevo enlace sea válido y no esté repetido,
 * actualiza el grupo en Supabase y lo republica.
 */
export async function actualizarGrupoPorPin(pin: string, nuevoLink: string): Promise<CreatedRoom> {
  const pinLimpio = pin.trim();
  const linkLimpio = nuevoLink.trim();

  if (!pinLimpio) {
    throw new Error("Por favor ingresa la clave / PIN de 15 dígitos de tu grupo.");
  }
  if (!linkLimpio) {
    throw new Error("Por favor ingresa el nuevo enlace de WhatsApp.");
  }

  // 1. Buscar el grupo que tenga ese PIN (primero en Supabase, luego local)
  let grupoEncontrado: DbGrupo | null = null;
  try {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("pin", pinLimpio)
      .maybeSingle();

    if (!error && data) {
      grupoEncontrado = supabaseRowToDbGrupo(data);
    }
  } catch (err) {
    console.warn("Error buscando grupo por PIN en Supabase:", err);
  }

  if (!grupoEncontrado) {
    const local = localGrupos().find((row) => (row.pin || "").trim() === pinLimpio);
    if (local) {
      grupoEncontrado = local;
    }
  }

  if (!grupoEncontrado) {
    throw new Error("El PIN de 15 dígitos no coincide con ningún grupo registrado.");
  }

  // 2. Verificar que el nuevo enlace no esté ya en uso por otro grupo distinto
  const repetido = await enlaceRepetido([linkLimpio], grupoEncontrado.id);
  if (repetido) {
    throw new LinkDuplicadoError(repetido);
  }

  // 3. Actualizar proveedores y timestamp (republicar)
  const creado_en = new Date().toISOString();
  const proveedores = [{ id: "whatsapp", label: "WhatsApp", link: linkLimpio }];
  const grupoActualizado: DbGrupo = {
    ...grupoEncontrado,
    proveedores,
    creado_en,
  };

  guardarGrupoLocal(grupoActualizado);

  try {
    const { error: updateErr } = await supabase
      .from("groups")
      .update({
        links: proveedores,
        created_at: creado_en,
        updated_at: new Date().toISOString(),
      })
      .eq("id", grupoEncontrado.id);

    if (updateErr) {
      console.warn("Error actualizando grupo por PIN en Supabase:", updateErr);
    }
  } catch (err) {
    console.warn("Excepción al actualizar por PIN en Supabase:", err);
  }

  return grupoToRoom(grupoActualizado);
}
