import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Link2, Ban, Lock, FileText, CheckCircle2 } from "lucide-react";
import logo from "@/assets/chatly-logo.png";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/terminos")({
  head: () => ({
    meta: [
      { title: "Términos y Condiciones — Chatly" },
      {
        name: "description",
        content:
          "Términos y condiciones de uso de Chatly, normas de convivencia, políticas anti-spam y directrices de moderación.",
      },
      { property: "og:title", content: "Términos y Condiciones — Chatly" },
      {
        property: "og:description",
        content:
          "Términos y condiciones de uso de Chatly, normas de convivencia, políticas anti-spam y directrices de moderación.",
      },
    ],
  }),
  component: TerminosYCondiciones,
});

function TerminosYCondiciones() {
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
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface transition-colors hover:bg-muted/40 cursor-pointer"
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
            Términos y Condiciones de Uso
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Normas de convivencia, uso responsable y directrices para la publicación de enlaces y
            creación de páginas en Chatly.
          </p>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-2xl px-4 pt-6 pb-28 space-y-8 text-sm leading-relaxed text-foreground/90">
        {/* 1. Naturaleza del servicio */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Link2 className="h-4 w-4" />
            <h2 className="font-display text-base font-bold text-foreground">
              1. Repositorio de enlaces y páginas (No hub de contenido explícito)
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Chatly y sus herramientas de diseño constituyen exclusivamente un{" "}
            <strong className="text-foreground font-semibold">
              repositorio y directorio abierto de enlaces comunitarios
            </strong>
            . Nuestra función es conectar a las personas con páginas informativas y grupos en
            plataformas externas de mensajería (como WhatsApp).
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Chatly{" "}
            <strong className="text-foreground font-semibold">
              NO es un hub de contenido inapropiado o explícito, ni almacena, aloja ni distribuye
              archivos multimedia, fotos, audios ni videos
            </strong>
            . Todo el contenido compartido, las conversaciones y los archivos ocurren única y
            directamente dentro de los servidores de WhatsApp y las plataformas externas.
          </p>
        </section>

        <hr className="border-border/60" />

        {/* 2. Cero tolerancia a Spam y Contenido Violento */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-brand">
            <Ban className="h-4 w-4" />
            <h2 className="font-display text-base font-bold text-foreground">
              2. Prohibición estricta de Spam y Contenido Violento
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Mantenemos una política de tolerancia cero ante conductas que comprometan la seguridad
            de los usuarios. Queda estrictamente prohibido:
          </p>
          <ul className="space-y-2 pl-1 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-foreground font-semibold">
                  Spam y enlaces duplicados:
                </strong>{" "}
                Reiterar publicaciones idénticas, utilizar enlaces engañosos, acortadores con
                publicidad invasiva o redirecciones a sitios de phishing y malware.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-foreground font-semibold">
                  Violencia y hostigamiento:
                </strong>{" "}
                Páginas o grupos que inciten al odio, discriminación, amenazas de daño físico,
                extorsión, acoso o actividades ilícitas.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>
                <strong className="text-foreground font-semibold">Estafas y fraudes:</strong>{" "}
                Enlaces diseñados para engañar económicamente o usurpar identidades de terceros.
              </span>
            </li>
          </ul>
        </section>

        <hr className="border-border/60" />

        {/* 3. Pautas sobre grupos +18 / Adultos */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-brand">
            <Lock className="h-4 w-4" />
            <h2 className="font-display text-base font-bold text-foreground">
              3. Directrices sobre Grupos y Enlaces +18 (Adultos)
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            La creación de grupos para mayores de edad (+18) es legal y permitida entre adultos en
            sus respectivos entornos externos. No obstante, al tratarse de un repositorio accesible
            y organizado, rige una regla fundamental de discreción:
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong className="text-foreground font-semibold">
              No especificar ni graficar contenido en fachadas públicas:
            </strong>{" "}
            Está prohibido colocar títulos pornográficos explícitos, descripciones anatómicas o
            gráficas vulgares en el nombre visible, subtítulos o portadas de las páginas y grupos.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Los detalles temáticos, acuerdos y contenidos específicos deben gestionarse{" "}
            <strong className="text-foreground font-semibold">
              directamente dentro de la plataforma externa (WhatsApp)
            </strong>
            , conservando la interfaz pública de Chatly limpia, ordenada y libre de material
            explícito visible.
          </p>
        </section>

        <hr className="border-border/60" />

        {/* 4. Responsabilidad y Moderación */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-brand">
            <ShieldCheck className="h-4 w-4" />
            <h2 className="font-display text-base font-bold text-foreground">
              4. Responsabilidad de los Administradores y Derecho de Retiro
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Cada creador que publique un enlace o diseñe una página asume la total y exclusiva
            responsabilidad de la temática de su grupo y de la moderación de los participantes
            dentro de su sala externa.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Chatly se reserva el derecho de retirar, despublicar o bloquear permanentemente
            cualquier grupo, página o enlace reportado que no cumpla con estas pautas de convivencia
            o que atente contra la ley y la comunidad.
          </p>
        </section>

        <hr className="border-border/60" />

        {/* 5. Aceptación */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            <h2 className="font-display text-base font-bold text-foreground">
              5. Aceptación de los Términos
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            El acceso, navegación, publicación de grupos y uso del diseñador de páginas en Chatly
            implican la aceptación plena e incondicional de estas condiciones.
          </p>
          <div className="pt-2">
            <Link
              to="/crear"
              className="inline-flex items-center gap-2 rounded-full brand-gradient px-5 py-2.5 font-display text-xs font-bold text-brand-foreground shadow-[var(--shadow-float)]"
            >
              Publicar grupo aceptando términos
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
