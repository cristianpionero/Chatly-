import { createFileRoute, useRouter, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Shield,
  KeyRound,
  SlidersHorizontal,
  ExternalLink,
  Lock,
  Sparkles,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import logo from "@/assets/chatly-logo.png";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/documentacion-panel")({
  head: () => ({
    meta: [
      { title: "Panel de Administración — Documentación | Chatly" },
      {
        name: "description",
        content:
          "Aprende cómo funciona el Panel de Administración de Chatly, el acceso exclusivo mediante enlace privado y la clave PIN de 15 dígitos.",
      },
      {
        property: "og:title",
        content: "Panel de Administración — Documentación | Chatly",
      },
      {
        property: "og:description",
        content:
          "Aprende cómo funciona el Panel de Administración de Chatly, el acceso exclusivo mediante enlace privado y la clave PIN de 15 dígitos.",
      },
    ],
  }),
  component: DocumentacionPanelPage,
});

function DocumentacionPanelPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const t = useT();

  const [inputUrl, setInputUrl] = useState("");
  const [errorInput, setErrorInput] = useState<string | null>(null);

  function handleGoToPanel(e: React.FormEvent) {
    e.preventDefault();
    setErrorInput(null);
    const val = inputUrl.trim();
    if (!val) {
      setErrorInput("Ingresa el enlace o ID de tu grupo.");
      return;
    }

    // Si pegaron una URL completa
    try {
      if (val.includes("panel-administracion")) {
        const urlObj = new URL(val, window.location.origin);
        const idParam = urlObj.searchParams.get("id");
        if (idParam) {
          navigate({ to: "/panel-administracion", search: { id: idParam } });
          return;
        }
      }
    } catch {
      // Ignorar error de parsing y continuar como ID
    }

    // Si pusieron directamente el ID
    navigate({ to: "/panel-administracion", search: { id: val } });
  }

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-[24rem]"
      />

      {/* Cabecera */}
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
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Shield className="h-3.5 w-3.5" />
            Guía de Administración y Seguridad
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Documentación: Panel de Administración
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Aprende cómo funciona el control privado de tus grupos, por qué el acceso se realiza
            exclusivamente mediante tu enlace personal y cómo proteger tu comunidad con tu clave
            PIN.
          </p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative z-10 mx-auto w-full max-w-2xl px-4 pt-8 pb-28 space-y-8 text-sm leading-relaxed text-foreground/90">
        {/* 1. Acceso mediante enlace privado */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-brand">
            <Lock className="h-4.5 w-4.5" />
            <h2 className="font-display text-base font-bold text-foreground">
              Acceso 100% privado mediante enlace secreto
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            En Chatly creemos en la sencillez y la soberanía de los datos: no te obligamos a crear
            cuentas con correos electrónicos que luego saturan tu bandeja, ni a recordar contraseñas
            complejas.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Cuando publicas un grupo en Chatly, el sistema genera de forma instantánea una pantalla
            de confirmación donde te entrega tu <strong>enlace privado de administración</strong>{" "}
            con un identificador único (por ejemplo:{" "}
            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400">
              /panel-administracion?id=tu-codigo-secreto
            </code>
            ).
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>El acceso al panel no es público:</strong> Por esa razón, el enlace del menú
            inferior conduce a esta documentación. Ningún visitante puede ver ni modificar los datos
            de tu grupo a menos que cuente con tu enlace secreto personal.
          </p>
        </section>

        <hr className="border-border/60" />

        {/* 2. Tu clave / PIN de 15 dígitos */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <KeyRound className="h-4.5 w-4.5" />
            <h2 className="font-display text-base font-bold text-foreground">
              Tu clave / PIN de 15 dígitos: tu seguro de vida
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Cada grupo registrado en Chatly tiene asignada una clave numérica de seguridad de 15
            dígitos generada criptográficamente. Esta clave actúa como prueba inequívoca de
            propiedad del grupo.
          </p>
          <div className="rounded-2xl border border-border/80 bg-surface/70 p-4 space-y-2">
            <p className="font-display text-xs font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              ¿Para qué sirve tu PIN de 15 dígitos?
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
              <li>
                <strong>Cambio rápido sin ir al panel:</strong> Si intentas publicar un nuevo enlace
                y el sistema te indica que ya está en uso, puedes tocar en <em>«aquí»</em> para
                ingresar tu PIN y actualizar el grupo en tiempo real.
              </li>
              <li>
                <strong>Recuperación de propiedad:</strong> Si perdiste tu enlace de administración
                o borraste el historial del navegador, tu PIN te permite reactivar y republicar tu
                comunidad.
              </li>
              <li>
                <strong>Protección contra suplantación:</strong> Impide que personas ajenas se
                apropien de tu grupo o modifiquen su enlace.
              </li>
            </ul>
          </div>
        </section>

        <hr className="border-border/60" />

        {/* 3. Funciones del Panel */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-brand">
            <SlidersHorizontal className="h-4.5 w-4.5" />
            <h2 className="font-display text-base font-bold text-foreground">
              ¿Qué puedes gestionar desde el Panel de Administración?
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Al abrir tu enlace privado de administración, tendrás acceso a un panel minimalista y de
            guardado automático donde puedes:
          </p>

          <div className="grid gap-3 pt-1">
            <div className="rounded-2xl border border-border/80 bg-surface/70 p-4 space-y-1">
              <div className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Actualizar el nombre del grupo
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cambia el título visible de tu grupo en el directorio con actualización automática
                en 3 segundos.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-surface/70 p-4 space-y-1">
              <div className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Rotar o actualizar el enlace de WhatsApp
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Si restableciste el enlace de invitación en WhatsApp, ingresa el nuevo enlace aquí
                para que los visitantes sigan entrando sin interrupciones.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-surface/70 p-4 space-y-1">
              <div className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Filtrar audiencia geográfica
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Elige si tu grupo está abierto a personas de todo el mundo, solo de tu país de
                origen o de países específicos de tu elección.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-border/60" />

        {/* 4. Acceso directo si ya tienes tu enlace o ID */}
        <section className="rounded-2xl border border-border bg-surface p-5 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-display text-base font-bold">
            <ExternalLink className="h-4.5 w-4.5 text-brand" />
            ¿Ya tienes tu enlace privado o ID de grupo?
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Pega tu enlace de administración o el identificador de tu grupo a continuación para
            acceder directamente a tus opciones de edición:
          </p>

          <form onSubmit={handleGoToPanel} className="space-y-3 pt-1">
            <div className="chat-bubble px-3.5 py-2.5">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Pega tu enlace privado o ID del grupo..."
                className="w-full bg-transparent font-mono text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>

            {errorInput && <p className="text-xs font-semibold text-destructive">{errorInput}</p>}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-1.5 rounded-full bg-brand py-2.5 font-display text-xs font-bold text-brand-foreground shadow-sm hover:opacity-95 cursor-pointer"
            >
              Ir a mi panel de administración
            </button>
          </form>
        </section>

        {/* Enlace a Pelink */}
        <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            ¿Quieres saber cómo se verifican los enlaces en tiempo real?
          </p>
          <Link
            to="/pelink"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Conoce a Pelink, nuestro bot oficial de verificación →
          </Link>
        </section>
      </main>
    </div>
  );
}
