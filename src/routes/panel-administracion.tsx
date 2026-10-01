import { createFileRoute, useRouter, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Check, Globe, Loader2, Lock, X } from "lucide-react";
import { allCountries, countryRegions, isValidProviderLink, providers } from "@/lib/chatly-data";
import { readCreatedRooms, type CreatedRoom } from "@/lib/created-rooms";
import {
  actualizarAudienciaGrupo,
  actualizarEnlaceGrupo,
  actualizarNombreGrupo,
  asegurarPinGrupo,
  enlaceRepetido,
  obtenerGrupo,
} from "@/lib/db/grupos";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/panel-administracion")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search["id"] === "string" ? (search["id"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Panel de Administración — Chatly" },
      {
        name: "description",
        content: "Edita el nombre, enlace de WhatsApp y audiencia de tu grupo.",
      },
    ],
  }),
  component: PanelAdministracion,
});

type AudienceType = "mine" | "some" | "all";
type SaveStatus = "saved" | "waiting" | "saving" | "error";

function StatusIndicator({ status }: { status: SaveStatus }) {
  if (status === "waiting" || status === "saving") {
    return (
      <span className="flex items-center gap-1 text-[0.7rem] font-medium text-amber-500 dark:text-amber-400">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
        </span>
        <span className="text-[0.65rem] text-muted-foreground">Guardando en 3s...</span>
      </span>
    );
  }

  if (status === "saved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.68rem] font-bold text-emerald-600 dark:text-emerald-400">
        <Check className="h-3 w-3 stroke-[3]" />
        Guardado
      </span>
    );
  }

  return null;
}

