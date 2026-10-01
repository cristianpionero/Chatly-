import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import { categories } from "@/lib/chatly-data";
import { PAGE_SIZE } from "@/lib/demo-rooms";
import { syncRooms } from "@/lib/db/sync-rooms";
import { useAppMode } from "@/lib/app-mode";
import { readModeGroups, demo, type ModeGroup } from "@/lib/mode-groups";
import { ModeGroupList } from "@/components/ModeGroupList";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/explorar")({
  head: () => ({
    meta: [
      { title: "Todos los grupos de WhatsApp — Chatly" },
      {
        name: "description",
        content: "Explora todos los grupos de WhatsApp publicados en Chatly por categoría y país.",
      },
      { property: "og:title", content: "Todos los grupos de WhatsApp — Chatly" },
      {
        property: "og:description",
        content: "Explora todos los grupos de WhatsApp publicados en Chatly por categoría y país.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "https://authentic-chats.lovable.app/explorar" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: "https://authentic-chats.lovable.app/explorar" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Inicio",
              item: "https://authentic-chats.lovable.app/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Explorar grupos",
              item: "https://authentic-chats.lovable.app/explorar",
            },
          ],
        }),
      },
    ],
  }),
  component: Explorar,
});

const norm = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

function Explorar() {
  const mode = useAppMode();
  const isMode = true;
  const { t, tCategory } = useI18n();
  const [groups, setGroups] = useState<ModeGroup[]>(demo);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    const refresh = () => {
      setGroups(readModeGroups(mode));
    };
    refresh();
    void syncRooms().then(refresh);
    window.addEventListener("chatly:rooms", refresh);
    return () => window.removeEventListener("chatly:rooms", refresh);
  }, [mode]);

  const filtered = useMemo(() => {
    const q = norm(query);
    return groups.filter((r) => {
      if (q && !norm(r.name).includes(q) && !norm(r.topic).includes(q)) return false;
      if (category && r.topic !== category) return false;
      return true;
    });
  }, [groups, query, category]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, category]);

  const shown = filtered.slice(0, visible);
  const rest = filtered.length - shown.length;

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link to="/" aria-label={t("back")} className="rounded-full border border-border p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-base font-bold">{`Todos los grupos`}</h1>
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? t("resultsCount") : t("resultsCountPlural")}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-20">
        <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchGroupPlaceholder")}
            aria-label={t("search")}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          {(query || category) && (
            <button
              aria-label={t("clearSearch")}
              onClick={() => {
                setQuery("");
                setCategory(null);
              }}
              className="rounded-full border border-border p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="swipe-row mt-3 gap-2 pb-1">
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => setCategory(category === c.label ? null : c.label)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                category === c.label
                  ? "border-brand bg-accent text-accent-foreground"
                  : "border-border bg-surface text-muted-foreground"
              }`}
            >
              {c.emoji} {tCategory(c.label)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-4 rounded-[var(--radius-2xl)] border border-dashed border-border bg-surface/60 p-4 text-sm text-muted-foreground">
            {t("noResults")}
          </p>
        ) : (
          <ModeGroupList groups={shown as ModeGroup[]} mode={mode} />
        )}

        {rest > 0 && (
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="mt-5 w-full rounded-full border border-border bg-surface py-3 font-display text-sm font-bold"
          >
            {t("seeMore")} ({Math.min(rest, PAGE_SIZE)})
          </button>
        )}

        {/* Menú: Sobre el sitio */}
        <section className="mt-12">
          <div className="border-t border-border/60 pt-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t("aboutSite")}
            </h3>
            <div className="mt-3 flex flex-col items-start gap-2.5">
              <Link
                to="/documentacion-panel"
                className="font-medium text-[0.72rem] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-2 decoration-emerald-500/40 hover:decoration-emerald-500 cursor-pointer transition-colors"
              >
                {t("adminPanel")}
              </Link>
              <Link
                to="/idioma"
                className="font-medium text-[0.72rem] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-2 decoration-emerald-500/40 hover:decoration-emerald-500 cursor-pointer transition-colors"
              >
                {t("languages")}
              </Link>
              <Link
                to="/acerca-de"
                className="font-medium text-[0.72rem] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-2 decoration-emerald-500/40 hover:decoration-emerald-500 cursor-pointer transition-colors"
              >
                {t("about")}
              </Link>
              <Link
                to="/terminos"
                className="font-medium text-[0.72rem] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-2 decoration-emerald-500/40 hover:decoration-emerald-500 cursor-pointer transition-colors"
              >
                {t("termsAndConditions")}
              </Link>
              <Link
                to="/pelink"
                className="font-medium text-[0.72rem] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-2 decoration-emerald-500/40 hover:decoration-emerald-500 cursor-pointer transition-colors"
              >
                {t("pelinkBot")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
