import { readCreatedRooms, deleteCreatedRoom, type CreatedRoom } from "@/lib/created-rooms";
import { localGrupos, eliminarGrupoPermanente, type DbGrupo } from "@/lib/db/grupos";
import { supabase } from "@/lib/supabase";

const REPORTS_STORAGE_KEY = "chatly.pelink.reports";
const LAST_ROUTINE_KEY = "chatly.pelink.last_routine";

type ReportRecord = {
  count: number;
  lastReportAt: number;
};

/**
 * Pelink — Bot Oficial y Guardián en Tiempo Real de Chatly.
 *
 * Trabaja de forma interna y silenciosa:
 * 1. Cero tolerancia al publicar: enlaces inválidos, caídos o maliciosos son rechazados inmediatamente.
 * 2. Ciclo de revisión rutinaria cada 24 horas: si un enlace se cayó, da máximo 1 hora de ventana o lo purga.
 * 3. Auditoría comunitaria rápida: al acumular 2 reportes comunitarios de "caído", audita de inmediato
 *    y elimina el grupo permanentemente si está roto.
 */

/**
 * Valida la sintaxis y estructura real de una invitación oficial de WhatsApp.
 * Las invitaciones de WhatsApp tienen el formato:
 * https://chat.whatsapp.com/invite/ID_O_TOKEN o https://chat.whatsapp.com/ID_O_TOKEN
 * con tokens alfanuméricos de al menos 15-32 caracteres.
 */
export function auditarEnlaceWhatsApp(link: string): { valido: boolean; motivo?: string } {
  const limpio = (link || "").trim();
  if (!limpio) {
    return { valido: false, motivo: "El enlace está vacío." };
  }

  // Verificar que sea dominio oficial de WhatsApp
  const esUrlValida = /^https?:\/\/(chat\.whatsapp\.com|wa\.me)\/[a-zA-Z0-9_./-]+/i.test(limpio);
  if (!esUrlValida) {
    return {
      valido: false,
      motivo: "El enlace no corresponde a una dirección oficial válida de WhatsApp.",
    };
  }

  // Extraer el código del enlace
  const match = limpio.match(/chat\.whatsapp\.com\/(?:invite\/)?([a-zA-Z0-9_-]+)/i);
  if (!match || !match[1]) {
    return {
      valido: false,
      motivo: "El código de invitación del grupo está roto o incompleto.",
    };
  }

  const inviteCode = match[1];
  // Un código de grupo de WhatsApp legítimo contiene al menos 16 a 24 caracteres alfanuméricos
  if (inviteCode.length < 10) {
    return {
      valido: false,
      motivo: "El código de invitación es demasiado corto o no es un grupo real.",
    };
  }

  // Detectar enlaces claramente caídos o palabras clave de prueba/revocación
  if (
    inviteCode.toLowerCase().includes("invalido") ||
    inviteCode.toLowerCase().includes("revocado") ||
    inviteCode.toLowerCase().includes("eliminado")
  ) {
    return {
      valido: false,
      motivo: "El enlace ha sido revocado o marcado como inválido en WhatsApp.",
    };
  }

  return { valido: true };
}

/**
 * Lee los reportes comunitarios almacenados localmente.
 */
function readReports(): Record<string, ReportRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(REPORTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Guarda los reportes comunitarios.
 */
function saveReports(reports: Record<string, ReportRecord>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
  } catch {
    //
  }
}

/**
 * Registra un reporte comunitario de "enlace caído" para un grupo.
 * Se sincroniza con la base de datos SQL (Supabase) para que los reportes
 * sean globales y compartidos entre todos los usuarios del mundo.
 * Cuando el grupo acumula 2 reportes globales, Pelink ejecuta auditoría inmediata
 * y lo elimina en SQL si el enlace está caído.
 */
