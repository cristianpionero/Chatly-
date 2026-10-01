import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, LogOut, Mail, MapPin, Users, UserRound } from "lucide-react";
import logo from "@/assets/chatly-logo.png";
import { useProfile, signOutProfile } from "@/lib/app-settings";
import { type CreatedRoom } from "@/lib/created-rooms";
import { asegurarPinGrupo, listarGruposDeAdmin } from "@/lib/db/grupos";
import { useI18n } from "@/lib/i18n";
import { useEffect } from "react";

export const Route = createFileRoute("/mi-perfil")({
  head: () => ({
    meta: [
      { title: "Tu perfil — Chatly" },
      {
        name: "description",
        content: "Tu perfil de Chatly: cuenta, país y los grupos que has creado.",
      },
      { property: "og:title", content: "Tu perfil — Chatly" },
      {
        property: "og:description",
        content: "Tu perfil de Chatly: cuenta, país y los grupos que has creado.",
      },
    ],
  }),
  component: MiPerfil,
});

function MiPerfil() {
  const { t, tCountry, tCategory } = useI18n();
  const router = useRouter();
  const navigate = useNavigate();
  const profile = useProfile();
  const [rooms, setRooms] = useState<CreatedRoom[]>([]);
  const [confirm, setConfirm] = useState(false);
  // Grupo abierto en la tarjeta del PIN.
  const [panelRoom, setPanelRoom] = useState<CreatedRoom | null>(null);
  const [panelPin, setPanelPin] = useState("");

  function abrirPanelCard(room: CreatedRoom) {
    void navigate({ to: "/panel-administracion", search: { id: room.id } });
  }

  // Los grupos creados por el administrador aparecen automáticamente aquí.
  useEffect(() => {
    if (!profile.uid) {
      setRooms([]);
      return;
    }
    let alive = true;
    void listarGruposDeAdmin(profile.uid).then((r) => alive && setRooms(r));
    const refresh = () => {
      void listarGruposDeAdmin(profile.uid).then((r) => alive && setRooms(r));
    };
    window.addEventListener("chatly:rooms", refresh);
    return () => {
      alive = false;
      window.removeEventListener("chatly:rooms", refresh);
    };
  }, [profile.uid]);

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground">
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[20rem]"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-md items-center gap-3 px-4 py-4">
        <button
          type="button"
          onClick={() => router.history.back()}
          aria-label={t("back")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <img src={logo} alt="Chatly" width={512} height={512} className="h-7 w-7" />
          <span className="font-display text-base font-bold tracking-tight">
            Chat<span className="text-muted-foreground">ly</span>
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-md flex-1 space-y-6 px-4 pb-32">
        {/* 1 · Cuenta */}
        <section>
          <h2 className="mb-2 px-1 font-display text-xs font-bold tracking-wide text-muted-foreground uppercase">
            {t("account")}
          </h2>
          <div className="divide-y divide-border rounded-[var(--radius-2xl)] border border-border bg-surface">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Users className="h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
              <span className="flex-1 text-sm text-muted-foreground">{t("profile")}</span>
              <span className="font-display text-sm font-semibold">
                {profile.signedIn ? profile.name : t("guest")}
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Mail className="h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
              <span className="flex-1 text-sm text-muted-foreground">{t("email")}</span>
              <span className="truncate font-display text-sm font-semibold">
                {profile.email || "—"}
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <MapPin className="h-4 w-4 shrink-0 text-brand" strokeWidth={2.5} />
              <span className="flex-1 text-sm text-muted-foreground">{t("country")}</span>
              <span className="font-display text-sm font-semibold">
                {profile.countryLabel
                  ? `${profile.countryFlag} ${tCountry(profile.countryLabel)}`
                  : "—"}
              </span>
            </div>
          </div>
          {!profile.signedIn && (
            <Link
              to="/entrar"
              search={{ next: undefined }}
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-full border border-border bg-surface px-5 py-3 font-display text-sm font-semibold shadow-[var(--shadow-bubble)]"
            >
              <UserRound className="h-5 w-5" strokeWidth={2.5} />
              {t("continueGoogle")}
            </Link>
          )}
        </section>

        {/* 2 · Grupos creados */}
        <section>
          <h2 className="mb-2 px-1 font-display text-xs font-bold tracking-wide text-muted-foreground uppercase">
            {t("createdGroups")}
          </h2>
          <div className="space-y-2">
            {rooms.length === 0 && (
              <p className="rounded-[var(--radius-2xl)] border border-dashed border-border bg-surface/60 p-4 text-sm text-muted-foreground">
                {t("noGroups")}
              </p>
            )}
            {rooms.map((room) => (
              <button
                key={room.id}
                type="button"
                onClick={() => abrirPanelCard(room)}
                className="flex w-full items-center gap-3 rounded-[var(--radius-2xl)] border border-border bg-surface p-3 text-left shadow-[var(--shadow-bubble)] active:scale-[0.99]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-lg">
                  {room.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm font-semibold">
                    {room.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {tCountry(room.countryLabel)} · {tCategory(room.topic)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 3 · Sesión */}
        <section>
          <h2 className="mb-2 px-1 font-display text-xs font-bold tracking-wide text-muted-foreground uppercase">
            {t("session")}
          </h2>
          <button
            type="button"
            onClick={() => setConfirm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 py-3 font-display text-sm font-semibold text-destructive shadow-[var(--shadow-bubble)] active:scale-95"
          >
            <LogOut className="h-4 w-4" strokeWidth={2.5} />
            {t("signOut")}
          </button>
          <p className="mt-3 text-center text-[0.7rem] text-muted-foreground">{t("demoNotice")}</p>
        </section>
      </main>

      {panelRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <button
            aria-label={t("cancel")}
            onClick={() => setPanelRoom(null)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
          />
          <div className="relative w-full max-w-xs rounded-[var(--radius-3xl)] border border-border bg-surface p-6 text-center shadow-[var(--shadow-float)]">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl">
              {panelRoom.emoji}
            </span>
            <h3 className="mt-3 font-display text-base font-bold">{panelRoom.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Este es el código para entrar al panel de este grupo.
            </p>
            <p className="mt-4 font-display text-3xl font-bold tracking-[0.4em]">
              {panelPin || "······"}
            </p>
            <button
              type="button"
              onClick={() => setPanelRoom(null)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-display text-sm font-semibold text-brand-foreground"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <button
            aria-label={t("cancel")}
            onClick={() => setConfirm(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
          />
          <div className="relative w-full max-w-xs rounded-[var(--radius-3xl)] border border-border bg-surface p-5 text-center shadow-[var(--shadow-float)]">
            <h3 className="font-display text-base font-bold">{t("signOutTitle")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("signOutText")}</p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirm(false)}
                className="flex-1 rounded-full border border-border px-4 py-2.5 font-display text-sm font-semibold"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  void signOutProfile().then(() => {
                    setConfirm(false);
                    setRooms([]);
                    // Vuelve a la pantalla de entrar con Google.
                    void navigate({ to: "/entrar", search: { next: undefined } });
                  });
                }}
                className="flex-1 rounded-full bg-destructive px-4 py-2.5 font-display text-sm font-semibold text-destructive-foreground"
              >
                {t("accept")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
