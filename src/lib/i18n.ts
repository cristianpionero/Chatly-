import { useCallback } from "react";
import { useLang } from "./app-settings";
import { categoryName } from "./i18n-categories";

export type Language = { code: string; flag: string; name: string };

/** 3 idiomas disponibles: Español, English, Português. */
export const LANGUAGES: Language[] = [
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "en", flag: "🇺🇸", name: "English" },
  { code: "pt", flag: "🇧🇷", name: "Português" },
];

const es = {
  settings: "Configuración",
  profile: "Perfil",
  darkMode: "Modo oscuro",
  lightMode: "Modo claro",
  language: "Idioma",
  chooseLanguage: "Elige tu idioma",
  country: "País",
  back: "Volver",
  home: "Inicio",
  cancel: "Cancelar",
  close: "Cerrar",
  search: "Buscar",
  clearSearch: "Limpiar búsqueda",
  topics: "Temas",
  countries: "Países",
  all: "Todos",
  allCountries: "Todos los países",
  swipe: "desliza →",
  roomsWord: "salas",
  resultsCount: "resultado",
  resultsCountPlural: "resultados",
  noResults: "No encontramos grupos con esa búsqueda. Prueba con otro nombre, categoría o país.",
  create: "Crear",
  createTitle: "Crear tu grupo",
  createSubtitle: "Publícalo una vez y tu comunidad entra desde la web o desde tus grupos.",
  stepName: "Nombre del grupo",
  namePlaceholder: "Ej: Nuevas amistades 2026",
  nameMaxError: "Pasaste el límite: máximo 80 caracteres.",
  stepLink: "Pon tu enlace de WhatsApp",
  required: "obligatorio",
  linkTaken: "Ese enlace ya está registrado en otro grupo. Usa uno distinto.",
  linkValidating: "Revisando el enlace…",
  linkReady: "Enlace válido y listo.",
  stepCategory: "Elige la categoría",
  stepCountry: "País de origen",
  stepDesc: "Descripción y reglas",
  descPlaceholder:
    "Cuéntale a la gente de qué trata el grupo, temas de conversación o normas básicas…",
  descMaxError: "Pasaste el límite: máximo 150 caracteres.",
  stepAudience: "¿Quiénes pueden unirse?",
  audienceAll: "Todos los países pueden unirse",
  audienceMine: "Solo mi país",
  audienceSome: "Países específicos",
  audienceMineHint: "Solo gente de tu país podrá unirse.",
  selectedCountries: "países seleccionados",
  edit: "editar",
  acceptTermsText: "Acepto los términos y condiciones de Chatly y me comprometo a moderar mi sala.",
  publishBtn: "Publicar grupo",
  publishingTitle: "Publicando grupo",
  wrongOrigin: "Este no es el origen del chat. Pon el país correcto.",

  // Hero / Portada
  heroJoinTitle1: "Únete a los grupos",
  heroJoinTitle2: "de WhatsApp",
  heroSubtitle: "Elige un grupo, revisa su descripción y únete directamente en WhatsApp.",
  searchGroupPlaceholder: "Busca un grupo por su nombre…",
  featuredGroupsTitle: "Grupos destacados",
  featuredGroupsSubtitle: "Comunidades activas con miembros reales de todo el mundo.",
  promoTitle: "¿Tienes un grupo de WhatsApp? Publícalo",
  promoSubtitle: "Tu enlace queda protegido: la gente solo se une desde aquí.",
  promoBtn: "Diseñar mi página",
  footerText: "Chatly Verde · hecho para conversar",

  // Menú inferior
  aboutSite: "Sobre el sitio",
  adminPanel: "Panel de administración",
  languages: "Idiomas",
  about: "Acerca de",
  termsAndConditions: "Términos y condiciones",
  pelinkBot: "Pelink — Bot verificador",

  // Modal de grupo
  joinedCount: "personas ya se unieron",
  description: "Descripción",
  noDescription: "Sin descripción",
  seeMore: "ver más",
  seeLess: "ver menos",
  linkBrokenQuestion: "caído",
  reported: "reportado",
  joinGroup: "Unirme al grupo",
  blockedRegion: "Bloqueado en tu región",
  redirectNotice: "Te llevaremos a WhatsApp para completar tu ingreso.",

  // Publicado
  publishedBadge: "Publicado",
  publishedTitle: "Ya está publicada",
  publishedQuestion: "¿Qué quieres hacer ahora?",
  goHome: "Ir a inicio",

  // Acerca de
  aboutHeaderTitle: "Acerca de Chatly",
  aboutHeaderSubtitle:
    "La plataforma rápida, libre y directa para descubrir y hacer crecer comunidades de WhatsApp en todo el mundo.",
  aboutQ1Title: "¿Qué es Chatly y para qué sirve?",
  aboutQ1Body:
    "Chatly es un directorio abierto diseñado para conectar personas a través de grupos y comunidades de WhatsApp. Permite a los usuarios encontrar espacios de conversación por intereses específicos (tecnología, estudio, empleo, gaming, amistades y más) o por país, ingresando directamente con un solo toque sin pasos complicados ni fricción innecesaria.",
  aboutQ2Title: "Publicación instantánea: sin esperas de horas",
  aboutQ2P1:
    "En muchas otras plataformas o directorios convencionales, publicar un grupo requiere esperar horas o días a que alguien lo revise manualmente o cumplir trámites tediosos.",
  aboutQ2P2:
    "En Chatly creemos en la inmediatez: tu grupo se publica de forma 100% inmediata. Tan pronto completas los datos requeridos y presionas publicar, tu grupo queda en vivo en el directorio para que personas de cualquier lugar puedan unirse al instante.",
  aboutQ3Title: "Requisitos sencillos para publicar tu grupo",
  aboutQ3Intro:
    "Para mantener el directorio útil, ordenado y confiable para todos, solo solicitamos los siguientes datos básicos:",
  aboutReqName:
    "Nombre del grupo: Un nombre claro que represente fielmente el tema de tu comunidad (máximo 80 caracteres).",
  aboutReqLink:
    "Enlace de invitación válido: El enlace oficial de invitación de tu grupo de WhatsApp (formato chat.whatsapp.com/...).",
  aboutReqCat:
    "Categoría y País: Seleccionar la temática correcta y el país para que los interesados puedan encontrarte con facilidad.",
  aboutReqDesc:
    "Descripción y reglas: Una breve explicación sobre de qué trata el grupo y qué normas de convivencia aplican.",
  aboutQ4Title: "Seguridad y moderación",
  aboutQ4Body:
    "Cada creador es responsable de moderar y mantener un ambiente respetuoso dentro de su grupo. No se permite la publicación de enlaces maliciosos, contenido que infrinja normas legales o enlaces duplicados. Los enlaces repetidos se detectan automáticamente para proteger la integridad del directorio.",
  aboutQ5Title: "¿Tienes un grupo y quieres publicarlo?",
  aboutQ5Body: "Es totalmente gratuito y solo toma unos segundos.",
  publishMyGroupNow: "Publicar mi grupo ahora",

  // Regiones
  regionSouth: "Sudamérica",
  regionNorth: "Norteamérica",
  regionCaribbean: "Caribe",
  regionEurope: "Europa",
  regionAsia: "Asia",
};

