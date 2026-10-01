import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ChevronRight, MapPin } from "lucide-react";
import logo from "@/assets/chatly-logo.png";
import { countryRegions, type Country } from "@/lib/chatly-data";
import { applySession } from "@/lib/app-settings";
import { signIn, resolveRedirect, type LocalUser } from "@/lib/local-auth";
import { obtenerUsuario, registrarUsuario } from "@/lib/db/usuarios";
import { useI18n } from "@/lib/i18n";
import { GoogleLogo } from "@/components/GoogleLogo";

export const Route = createFileRoute("/entrar")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: typeof search["next"] === "string" ? (search["next"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Iniciar sesión — Chatly" },
      {
        name: "description",
        content: "Entra a Chatly con tu cuenta de Google, elige tu país y acepta los términos.",
      },
      { property: "og:title", content: "Iniciar sesión — Chatly" },
      {
        property: "og:description",
        content: "Entra a Chatly con Google para publicar y administrar tus grupos.",
      },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  const { t, tCountry, tRegion } = useI18n();
  const router = useRouter();
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [country, setCountry] = useState<Country | null>(null);
  const [terms, setTerms] = useState(false);
  const [picking, setPicking] = useState(false);
  /** Cuenta de Google que todavía no está registrada en la base de datos. */
  const [pending, setPending] = useState<LocalUser | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const ready = pending !== null && country !== null && terms && !busy;

  /** Vuelve exactamente a donde estaba la persona antes de registrarse. */
  function goBackToFlow() {
    if (next && next.startsWith("/")) {
      void navigate({ to: next });
      return;
    }
    void navigate({ to: "/" });
  }

  /** Continúa con la cuenta de Google ya autenticada. */
  async function afterGoogle(user: LocalUser) {
    const fila = await obtenerUsuario(user.uid);
    if (fila) {
      // Ya estaba registrado: entra directo, sin pedir nada.
      applySession({
        uid: fila.uid,
        name: fila.nombre,
        email: user.email ?? "",
        photo: fila.foto ?? user.photoURL ?? "",
        countryFlag: fila.pais_flag,
        countryLabel: fila.pais,
      });
      goBackToFlow();
      return;
    }
    setPending(user);
  }

  // Si Google devolvió por redirección, recogemos la sesión al abrir la pantalla.
  useEffect(() => {
    void resolveRedirect().then((user) => {
      if (user) void afterGoogle(user);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Paso 1: continuar con Google. */
  async function googleSignIn() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const user = await signIn();
      await afterGoogle(user);
    } catch {
      setError(t("signInError"));
    } finally {
      setBusy(false);
    }
  }

  /** Paso 2: guardar el registro (país + términos) en la base de datos. */
  async function submit() {
    if (!country || !pending) return;
    setBusy(true);
    setError("");
    const nombre = pending.displayName || pending.email?.split("@")[0] || "Usuario";
    const fila = await registrarUsuario({
      uid: pending.uid,
      nombre,
      pais: country.label,
      paisFlag: country.flag,
      foto: pending.photoURL,
    });
    setBusy(false);
    if (!fila) {
      setError(t("signInError"));
      return;
    }
    applySession({
      uid: fila.uid,
      name: fila.nombre,
      email: pending.email ?? "",
      photo: fila.foto ?? "",
      countryFlag: fila.pais_flag,
      countryLabel: fila.pais,
    });
    goBackToFlow();
  }

  if (picking) {
    return (
      <div className="relative min-h-screen bg-background font-sans text-foreground">
        <header className="mx-auto flex w-full max-w-md items-center gap-3 px-4 py-4">
          <button
            type="button"
            onClick={() => setPicking(false)}
            aria-label={t("back")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="font-display text-lg font-bold tracking-tight">
            {t("chooseYourCountry")}
          </h1>
        </header>
        <main className="mx-auto w-full max-w-md px-4 pb-32">
          {countryRegions.map((r) => (
            <section key={r.label} className="mt-4">
              <p className="px-1 font-display text-xs font-bold text-muted-foreground">
                {tRegion(r.label)}
              </p>
              <ul className="mt-1 divide-y divide-border">
                {r.countries.map((c) => (
                  <li key={c.label}>
                    <button
                      type="button"
                      onClick={() => {
                        setCountry(c);
                        setPicking(false);
                      }}
                      className="flex w-full items-center gap-3 py-3 text-left active:opacity-70"
                    >
                      <span className="text-xl">{c.flag}</span>
                      <span className="flex-1 font-display text-base font-medium">
                        {tCountry(c.label)}
                      </span>
                      {country?.label === c.label && (
                        <Check className="h-4 w-4 text-brand" strokeWidth={3} />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground">
      <header className="relative z-10 mx-auto w-full max-w-md px-4 py-4">
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label={t("back")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10">
        <div className="mt-6 flex flex-col items-center text-center">
          <img src={logo} alt="Chatly" width={512} height={512} className="h-20 w-20" />
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
            Chat<span className="text-muted-foreground">ly</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("signInToStart")}</p>
        </div>

        <div className="mt-12 space-y-3">
          {/* Paso 1: cuenta de Google. */}
          <button
            type="button"
            onClick={() => void googleSignIn()}
            disabled={busy || pending !== null}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-surface px-5 py-3.5 font-display text-sm font-semibold shadow-[var(--shadow-bubble)] transition-transform active:scale-[0.98] disabled:opacity-70"
          >
            <GoogleLogo />
            {pending ? (pending.displayName ?? pending.email) : "Continuar con Google"}
            {pending && <Check className="h-4 w-4 text-brand" strokeWidth={3} />}
          </button>

          {pending && (
            <button
              type="button"
              onClick={() => setPicking(true)}
              className="flex w-full items-center gap-3 rounded-[var(--radius-2xl)] border border-border bg-surface px-4 py-3 text-left"
            >
              <MapPin className="h-4 w-4 text-brand" strokeWidth={2.5} />
              <span className="flex-1 font-display text-sm font-semibold">
                {country ? `${country.flag} ${tCountry(country.label)}` : t("selectCountry")}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {pending && (
          <label className="mt-6 flex items-start gap-2.5 text-xs text-muted-foreground">
            <button
              type="button"
              role="checkbox"
              aria-checked={terms}
              onClick={() => setTerms((v) => !v)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                terms ? "border-brand bg-brand text-brand-foreground" : "border-border bg-surface"
              }`}
            >
              {terms && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
            </button>
            <span>{t("acceptTerms")}</span>
          </label>
        )}

        <div className="flex-1" />

        {error && <p className="mb-3 text-center text-[0.75rem] text-destructive">{error}</p>}

        {pending && (
          <button
            type="button"
            disabled={!ready}
            onClick={() => void submit()}
            className="w-full rounded-full brand-gradient py-3.5 font-display text-sm font-bold text-brand-foreground shadow-[var(--shadow-float)] transition-opacity active:scale-[0.98] disabled:opacity-40"
          >
            {t("continueBtn")}
          </button>
        )}
      </main>
    </div>
  );
}
