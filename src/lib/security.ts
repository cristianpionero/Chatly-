/**
 * Reglas de seguridad de un grupo (país + "Seguridad avanzada").
 *
 * Aquí se decide de verdad qué puede hacer un usuario en un grupo:
 * ver el chat, escribir, ver el perfil y abrir los enlaces de los proveedores.
 * Todas las pantallas usan esta misma función para que la seguridad se aplique
 * igual en todos lados.
 */

/** Configuración opcional de "Seguridad avanzada" que el admin define al crear el grupo. */
export type SeguridadAvanzada = {
  /** ¿Restringir el acceso a los proveedores por país? */
  restringirPorPais: boolean;
  /** "todos" = aplica a todos los proveedores, "algunos" = solo a los listados. */
  alcanceProveedores: "todos" | "algunos";
  /** Ids de proveedores afectados cuando el alcance es "algunos". */
  proveedores: string[];
  /** Modos donde aplica la restricción. */
  modos: "whatsapp"[];
  /** Otras regiones pueden ver el chat aunque no puedan participar. */
  otrasRegionesVenChat: boolean;
  /** Otras regiones pueden ver el perfil del grupo. */
  otrasRegionesVenPerfil: boolean;
  /** Aplicar la configuración a todos los grupos del admin. */
  aplicarATodosLosGrupos: boolean;
};

export type GrupoSeguro = {
  countryLabel: string;
  audience?: string;
  allowedCountries?: string[];
  adminId?: string;
  security?: SeguridadAvanzada;
};

export type UsuarioSeguro = {
  uid?: string;
  countryLabel?: string;
  signedIn?: boolean;
  /** Entró como explorador (sin cuenta) con el país guardado en su navegador. */
  esInvitado?: boolean;
};

/** El país del usuario debe coincidir con el del grupo (o estar en la lista permitida). */
export function paisPermitido(paisUsuario: string, grupo: GrupoSeguro): boolean {
  if (!paisUsuario) return false;
  const permitidos = grupo.allowedCountries ?? [];
  if (permitidos.length > 0) return permitidos.includes(paisUsuario);
  if (grupo.audience && /todos/i.test(grupo.audience)) return true;
  return paisUsuario === grupo.countryLabel;
}

export type Acceso = {
  /** El usuario es el administrador dueño del grupo. */
  esAdmin: boolean;
  /** El país del usuario está permitido en el grupo. */
  paisOk: boolean;
  /** Puede ver la sala de chat. */
  puedeVerChat: boolean;
  /** Puede escribir / enviar archivos. */
  puedeEscribir: boolean;
  /** Puede ver el perfil del grupo. */
  puedeVerPerfil: boolean;
  /** ¿Puede abrir el enlace de este proveedor? */
  puedeUsarProveedor: (proveedorId: string) => boolean;
  /** Mensaje claro para mostrar al usuario. */
  motivo: string;
};

const MODOS = ["whatsapp"] as const;

function permitido(): Acceso {
  return {
    esAdmin: false,
    paisOk: true,
    puedeVerChat: true,
    puedeEscribir: true,
    puedeVerPerfil: true,
    puedeUsarProveedor: () => true,
    motivo: "",
  };
}

/** Calcula qué puede hacer el usuario en el grupo. */
export function evaluarAcceso(grupo: GrupoSeguro | null, user: UsuarioSeguro): Acceso {
  if (!grupo) return permitido();

  const esAdmin = Boolean(user.uid && grupo.adminId && grupo.adminId === user.uid);
  if (esAdmin) return { ...permitido(), esAdmin: true };

  const adv = grupo.security;
  const pais = user.countryLabel ?? "";
  const paisOk = Boolean(user.signedIn) && paisPermitido(pais, grupo);
  if (paisOk) return permitido();

  // Restringe los proveedores salvo que el admin haya dicho expresamente que no.
  const restringeProveedores = adv ? adv.restringirPorPais : true;
  const alcance = adv?.alcanceProveedores ?? "todos";
  const listados = adv?.proveedores ?? [];
  const modos = adv?.modos ?? [];

  const puedeUsarProveedor = (proveedorId: string) => {
    if (!restringeProveedores) return true;
    const id = proveedorId.toLowerCase();
    const enAlcance = alcance === "todos" || listados.includes(id);
    if (!enAlcance) return true;
    const esModo = (MODOS as readonly string[]).includes(id);
    if (esModo && modos.length > 0 && !modos.includes(id as "whatsapp")) return true;
    return false;
  };

  const puedeVerChat = adv ? adv.otrasRegionesVenChat : true;
  const puedeVerPerfil = adv ? adv.otrasRegionesVenPerfil : true;

  const motivo = !user.signedIn
    ? "Inicia sesión con tu cuenta para verificar tu país y poder participar en este grupo."
    : user.esInvitado
      ? `Este grupo es solo para ${grupo.countryLabel || "otra región"}. Entraste como explorador de ${
          pais || "otro país"
        }.`
      : `Este grupo es solo para ${grupo.countryLabel || "otra región"}. Tu cuenta está registrada en ${
          pais || "otro país"
        }.`;

  return {
    esAdmin: false,
    paisOk: false,
    puedeVerChat,
    puedeEscribir: false,
    puedeVerPerfil,
    puedeUsarProveedor,
    motivo,
  };
}