export type Dict = typeof es;

const en: Dict = {
  settings: "Settings",
  profile: "Profile",
  darkMode: "Dark mode",
  lightMode: "Light mode",
  language: "Language",
  chooseLanguage: "Choose your language",
  country: "Country",
  back: "Back",
  home: "Home",
  cancel: "Cancel",
  close: "Close",
  search: "Search",
  clearSearch: "Clear search",
  topics: "Topics",
  countries: "Countries",
  all: "All",
  allCountries: "All countries",
  swipe: "swipe →",
  roomsWord: "rooms",
  resultsCount: "result",
  resultsCountPlural: "results",
  noResults: "No groups found with that search. Try another name, category, or country.",
  create: "Create",
  createTitle: "Create your group",
  createSubtitle: "Publish it once and your community joins from the web or from your groups.",
  stepName: "Group name",
  namePlaceholder: "E.g.: New friendships 2026",
  nameMaxError: "Limit exceeded: maximum 80 characters.",
  stepLink: "Put your WhatsApp link",
  required: "required",
  linkTaken: "That link is already registered in another group. Use a different one.",
  linkValidating: "Checking link…",
  linkReady: "Valid link and ready.",
  stepCategory: "Choose category",
  stepCountry: "Country of origin",
  stepDesc: "Description and rules",
  descPlaceholder: "Tell people what the group is about, topics, or basic guidelines…",
  descMaxError: "Limit exceeded: maximum 150 characters.",
  stepAudience: "Who can join?",
  audienceAll: "All countries can join",
  audienceMine: "Only my country",
  audienceSome: "Specific countries",
  audienceMineHint: "Only people from your country will be able to join.",
  selectedCountries: "selected countries",
  edit: "edit",
  acceptTermsText: "I accept Chatly's terms and conditions and commit to moderating my room.",
  publishBtn: "Publish group",
  publishingTitle: "Publishing group",
  wrongOrigin: "This isn't the chat's origin. Pick the right country.",

  // Hero / Portada
  heroJoinTitle1: "Join WhatsApp",
  heroJoinTitle2: "groups",
  heroSubtitle: "Pick a group, check its description, and join directly on WhatsApp.",
  searchGroupPlaceholder: "Search a group by name…",
  featuredGroupsTitle: "Featured groups",
  featuredGroupsSubtitle: "Active communities with real members from around the world.",
  promoTitle: "Do you have a WhatsApp group? Publish it",
  promoSubtitle: "Your link is protected: people only join directly from here.",
  promoBtn: "Design my page",
  footerText: "Chatly Green · made to connect",

  // Menú inferior
  aboutSite: "About the site",
  adminPanel: "Admin panel",
  languages: "Languages",
  about: "About",
  termsAndConditions: "Terms and conditions",
  pelinkBot: "Pelink — Verification Bot",

  // Modal de grupo
  joinedCount: "people already joined",
  description: "Description",
  noDescription: "No description",
  seeMore: "see more",
  seeLess: "see less",
  linkBrokenQuestion: "broken",
  reported: "reported",
  joinGroup: "Join group",
  blockedRegion: "Blocked in your region",
  redirectNotice: "We'll take you to WhatsApp to complete your entry.",

  // Publicado
  publishedBadge: "Published",
  publishedTitle: "It's now published",
  publishedQuestion: "What would you like to do now?",
  goHome: "Go to home",

  // Acerca de
  aboutHeaderTitle: "About Chatly",
  aboutHeaderSubtitle:
    "The fast, open, and direct platform to discover and grow WhatsApp communities worldwide.",
  aboutQ1Title: "What is Chatly and what is it for?",
  aboutQ1Body:
    "Chatly is an open directory designed to connect people through WhatsApp groups and communities. It lets users find conversation spaces by specific interests (tech, study, jobs, gaming, friendships, and more) or by country, joining directly in one tap without friction or complicated steps.",
  aboutQ2Title: "Instant publishing: no waiting for hours",
  aboutQ2P1:
    "In many other platforms or directories, publishing a group requires waiting hours or days for manual approval or completing tedious forms.",
  aboutQ2P2:
    "At Chatly we believe in immediacy: your group is published 100% immediately. As soon as you fill in the details and tap publish, your group goes live in the directory for people anywhere to join instantly.",
  aboutQ3Title: "Simple requirements to publish your group",
  aboutQ3Intro:
    "To keep the directory helpful, orderly, and trustworthy for everyone, we only require the following basic details:",
  aboutReqName:
    "Group name: A clear name faithfully representing your community theme (max 80 characters).",
  aboutReqLink:
    "Valid invite link: The official invite link of your WhatsApp group (format chat.whatsapp.com/...).",
  aboutReqCat:
    "Category and Country: Select the right topic and country so people can discover you easily.",
  aboutReqDesc:
    "Description and rules: A brief explanation of what the group is about and what guidelines apply.",
  aboutQ4Title: "Security and moderation",
  aboutQ4Body:
    "Every creator is responsible for moderating and maintaining a respectful environment within their group. Malicious links, illegal content, or duplicate links are strictly disallowed. Repeated links are detected automatically to preserve directory integrity.",
  aboutQ5Title: "Have a group and want to publish it?",
  aboutQ5Body: "It is completely free and only takes a few seconds.",
  publishMyGroupNow: "Publish my group now",

  // Regiones
  regionSouth: "South America",
  regionNorth: "North America",
  regionCaribbean: "Caribbean",
  regionEurope: "Europe",
  regionAsia: "Asia",
};

