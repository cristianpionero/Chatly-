import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Repeat, X, Check } from "lucide-react";
import verdeLogo from "@/assets/mode-verde-logo.png";
import { setMode, useAppMode, type AppMode } from "@/lib/app-mode";

export const modeLogo: Record<AppMode, string> = {
  whatsapp: verdeLogo,
};

type Choice = AppMode;

/** Logo de marca del modo activo (portada, bolita de ajustes, etc.). */
export function logoForMode(mode: AppMode): string {
  return modeLogo[mode];
}

const copy: Record<Choice, { name: string; provider: string; blurb: string }> = {
  whatsapp: {
    name: "Modo WhatsApp",
    provider: "WhatsApp",
    blurb:
      "Tu aplicación cambia a modo WhatsApp: verás un directorio de grupos para unirte directamente por su enlace de WhatsApp, sin chat interno.",
  },
};

/** Botón de la bolita: abre el selector de modo y su confirmación. */
export function ModeSwitcher({ className, onDone }: { className: string; onDone?: () => void }) {
  const mode = useAppMode();
  const navigate = useNavigate();
  const [step, setStep] = useState<null | "pick" | Choice>(null);

  function activate(choice: Choice) {
    setMode(choice);
    setStep(null);
    onDone?.();
    void navigate({ to: "/" });
  }

  return (
    <>
      <button
        type="button"
        aria-label="Cambiar de modo"
        title="Cambiar de modo"
        className={className}
        onClick={() => setStep("pick")}
      >
        <Repeat className="h-5 w-5" strokeWidth={2.5} style={{ color: "#0B7285" }} />
      </button>

      {step && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
          <button
            aria-label="Cerrar"
            onClick={() => setStep(null)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
          />

          {step === "pick" && (
            <div className="animate-in slide-in-from-bottom duration-300 relative w-full max-w-md rounded-t-[2rem] border border-border bg-surface p-5 pb-8 shadow-[var(--shadow-float)] sm:rounded-[2rem]">
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border sm:hidden" />
              <div className="mb-1 flex items-center justify-between">
                <h2 className="font-display text-base font-bold">Elige un modo</h2>
                <button
                  onClick={() => setStep(null)}
                  className="rounded-full border border-border p-1.5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">
                Elige cómo quieres usar la aplicación. El chulito indica el modo aplicado.
              </p>
              <div className="space-y-2.5">
                {(["whatsapp"] as Choice[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => (c === mode ? setStep(null) : setStep(c))}
                    className="flex w-full items-center gap-3 rounded-[var(--radius-2xl)] border border-border bg-surface p-3 text-left shadow-[var(--shadow-bubble)] active:scale-[0.98]"
                  >
                    <img
                      src={modeLogo[c]}
                      alt=""
                      width={512}
                      height={512}
                      loading="lazy"
                      className="h-10 w-10"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-sm font-bold">{copy[c].name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {`Grupos de ${copy[c].provider}`}
                      </span>
                    </span>
                    {mode === c && <Check className="h-4 w-4 text-brand" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step !== null && step !== "pick" && (
            <div className="animate-in zoom-in-95 duration-200 relative mx-4 mb-6 w-full max-w-xs rounded-[var(--radius-3xl)] border border-border bg-surface p-5 text-center shadow-[var(--shadow-float)] sm:mb-0">
              <img
                src={modeLogo[step]}
                alt=""
                width={512}
                height={512}
                loading="lazy"
                className="mx-auto h-14 w-14"
              />
              <h3 className="mt-3 font-display text-base font-bold">{copy[step].name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {copy[step].blurb}
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setStep("pick")}
                  className="flex-1 rounded-full border border-border py-2.5 font-display text-sm font-bold"
                >
                  Volver
                </button>
                <button
                  onClick={() => activate(step)}
                  className="flex-1 rounded-full brand-gradient py-2.5 font-display text-sm font-bold text-brand-foreground"
                >
                  Aceptar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
