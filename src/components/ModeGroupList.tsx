import { useState } from "react";
import { Users } from "lucide-react";
import { modeLogo } from "@/components/ModeSwitcher";
import type { AppMode } from "@/lib/app-mode";
import { getGroupBadges, type ModeGroup } from "@/lib/mode-groups";
import { evaluarAcceso } from "@/lib/security";
import { useGuest, usuarioSeguro } from "@/lib/guest";
import { useProfile } from "@/lib/app-settings";
import { useI18n } from "@/lib/i18n";

/**
 * Lista de grupos del modo WhatsApp con diseño en línea limpia.
 * Cada grupo se muestra en una sola línea completa: nombre a la izquierda
 * e indicadores emoji (bandera, mundo, candado) alineados a la derecha.
 */
export function ModeGroupList({ groups, mode }: { groups: ModeGroup[]; mode: AppMode }) {
  const profile = useProfile();
  const guest = useGuest();
  const { t, tCategory, tCountry, lang } = useI18n();
  const [joining, setJoining] = useState<ModeGroup | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);

  if (mode !== "whatsapp") return null;
  const providerName = "WhatsApp";

  const description = joining?.rules?.trim() || t("noDescription");
  const isLongDescription = description.length > 100;

  return (
    <>
      <div className="mt-3 divide-y divide-border/40 border-y border-border/40">
        {groups.map((g) => {
          const badge = getGroupBadges(g);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setJoining(g);
                setShowFullDesc(false);
              }}
              className="group flex w-full items-center justify-between py-3.5 px-2 text-left transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              <span className="min-w-0 flex-1 truncate font-display text-[0.95rem] font-medium text-foreground group-hover:text-brand transition-colors">
                {g.name}
              </span>
              <span
                className="shrink-0 pl-4 text-base tracking-wider select-none"
                title={badge.label}
              >
                {badge.emojis}
              </span>
            </button>
          );
        })}
      </div>

      {joining && (
        <div className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center">
          <button
            aria-label={t("close")}
            onClick={() => setJoining(null)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
          />
          <div className="animate-in slide-in-from-bottom duration-300 relative w-full max-w-sm rounded-t-[2rem] border border-border bg-surface p-5 pb-8 shadow-[var(--shadow-float)] sm:rounded-[2rem]">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border sm:hidden" />
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-[1rem_1rem_1rem_0.3rem] bg-accent text-2xl">
                {joining.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-bold">{joining.name}</p>
                <p className="text-xs text-muted-foreground">
                  {joining.country} {tCountry(joining.countryLabel)} · {tCategory(joining.topic)}
                </p>
              </div>
              <img
                src={modeLogo[mode]}
                alt=""
                width={512}
                height={512}
                loading="lazy"
                className="h-9 w-9"
              />
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-[var(--radius-2xl)] bg-accent px-4 py-3 text-accent-foreground">
              <Users className="h-5 w-5 shrink-0" strokeWidth={2.5} />
              <p className="font-display text-sm font-bold">
                {joining.members.toLocaleString(lang)} {t("joinedCount")}
              </p>
            </div>

            <div className="mt-3 rounded-[var(--radius-2xl)] border border-border p-3 transition-all max-h-48 overflow-y-auto">
              <p className="font-display text-xs font-bold">{t("description")}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground break-words">
                {isLongDescription ? (
                  <>
                    <span>{showFullDesc ? description : `${description.slice(0, 100)}...`}</span>
                    <button
                      type="button"
                      onClick={() => setShowFullDesc((prev) => !prev)}
                      className="ml-1.5 inline font-medium text-[0.72rem] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline underline-offset-2 decoration-emerald-500/40 hover:decoration-emerald-500 cursor-pointer transition-colors"
                    >
                      {showFullDesc ? t("seeLess") : t("seeMore")}
                    </button>
                  </>
                ) : (
                  description
                )}
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setJoining(null)}
                className="flex-1 rounded-full border border-border py-3 font-display text-sm font-bold"
              >
                {t("cancel")}
              </button>
              {evaluarAcceso(joining, usuarioSeguro(profile, guest)).puedeUsarProveedor(
                joining.provider,
              ) ? (
                <a
                  href={joining.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setJoining(null)}
                  className="flex-[1.4] rounded-full brand-gradient py-3 text-center font-display text-sm font-bold text-brand-foreground"
                >
                  {t("joinGroup")}
                </a>
              ) : (
                <span className="flex-[1.4] rounded-full border border-border py-3 text-center font-display text-sm font-bold text-muted-foreground">
                  {t("blockedRegion")}
                </span>
              )}
            </div>
            <p className="mt-3 text-center text-[0.7rem] text-muted-foreground">
              {t("redirectNotice")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
