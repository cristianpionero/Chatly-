import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, CheckCheck, Globe, Loader2, Plus, X } from "lucide-react";
import logo from "@/assets/chatly-logo.png";
import {
  allCountries,
  categories,
  countryRegions,
  featuredCountries,
  isValidProviderLink,
  providers,
  type Country,
} from "@/lib/chatly-data";
import { saveCreatedRoom, type CreatedRoom } from "@/lib/created-rooms";
import {
  actualizarGrupoPorPin,
  crearGrupo,
  enlaceRepetido,
  LinkDuplicadoError,
} from "@/lib/db/grupos";

import { useProfile, saveProfile } from "@/lib/app-settings";
import { useAppMode } from "@/lib/app-mode";
import { useI18n } from "@/lib/i18n";
import { ProviderLogo } from "@/components/ProviderLogo";
import { getOrCreateDeviceId } from "@/lib/local-auth";
import { registrarUsuario } from "@/lib/db/usuarios";

export const Route = createFileRoute("/crear")({
  head: () => ({
    meta: [
      { title: "Crear chat en Chatly — Publica tu grupo" },
      {
        name: "description",
        content:
          "Crea tu sala en Chatly: nombre, categoría, país, descripción y enlaces de WhatsApp o Discord.",
      },
      { property: "og:title", content: "Crear chat en Chatly — Publica tu grupo" },
      {
        property: "og:description",
        content: "Formulario para crear y publicar tu chat con puentes a WhatsApp y Discord.",
      },
    ],
  }),
  component: CrearChat,
});

const NAME_MAX = 80;
const DESC_MAX = 150;
const FALLBACK_COUNTRY: Country = { flag: "🇨🇴", label: "Colombia" };

