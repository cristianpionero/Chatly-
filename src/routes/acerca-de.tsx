import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Zap, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import logo from "@/assets/chatly-logo.png";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/acerca-de")({
  head: () => ({
    meta: [
      { title: "Acerca de — Chatly" },
      {
        name: "description",
        content:
          "Conoce qué es Chatly, cómo funciona la publicación inmediata de grupos de WhatsApp y nuestros requisitos.",
      },
      { property: "og:title", content: "Acerca de — Chatly" },
      {
        property: "og:description",
        content:
          "Conoce qué es Chatly, cómo funciona la publicación inmediata de grupos de WhatsApp y nuestros requisitos.",
      },
    ],
  }),
  component: AcercaDe,
});

function AcercaDe() {
  const router = useRouter();
  const t = useT();

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[22rem]"
      />

      <header className="relative z-10 mx-auto w-full max-w-2xl px-4 pt-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.history.back()}
            aria-label={t("back")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:bg-muted/40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="Chatly" width={512} height={512} className="h-7 w-7" />
            <span className="font-display text-base font-bold tracking-tight">
              Chat<span className="text-brand">ly</span>
            </span>
          </div>
        </div>

        <div className="mt-7">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {t("aboutHeaderTitle")}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t("aboutHeaderSubtitle")}
          </p>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-2xl px-4 pt-6 pb-28 space-y-8 text-sm leading-relaxed text-foreground/90">
        {/* Qué es Chatly */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-brand">
            <Sparkles className="h-4 w-4" />
            <h2 className="font-display text-base font-bold text-foreground">
              {t("aboutQ1Title")}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{t("aboutQ1Body")}</p>
        </section>

        <hr className="border-border/60" />

        {/* Publicación Inmediata */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Zap className="h-4 w-4" />
            <h2 className="font-display text-base font-bold text-foreground">
              {t("aboutQ2Title")}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{t("aboutQ2P1")}</p>
          <p className="text-muted-foreground leading-relaxed">{t("aboutQ2P2")}</p>
        </section>

        <hr className="border-border/60" />

        {/* Requisitos para publicar */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-brand">
            <CheckCircle2 className="h-4 w-4" />
            <h2 className="font-display text-base font-bold text-foreground">
              {t("aboutQ3Title")}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{t("aboutQ3Intro")}</p>
          <ul className="space-y-2 pl-1 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{t("aboutReqName")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{t("aboutReqLink")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{t("aboutReqCat")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{t("aboutReqDesc")}</span>
            </li>
          </ul>
        </section>

        <hr className="border-border/60" />

        {/* Moderación y seguridad */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-brand">
            <ShieldCheck className="h-4 w-4" />
            <h2 className="font-display text-base font-bold text-foreground">
              {t("aboutQ4Title")}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{t("aboutQ4Body")}</p>
          <div className="pt-1">
            <Link
              to="/terminos"
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Leer Términos y Condiciones completos →
            </Link>
          </div>
        </section>

        <hr className="border-border/60" />

        {/* Preguntas frecuentes o dudas */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-brand">
            <HelpCircle className="h-4 w-4" />
            <h2 className="font-display text-base font-bold text-foreground">
              {t("aboutQ5Title")}
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">{t("aboutQ5Body")}</p>
          <div className="pt-2">
            <Link
              to="/crear"
              className="inline-flex items-center gap-2 rounded-full brand-gradient px-5 py-2.5 font-display text-xs font-bold text-brand-foreground shadow-[var(--shadow-float)]"
            >
              {t("publishMyGroupNow")}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
