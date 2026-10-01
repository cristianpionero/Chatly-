export type Category = { emoji: string; label: string; count: string };

export const categories: Category[] = [
  { emoji: "🫂", label: "Amistad", count: "3.1k" },
  { emoji: "🎮", label: "Gaming", count: "2.4k" },
  { emoji: "💬", label: "Charla libre", count: "1.9k" },
  { emoji: "🎬", label: "Cine y series", count: "1.2k" },
  { emoji: "🎧", label: "Música", count: "980" },
  { emoji: "📚", label: "Estudio", count: "740" },
  { emoji: "💼", label: "Trabajo", count: "610" },
  { emoji: "⚽", label: "Deportes", count: "540" },
  { emoji: "🍕", label: "Comida", count: "510" },
  { emoji: "✈️", label: "Viajes", count: "470" },
  { emoji: "📸", label: "Fotografía", count: "430" },
  { emoji: "🎨", label: "Arte", count: "390" },
  { emoji: "💻", label: "Tecnología", count: "360" },
  { emoji: "🎙️", label: "Podcast", count: "320" },
  { emoji: "🌱", label: "Sostenibilidad", count: "290" },
  { emoji: "🐾", label: "Mascotas", count: "280" },
  { emoji: "💪", label: "Fitness", count: "250" },
  { emoji: "🎭", label: "Teatro", count: "220" },
  { emoji: "📖", label: "Lectura", count: "210" },
  { emoji: "🚗", label: "Autos", count: "190" },
  { emoji: "🏠", label: "Hogar", count: "180" },
  { emoji: "🎲", label: "Juegos de mesa", count: "160" },
  { emoji: "🧘", label: "Bienestar", count: "150" },
  { emoji: "🎤", label: "Karaoke", count: "140" },
  { emoji: "🌃", label: "Noche", count: "130" },
  { emoji: "🎓", label: "Universidad", count: "120" },
  { emoji: "🧩", label: "Humor", count: "110" },
  { emoji: "💰", label: "Finanzas", count: "100" },
  { emoji: "🎉", label: "Fiestas", count: "98" },
  { emoji: "🧑‍🍳", label: "Recetas", count: "94" },
  { emoji: "🛹", label: "Skate", count: "90" },
  { emoji: "🏍️", label: "Motos", count: "88" },
  { emoji: "🪄", label: "Anime", count: "86" },
  { emoji: "🧿", label: "Espiritual", count: "82" },
  { emoji: "🎹", label: "Producción", count: "78" },
  { emoji: "📈", label: "Emprender", count: "74" },
  { emoji: "🌍", label: "Idiomas", count: "70" },
  { emoji: "🕹️", label: "Retro", count: "66" },
  { emoji: "🏕️", label: "Aventura", count: "62" },
  { emoji: "🧵", label: "DIY", count: "58" },
  { emoji: "⛪", label: "Fe", count: "54" },
  { emoji: "🔞", label: "Más +18", count: "52" },
  { emoji: "✨", label: "Otros", count: "48" },
];

export type Country = { flag: string; label: string };
export type Region = { label: string; countries: Country[] };

export const countryRegions: Region[] = [
  {
    label: "Sudamérica",
    countries: [
      { flag: "🇦🇷", label: "Argentina" },
      { flag: "🇧🇷", label: "Brasil" },
      { flag: "🇨🇱", label: "Chile" },
      { flag: "🇨🇴", label: "Colombia" },
      { flag: "🇵🇪", label: "Perú" },
      { flag: "🇻🇪", label: "Venezuela" },
      { flag: "🇪🇨", label: "Ecuador" },
      { flag: "🇺🇾", label: "Uruguay" },
    ],
  },
  {
    label: "Norteamérica",
    countries: [
      { flag: "🇲🇽", label: "México" },
      { flag: "🇺🇸", label: "Estados Unidos" },
      { flag: "🇨🇦", label: "Canadá" },
      { flag: "🇬🇹", label: "Guatemala" },
      { flag: "🇨🇷", label: "Costa Rica" },
      { flag: "🇵🇦", label: "Panamá" },
      { flag: "🇭🇳", label: "Honduras" },
      { flag: "🇸🇻", label: "El Salvador" },
    ],
  },
  {
    label: "Caribe",
    countries: [
      { flag: "🇩🇴", label: "R. Dominicana" },
      { flag: "🇨🇺", label: "Cuba" },
      { flag: "🇵🇷", label: "Puerto Rico" },
      { flag: "🇯🇲", label: "Jamaica" },
      { flag: "🇧🇸", label: "Bahamas" },
      { flag: "🇹🇹", label: "Trinidad y T." },
      { flag: "🇧🇧", label: "Barbados" },
      { flag: "🇭🇹", label: "Haití" },
    ],
  },
  {
    label: "Europa",
    countries: [
      { flag: "🇪🇸", label: "España" },
      { flag: "🇵🇹", label: "Portugal" },
      { flag: "🇫🇷", label: "Francia" },
      { flag: "🇮🇹", label: "Italia" },
      { flag: "🇩🇪", label: "Alemania" },
      { flag: "🇬🇧", label: "Reino Unido" },
      { flag: "🇳🇱", label: "Países Bajos" },
      { flag: "🇵🇱", label: "Polonia" },
    ],
  },
  {
    label: "Asia",
    countries: [
      { flag: "🇯🇵", label: "Japón" },
      { flag: "🇰🇷", label: "Corea del Sur" },
      { flag: "🇨🇳", label: "China" },
      { flag: "🇮🇳", label: "India" },
      { flag: "🇮🇩", label: "Indonesia" },
      { flag: "🇹🇭", label: "Tailandia" },
      { flag: "🇵🇭", label: "Filipinas" },
      { flag: "🇹🇷", label: "Turquía" },
    ],
  },
];

export const allCountries: Country[] = countryRegions.flatMap((r) => r.countries);

/** Países destacados que se muestran sin abrir "Ver más". */
export const featuredCountries: Country[] = [
  { flag: "🇺🇸", label: "Estados Unidos" },
  { flag: "🇨🇴", label: "Colombia" },
  { flag: "🇧🇷", label: "Brasil" },
  { flag: "🇦🇷", label: "Argentina" },
  { flag: "🇪🇸", label: "España" },
  { flag: "🇵🇭", label: "Filipinas" },
  { flag: "🇫🇷", label: "Francia" },
  { flag: "🇲🇽", label: "México" },
];

export type Provider = {
  id: string;
  label: string;
  emoji: string;
  placeholder: string;
  /** Dominio(s) válidos para el enlace de invitación. */
  hosts: string[];
};

export const providers: Provider[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    emoji: "🟢",
    placeholder: "https://chat.whatsapp.com/…",
    hosts: ["chat.whatsapp.com"],
  },
  {
    id: "discord",
    label: "Discord",
    emoji: "🟣",
    placeholder: "https://discord.gg/…",
    hosts: ["discord.gg", "discord.com"],
  },
  {
    id: "signal",
    label: "Signal",
    emoji: "⚪",
    placeholder: "https://signal.group/…",
    hosts: ["signal.group", "signal.me"],
  },
  {
    id: "messenger",
    label: "Messenger",
    emoji: "🔷",
    placeholder: "https://m.me/j/…",
    hosts: ["m.me", "messenger.com"],
  },
];

export function isValidProviderLink(provider: Provider, value: string) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return false;
    const host = url.hostname.replace(/^www\./, "");
    return provider.hosts.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
}
