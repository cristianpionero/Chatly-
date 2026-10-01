import type { AppMode } from "@/lib/app-mode";
import type { SeguridadAvanzada } from "@/lib/security";

import { readCreatedRooms } from "@/lib/created-rooms";

/**
 * Grupos del directorio del modo WhatsApp.
 *
 * En modo WhatsApp el usuario NO ve el enlace: solo se une. El enlace
 * se guarda aquí y se abre al confirmar los términos del grupo.
 */
export type ModeGroup = {
  id: string;
  emoji: string;
  name: string;
  topic: string;
  country: string;
  countryLabel: string;
  members: number;
  link: string;
  provider: "whatsapp";
  rules: string;
  createdAt: number;
  /** Seguridad del grupo (solo en grupos creados por usuarios). */
  security?: SeguridadAvanzada;
  adminId?: string;
  audience?: string;
  allowedCountries?: string[];
};

/** Dos grupos demo iniciales con el nuevo estilo en línea. */
export const demo: ModeGroup[] = [
  {
    id: "demo-tecnologia-global",
    emoji: "💻",
    name: "Comunidad de Tecnología & Inteligencia Artificial",
    topic: "Tecnología",
    country: "🇨🇴",
    countryLabel: "Colombia",
    members: 348,
    link: "https://chat.whatsapp.com/invite/tecnologia-ia-demo",
    provider: "whatsapp",
    rules:
      "Espacio abierto para desarrolladores, entusiastas de IA y tecnología. Acceso libre sin restricciones.",
    createdAt: 1711500000000,
    audience: "all",
    allowedCountries: [],
  },
  {
    id: "demo-emprendedores-colombia",
    emoji: "🚀",
    name: "Emprendedores & Startups Colombia",
    topic: "Trabajo",
    country: "🇨🇴",
    countryLabel: "Colombia",
    members: 215,
    link: "https://chat.whatsapp.com/invite/emprendedores-col-demo",
    provider: "whatsapp",
    rules: "Networking y colaboración de negocios. Acceso con filtro y restricciones de seguridad.",
    createdAt: 1711510000000,
    audience: "some",
    allowedCountries: ["Colombia"],
    security: {
      bloquearBots: true,
      verificarCuenta: true,
    },
  },
];

export type GroupBadge = {
  emojis: string;
  label: string;
};

/**
 * Indicadores emoji para cada grupo:
 * - Si se indicó que se puede unir cualquiera -> bandera del país y emoji del mundo (🇨🇴 🌍)
 * - Si puso restricción en ese país -> bandera del grupo y candado (🇨🇴 🔒)
 * - Si al grupo nomás se puede unir el país de ellos -> simplemente la bandera del país (🇨🇴)
 */
export function getGroupBadges(g: {
  country: string;
  countryLabel?: string;
  audience?: string;
  allowedCountries?: string[];
  security?: SeguridadAvanzada;
}): GroupBadge {
  const flag = g.country || "🌍";
  const audience = (g.audience ?? "").toLowerCase().trim();
  const allowed = g.allowedCountries ?? [];

  // Caso 2: Restricción detectada (algunos países, filtros o reglas de seguridad)
  const hasRestriction =
    audience === "some" ||
    audience.includes("seleccionados") ||
    audience.includes("algunos") ||
    Boolean(
      g.security &&
      (g.security.bloquearBots || g.security.verificarCuenta || g.security.limiteIngresosDia),
    );

  if (hasRestriction) {
    return {
      emojis: `${flag} 🔒`,
      label: "Acceso con restricción detectada",
    };
  }

  // Caso 3: Al grupo nomás se puede unir el país de ellos -> simplemente la bandera del país
  const isMineOnly =
    audience === "mine" ||
    audience.startsWith("solo") ||
    (allowed.length === 1 && allowed[0] === g.countryLabel);

  if (isMineOnly) {
    return {
      emojis: flag,
      label: `Solo miembros de ${g.countryLabel || "este país"}`,
    };
  }

  // Caso 1: Se puede unir cualquiera -> bandera del país y mundo
  return {
    emojis: `${flag} 🌍`,
    label: "Cualquiera puede unirse",
  };
}

const generated: ModeGroup[] = [];

/** Grupos disponibles en el modo indicado (los creados por usuarios van primero). */
export function readModeGroups(mode: AppMode): ModeGroup[] {
  if (mode !== "whatsapp") return [];
  const provider = mode;

  const mine: ModeGroup[] = readCreatedRooms()
    .filter((r) => (r.shareModes ?? []).includes(provider))
    // Lo más nuevo (o recién republicado) va primero.
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((r) => {
      const link = r.links?.find((l) => l.id === provider)?.link ?? "";
      const g: ModeGroup = {
        id: r.id,
        emoji: r.emoji,
        name: r.name,
        topic: r.topic,
        country: r.country,
        countryLabel: r.countryLabel,
        members: r.people,
        link,
        provider,
        rules: r.description,
        createdAt: r.createdAt,
      };
      if (r.security) g.security = r.security;
      if (r.adminId) g.adminId = r.adminId;
      if (r.audience) g.audience = r.audience;
      if (r.allowedCountries) g.allowedCountries = r.allowedCountries;
      return g;
    })
    .filter((g) => g.link.length > 0);

  const existingIds = new Set(mine.map((m) => m.id));
  const extraDemo = demo.filter((g) => g.provider === provider && !existingIds.has(g.id));

  return [...mine, ...extraDemo, ...generated.filter((g) => g.provider === provider)];
}

export function findModeGroup(mode: AppMode, id: string) {
  return readModeGroups(mode).find((g) => g.id === id);
}
