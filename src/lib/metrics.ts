/**
 * Métricas de confianza que se muestran en la portada.
 *
 * Las cifras salen de los grupos reales guardados en la base de datos.
 */
export const fmt = (n: number) => n.toLocaleString("es");

/** Texto de la insignia de la portada. */
export function metricsBadge(total: number): string {
  return `${fmt(total)} ${total === 1 ? "grupo" : "grupos"} de WhatsApp`;
}