const pt: Dict = {
  settings: "Configurações",
  profile: "Perfil",
  darkMode: "Modo escuro",
  lightMode: "Modo claro",
  language: "Idioma",
  chooseLanguage: "Escolha seu idioma",
  country: "País",
  back: "Voltar",
  home: "Início",
  cancel: "Cancelar",
  close: "Fechar",
  search: "Buscar",
  clearSearch: "Limpar busca",
  topics: "Temas",
  countries: "Países",
  all: "Todos",
  allCountries: "Todos os países",
  swipe: "deslize →",
  roomsWord: "salas",
  resultsCount: "resultado",
  resultsCountPlural: "resultados",
  noResults: "Nenhum grupo encontrado com essa busca. Tente outro nome, categoria ou país.",
  create: "Criar",
  createTitle: "Criar seu grupo",
  createSubtitle: "Publique uma vez e sua comunidade entra pela web ou pelos seus grupos.",
  stepName: "Nome do grupo",
  namePlaceholder: "Ex: Novas amizades 2026",
  nameMaxError: "Passou do limite: máximo 80 caracteres.",
  stepLink: "Coloque seu link do WhatsApp",
  required: "obrigatório",
  linkTaken: "Esse link já está registrado em outro grupo. Use outro link.",
  linkValidating: "Verificando link…",
  linkReady: "Link válido e pronto.",
  stepCategory: "Escolha a categoria",
  stepCountry: "País de origem",
  stepDesc: "Descrição e regras",
  descPlaceholder: "Conte às pessoas sobre o que é o grupo, tópicos ou regras básicas…",
  descMaxError: "Passou do limite: máximo 150 caracteres.",
  stepAudience: "Quem pode entrar?",
  audienceAll: "Todos os países podem entrar",
  audienceMine: "Apenas meu país",
  audienceSome: "Países específicos",
  audienceMineHint: "Apenas pessoas do seu país poderão entrar.",
  selectedCountries: "países selecionados",
  edit: "editar",
  acceptTermsText: "Aceito os termos e condições do Chatly e me comprometo a moderar minha sala.",
  publishBtn: "Publicar grupo",
  publishingTitle: "Publicando grupo",
  wrongOrigin: "Esta não é a origem do chat. Coloque o país correto.",

  // Hero / Portada
  heroJoinTitle1: "Participe dos grupos",
  heroJoinTitle2: "do WhatsApp",
  heroSubtitle: "Escolha um grupo, veja a descrição e entre diretamente no WhatsApp.",
  searchGroupPlaceholder: "Busque um grupo pelo nome…",
  featuredGroupsTitle: "Grupos em destaque",
  featuredGroupsSubtitle: "Comunidades ativas com membros reais de todo o mundo.",
  promoTitle: "Tem um grupo do WhatsApp? Publique",
  promoSubtitle: "Seu link fica protegido: as pessoas só entram diretamente por aqui.",
  promoBtn: "Criar minha página",
  footerText: "Chatly Verde · feito para conversar",

  // Menú inferior
  aboutSite: "Sobre o site",
  adminPanel: "Painel de administração",
  languages: "Idiomas",
  about: "Sobre",
  termsAndConditions: "Termos e condições",
  pelinkBot: "Pelink — Bot verificador",

  // Modal de grupo
  joinedCount: "pessoas já entraram",
  description: "Descrição",
  noDescription: "Sem descrição",
  seeMore: "ver mais",
  seeLess: "ver menos",
  linkBrokenQuestion: "quebrado",
  reported: "reportado",
  joinGroup: "Entrar no grupo",
  blockedRegion: "Bloqueado na sua região",
  redirectNotice: "Vamos te levar ao WhatsApp para concluir sua entrada.",

  // Publicado
  publishedBadge: "Publicado",
  publishedTitle: "Já está publicado",
  publishedQuestion: "O que você gostaria de fazer agora?",
  goHome: "Ir ao início",

  // Acerca de
  aboutHeaderTitle: "Sobre o Chatly",
  aboutHeaderSubtitle:
    "A plataforma rápida, livre e direta para descobrir e fazer crescer comunidades do WhatsApp no mundo todo.",
  aboutQ1Title: "O que é o Chatly e para que serve?",
  aboutQ1Body:
    "O Chatly é um diretório aberto projetado para conectar pessoas por meio de grupos e comunidades do WhatsApp. Permite aos usuários encontrar espaços de conversa por interesses específicos (tecnologia, estudos, empregos, jogos, amizades e mais) ou por país, entrando diretamente com um único toque sem burocracia ou etapas complicadas.",
  aboutQ2Title: "Publicação instantânea: sem horas de espera",
  aboutQ2P1:
    "Em muitas outras plataformas ou diretórios convencionais, publicar um grupo exige esperar horas ou dias por análises manuais ou etapas demoradas.",
  aboutQ2P2:
    "No Chatly acreditamos no imediatismo: seu grupo é publicado de forma 100% imediata. Assim que você preenche os dados necessários e toca em publicar, seu grupo fica no ar no diretório para pessoas de qualquer lugar entrarem instantaneamente.",
  aboutQ3Title: "Requisitos simples para publicar seu grupo",
  aboutQ3Intro:
    "Para manter o diretório útil, organizado e confiável para todos, solicitamos apenas os seguintes dados básicos:",
  aboutReqName:
    "Nome do grupo: Um nome claro que represente fielmente o tema da sua comunidade (máximo de 80 caracteres).",
  aboutReqLink:
    "Link de convite válido: O link oficial de convite do seu grupo do WhatsApp (formato chat.whatsapp.com/...).",
  aboutReqCat:
    "Categoria e País: Selecionar o tema correto e o país para que os interessados possam encontrá-lo com facilidade.",
  aboutReqDesc:
    "Descrição e regras: Uma breve explicação sobre o grupo e quais regras de convivência se aplicam.",
  aboutQ4Title: "Segurança e moderação",
  aboutQ4Body:
    "Cada criador é responsável por moderar e manter um ambiente respeitoso dentro do seu grupo. Não é permitida a publicação de links maliciosos, conteúdos que infrinjam leis ou links duplicados. Links repetidos são detectados automaticamente para proteger a integridade do diretório.",
  aboutQ5Title: "Tem um grupo e quer publicar?",
  aboutQ5Body: "É totalmente gratuito e leva apenas alguns segundos.",
  publishMyGroupNow: "Publicar meu grupo agora",

  // Regiones
  regionSouth: "América do Sul",
  regionNorth: "América do Norte",
  regionCaribbean: "Caribe",
  regionEurope: "Europa",
  regionAsia: "Ásia",
};