function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
      />
      <div className="animate-in slide-in-from-bottom duration-300 relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-[2rem] border border-border bg-surface p-4 pb-8 shadow-[var(--shadow-float)]">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-full border border-border p-1.5 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function PanelAdministracion() {
  const router = useRouter();
  const search = useSearch({ from: "/panel-administracion" });
  const { tCountry } = useI18n();

  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<CreatedRoom | null>(null);
  const [pin, setPin] = useState("");
  const [copiedPin, setCopiedPin] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [nameStatus, setNameStatus] = useState<SaveStatus>("saved");

  const [waLink, setWaLink] = useState("");
  const [linkStatus, setLinkStatus] = useState<SaveStatus>("saved");
  const [linkError, setLinkError] = useState<string | null>(null);

  const [audience, setAudience] = useState<AudienceType>("mine");
  const [someCountries, setSomeCountries] = useState<string[]>([]);
  const [audienceStatus, setAudienceStatus] = useState<SaveStatus>("saved");
  const [showCountrySheet, setShowCountrySheet] = useState(false);

  const whatsappProvider = providers.find((p) => p.id === "whatsapp")!;

  // Timers
  const nameTimerRef = useRef<number | null>(null);
  const linkTimerRef = useRef<number | null>(null);

  // Cargar grupo al entrar
  useEffect(() => {
    let alive = true;
    async function init() {
      setLoading(true);
      let targetRoom: CreatedRoom | null = null;
      if (search.id) {
        targetRoom = await obtenerGrupo(search.id);
        if (!targetRoom) {
          const local = readCreatedRooms();
          targetRoom = local.find((r) => r.id === search.id) || null;
        }
      }
      if (!alive) return;

      if (targetRoom) {
        setRoom(targetRoom);
        setName(targetRoom.name);
        const link = targetRoom.links?.find((l) => l.id === "whatsapp")?.link || "";
        setWaLink(link);

        const aud = targetRoom.audience || "";
        if (
          aud.includes("algunos") ||
          aud.includes("seleccionados") ||
          (targetRoom.allowedCountries && targetRoom.allowedCountries.length > 1)
        ) {
          setAudience("some");
          setSomeCountries(targetRoom.allowedCountries || []);
        } else if (aud === "all" || aud.includes("todos") || aud.includes("Cualquiera")) {
          setAudience("all");
          setSomeCountries([]);
        } else {
          setAudience("mine");
          setSomeCountries([targetRoom.countryLabel]);
        }

        const p = await asegurarPinGrupo(targetRoom.id);
        if (alive) setPin(p || targetRoom.pin || "");
      }
      setLoading(false);
    }

    void init();
    return () => {
      alive = false;
    };
  }, [search.id]);

  // Copiar PIN de 15 dígitos al tocarlo
  function copyPin() {
    if (!pin) return;
    navigator.clipboard
      .writeText(pin)
      .then(() => {
        setCopiedPin(true);
        setTimeout(() => setCopiedPin(false), 2500);
      })
      .catch(() => {});
  }

  // 1. Manejo del Nombre (Auto-guardado tras 3 segundos)
  function handleNameChange(val: string) {
    setName(val);
    setNameStatus("waiting");
    if (nameTimerRef.current) clearTimeout(nameTimerRef.current);

    nameTimerRef.current = window.setTimeout(async () => {
      if (!room || !val.trim()) return;
      setNameStatus("saving");
      await actualizarNombreGrupo(room.id, val.trim());
      setNameStatus("saved");
    }, 3000);
  }

  // 2. Manejo del Enlace (Validación + Auto-guardado tras 3 segundos)
  function handleLinkChange(val: string) {
    setWaLink(val);
    setLinkError(null);
    setLinkStatus("waiting");
    if (linkTimerRef.current) clearTimeout(linkTimerRef.current);

    linkTimerRef.current = window.setTimeout(async () => {
      if (!room) return;
      const limpio = val.trim();
      if (!limpio) {
        setLinkError("El enlace no puede estar vacío.");
        setLinkStatus("error");
        return;
      }
      if (!isValidProviderLink(whatsappProvider, limpio)) {
        setLinkError("El enlace de WhatsApp no es válido (debe ser chat.whatsapp.com/...).");
        setLinkStatus("error");
        return;
      }

      setLinkStatus("saving");
      try {
        const repetido = await enlaceRepetido([limpio], room.id);
        if (repetido) {
          setLinkError("Ese enlace ya está publicado en otro grupo.");
          setLinkStatus("error");
          return;
        }

        await actualizarEnlaceGrupo(room.id, limpio);
        setLinkError(null);
        setLinkStatus("saved");
      } catch {
        setLinkError("Error al guardar el enlace. Inténtalo de nuevo.");
        setLinkStatus("error");
      }
    }, 3000);
  }

  // 3. Manejo de Audiencia (Auto-guardado inmediato al cambiar)
  async function handleAudienceChange(nextAud: AudienceType, customCountries?: string[]) {
    if (!room) return;
    setAudience(nextAud);
    setAudienceStatus("saving");

    const countries =
      nextAud === "all"
        ? allCountries.map((c) => c.label)
        : nextAud === "some"
          ? (customCountries ?? someCountries)
          : [room.countryLabel];

    const audText =
      nextAud === "all"
        ? "Todos pueden unirse"
        : nextAud === "mine"
          ? `Solo miembros de ${room.country} ${room.countryLabel}`
          : `${countries.length} países seleccionados`;

    await actualizarAudienciaGrupo(room.id, audText, countries);
    setAudienceStatus("saved");
  }

  function toggleCountry(cLabel: string) {
    const next = someCountries.includes(cLabel)
      ? someCountries.filter((c) => c !== cLabel)
      : [...someCountries, cLabel];
    setSomeCountries(next);
    void handleAudienceChange("some", next);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  if (!room) {
    if (!search.id) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center font-sans text-foreground">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Lock className="h-6 w-6 stroke-[2.5]" />
          </div>
          <h2 className="mt-4 font-display text-xl font-bold">Acceso mediante enlace privado</h2>
          <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
            Los paneles de administración en Chatly son privados. Para gestionar tu grupo debes
            ingresar utilizando el enlace único que recibes al momento de publicarlo.
          </p>
          <div className="mt-6 flex flex-col w-full max-w-xs gap-2.5">
            <Link
              to="/documentacion-panel"
              className="flex w-full items-center justify-center rounded-full bg-brand py-3 font-display text-xs font-bold text-brand-foreground shadow-sm hover:opacity-95 cursor-pointer"
            >
              Leer documentación del panel
            </Link>
            <Link
              to="/"
              className="flex w-full items-center justify-center rounded-full border border-border bg-surface py-2.5 font-display text-xs font-semibold text-foreground hover:bg-muted/40 cursor-pointer"
            >
              Ir a la página principal
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center font-sans text-foreground">
        <h2 className="font-display text-lg font-bold">No se encontró el grupo</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          El identificador no coincide con ningún grupo registrado o el enlace ha caducado.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => router.history.back()}
            className="rounded-full bg-brand px-5 py-2.5 font-display text-sm font-bold text-brand-foreground cursor-pointer"
          >
            Volver
          </button>
          <Link
            to="/documentacion-panel"
            className="rounded-full border border-border bg-surface px-5 py-2.5 font-display text-sm font-semibold text-foreground hover:bg-muted/40 cursor-pointer"
          >
            Ver documentación
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[22rem]"
      />

      {/* Header */}
      <header className="relative z-10 mx-auto w-full max-w-md px-4 pt-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.history.back()}
            aria-label="Volver"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:bg-muted/40 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          {/* PIN de 15 dígitos arriba a la derecha en letra verde pequeña (toca para copiar) */}
          {pin && (
            <button
              type="button"
              onClick={copyPin}
              className="group flex flex-col items-end transition-all active:scale-95 cursor-pointer text-right"
              title="Toca para copiar el PIN"
            >
              <span className="font-mono text-[0.72rem] font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                PIN: {pin}
              </span>
              <span className="text-[0.62rem] font-semibold text-emerald-600/70 dark:text-emerald-400/70 group-hover:underline">
                {copiedPin ? "¡Copiado!" : "(toca para copiar)"}
              </span>
            </button>
          )}
        </div>

        <div className="mt-4">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Panel de administración
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Los cambios que realices se guardan automáticamente.
          </p>
        </div>
      </header>

      {/* Main Form Fields */}
      <main className="relative z-10 mx-auto w-full max-w-md space-y-6 px-4 pt-6 pb-28">
        {/* Recuadro 1: Nombre */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display text-sm font-bold">Nombre</h2>
            <StatusIndicator status={nameStatus} />
          </div>
          <div className="chat-bubble px-3.5 py-3">
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Nombre del grupo"
              maxLength={100}
              className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
            />
          </div>
        </section>

        {/* Recuadro 2: Enlace de WhatsApp */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display text-sm font-bold">Enlace de WhatsApp</h2>
            <StatusIndicator status={linkStatus} />
          </div>
          <div className="chat-bubble px-3.5 py-3">
            <input
              type="url"
              value={waLink}
              onChange={(e) => handleLinkChange(e.target.value)}
              placeholder="https://chat.whatsapp.com/..."
              className="w-full bg-transparent text-sm font-mono outline-none placeholder:text-muted-foreground"
            />
          </div>
          {linkError && (
            <p className="rounded-xl bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive">
              {linkError}
            </p>
          )}
        </section>

        {/* Recuadro 3: Quién puede unirse */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-display text-sm font-bold">Quién puede unirse</h2>
            <StatusIndicator status={audienceStatus} />
          </div>

          {/* País de origen bloqueado / fijo */}
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-surface/50 px-3 py-2 text-xs text-muted-foreground">
            <span className="text-base">{room.country}</span>
            <span>
              País de origen: <strong className="text-foreground">{room.countryLabel}</strong>{" "}
              <span className="text-[0.68rem] text-muted-foreground/70">(fijo)</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {/* Solo mi país */}
            <button
              type="button"
              onClick={() => handleAudienceChange("mine")}
              className={`chat-bubble px-3.5 py-2.5 text-left transition-all cursor-pointer ${
                audience === "mine" ? "chat-bubble-active" : ""
              }`}
            >
              <span className="mr-1.5">{room.country}</span>
              <span className="font-display text-xs font-semibold">Solo {room.countryLabel}</span>
            </button>

            {/* Algunos países */}
            <button
              type="button"
              onClick={() => {
                setAudience("some");
                setShowCountrySheet(true);
              }}
              className={`chat-bubble px-3.5 py-2.5 text-left transition-all cursor-pointer ${
                audience === "some" ? "chat-bubble-active" : ""
              }`}
            >
              <span className="mr-1.5">📍</span>
              <span className="font-display text-xs font-semibold">Algunos países</span>
            </button>

            {/* Todos */}
            <button
              type="button"
              onClick={() => handleAudienceChange("all")}
              className={`chat-bubble px-3.5 py-2.5 text-left transition-all cursor-pointer ${
                audience === "all" ? "chat-bubble-active" : ""
              }`}
            >
              <Globe className="mr-1.5 inline h-3.5 w-3.5" />
              <span className="font-display text-xs font-semibold">Todos</span>
            </button>
          </div>

          {audience === "all" && (
            <p className="rounded-xl bg-accent px-3 py-2 text-xs font-medium text-accent-foreground">
              Cualquier persona puede unirse desde cualquier país.
            </p>
          )}

          {audience === "mine" && (
            <p className="text-xs text-muted-foreground">
              Solo podrán unirse personas de {room.countryLabel}.
            </p>
          )}

          {audience === "some" && someCountries.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {someCountries.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-[0.72rem] font-medium text-secondary-foreground"
                  >
                    <span>{allCountries.find((c) => c.label === label)?.flag}</span>
                    <span>{tCountry(label)}</span>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowCountrySheet(true)}
                className="text-xs font-semibold text-brand underline underline-offset-2 cursor-pointer"
              >
                Editar países seleccionados ({someCountries.length})
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Sheet para elegir países permitidos cuando audiencia es "algunos" */}
      {showCountrySheet && (
        <Sheet title="Países que pueden unirse" onClose={() => setShowCountrySheet(false)}>
          <div className="space-y-4 pt-1">
            {countryRegions.map((region) => (
              <div key={region.label}>
                <h3 className="mb-2 text-xs font-bold text-muted-foreground uppercase">
                  {region.label}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {region.countries.map((c) => {
                    const active = someCountries.includes(c.label);
                    return (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => toggleCountry(c.label)}
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? "border-brand bg-brand text-brand-foreground"
                            : "border-border bg-surface text-foreground"
                        }`}
                      >
                        <span>{c.flag}</span>
                        <span>{c.label}</span>
                        {active && <Check className="ml-1 h-3 w-3 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Sheet>
      )}
    </div>
  );
}
