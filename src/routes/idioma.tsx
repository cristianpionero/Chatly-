import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import logo from "@/assets/chatly-logo.png";
import { readLang, setLang } from "@/lib/app-settings";
import { LANGUAGES, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/idioma")({
  head: () => ({
    meta: [
      { title: "Idioma — Chatly" },
      { name: "description", content: "Elige entre 3 idiomas para usar Chatly a tu manera." },
      { property: "og:title", content: "Idioma — Chatly" },
      {
        property: "og:description",
        content: "Elige entre 3 idiomas para usar Chatly a tu manera.",
      },
    ],
  }),
  component: Idioma,
});

function Idioma() {
  const t = useT();
  const router = useRouter();
  const [current, setCurrent] = useState("es");

  useEffect(() => {
    setCurrent(readLang());
  }, []);

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[18rem]"
      />

      <header className="relative z-10 mx-auto w-full max-w-md px-4 pt-4">
        <div className="flex items-center gap-3">
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
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold tracking-tight">
          {t("chooseLanguage")}
        </h1>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-md px-4 pt-5 pb-32">
        <ul className="divide-y divide-border">
          {LANGUAGES.map((lang) => {
            const active = lang.code === current;
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  onClick={() => {
                    setLang(lang.code);
                    setCurrent(lang.code);
                  }}
                  className="flex w-full items-center gap-3 py-3.5 text-left active:opacity-70"
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span
                    className={cn(
                      "flex-1 font-display text-base",
                      active ? "font-bold text-brand" : "font-medium",
                    )}
                  >
                    {lang.name}
                  </span>
                  {active && <Check className="h-4 w-4 text-brand" strokeWidth={3} />}
                </button>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
