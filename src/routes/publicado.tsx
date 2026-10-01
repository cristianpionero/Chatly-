import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, CheckCheck } from "lucide-react";
import logo from "@/assets/chatly-logo.png";
import { useT } from "@/lib/i18n";
import { readCreatedRooms } from "@/lib/created-rooms";

export const Route = createFileRoute("/publicado")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search["id"] === "string" ? (search["id"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Grupo publicado — Chatly" },
      {
        name: "description",
        content: "Tu grupo ha sido publicado exitosamente en Chatly.",
      },
      { property: "og:title", content: "Grupo publicado — Chatly" },
      {
        property: "og:description",
        content: "Tu grupo ha sido publicado exitosamente.",
      },
    ],
  }),
  component: Publicado,
});

function Publicado() {
  const t = useT();
  const search = useSearch({ from: "/publicado" });
  const [copied, setCopied] = useState(false);
  const [adminUrl, setAdminUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const id = search.id || readCreatedRooms()[0]?.id || "";
      const path = id ? `/panel-administracion?id=${id}` : "/panel-administracion";
      return `${window.location.origin}${path}`;
    }
    return "";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = search.id || readCreatedRooms()[0]?.id || "";
      const path = id ? `/panel-administracion?id=${id}` : "/panel-administracion";
      setAdminUrl(`${window.location.origin}${path}`);
    }
  }, [search.id]);

  function copyAdminUrl() {
    const urlToCopy =
      adminUrl ||
      (typeof window !== "undefined" ? `${window.location.origin}/panel-administracion` : "");
    if (!urlToCopy) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(urlToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => {
          fallbackCopy(urlToCopy);
        });
    } else {
      fallbackCopy(urlToCopy);
    }
  }

  function fallbackCopy(text: string) {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      //
    }
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-background px-4 text-center font-sans text-foreground">
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-80"
      />

      {/* Enlace privado de administración en letras verdes pequeñas arribita (toca para copiar) */}
      <header className="relative z-20 mx-auto w-full max-w-md pt-5 pb-2">
        <button
          type="button"
          onClick={copyAdminUrl}
          className="group inline-flex max-w-full items-center justify-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-left transition-all active:scale-95 cursor-pointer shadow-sm"
          title="Toca para copiar el enlace de administración"
        >
          <span className="truncate font-mono text-[0.72rem] font-bold text-emerald-600 dark:text-emerald-400">
            {adminUrl || "Cargando enlace..."}
          </span>
          {copied ? (
            <span className="inline-flex shrink-0 items-center gap-1 text-[0.68rem] font-bold text-emerald-600 dark:text-emerald-400">
              <Check className="h-3 w-3 stroke-[3]" />
              ¡Copiado!
            </span>
          ) : (
            <span className="shrink-0 text-[0.68rem] font-semibold text-emerald-600/80 dark:text-emerald-400/80 group-hover:underline">
              (toca para copiar)
            </span>
          )}
        </button>
      </header>

      {/* Contenido principal */}
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center pt-2 pb-12">
        <img src={logo} alt="Chatly" width={512} height={512} className="h-20 w-20" />
        <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground">
          <CheckCheck className="h-3.5 w-3.5 text-brand" strokeWidth={3} />
          {t("publishedBadge")}
        </span>
        <h1 className="mt-4 font-display text-2xl leading-tight font-bold tracking-tight">
          {t("publishedTitle")}
        </h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">{t("publishedQuestion")}</p>
      </main>

      {/* Botón "Ir a ver" abajo */}
      <footer className="relative z-10 mx-auto w-full max-w-md pb-10">
        <Link
          to="/"
          className="flex w-full items-center justify-center rounded-full bg-brand py-3.5 font-display text-sm font-bold text-brand-foreground shadow-[var(--shadow-float)] active:scale-[0.99]"
        >
          Ir a ver
        </Link>
      </footer>
    </div>
  );
}
