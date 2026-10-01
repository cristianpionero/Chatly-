import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Radio, X } from "lucide-react";
import { logoForMode } from "@/components/ModeSwitcher";
import { categories, countryRegions } from "@/lib/chatly-data";
import { HOME_LIMIT } from "@/lib/demo-rooms";
import { syncRooms } from "@/lib/db/sync-rooms";
import { useAppMode } from "@/lib/app-mode";
import { readModeGroups, demo, type ModeGroup } from "@/lib/mode-groups";
import { ModeGroupList } from "@/components/ModeGroupList";
import { FeaturedGroups } from "@/components/FeaturedGroups";
import { useI18n } from "@/lib/i18n";

import { metricsBadge } from "@/lib/metrics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grupos de WhatsApp — Chatly" },
      {
        name: "description",
        content:
          "Directorio de grupos de WhatsApp por tema y país. Únete en un toque o publica tu grupo gratis.",
      },
      { property: "og:title", content: "Grupos de WhatsApp — Chatly" },
      {
        property: "og:description",
        content:
          "Directorio de grupos de WhatsApp por tema y país. Únete en un toque o publica tu grupo gratis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://authentic-chats.lovable.app/" },
      { property: "og:locale", content: "es_ES" },
      {
        name: "keywords",
        content:
          "grupos de whatsapp, links de grupos de whatsapp, unirse a grupos de whatsapp, comunidades whatsapp",
      },
      { name: "robots", content: "index, follow, max-image-preview:large" },
    ],
    links: [{ rel: "canonical", href: "https://authentic-chats.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Chatly",
          url: "https://authentic-chats.lovable.app/",
          inLanguage: "es",
          description:
            "Directorio de grupos de WhatsApp por tema y país. Únete en un toque o publica tu grupo gratis.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://authentic-chats.lovable.app/explorar?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "¿Cómo me uno a un grupo de WhatsApp en Chatly?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Elige un grupo del directorio, revisa sus términos y toca unirte para abrirlo directamente en WhatsApp.",
              },
            },
            {
              "@type": "Question",
              name: "¿Puedo publicar mi grupo gratis?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sí. Publicar tu grupo en Chatly es gratis: agrega nombre, categoría, país y tu enlace de invitación.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

const norm = (v: string) =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/** Filtro compartido: nombre + categoría + país. */
function matches(
  item: { name: string; topic: string; countryLabel: string },
  query: string,
  category: string | null,
  country: string,
) {
  const q = norm(query);
  if (q && !norm(item.name).includes(q) && !norm(item.topic).includes(q)) return false;
  if (category && item.topic !== category) return false;
  if (country !== "Todos" && item.countryLabel !== country) return false;
  return true;
}

function Index() {
  const mode = useAppMode();
  const { t, tCategory, tCountry, tRegion } = useI18n();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState("Sudamérica");
  const [activeCountry, setActiveCountry] = useState("Todos");
  const [groups, setGroups] = useState<ModeGroup[]>(demo);

  useEffect(() => {
    const refresh = () => {
      setGroups(readModeGroups(mode));
    };
    refresh();
    void syncRooms().then(refresh);
    window.addEventListener("chatly:rooms", refresh);
    return () => window.removeEventListener("chatly:rooms", refresh);
  }, [mode]);

  const region = countryRegions.find((r) => r.label === activeRegion) ?? countryRegions[0]!;

  const filteredGroups = useMemo(
    () => groups.filter((g) => matches(g, query, activeCategory, activeCountry)),
    [groups, query, activeCategory, activeCountry],
  );
  /** En los modos la portada también muestra como máximo 20 grupos. */
  const homeGroups = filteredGroups.slice(0, HOME_LIMIT);

  const isMode = true;
  const providerName = "WhatsApp";
  const brandLogo = logoForMode(mode);
  const brandName = "Chatly Verde";
  const resultsCount = filteredGroups.length;
  /** Conteos reales de la base de datos (ya no hay cifras de demo). */
  const countByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const g of groups) map.set(g.topic, (map.get(g.topic) ?? 0) + 1);
    return map;
  }, [groups]);

  const filters = (
    <>
      <section className="pt-4">
        <div className="flex items-baseline justify-between px-4">
          <h2 className="font-display text-base font-bold">{t("topics")}</h2>
          <span className="text-xs text-muted-foreground">{t("swipe")}</span>
        </div>
        <div className="swipe-row mt-3 gap-2 px-4 pb-2">
          {categories.map((c) => {
            const active = c.label === activeCategory;
            return (
              <button
                key={c.label}
                onClick={() => setActiveCategory(active ? null : c.label)}
                className={`chat-bubble w-[5.25rem] px-2 pt-2 pb-2.5 text-left ${
                  active ? "chat-bubble-active" : ""
                }`}
              >
                <span className="text-xl">{c.emoji}</span>
                <span className="mt-1.5 block font-display text-[0.72rem] leading-tight font-semibold truncate">
                  {tCategory(c.label)}
                </span>
                <span className="mt-0.5 block text-[0.6rem] text-muted-foreground">
                  {countByCategory.get(c.label) ?? 0} {t("roomsWord")}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center gap-3">
          <h2 className="shrink-0 font-display text-base font-bold">{t("countries")}</h2>
          <div className="swipe-row gap-2">
            {countryRegions.map((r) => (
              <button
                key={r.label}
                onClick={() => setActiveRegion(r.label)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  r.label === activeRegion
                    ? "border-brand bg-brand/15 text-foreground"
                    : "border-border bg-surface text-muted-foreground"
                }`}
              >
                {tRegion(r.label)}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCountry("Todos")}
            className={`country-tag ${activeCountry === "Todos" ? "country-tag-active" : ""}`}
          >
            <span>🌎</span>
            {t("all")}
          </button>
          {region.countries.map((c) => (
            <button
              key={c.label}
              onClick={() => setActiveCountry(activeCountry === c.label ? "Todos" : c.label)}
              className={`country-tag ${c.label === activeCountry ? "country-tag-active" : ""}`}
            >
              <span>{c.flag}</span>
              {tCountry(c.label)}
            </button>
          ))}
        </div>
      </section>
    </>
  );

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[26rem]"
      />
      <header className="relative z-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <img src={brandLogo} alt={brandName} width={512} height={512} className="h-8 w-8" />
            <span className="font-display text-lg font-bold tracking-tight">
              {isMode ? (
                <>
                  Chat<span className="text-brand">ly</span>
                </>
              ) : (
                <>
                  Chat<span className="text-muted-foreground">ly</span>
                </>
              )}
            </span>
          </div>
          <Link
            to="/crear"
            className="inline-flex items-center gap-1 rounded-full brand-gradient px-3 py-1.5 font-display text-xs font-bold text-brand-foreground shadow-[var(--shadow-bubble)]"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            {t("create")}
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl pb-20">
        <section className="px-4 pt-4 pb-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Radio className="h-3.5 w-3.5 text-brand" strokeWidth={3} />
            {metricsBadge(groups.length)}
          </span>
          <h1 className="mt-5 font-display text-[2.1rem] leading-[1.05] font-bold tracking-tight">
            {t("heroJoinTitle1")}
            <br />
            {t("heroJoinTitle2")}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-relaxed text-muted-foreground">
            {t("heroSubtitle")}
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 shadow-[var(--shadow-bubble)]">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchGroupPlaceholder")}
              aria-label={t("search")}
              className="min-w-0 flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            {(query || activeCategory || activeCountry !== "Todos") && (
              <button
                aria-label={t("clearSearch")}
                onClick={() => {
                  setQuery("");
                  setActiveCategory(null);
                  setActiveCountry("Todos");
                }}
                className="rounded-full border border-border p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {(query || activeCategory || activeCountry !== "Todos") && (
            <p className="mt-2 text-xs text-muted-foreground">
              {resultsCount} {resultsCount === 1 ? t("resultsCount") : t("resultsCountPlural")}
              {activeCategory && ` · ${tCategory(activeCategory)}`}
              {activeCountry !== "Todos" && ` · ${tCountry(activeCountry)}`}
            </p>
          )}
        </section>

        {filters}

        <section className="mt-8 px-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-base font-bold">
              {`Grupos de ${providerName}`}
              {activeCategory && ` · ${tCategory(activeCategory)}`}
              {activeCountry !== "Todos" && ` · ${tCountry(activeCountry)}`}
            </h2>
          </div>

          {resultsCount === 0 && (
            <p className="mt-3 rounded-[var(--radius-2xl)] border border-dashed border-border bg-surface/60 p-4 text-sm text-muted-foreground">
              {t("noResults")}
            </p>
          )}

          {isMode ? <ModeGroupList groups={homeGroups} mode={mode} /> : null}
        </section>

        {isMode ? <FeaturedGroups groups={groups} mode={mode} /> : null}

        <section className="mt-10 px-4">
          <div className="rounded-[1.75rem_1.75rem_1.75rem_0.4rem] brand-gradient p-5 text-brand-foreground shadow-[var(--shadow-float)]">
            <p className="font-display text-lg leading-tight font-bold">{t("promoTitle")}</p>
            <p className="mt-2 text-sm opacity-80">{t("promoSubtitle")}</p>
            <Link
              to="/disenar"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-display text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              {t("promoBtn")}
            </Link>
          </div>
        </section>

        {/* Menú: Sobre el sitio */}
        <section className="mt-10 px-4">
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

      <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        {t("footerText")}
      </footer>
    </div>
  );
}
