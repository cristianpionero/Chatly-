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

        {/* 3. Política de Cero Tolerancia y Ciclo de 24 Horas */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-rose-500">
            <AlertTriangle className="h-4.5 w-4.5" />
            <h2 className="font-display text-base font-bold text-foreground">
              Política de Cero Tolerancia y Ciclo de 24 Horas
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Para garantizar que Chatly nunca se llene de enlaces fraudulentos, grupos vacíos o
            trampas de creadores que publican un enlace para cambiarlo minutos después, Pelink opera
            bajo reglas estrictas e inapelables:
          </p>

          <div className="grid gap-3 pt-1">
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-display text-xs font-bold text-rose-600 dark:text-rose-400">
                <CheckCircle2 className="h-4 w-4" />
                Cero tolerancia al publicar (Revisión instantánea)
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Apenas se pulsa «Publicar grupo», Pelink revisa el enlace de forma inmediata. Si el
                enlace está caído, revocado, no corresponde a un grupo real de WhatsApp o fue
                cambiado desde el inicio, se considera una falta de respeto al directorio:
                <strong> el grupo es rechazado y eliminado permanentemente de inmediato</strong> de
                la base de datos para no almacenar basura.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-display text-xs font-bold text-amber-600 dark:text-amber-400">
                <RefreshCw className="h-4 w-4" />
                Revisión rutinaria cada 24 horas (Ventana estricta de 1 hora)
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pelink barre todos los grupos del catálogo en un ciclo automático de 24 horas. Si en
                su revisión detecta que un creador modificó, restableció o dejó caer el enlace
                después de haberlo publicado, el sistema le otorga una ventana máxima de
                <strong> 1 sola hora</strong> para solucionarlo. Si en ese plazo no es actualizado,
                el grupo se elimina permanentemente de la base de datos sin contemplaciones.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1.5">
              <div className="flex items-center gap-2 font-display text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Zap className="h-4 w-4" />
                Auditoría comunitaria instantánea (Regla de los 2 reportes)
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                En cada ficha de grupo, discretamente integrado junto a la descripción, los
                visitantes cuentan con un enlace verde que indica <em>«caído»</em>. Cuando dos
                usuarios reportan que un grupo no funciona,{" "}
                <strong>Pelink entra a auditarlo de manera inmediata</strong> sin esperar el ciclo
                de 24 horas. Si corrobora que el enlace no sirve, procede a su eliminación
                definitiva en el acto.
              </p>
            </div>
          </div>
        </section>

        <hr className="border-border/60" />

        {/* 4. Advertencia a los administradores: Su poder es el PIN de 15 dígitos */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-brand">
            <KeyRound className="h-4.5 w-4.5" />
            <h2 className="font-display text-base font-bold text-foreground">
              Advertencia a creadores: Tienen un poder más que nosotros (Su PIN)
            </h2>
          </div>
          <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4 space-y-2">
            <p className="font-display text-xs font-bold text-brand">
              ⚠️ Aviso importante a los administradores de salas
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ustedes como creadores cuentan con una herramienta que nosotros no podemos gestionar
              por ustedes: <strong>su clave PIN única de 15 dígitos</strong> y su enlace privado de
              administración. Con ese PIN tienen el poder exclusivo de cambiar, reparar y reactivar
              el enlace de su comunidad en segundos desde cualquier dispositivo.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Si tu enlace en WhatsApp cambia o se restablece, no esperes a que los usuarios lo
              reporten o a que Pelink lo elimine. Entra de inmediato con tu PIN, actualiza el enlace
              y tu grupo mantendrá su lugar y visibilidad. Si descuidas tu comunidad, el bot actuará
              con tolerancia cero.
            </p>
          </div>
        </section>

        <hr className="border-border/60" />

        {/* 5. ¿Qué hacer si tu enlace expiró o cambió? El PIN de 15 dígitos */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4.5 w-4.5" />
            <h2 className="font-display text-base font-bold text-foreground">
              ¿Cómo usar tu PIN para cambiar el enlace al instante?
            </h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Si restableciste el enlace de tu grupo en WhatsApp o deseas apuntar a una nueva sala, no
            tienes que perder tu posición ni tu audiencia:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-xs text-muted-foreground pl-1">
            <li>
              Al intentar publicar el nuevo enlace, el sistema te avisará si detecta tu grupo y te
              permitirá tocar en <strong>«aquí»</strong> para cambio rápido.
            </li>
            <li>
              Ingresas tu <strong>PIN de 15 dígitos</strong> y el nuevo enlace oficial de WhatsApp.
            </li>
            <li>
              Pelink lo valida en el instante y republica tu grupo con la información actualizada
              sin interrupciones.
            </li>
          </ol>
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