type AddedProvider = { id: string; label: string; emoji: string; link: string };
type Audience = "mine" | "some" | "all";

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
          <button onClick={onClose} className="rounded-full border border-border p-1.5">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Step({ n, label, hint }: { n: number; label: string; hint?: string }) {
  return (
    <div className="mb-2 flex items-baseline gap-2">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[0.6rem_0.6rem_0.6rem_0.15rem] brand-gradient font-display text-[0.65rem] font-bold text-brand-foreground">
        {n}
      </span>
      <h2 className="font-display text-sm font-bold">{label}</h2>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

function CrearChat() {
  const navigate = useNavigate();
  const profile = useProfile();
  const appMode = useAppMode();
  const isMode = true;
  const { t, lang, tCategory, tCountry, tRegion } = useI18n();
  const MY_COUNTRY: Country = profile.countryLabel
    ? { flag: profile.countryFlag, label: profile.countryLabel }
    : FALLBACK_COUNTRY;

  const [name, setName] = useState("");
  const [waLink, setWaLink] = useState("");
  const whatsappProvider = providers.find((p) => p.id === "whatsapp")!;
  const waTrimmed = waLink.trim();
  const waValid = isValidProviderLink(whatsappProvider, waTrimmed);
  // Verificación instantánea: ¿ese enlace ya está publicado en otro grupo?
  const [linkCheck, setLinkCheck] = useState<"idle" | "checking" | "free" | "taken">("idle");
  useEffect(() => {
    if (!waValid) {
      setLinkCheck("idle");
      return;
    }
    let cancelado = false;
    setLinkCheck("checking");
    const timer = window.setTimeout(() => {
      void enlaceRepetido([waTrimmed])
        .then((repetido) => {
          if (!cancelado) setLinkCheck(repetido ? "taken" : "free");
        })
        .catch(() => {
          if (!cancelado) setLinkCheck("free");
        });
    }, 250);
    return () => {
      cancelado = true;
      window.clearTimeout(timer);
    };
  }, [waTrimmed, waValid]);
  const added: AddedProvider[] = waValid
    ? [
        {
          id: whatsappProvider.id,
          label: whatsappProvider.label,
          emoji: whatsappProvider.emoji,
          link: waTrimmed,
        },
      ]
    : [];
  const [category, setCategory] = useState(categories[0]!.label);
  const [country, setCountry] = useState<Country>(featuredCountries[1]!);
  // Por seguridad, el país del grupo arranca en el país de la cuenta.
  useEffect(() => {
    if (profile.countryLabel)
      setCountry({ flag: profile.countryFlag, label: profile.countryLabel });
  }, [profile.countryFlag, profile.countryLabel]);
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState<Audience>("mine");
  const [someCountries, setSomeCountries] = useState<string[]>([]);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishingMessageIndex, setPublishingMessageIndex] = useState(0);
  const publishingMessages = [
    "Si necesitas cambiar el enlace, bórralo y publica uno nuevo.",
    "Revisa que todo esté correcto para evitar que tu grupo quede en revisión.",
    "¡Listo! Tu grupo estará disponible en unos segundos.",
  ];

  useEffect(() => {
    if (!publishing) return;
    const timer = window.setInterval(() => {
      setPublishingMessageIndex((index) => (index + 1) % publishingMessages.length);
    }, 850);
    return () => window.clearInterval(timer);
  }, [publishing, publishingMessages.length]);

  const [sheet, setSheet] = useState<null | "categories" | "countries" | "audience">(null);

  // Estados para el cambio rápido por PIN
  const [showQuickChange, setShowQuickChange] = useState(false);
  const [quickPin, setQuickPin] = useState("");
  const [quickNewLink, setQuickNewLink] = useState("");
  const [quickState, setQuickState] = useState<"form" | "loading" | "success">("form");
  const [quickError, setQuickError] = useState<string | null>(null);

  async function handleQuickChangeSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setQuickError(null);
    const pinLimpio = quickPin.trim();
    const linkLimpio = quickNewLink.trim();

    if (!pinLimpio) {
      setQuickError("Por favor ingresa el PIN de 15 dígitos de tu grupo.");
      return;
    }
    if (!linkLimpio) {
      setQuickError("Por favor ingresa el nuevo enlace de WhatsApp.");
      return;
    }
    if (!isValidProviderLink(whatsappProvider, linkLimpio)) {
      setQuickError("El nuevo enlace de WhatsApp no es válido (chat.whatsapp.com/...).");
      return;
    }

    setQuickState("loading");

    const minDelay = new Promise((resolve) => window.setTimeout(resolve, 2400));

    try {
      const [updated] = await Promise.all([actualizarGrupoPorPin(pinLimpio, linkLimpio), minDelay]);
      saveCreatedRoom(updated);
      setQuickState("success");
      setWaLink("");
      setLinkCheck("idle");
    } catch (err: unknown) {
      await minDelay;
      setQuickState("form");
      if (err instanceof LinkDuplicadoError) {
        setQuickError("Ese nuevo enlace ya está en uso por otro grupo.");
      } else if (err instanceof Error) {
        setQuickError(err.message);
      } else {
        setQuickError("No pudimos actualizar el grupo. Revisa el PIN.");
      }
    }
  }

  const visibleCategories = useMemo(() => {
    const first = categories.slice(0, 11);
    return first.some((c) => c.label === category)
      ? first
      : [categories.find((c) => c.label === category)!, ...first.slice(0, 10)];
  }, [category]);

  const visibleCountries = useMemo(() => {
    return featuredCountries.some((c) => c.label === country.label)
      ? featuredCountries
      : [country, ...featuredCountries.slice(0, 7)];
  }, [country]);

  const nameTooLong = name.length > NAME_MAX;
  const descTooLong = description.trim().length > DESC_MAX;

  const audienceText =
    audience === "all"
      ? t("audienceAll")
      : audience === "mine"
        ? `${t("mineCanJoin")} ${MY_COUNTRY.flag} ${tCountry(MY_COUNTRY.label)}`
        : `${someCountries.length} ${t("selectedCountries")}`;

  function toggleSome(label: string) {
    setSomeCountries((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );
  }

  const modeProviders = added.filter((p) => p.id === "whatsapp") as {
    id: "whatsapp";
    label: string;
    emoji: string;
    link: string;
  }[];

  function publish() {
    if (!name.trim()) return setError(t("stepName"));
    if (nameTooLong) return setError(t("nameMaxError"));
    if (!waTrimmed) return setError(t("stepLink"));
    if (!waValid) return setError("El enlace de WhatsApp no es válido.");
    if (linkCheck === "taken") return setError(t("linkTaken"));
    if (linkCheck === "checking")
      return setError("Estamos revisando el enlace, espera un momento.");
    if (!description.trim()) return setError(t("stepDesc"));
    if (descTooLong) return setError(t("descMaxError"));
    if (audience === "some" && someCountries.length === 0)
      return setError("Elige al menos un país que pueda unirse.");
    if (!terms) return setError("Debes aceptar los términos y condiciones.");

    setError(null);
    setPublishingMessageIndex(0);
    setPublishing(true);

    const emoji = categories.find((c) => c.label === category)?.emoji ?? "💬";

    void (async () => {
      try {
        const deviceUid = profile.uid || getOrCreateDeviceId();

        // 1. Registrar usuario y su país de origen en Supabase y localmente
        await registrarUsuario({
          uid: deviceUid,
          nombre: profile.name || "Administrador",
          pais: country.label,
          paisFlag: country.flag,
        });

        saveProfile({
          uid: deviceUid,
          countryLabel: country.label,
          countryFlag: country.flag,
          signedIn: true,
        });

        // Mantiene la pantalla de publicación visible el tiempo justo para confirmar el guardado.
        await new Promise((resolve) => window.setTimeout(resolve, 2600));

        const room = await crearGrupo({
          nombre: name.trim(),
          categoria: category,
          emoji,
          pais: country.label,
          paisFlag: country.flag,
          descripcion: description.trim(),
          adminId: deviceUid,
          proveedores: added.map((p) => ({ id: p.id, label: p.label, link: p.link.trim() })),
          seguridad: {
            audiencia: audienceText,
            paises:
              audience === "all"
                ? allCountries.map((c) => c.label)
                : audience === "some"
                  ? someCountries
                  : [country.label],
          },
          modos: modeProviders.map((p) => p.id),
        });

        saveCreatedRoom(room);
        navigate({ to: "/publicado", search: { id: room.id } });
      } catch (err) {
        setPublishing(false);
        setError(
          err instanceof LinkDuplicadoError
            ? t("linkTaken")
            : "No pudimos publicar tu grupo. Inténtalo de nuevo.",
        );
      }
    })();
  }

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[26rem]"
      />

      <header className="relative z-10 mx-auto max-w-md px-4 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Link>
        <div className="mt-4 flex flex-col items-center text-center">
          <img src={logo} alt="Chatly" width={512} height={512} className="h-16 w-16" />
          <h1 className="mt-3 font-display text-2xl leading-tight font-bold tracking-tight">
            {t("createTitle")}
          </h1>
          <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{t("createSubtitle")}</p>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-md space-y-7 px-4 pt-8 pb-24">
        {/* 1 · Nombre */}
        <section>
          <Step n={1} label={t("stepName")} />
          <div className={`chat-bubble px-3 py-3 ${nameTooLong ? "border-destructive" : ""}`}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={NAME_MAX + 20}
              placeholder={t("namePlaceholder")}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between px-1">
            {nameTooLong ? (
              <p className="text-xs font-semibold text-destructive">{t("nameMaxError")}</p>
            ) : (
              <span />
            )}
            <span
              className={`text-xs ${nameTooLong ? "font-semibold text-destructive" : "text-muted-foreground"}`}
            >
              {name.length}/{NAME_MAX}
            </span>
          </div>
        </section>

        {/* 2 · Enlace de WhatsApp */}
        <section>
          <Step n={2} label={t("stepLink")} hint={t("required")} />
          <div
            className={`chat-bubble px-3 py-3 ${(waTrimmed && !waValid) || linkCheck === "taken" ? "border-destructive" : ""}`}
          >
            <div className="flex items-center gap-2">
              <ProviderLogo id="whatsapp" className="h-6 w-6 shrink-0" />
              <span className="font-display text-xs font-semibold">WhatsApp</span>
            </div>
            <input
              value={waLink}
              onChange={(e) => setWaLink(e.target.value)}
              placeholder={whatsappProvider.placeholder}
              inputMode="url"
              aria-label="WhatsApp"
              className="mt-2 w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
            />
            {waTrimmed && !waValid && (
              <p className="mt-1.5 text-[0.7rem] font-semibold text-destructive">
                https://chat.whatsapp.com/...
              </p>
            )}
            {waValid && linkCheck === "checking" && (
              <p className="mt-1.5 flex items-center gap-1 text-[0.7rem] font-semibold text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> {t("linkValidating")}
              </p>
            )}
            {waValid && linkCheck === "taken" && (
              <p className="mt-1.5 text-[0.7rem] font-semibold text-destructive">
                {t("linkTaken")}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setQuickPin("");
                    setQuickNewLink("");
                    setQuickError(null);
                    setQuickState("form");
                    setShowQuickChange(true);
                  }}
                  className="font-bold text-emerald-600 dark:text-emerald-400 underline underline-offset-2 hover:text-emerald-500 cursor-pointer inline-block"
                >
                  aquí
                </button>
              </p>
            )}
            {waValid && linkCheck === "free" && (
              <p className="mt-1.5 flex items-center gap-1 text-[0.7rem] font-semibold text-brand">
                <Check className="h-3.5 w-3.5" /> {t("linkReady")}
              </p>
            )}
          </div>
        </section>

        {/* 3 · Categoría */}
        <section>
          <Step n={3} label={t("stepCategory")} />
          <div className="flex flex-wrap gap-2">
            {visibleCategories.map((c) => (
              <button
                key={c.label}
                onClick={() => setCategory(c.label)}
                className={`chat-bubble px-3 py-2 text-left ${c.label === category ? "chat-bubble-active" : ""}`}
              >
                <span className="mr-1.5">{c.emoji}</span>
                <span className="font-display text-xs font-semibold">{tCategory(c.label)}</span>
              </button>
            ))}
            <button
              onClick={() => setSheet("categories")}
              className="rounded-full border border-dashed border-brand px-3 py-2 font-display text-xs font-semibold"
            >
              {t("seeMore")}
            </button>
          </div>
        </section>

        {/* 4 · País */}
        <section>
          <Step n={4} label={t("stepCountry")} />
          <div className="flex flex-wrap gap-2">
            {visibleCountries.map((c) => (
              <button
                key={c.label}
                onClick={() => setCountry(c)}
                className={`country-tag ${c.label === country.label ? "country-tag-active" : ""}`}
              >
                <span>{c.flag}</span>
                {tCountry(c.label)}
              </button>
            ))}
            <button
              onClick={() => setSheet("countries")}
              className="rounded-full border border-dashed border-brand px-3 py-2 font-display text-xs font-semibold"
            >
              {t("seeMore")}
            </button>
          </div>
        </section>

        {/* 5 · Descripción */}
        <section>
          <Step n={5} label={t("stepDesc")} hint={`máx. ${DESC_MAX}`} />
          <div className={`chat-bubble px-3 py-3 ${descTooLong ? "border-destructive" : ""}`}>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
              maxLength={DESC_MAX}
              rows={5}
              placeholder={t("descPlaceholder")}
              className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between px-1">
            {descTooLong ? (
              <p className="text-xs font-semibold text-destructive">{t("descMaxError")}</p>
            ) : (
              <span />
            )}
            <span
              className={`text-xs ${descTooLong ? "font-semibold text-destructive" : "text-muted-foreground"}`}
            >
              {description.trim().length}/{DESC_MAX}
            </span>
          </div>
        </section>

        {/* 6 · Seguridad */}
        <section>
          <Step n={6} label={t("stepAudience")} />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setAudience("mine")}
              className={`chat-bubble px-3 py-2 ${audience === "mine" ? "chat-bubble-active" : ""}`}
            >
              <span className="mr-1.5">{MY_COUNTRY.flag}</span>
              <span className="font-display text-xs font-semibold">{t("audienceMine")}</span>
            </button>
            <button
              onClick={() => {
                setAudience("some");
                setSheet("audience");
              }}
              className={`chat-bubble px-3 py-2 ${audience === "some" ? "chat-bubble-active" : ""}`}
            >
              <span className="mr-1.5">🌎</span>
              <span className="font-display text-xs font-semibold">{t("audienceSome")}</span>
            </button>
            <button
              onClick={() => setAudience("all")}
              className={`chat-bubble px-3 py-2 ${audience === "all" ? "chat-bubble-active" : ""}`}
            >
              <Globe className="mr-1.5 inline h-3.5 w-3.5" />
              <span className="font-display text-xs font-semibold">{t("all")}</span>
            </button>
          </div>

          {audience === "all" && (
            <p className="mt-2 rounded-xl bg-accent px-3 py-2 text-xs font-medium text-accent-foreground">
              {t("audienceAll")}
            </p>
          )}
          {audience === "some" && someCountries.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {someCountries.map((label) => (
                <span
                  key={label}
                  className="rounded-md bg-secondary px-1.5 py-0.5 text-[0.7rem] font-medium text-secondary-foreground"
                >
                  {allCountries.find((c) => c.label === label)?.flag} {tCountry(label)}
                </span>
              ))}
              <button
                onClick={() => setSheet("audience")}
                className="text-[0.7rem] font-semibold underline decoration-brand decoration-2 underline-offset-2"
              >
                {t("edit")}
              </button>
            </div>
          )}
          {audience === "mine" && (
            <p className="mt-2 text-xs text-muted-foreground">{t("audienceMineHint")}</p>
          )}
        </section>

        {/* 7 · Términos */}
        <section>
          <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
            <button
              type="button"
              role="checkbox"
              aria-checked={terms}
              onClick={() => setTerms((t) => !t)}
              aria-label={t("acceptTermsText")}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors cursor-pointer ${
                terms ? "border-brand bg-brand text-brand-foreground" : "border-border bg-surface"
              }`}
            >
              {terms && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </button>
            <p className="leading-relaxed select-none">
              <span onClick={() => setTerms((t) => !t)} className="cursor-pointer">
                {lang === "en"
                  ? "I accept Chatly's "
                  : lang === "pt"
                    ? "Aceito os "
                    : "Acepto los "}
              </span>
              <Link
                to="/terminos"
                className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-2 decoration-emerald-500/40 hover:decoration-emerald-500 transition-colors cursor-pointer"
              >
                {lang === "en"
                  ? "terms and conditions"
                  : lang === "pt"
                    ? "termos e condições"
                    : "términos y condiciones"}
              </Link>
              <span onClick={() => setTerms((t) => !t)} className="cursor-pointer">
                {lang === "en"
                  ? " and commit to moderating my room."
                  : lang === "pt"
                    ? " do Chatly e me comprometo a moderar minha sala."
                    : " de Chatly y me comprometo a moderar mi sala."}
              </span>
            </p>
          </div>
        </section>

        {error && (
          <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
            {error}
          </p>
        )}

        <button
          onClick={publish}
          className="flex w-full items-center justify-center gap-1.5 rounded-full brand-gradient py-3 font-display text-sm font-bold text-brand-foreground shadow-[var(--shadow-float)]"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          {t("publishBtn")}
        </button>
      </main>

      {/* Mini interfaz: categorías */}
      {sheet === "categories" && (
        <Sheet title={t("topics")} onClose={() => setSheet(null)}>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.label}
                onClick={() => {
                  setCategory(c.label);
                  setSheet(null);
                }}
                className={`chat-bubble px-3 py-2 ${c.label === category ? "chat-bubble-active" : ""}`}
              >
                <span className="mr-1.5">{c.emoji}</span>
                <span className="font-display text-xs font-semibold">{tCategory(c.label)}</span>
              </button>
            ))}
          </div>
        </Sheet>
      )}

      {/* Mini interfaz: países por región */}
      {sheet === "countries" && (
        <Sheet title={t("countries")} onClose={() => setSheet(null)}>
          <div className="space-y-4">
            {countryRegions.map((r) => (
              <div key={r.label}>
                <p className="mb-2 font-display text-xs font-bold text-muted-foreground">
                  {tRegion(r.label)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {r.countries.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => {
                        setCountry(c);
                        setSheet(null);
                      }}
                      className={`country-tag ${c.label === country.label ? "country-tag-active" : ""}`}
                    >
                      <span>{c.flag}</span>
                      {tCountry(c.label)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Sheet>
      )}

      {/* Mini interfaz: países que pueden unirse */}
      {sheet === "audience" && (
        <Sheet title={t("stepAudience")} onClose={() => setSheet(null)}>
          <div className="space-y-4">
            {countryRegions.map((r) => (
              <div key={r.label}>
                <p className="mb-2 font-display text-xs font-bold text-muted-foreground">
                  {tRegion(r.label)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {r.countries.map((c) => (
                    <button
                      key={c.label}
                      onClick={() => toggleSome(c.label)}
                      className={`country-tag ${someCountries.includes(c.label) ? "country-tag-active" : ""}`}
                    >
                      <span>{c.flag}</span>
                      {tCountry(c.label)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSheet(null)}
            className="mt-5 w-full rounded-full bg-primary py-2.5 font-display text-sm font-bold text-primary-foreground cursor-pointer"
          >
            {t("close")} ({someCountries.length})
          </button>
        </Sheet>
      )}

      {/* Mini interfaz / Modal medio: Cambio Rápido de Enlace por PIN */}
      {showQuickChange && (
        <Sheet
          title={
            quickState === "success"
              ? "¡Grupo republicado!"
              : quickState === "loading"
                ? "Revisando y republicando"
                : "¿Quieres hacer un cambio rápido de enlace sin tener que ir a la administración?"
          }
          onClose={() => {
            if (quickState !== "loading") setShowQuickChange(false);
          }}
        >
          {quickState === "form" && (
            <form onSubmit={handleQuickChangeSubmit} className="space-y-4 pt-1">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ingresa la clave / PIN de 15 dígitos de tu grupo y el nuevo enlace para actualizarlo
                y republicarlo automáticamente.
              </p>

              {/* Recuadro 1: PIN de 15 dígitos */}
              <div className="space-y-1.5">
                <label className="font-display text-xs font-bold text-foreground">
                  PIN del grupo (15 dígitos)
                </label>
                <div className="chat-bubble px-3.5 py-2.5">
                  <input
                    type="text"
                    value={quickPin}
                    onChange={(e) => setQuickPin(e.target.value.replace(/\D/g, "").slice(0, 15))}
                    placeholder="Ej: 839201948271039"
                    maxLength={15}
                    className="w-full bg-transparent font-mono text-sm tracking-widest outline-none placeholder:text-muted-foreground placeholder:tracking-normal"
                  />
                </div>
              </div>

              {/* Recuadro 2: Nuevo enlace de WhatsApp */}
              <div className="space-y-1.5">
                <label className="font-display text-xs font-bold text-foreground">
                  Nuevo enlace de WhatsApp
                </label>
                <div className="chat-bubble px-3.5 py-2.5">
                  <input
                    type="url"
                    value={quickNewLink}
                    onChange={(e) => setQuickNewLink(e.target.value)}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full bg-transparent font-mono text-xs outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {quickError && (
                <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
                  {quickError}
                </p>
              )}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-1.5 rounded-full bg-brand py-3 font-display text-sm font-bold text-brand-foreground shadow-[var(--shadow-float)] active:scale-[0.99] cursor-pointer"
              >
                Actualizar y republicar
              </button>
            </form>
          )}

          {quickState === "loading" && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Loader2 className="h-9 w-9 animate-spin text-brand" strokeWidth={2.5} />
              <p className="mt-4 font-display text-base font-bold">
                Revisando clave y republicando...
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                Verificando que la clave coincida y actualizando el enlace en tiempo real.
              </p>
            </div>
          )}

          {quickState === "success" && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCheck className="h-7 w-7 stroke-[2.5]" />
              </div>
              <p className="mt-4 font-display text-lg font-bold">¡Enlace actualizado con éxito!</p>
              <p className="mt-1.5 max-w-xs text-xs text-muted-foreground">
                Tu grupo ha sido actualizado con el nuevo enlace y republicado en Chatly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowQuickChange(false);
                  navigate({ to: "/" });
                }}
                className="mt-6 flex w-full items-center justify-center rounded-full bg-brand py-3 font-display text-sm font-bold text-brand-foreground shadow-[var(--shadow-float)] cursor-pointer active:scale-[0.99]"
              >
                Ir a ver el grupo
              </button>
            </div>
          )}
        </Sheet>
      )}

      {/* Publicando */}
      {publishing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background px-6">
          <div className="hero-glow absolute inset-x-0 top-0 h-80" aria-hidden="true" />
          <div className="relative flex w-full max-w-xs flex-col items-center text-center">
            <img src={logo} alt="Chatly" width={512} height={512} className="h-20 w-20" />
            <Loader2
              aria-label="Publicando"
              className="mt-7 h-8 w-8 animate-spin text-brand"
              strokeWidth={2.5}
            />
            <p className="mt-5 font-display text-xl font-bold">{t("publishingTitle")}</p>
            <p className="mt-3 min-h-12 text-sm leading-relaxed text-muted-foreground">
              {publishingMessages[publishingMessageIndex]}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