const dicts: Record<string, Dict> = {
  es,
  en,
  pt,
};

/** Código ISO de cada país de la app (para traducir su nombre). */
export const COUNTRY_CODES: Record<string, string> = {
  Argentina: "AR",
  Brasil: "BR",
  Chile: "CL",
  Colombia: "CO",
  Perú: "PE",
  Venezuela: "VE",
  Ecuador: "EC",
  Uruguay: "UY",
  México: "MX",
  "Estados Unidos": "US",
  Canadá: "CA",
  Guatemala: "GT",
  "Costa Rica": "CR",
  Panamá: "PA",
  Honduras: "HN",
  "El Salvador": "SV",
  "R. Dominicana": "DO",
  Cuba: "CU",
  "Puerto Rico": "PR",
  Jamaica: "JM",
  Bahamas: "BS",
  "Trinidad y T.": "TT",
  Barbados: "BB",
  Haití: "HT",
  España: "ES",
  Portugal: "PT",
  Francia: "FR",
  Italia: "IT",
  Alemania: "DE",
  "Reino Unido": "GB",
  "Países Bajos": "NL",
  Polonia: "PL",
  Japón: "JP",
  "Corea del Sur": "KR",
  China: "CN",
  India: "IN",
  Indonesia: "ID",
  Tailandia: "TH",
  Filipinas: "PH",
  Turquía: "TR",
};

