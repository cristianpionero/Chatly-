import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bot,
  ShieldCheck,
  Zap,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  KeyRound,
  EyeOff,
  Sparkles,
} from "lucide-react";
import logo from "@/assets/chatly-logo.png";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/pelink")({
  head: () => ({
    meta: [
      { title: "Pelink — Bot Verificador Oficial en Tiempo Real | Chatly" },
      {
        name: "description",
        content:
          "Conoce a Pelink, el bot oficial de Chatly que verifica en tiempo real la vigencia y salud de los enlaces de WhatsApp sin unirse a los grupos.",
      },
      {
        property: "og:title",
        content: "Pelink — Bot Verificador Oficial en Tiempo Real | Chatly",
      },
      {
        property: "og:description",
        content:
          "Conoce a Pelink, el bot oficial de Chatly que verifica en tiempo real la vigencia y salud de los enlaces de WhatsApp sin unirse a los grupos.",
      },
    ],
  }),
  component: PelinkPage,
});

function PelinkPage() {
  const router = useRouter();
  const t = useT();

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
            <Bot className="h-3.5 w-3.5" />
            Bot Oficial de Chatly
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Pelink: Verificación de Enlaces en Tiempo Real
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            El sistema inteligente que comprueba de forma continua la vigencia, validez y salud de
            cada grupo publicado en Chatly, protegiendo a los usuarios y garantizando directorios
            libres de enlaces rotos.
          </p>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="relative z-10 mx-auto w-full max-w-2xl px-4 pt-8 pb-28 space-y-8 text-sm leading-relaxed text-foreground/90">
        {/* 1. ¿Qué es Pelink? */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-brand">
            <Sparkles className="h-4.5 w-4.5" />
            <h2 className="font-display text-base font-bold text-foreground">
              ¿Qué es Pelink y cuál es su misión?
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            En la mayoría de directorios y listas públicas de WhatsApp, uno de los mayores problemas
            con los que se topan las personas son los enlaces caídos, grupos que ya no existen, o
            invitaciones revocadas que arrojan el molesto mensaje de “El enlace no es válido”. Esto
            hace perder el tiempo a los usuarios y perjudica la reputación de la comunidad.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>Pelink</strong> es el bot oficial y guardián automatizado de Chatly. Su única
            misión es monitorear y certificar en tiempo real que cada enlace publicado en la
            plataforma esté realmente activo, que el grupo destino exista y que cualquier visitante
            pueda unirse de manera transparente e inmediata.
          </p>
        </section>

        <hr className="border-border/60" />

        {/* 2. ¿Cómo funciona la verificación sin entrar al grupo? */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <EyeOff className="h-4.5 w-4.5" />
            <h2 className="font-display text-base font-bold text-foreground">
              Privacidad total: Pelink nunca entra a tus grupos
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Un principio fundamental en Chatly es el respeto estricto a la privacidad de cada sala.
            <strong>
              {" "}
              Pelink jamás se une como participante a los grupos, no lee chats, no descarga archivos
              ni tiene acceso a los números de teléfono de tus integrantes.
            </strong>
          </p>
          <p className="text-muted-foreground leading-relaxed">
            En su lugar, Pelink realiza una <em>inspección perimetral del enlace oficial</em> (
            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
              chat.whatsapp.com
            </code>
            ). Mediante peticiones de verificación de encabezados y respuesta del protocolo oficial
            de WhatsApp, analiza la respuesta pública del enlace para comprobar si la invitación
            está vigente, sin invadir jamás el interior del grupo.
          </p>
        </section>

        <hr className="border-border/60" />

        {/* 3. Qué detecta en tiempo real */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-brand">
            <Zap className="h-4.5 w-4.5" />
            <h2 className="font-display text-base font-bold text-foreground">
              ¿Qué analiza Pelink apenas se publica o actualiza un grupo?
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Apenas un creador registra su grupo en Chatly o modifica sus datos, Pelink ejecuta una
            serie de validaciones en cuestión de segundos:
          </p>

          <div className="grid gap-3 pt-1">
            <div className="rounded-2xl border border-border/80 bg-surface/70 p-4 space-y-1">
              <div className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Vigencia del enlace
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Confirma que el enlace de invitación esté activo y no haya sido anulado por el
                creador dentro de WhatsApp.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-surface/70 p-4 space-y-1">
              <div className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Detección de enlaces expirados o cambiados
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Si un administrador pulsa «Restablecer enlace» en los ajustes de WhatsApp, el enlace
                anterior expira. Pelink detecta este cambio para avisar al dueño y permitir su
                renovación.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-surface/70 p-4 space-y-1">
              <div className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                <ShieldCheck className="h-4 w-4 text-brand" />
                Grupos inexistentes o eliminados
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Si el grupo fue cerrado o disuelto por los moderadores, Pelink lo marca de inmediato
                para evitar que usuarios ingresen a salas inactivas.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-surface/70 p-4 space-y-1">
              <div className="flex items-center gap-2 font-display text-xs font-bold text-foreground">
                <RefreshCw className="h-4 w-4 text-blue-500" />
                Prevención de duplicados
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Revisa que el mismo enlace de WhatsApp no esté duplicado en múltiples publicaciones,
                garantizando un catálogo ordenado y sin spam.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-border/60" />

        {/* 4. ¿Qué hacer si tu enlace expiró o cambió? El PIN de 15 dígitos */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <KeyRound className="h-4.5 w-4.5" />
            <h2 className="font-display text-base font-bold text-foreground">
              ¿Tu enlace cambió o expiró? Solución rápida con tu PIN
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Si cambiaste el enlace de tu grupo en WhatsApp o si Pelink detecta que tu enlace
            anterior ya está registrado, no tienes que empezar de cero ni perder la visibilidad de
            tu comunidad.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Cada grupo cuenta con una <strong>clave / PIN de 15 dígitos</strong> asignada al momento
            de crearlo. Al intentar registrar tu nuevo enlace, cuando el sistema te avise que el
            grupo ya existe, puedes tocar en <strong>«aquí»</strong> para abrir el formulario de
            cambio rápido. Al ingresar tu PIN de 15 dígitos y el nuevo enlace, Pelink lo comprueba y
            republica tu grupo con la información actualizada al instante.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            También puedes gestionarlo desde tu <strong>enlace privado de administración</strong> si
            lo conservas.
          </p>
        </section>

        <hr className="border-border/60" />

        {/* 5. Conclusión y enlaces */}
        <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center space-y-3">
          <h3 className="font-display text-base font-bold text-foreground">
            Comunidades vivas, seguras y sin enlaces rotos
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
            Pelink trabaja en segundo plano para que tú solo tengas que preocuparte por disfrutar de
            buenas conversaciones y hacer crecer tu grupo con personas afines.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              to="/crear"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-full bg-brand px-5 py-2.5 font-display text-xs font-bold text-brand-foreground shadow-sm hover:opacity-95 cursor-pointer"
            >
              Publicar mi grupo gratis
            </Link>
            <Link
              to="/documentacion-panel"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-border bg-surface px-5 py-2.5 font-display text-xs font-semibold text-foreground hover:bg-muted/40 cursor-pointer"
            >
              Documentación del Panel
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
