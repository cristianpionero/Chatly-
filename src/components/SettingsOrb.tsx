import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Moon, Sun, User, Languages } from "lucide-react";
import { GoogleLogo } from "@/components/GoogleLogo";
import { ModeSwitcher, logoForMode } from "@/components/ModeSwitcher";
import { useAppMode } from "@/lib/app-mode";
import { useDarkMode, useProfile } from "@/lib/app-settings";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Bolita flotante de configuración (derecha, un poco por encima del borde inferior). */
export function SettingsOrb() {
  const [open, setOpen] = useState(false);
  const [idle, setIdle] = useState(false);
  const { dark, toggle } = useDarkMode();
  const profile = useProfile();
  const t = useT();
  const mode = useAppMode();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const orbLogo = logoForMode(mode);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Tras 1 minuto sin usarla se vuelve translúcida (pero visible).
  useEffect(() => {
    const reset = () => {
      setIdle(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setIdle(true), 60_000);
    };
    reset();
    const events = ["pointerdown", "keydown", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, []);

  useEffect(() => {
    if (open) setIdle(false);
  }, [open]);

  // Bolitas del menú: más pequeñas que la del logo y con iconos de color.
  const item =
    "flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface shadow-[var(--shadow-float)] transition-transform active:scale-90";

  return (
    <div
      className={cn(
        "fixed right-4 bottom-24 z-50 flex flex-col items-end gap-2 transition-opacity duration-700",
        idle && !open ? "opacity-35" : "opacity-100",
      )}
    >
      {open && (
        <>
          {!profile.signedIn && (
            <Link
              to="/entrar"
              search={{ next: pathname }}
              aria-label={t("signIn")}
              title={t("signIn")}
              className={item}
              onClick={() => setOpen(false)}
            >
              <GoogleLogo className="h-5 w-5" />
            </Link>
          )}
          {/* La cuenta solo aparece cuando la persona ya inició sesión. */}
          {profile.signedIn && (
            <Link
              to="/mi-perfil"
              aria-label={t("profile")}
              title={t("profile")}
              className={item}
              onClick={() => setOpen(false)}
            >
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="h-full w-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="h-5 w-5" strokeWidth={2.5} style={{ color: "#E03131" }} />
              )}
            </Link>
          )}

          <button
            type="button"
            aria-label={dark ? t("lightMode") : t("darkMode")}
            title={dark ? t("lightMode") : t("darkMode")}
            className={item}
            onClick={() => toggle()}
          >
            {dark ? (
              <Sun className="h-5 w-5" strokeWidth={2.5} style={{ color: "#F59F00" }} />
            ) : (
              <Moon className="h-5 w-5" strokeWidth={2.5} style={{ color: "#4C6EF5" }} />
            )}
          </button>
          <ModeSwitcher className={item} onDone={() => setOpen(false)} />
          <Link
            to="/idioma"
            aria-label={t("language")}
            title={t("language")}
            className={item}
            onClick={() => setOpen(false)}
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <Languages
                className="h-5 w-5"
                strokeWidth={2.5}
                style={{ color: "#0CA678" }}
                aria-hidden="true"
              />
              <Languages
                className="absolute h-5 w-5 [clip-path:inset(0_0_0_50%)]"
                strokeWidth={2.5}
                style={{ color: "#7048E8" }}
                aria-hidden="true"
              />
            </span>
          </Link>
        </>
      )}

      <button
        type="button"
        aria-label={t("settings")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full brand-gradient shadow-[var(--shadow-float)] transition-transform active:scale-90",
          open && "rotate-12",
        )}
      >
        <img src={orbLogo} alt="" width={512} height={512} className="h-8 w-8" />
      </button>
    </div>
  );
}