/** Nombre del país en el idioma activo (usa Intl, sin tablas gigantes). */
export function countryName(lang: string, label: string): string {
  const code = COUNTRY_CODES[label];
  if (!code) return label;
  try {
    const dn = new Intl.DisplayNames([lang], { type: "region" });
    return dn.of(code) ?? label;
  } catch {
    return label;
  }
}

const REGION_KEYS: Record<string, keyof Dict> = {
  Sudamérica: "regionSouth",
  Norteamérica: "regionNorth",
  Caribe: "regionCaribbean",
  Europa: "regionEurope",
  Asia: "regionAsia",
};

export function translate(lang: string, key: keyof Dict): string {
  return dicts[lang]?.[key] ?? es[key];
}

/** Hook de traducción: t("profile") */
export function useT() {
  const lang = useLang();
  return useCallback((key: keyof Dict) => translate(lang, key), [lang]);
}

/** Hook completo: textos, países, categorías y regiones en el idioma activo. */
export function useI18n() {
  const lang = useLang();
  return {
    lang,
    t: useCallback((key: keyof Dict) => translate(lang, key), [lang]),
    tCountry: useCallback((label: string) => countryName(lang, label), [lang]),
    tCategory: useCallback((label: string) => categoryName(lang, label), [lang]),
    tRegion: useCallback(
      (label: string) => (REGION_KEYS[label] ? translate(lang, REGION_KEYS[label]) : label),
      [lang],
    ),
  };
}
