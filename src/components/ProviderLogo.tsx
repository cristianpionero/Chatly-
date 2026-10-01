/** Logos reales (SVG de marca) de los proveedores de mensajería. */
export const PROVIDER_COLOR: Record<string, string> = {
  whatsapp: "#25D366",
  discord: "#5865F2",
  signal: "#3A76F0",
  messenger: "#0084FF",
};

export function ProviderLogo({ id, className = "h-6 w-6" }: { id: string; className?: string }) {
  switch (id) {
    case "whatsapp":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#25D366" />
          <path
            fill="#fff"
            d="M16.1 6.9c-5 0-9.1 4.1-9.1 9.1 0 1.6.4 3.1 1.2 4.5L7 25.4l5-1.3c1.3.7 2.7 1.1 4.1 1.1 5 0 9.1-4.1 9.1-9.1s-4.1-9.2-9.1-9.2zm5.3 12.9c-.2.6-1.3 1.2-1.8 1.3-.5.1-1 .1-1.7-.1-1-.3-2.7-1.1-4.1-2.9-1-1.3-1.5-2.5-1.6-3.1-.1-.6.2-1.3.6-1.7.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.5l-.3.4c-.1.1-.2.3-.1.5.2.4.6 1 1.2 1.5.7.6 1.3.9 1.6 1 .2.1.4 0 .5-.1l.5-.6c.1-.2.3-.2.5-.1l1.6.8c.4.2.4.3.4.5.1.2 0 .5-.1.7z"
          />
        </svg>
      );
    case "discord":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#5865F2" />
          <path
            fill="#fff"
            d="M22.4 10.7a13 13 0 0 0-3.2-1l-.3.6a9.9 9.9 0 0 1 2.8 1.1 13.6 13.6 0 0 0-11.4 0 9.9 9.9 0 0 1 2.8-1.1l-.3-.6a13 13 0 0 0-3.2 1c-2 3-2.6 6.3-2.4 9.6a13.3 13.3 0 0 0 4 2 9.7 9.7 0 0 0 .9-1.4c-.5-.2-1-.4-1.4-.7l.3-.3a9.6 9.6 0 0 0 8.2 0l.3.3c-.4.3-.9.5-1.4.7.3.5.6 1 .9 1.4a13.3 13.3 0 0 0 4-2c.3-3.6-.5-6.9-2.6-9.6zM12.9 18.5c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.4.7 1.4 1.6-.6 1.6-1.4 1.6zm6.2 0c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.4.7 1.4 1.6-.6 1.6-1.4 1.6z"
          />
        </svg>
      );
    case "signal":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#3A76F0" />
          <path
            fill="#fff"
            d="M16 7.5c-4.8 0-8.7 3.6-8.7 8 0 1.9.7 3.6 1.8 5l-1.2 3.5a.6.6 0 0 0 .8.8l3.7-1.2c1.1.6 2.4.9 3.6.9 4.8 0 8.7-3.6 8.7-8s-3.9-9-8.7-9z"
          />
        </svg>
      );
    case "messenger":
      return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#0084FF" />
          <path
            fill="#fff"
            d="M16 7c-5 0-9 3.7-9 8.4 0 2.6 1.2 4.9 3.2 6.4v3l3-1.6c.9.2 1.8.4 2.8.4 5 0 9-3.7 9-8.3S21 7 16 7zm.9 11-2.3-2.4-4.3 2.4 4.8-5 2.3 2.4 4.2-2.4-4.7 5z"
          />
        </svg>
      );
    default:
      return <span className={className} aria-hidden="true" />;
  }
}
