import { readTable, writeTable } from "@/lib/db/store";
import { supabase } from "@/lib/supabase";

export type DbUsuario = {
  uid: string;
  nombre: string;
  pais: string;
  pais_flag: string;
  foto: string | null;
};

const COL = "usuarios";

function localUsuarios() {
  return readTable<DbUsuario>(COL);
}

function guardarLocal(usuario: DbUsuario) {
  const rows = localUsuarios();
  const index = rows.findIndex((row) => row.uid === usuario.uid);
  if (index >= 0) rows[index] = usuario;
  else rows.push(usuario);
  writeTable(COL, rows);
}

/**
 * Usuarios guardados en Supabase y en la caché local del dispositivo.
 * El país se guarda al publicar el primer grupo y queda registrado permanentemente.
 */
export async function registrarUsuario(user: {
  uid: string;
  nombre: string;
  pais: string;
  paisFlag: string;
  foto?: string | null;
}): Promise<DbUsuario | null> {
  const usuarioObj: DbUsuario = {
    uid: user.uid,
    nombre: user.nombre || "Administrador",
    pais: user.pais,
    pais_flag: user.paisFlag,
    foto: user.foto ?? null,
  };

  // 1. Guardar en memoria local
  guardarLocal(usuarioObj);

  // 2. Guardar en Supabase (app_users)
  try {
    const { error } = await supabase.from("app_users").upsert(
      {
        id: user.uid,
        name: usuarioObj.nombre,
        country_label: usuarioObj.pais,
        country_flag: usuarioObj.pais_flag,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (error) {
      console.warn("Error guardando usuario en Supabase:", error.message);
    }
  } catch (err) {
    console.warn("Excepción al sincronizar usuario con Supabase:", err);
  }

  return usuarioObj;
}

export async function obtenerUsuario(uid: string): Promise<DbUsuario | null> {
  if (!uid) return null;

  // 1. Intentar obtener de Supabase
  try {
    const { data, error } = await supabase
      .from("app_users")
      .select("*")
      .eq("id", uid)
      .maybeSingle();

    if (!error && data) {
      const u: DbUsuario = {
        uid: data.id,
        nombre: data.name || "Administrador",
        pais: data.country_label || "",
        pais_flag: data.country_flag || "",
        foto: null,
      };
      guardarLocal(u);
      return u;
    }
  } catch (err) {
    console.warn("Error consultando usuario en Supabase:", err);
  }

  // 2. Fallback a memoria local
  return localUsuarios().find((row) => row.uid === uid) ?? null;
}