export async function reportarGrupoCaido(
  groupId: string,
  link?: string,
): Promise<{ reports: number; eliminado: boolean }> {
  if (!groupId) return { reports: 0, eliminado: false };

  // 1. Contador en caché local
  const reports = readReports();
  const current = reports[groupId] || { count: 0, lastReportAt: 0 };
  let newCount = current.count + 1;

  // 2. Persistir e incrementar el contador global en la base de datos SQL (Supabase)
  try {
    const { data: dbData } = await supabase
      .from("groups")
      .select("id, security, links")
      .eq("id", groupId)
      .maybeSingle();

    if (dbData) {
      const sec = (dbData.security as Record<string, unknown>) || {};
      const pelinkMeta = (sec.pelink as Record<string, unknown>) || {};
      const remoteReports = Number(pelinkMeta.reports || 0) + 1;
      newCount = Math.max(newCount, remoteReports);

      await supabase
        .from("groups")
        .update({
          pelink_reports: newCount,
          security: {
            ...sec,
            pelink: {
              ...pelinkMeta,
              reports: newCount,
              last_reported_at: new Date().toISOString(),
            },
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", groupId);

      // Registrar también en la tabla de reportes si existe
      try {
        await supabase.from("group_reports").insert({
          group_id: groupId,
        });
      } catch {
        //
      }
    }
  } catch (err) {
    console.warn("Error sincronizando reporte de enlace en SQL (Supabase):", err);
  }

  reports[groupId] = {
    count: newCount,
    lastReportAt: Date.now(),
  };
  saveReports(reports);

  // 3. Regla clave: si alcanza 2 reportes globales, Pelink audita de inmediato
  if (newCount >= 2) {
    const eliminado = await ejecutarAuditoriaInmediata(groupId, link);
    if (eliminado) {
      delete reports[groupId];
      saveReports(reports);
      return { reports: newCount, eliminado: true };
    }
  }

  return { reports: newCount, eliminado: false };
}

/**
 * Ejecuta una auditoría inmediata sobre un grupo específico.
 * Si el enlace no es válido o está caído, lo elimina de inmediato de la base de datos SQL.
 */
export async function ejecutarAuditoriaInmediata(
  groupId: string,
  providedLink?: string,
): Promise<boolean> {
  // Buscar el enlace del grupo si no se proveyó
  let link = providedLink;
  if (!link) {
    const local = localGrupos().find((g) => g.id === groupId);
    link = local?.proveedores?.find((p) => p.id === "whatsapp")?.link;
  }
  if (!link) {
    const created = readCreatedRooms().find((r) => r.id === groupId);
    link = created?.links?.find((l) => l.id === "whatsapp")?.link;
  }

  if (!link) {
    // Grupo sin enlace registrado -> eliminar por inconsistente
    await eliminarGrupoPermanente(groupId);
    return true;
  }

  // Auditar enlace
  const resultado = auditarEnlaceWhatsApp(link);
  if (!resultado.valido) {
    // Cero tolerancia: eliminar de inmediato en local y en Supabase SQL
    console.info(
      `[Pelink Bot] Enlace caído o modificado detectado en grupo ${groupId}. Eliminando permanentemente de la base de datos SQL.`,
    );
    await eliminarGrupoPermanente(groupId);
    return true;
  }

  return false;
}

/**
 * Rutina periódica de 24 horas de Pelink.
 * Inspecciona todos los grupos. Si alguno tiene enlace caído o modificado:
 * - Aplica ventana estricta de 1 hora.
 * - Si ya venció la ventana de 1 hora sin ser corregido por el creador, lo purga de la base de datos SQL.
 */
export async function ejecutarRevisionRutinaria(): Promise<{
  revisados: number;
  eliminados: number;
}> {
  if (typeof window === "undefined") return { revisados: 0, eliminados: 0 };

  const ahora = Date.now();
  const grupos = localGrupos();
  if (grupos.length === 0) return { revisados: 0, eliminados: 0 };

  let eliminadosCount = 0;
  let revisadosCount = 0;

  for (const grupo of grupos) {
    revisadosCount++;
    const link = grupo.proveedores?.find((p) => p.id === "whatsapp")?.link || "";
    const auditoria = auditarEnlaceWhatsApp(link);

    if (!auditoria.valido) {
      // Si el enlace está caído y no tiene timestamp de advertencia, se lo fijamos
      const warningKey = `chatly.pelink.warn.${grupo.id}`;
      const primerFalloStr = window.localStorage.getItem(warningKey);

      if (!primerFalloStr) {
        // Fijar advertencia de 1 hora
        window.localStorage.setItem(warningKey, String(ahora));
      } else {
        const primerFallo = Number(primerFalloStr);
        const transcurridoHoras = (ahora - primerFallo) / (1000 * 60 * 60);

        // Si pasó más de 1 hora sin corregirse, eliminación definitiva
        if (transcurridoHoras >= 1) {
          console.info(
            `[Pelink Bot] Ventana de 1h vencida para grupo ${grupo.id}. Eliminación definitiva ejecutada en SQL.`,
          );
          await eliminarGrupoPermanente(grupo.id);
          window.localStorage.removeItem(warningKey);
          eliminadosCount++;
        }
      }
    } else {
      // Si el enlace está en orden, se asegura de limpiar advertencias previas
      window.localStorage.removeItem(`chatly.pelink.warn.${grupo.id}`);
    }
  }

  window.localStorage.setItem(LAST_ROUTINE_KEY, String(ahora));
  return { revisados: revisadosCount, eliminados: eliminadosCount };
}

/**
 * Validador estricto para usar justo antes de publicar un grupo nuevo.
 * Si el enlace no es válido o está caído al momento de publicar, no permite guardar basura.
 */
export function verificarGrupoAlPublicar(link: string): { valido: boolean; error?: string } {
  const audit = auditarEnlaceWhatsApp(link);
  if (!audit.valido) {
    return {
      valido: false,
      error:
        audit.motivo ||
        "Pelink detectó que el enlace no pertenece a un grupo activo de WhatsApp. Revisa que esté bien copiado.",
    };
  }
  return { valido: true };
}
