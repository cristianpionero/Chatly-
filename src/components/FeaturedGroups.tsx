import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { ModeGroupList } from "@/components/ModeGroupList";
import type { AppMode } from "@/lib/app-mode";
import type { ModeGroup } from "@/lib/mode-groups";
import { useT } from "@/lib/i18n";

const FEATURED_LIMIT = 6;

/**
 * "Grupos destacados": los grupos que se publicaron primero en el directorio.
 * Se muestran con una tarjeta de encabezado con el color de la marca.
 */
export function FeaturedGroups({ groups, mode }: { groups: ModeGroup[]; mode: AppMode }) {
  const t = useT();
  const featured = useMemo(
    () => [...groups].sort((a, b) => a.createdAt - b.createdAt).slice(0, FEATURED_LIMIT),
    [groups],
  );

  if (groups.length <= 2 || featured.length === 0) return null;

  return (
    <section className="mt-10 px-4">
      <div className="rounded-[1.75rem_1.75rem_0.4rem_1.75rem] border border-border bg-surface p-4 shadow-[var(--shadow-bubble)]">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[0.9rem_0.9rem_0.9rem_0.3rem] brand-gradient text-brand-foreground">
            <Sparkles className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <h2 className="font-display text-base font-bold">{t("featuredGroupsTitle")}</h2>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {t("featuredGroupsSubtitle")}
        </p>
      </div>

      <ModeGroupList groups={featured} mode={mode} />
    </section>
  );
}
