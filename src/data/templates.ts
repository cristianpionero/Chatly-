export interface TemplateData {
  id: string;
  name: string;
  colorTheme: "green" | "blue" | "purple" | "emerald";
  backgroundImageUrl?: string;
  backgroundStyle?: {
    gradient?: string;
    bgColor?: string;
  };
  texts: Array<{
    type: "title" | "subtitle" | "text";
    text: string;
    fontSize: number;
    color: string;
  }>;
  links: Array<{
    url: string;
    title: string;
    colorStyle: "green" | "blue";
  }>;
}

export const TEMPLATES_LIST: TemplateData[] = [
  {
    id: "gamer_pro",
    name: "Comunidad Gamer & Twitch",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #090d16 0%, #15102a 50%, #090d16 100%)",
    },
    texts: [
      {
        type: "title",
        text: "⚡ ELITE GAMING CLAN",
        fontSize: 28,
        color: "#38BDF8",
      },
      {
        type: "subtitle",
        text: "Torneos semanales, scrims competitivos y directos diarios",
        fontSize: 16,
        color: "#E2E8F0",
      },
      {
        type: "text",
        text: "¡Únete a nuestra comunidad oficial! Accede a salas personalizadas, premios y sorteos de pases de batalla.",
        fontSize: 14,
        color: "#94A3B8",
      },
    ],
    links: [
      {
        title: "🎮 Grupo de WhatsApp: Torneos & Scrims",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "👉 Servidor de Discord de la Comunidad",
        url: "https://discord.gg",
        colorStyle: "blue",
      },
      {
        title: "🔴 Canal de Twitch en Vivo",
        url: "https://twitch.tv",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "creador_vip",
    name: "Creador de Contenido & VIP",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #18181b 0%, #2e1065 100%)",
    },
    texts: [
      {
        type: "title",
        text: "✨ SOFÍA MARTÍNEZ · VIP",
        fontSize: 28,
        color: "#F472B6",
      },
      {
        type: "subtitle",
        text: "Bienvenido a mi espacio exclusivo y comunidad privada",
        fontSize: 16,
        color: "#F3F4F6",
      },
      {
        type: "text",
        text: "Aquí tienes acceso a contenido inédito, charlas directas conmigo y avisos antes que en mis redes públicas.",
        fontSize: 14,
        color: "#D1D5DB",
      },
    ],
    links: [
      {
        title: "💎 Grupo Exclusivo de WhatsApp VIP",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📸 Mi Perfil Oficial de Instagram",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
      {
        title: "💌 Suscripción Mensual / Contenido Especial",
        url: "https://patreon.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "tienda_moda",
    name: "Tienda de Moda & Ropa Urbana",
    colorTheme: "green",
    backgroundStyle: {
      bgColor: "#FFFFFF",
    },
    texts: [
      {
        type: "title",
        text: "🛍️ TIENDA STREETWEAR & MODA",
        fontSize: 28,
        color: "#0F172A",
      },
      {
        type: "subtitle",
        text: "Colección 2026 · Envíos rápidos a todo el país",
        fontSize: 16,
        color: "#059669",
      },
      {
        type: "text",
        text: "Horario de atención directa: Lunes a Sábado de 9 AM a 8 PM. Toca abajo para pedir asesoría o ver productos.",
        fontSize: 14,
        color: "#475569",
      },
    ],
    links: [
      {
        title: "💬 Chatear con Asesor de Ventas (WhatsApp)",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "📦 Ver Catálogo Completo de Productos",
        url: "https://catalogo.com",
        colorStyle: "blue",
      },
      {
        title: "🔥 Grupo de WhatsApp: Ofertas & Lanzamientos",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
    ],
  },
  {
    id: "fitness_coach",
    name: "Fitness, Gym & Nutrición",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #0c0a09 0%, #1c1917 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🔥 COACH FITNESS · TEAM FIT",
        fontSize: 28,
        color: "#FBBF24",
      },
      {
        type: "subtitle",
        text: "Transforma tu estilo de vida y alcanza tus metas",
        fontSize: 16,
        color: "#FFFFFF",
      },
      {
        type: "text",
        text: "Entrenamientos estructurados para casa o gimnasio y seguimiento de hábitos 100% garantizado.",
        fontSize: 14,
        color: "#A8A29E",
      },
    ],
    links: [
      {
        title: "💪 Unirme al Reto Gratuito de 7 Días (WhatsApp)",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📲 Agendar Asesoría Personalizada 1 a 1",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "🥗 Descargar Plan Nutricional en PDF",
        url: "https://drive.google.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "restaurante_menu",
    name: "Restaurante & Delivery",
    colorTheme: "green",
    backgroundStyle: {
      bgColor: "#FFFBEB",
    },
    texts: [
      {
        type: "title",
        text: "🍕 RESTAURANTE & PIZZERÍA ARTESANAL",
        fontSize: 26,
        color: "#7C2D12",
      },
      {
        type: "subtitle",
        text: "Sabor auténtico con ingredientes frescos todos los días",
        fontSize: 16,
        color: "#C2410C",
      },
      {
        type: "text",
        text: "Pide a domicilio o reserva tu mesa. Envíos gratis en pedidos superiores a $20.",
        fontSize: 14,
        color: "#78350F",
      },
    ],
    links: [
      {
        title: "🛵 Hacer Pedido por WhatsApp (Delivery Inmediato)",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "📖 Ver Menú Digital con Fotos y Precios",
        url: "https://menu.digital",
        colorStyle: "blue",
      },
      {
        title: "📍 Ver Ubicación en Google Maps",
        url: "https://maps.google.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "dj_musica",
    name: "DJ, Música & Fiestas",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #1e1035 0%, #080314 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🎧 DJ SOUNDWAVE · LIVE",
        fontSize: 28,
        color: "#A78BFA",
      },
      {
        type: "subtitle",
        text: "Tech House, Afro House & Urban Beats",
        fontSize: 16,
        color: "#EDE9FE",
      },
      {
        type: "text",
        text: "Escucha mis últimas sesiones en vivo o únete al grupo VIP para conseguir entradas con descuento.",
        fontSize: 14,
        color: "#C4B5FD",
      },
    ],
    links: [
      {
        title: "🎟️ Lista de Invitados VIP & Descuentos (WhatsApp)",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🎵 Escuchar Sesiones en Spotify / SoundCloud",
        url: "https://spotify.com",
        colorStyle: "blue",
      },
      {
        title: "📅 Próximas Fechas de Conciertos y Eventos",
        url: "https://tourdates.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "estudios_universidad",
    name: "Estudiantes & Universidad",
    colorTheme: "green",
    backgroundStyle: {
      bgColor: "#F8FAFC",
    },
    texts: [
      {
        type: "title",
        text: "📚 GRUPO DE ESTUDIO ACADÉMICO",
        fontSize: 26,
        color: "#1E3A8A",
      },
      {
        type: "subtitle",
        text: "Material de apoyo, exámenes resueltos y tutorías",
        fontSize: 16,
        color: "#2563EB",
      },
      {
        type: "text",
        text: "Espacio colaborativo para compartir resúmenes, libros digitales y coordinar sesiones de estudio por Zoom.",
        fontSize: 14,
        color: "#475569",
      },
    ],
    links: [
      {
        title: "💬 Grupo de WhatsApp de Consultas y Tareas",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📖 Carpeta Compartida de Libros y Apuntes (Drive)",
        url: "https://drive.google.com",
        colorStyle: "blue",
      },
      {
        title: "🎥 Sala de Clases y Repasos en Vivo (Zoom)",
        url: "https://zoom.us",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "museo_cultura",
    name: "Museo & Galería de Arte",
    colorTheme: "green",
    backgroundStyle: {
      bgColor: "#FAFAF9",
    },
    texts: [
      {
        type: "title",
        text: "🏛️ MUSEO DE ARTE & CULTURA",
        fontSize: 26,
        color: "#1C1917",
      },
      {
        type: "subtitle",
        text: "Exposición Temporal: Luces y Horizontes 2026",
        fontSize: 16,
        color: "#57534E",
      },
      {
        type: "text",
        text: "Descubre obras contemporáneas, accede a audioguías gratuitas y reserva recorridos presenciales con curadores.",
        fontSize: 14,
        color: "#78716C",
      },
    ],
    links: [
      {
        title: "🎟️ Reservar Visita Guiada por WhatsApp",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🖼️ Ver Galería de Obras en Alta Resolución",
        url: "https://museo.org/obras",
        colorStyle: "blue",
      },
      {
        title: "🎧 Audioguía Oficial en Audio / Podcast",
        url: "https://museo.org/audio",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "trading_cripto",
    name: "Cripto, Forex & Trading",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)",
    },
    texts: [
      {
        type: "title",
        text: "📈 CRYPTO ALERTS · CLUB",
        fontSize: 28,
        color: "#34D399",
      },
      {
        type: "subtitle",
        text: "Análisis técnico diario de Bitcoin, Ethereum y Forex",
        fontSize: 16,
        color: "#ECFDF5",
      },
      {
        type: "text",
        text: "Reportes matutinos, gestión de riesgo profesional y debates en tiempo real entre operadores financieros.",
        fontSize: 14,
        color: "#A7F3D0",
      },
    ],
    links: [
      {
        title: "🟢 Canal de WhatsApp: Noticias y Alertas Flash",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📊 Gráficos y Análisis en TradingView",
        url: "https://tradingview.com",
        colorStyle: "blue",
      },
      {
        title: "💬 Comunidad de Discusión en Telegram",
        url: "https://t.me",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "fotografia_bodas",
    name: "Fotografía Profesional & Bodas",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    },
    texts: [
      {
        type: "title",
        text: "📷 ESTUDIO FOTOGRÁFICO",
        fontSize: 28,
        color: "#FFFFFF",
      },
      {
        type: "subtitle",
        text: "Inmortalizando tus momentos más especiales",
        fontSize: 16,
        color: "#94A3B8",
      },
      {
        type: "text",
        text: "Especialistas en bodas, sesiones de compromiso, retratos de estudio y cobertura de eventos exclusivos.",
        fontSize: 14,
        color: "#CBD5E1",
      },
    ],
    links: [
      {
        title: "💬 Cotizar Fecha o Paquete por WhatsApp",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "🌟 Ver Portafolio Completo y Galerías",
        url: "https://portfolio.com",
        colorStyle: "blue",
      },
      {
        title: "📸 Síguenos en Instagram (@fotografia)",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "podcast_show",
    name: "Podcast & Programa en Vivo",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🎙️ CHARLAS SIN FILTRO · PODCAST",
        fontSize: 27,
        color: "#F59E0B",
      },
      {
        type: "subtitle",
        text: "Nuevos episodios todos los martes y jueves",
        fontSize: 16,
        color: "#F5F5F4",
      },
      {
        type: "text",
        text: "Historias reales, entrevistas a referentes y charlas entretenidas sobre tecnología, finanzas y estilo de vida.",
        fontSize: 14,
        color: "#D6D3D1",
      },
    ],
    links: [
      {
        title: "💬 Grupo de WhatsApp para Proponer Temas",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🎧 Escuchar en Spotify",
        url: "https://spotify.com",
        colorStyle: "green",
      },
      {
        title: "📺 Ver Episodios en Video por YouTube",
        url: "https://youtube.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "soporte_atencion",
    name: "Soporte & Centro de Ayuda",
    colorTheme: "blue",
    backgroundStyle: {
      bgColor: "#FFFFFF",
    },
    texts: [
      {
        type: "title",
        text: "🛠️ CENTRO DE SOPORTE & AYUDA",
        fontSize: 27,
        color: "#1E293B",
      },
      {
        type: "subtitle",
        text: "¿En qué podemos colaborarte el día de hoy?",
        fontSize: 16,
        color: "#2563EB",
      },
      {
        type: "text",
        text: "Nuestro equipo responde en minutos para ayudarte con pedidos, garantías o dudas técnicas.",
        fontSize: 14,
        color: "#475569",
      },
    ],
    links: [
      {
        title: "💬 Iniciar Chat de Soporte Técnico (WhatsApp)",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "❓ Preguntas Frecuentes y Manuales de Uso",
        url: "https://ayuda.com/faq",
        colorStyle: "blue",
      },
      {
        title: "📮 Generar Ticket de Reclamo o Garantía",
        url: "https://ayuda.com/ticket",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "ofertas_cupones",
    name: "Ofertas, Cupones & Rebajas",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #450a0a 0%, #1c1917 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🔥 CHOLLOS & CUPONES VIP",
        fontSize: 28,
        color: "#F87171",
      },
      {
        type: "subtitle",
        text: "Descuentos de hasta el 70% todos los días",
        fontSize: 16,
        color: "#FEF2F2",
      },
      {
        type: "text",
        text: "Recibe avisos antes de que se agote el stock de promociones en tecnología, ropa y compras en línea.",
        fontSize: 14,
        color: "#FECACA",
      },
    ],
    links: [
      {
        title: "⚡ Grupo de WhatsApp: Ofertas Relámpago",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🏷️ Ver Lista de Cupones Activos de la Semana",
        url: "https://cupones.com",
        colorStyle: "blue",
      },
      {
        title: "📢 Canal de Avisos Flash en Telegram",
        url: "https://t.me",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "emprendedores_red",
    name: "Networking & Emprendedores",
    colorTheme: "green",
    backgroundStyle: {
      bgColor: "#FFFFFF",
    },
    texts: [
      {
        type: "title",
        text: "🚀 CLUB DE EMPRENDEDORES",
        fontSize: 27,
        color: "#065F46",
      },
      {
        type: "subtitle",
        text: "Conectando fundadores, mentores y marcas",
        fontSize: 16,
        color: "#059669",
      },
      {
        type: "text",
        text: "Comparte experiencias, asiste a masterclasses virtuales y encuentra socios para escalar tu negocio.",
        fontSize: 14,
        color: "#334155",
      },
    ],
    links: [
      {
        title: "🤝 Unirme a la Comunidad Oficial de WhatsApp",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🎟️ Registro a la Próxima Masterclass Gratuita",
        url: "https://masterclass.com",
        colorStyle: "blue",
      },
      {
        title: "💼 Directorio de Miembros y Proyectos",
        url: "https://directorio.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "viajes_expedicion",
    name: "Viajes, Tours & Turismo",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #082f49 0%, #0369a1 50%, #082f49 100%)",
    },
    texts: [
      {
        type: "title",
        text: "✈️ VIAJEROS & EXPEDICIONES",
        fontSize: 28,
        color: "#38BDF8",
      },
      {
        type: "subtitle",
        text: "Descubriendo los destinos más increíbles del mundo",
        fontSize: 16,
        color: "#F0F9FF",
      },
      {
        type: "text",
        text: "Únete a nuestras próximas salidas grupales, descarga itinerarios recomendados y tips de mochileros.",
        fontSize: 14,
        color: "#BAE6FD",
      },
    ],
    links: [
      {
        title: "🌴 Próximo Viaje Grupal: Cupos por WhatsApp",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🗺️ Descargar Guía de Viaje en PDF",
        url: "https://guias.com",
        colorStyle: "blue",
      },
      {
        title: "📸 Ver Fotos de Expediciones en Instagram",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "fan_club_oficial",
    name: "Fan Club & Comunidad",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%)",
    },
    texts: [
      {
        type: "title",
        text: "⭐ FAN CLUB OFICIAL",
        fontSize: 28,
        color: "#C084FC",
      },
      {
        type: "subtitle",
        text: "El punto de encuentro para los verdaderos fans",
        fontSize: 16,
        color: "#FAF5FF",
      },
      {
        type: "text",
        text: "Enterate antes de firmas de autógrafos, convivencias privadas, lanzamientos y dinámicas mensuales.",
        fontSize: 14,
        color: "#E9D5FF",
      },
    ],
    links: [
      {
        title: "💜 Grupo Oficial de WhatsApp para Fans",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🎁 Participar en el Sorteo Exclusivo de este Mes",
        url: "https://sorteo.com",
        colorStyle: "blue",
      },
      {
        title: "👕 Tienda de Merchandising y Ropa Oficial",
        url: "https://tiendafan.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "inmobiliaria_bienes",
    name: "Bienes Raíces & Inmobiliaria",
    colorTheme: "green",
    backgroundStyle: {
      bgColor: "#FFFFFF",
    },
    texts: [
      {
        type: "title",
        text: "🏡 INMOBILIARIA & PROPIEDADES",
        fontSize: 27,
        color: "#134E4A",
      },
      {
        type: "subtitle",
        text: "Encuentra el hogar o inversión ideal para ti",
        fontSize: 16,
        color: "#0D9488",
      },
      {
        type: "text",
        text: "Propiedades exclusivas en las mejores zonas. Agenda una visita presencial o solicita asesoría crediticia.",
        fontSize: 14,
        color: "#334155",
      },
    ],
    links: [
      {
        title: "💬 Agendar Recorrido por WhatsApp",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "📋 Ver Catálogo de Casas y Departamentos",
        url: "https://inmobiliaria.com",
        colorStyle: "blue",
      },
      {
        title: "🏠 Grupo de WhatsApp: Oportunidades de Inversión",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
    ],
  },
  {
    id: "barberia_salon",
    name: "Barbería & Salón Masculino",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
    },
    texts: [
      {
        type: "title",
        text: "✂️ THE BARBER CLUB & SPA",
        fontSize: 28,
        color: "#FBBF24",
      },
      {
        type: "subtitle",
        text: "Estilo, elegancia y cuidado personal",
        fontSize: 16,
        color: "#F4F4F5",
      },
      {
        type: "text",
        text: "Cortes clásicos, degradados, perfilado de barba y tratamientos faciales. Reserva tu turno sin esperas.",
        fontSize: 14,
        color: "#A1A1AA",
      },
    ],
    links: [
      {
        title: "💈 Reservar Turno Inmediato (WhatsApp)",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "📸 Ver Fotos de Cortes y Estilos en Instagram",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
      {
        title: "📍 Ver Ubicación en Google Maps",
        url: "https://maps.google.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "tatuajes_estudio",
    name: "Tatuajes & Estudio de Arte",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
    },
    texts: [
      {
        type: "title",
        text: "⚡ BLACK INK TATTOO STUDIO",
        fontSize: 27,
        color: "#FB7185",
      },
      {
        type: "subtitle",
        text: "Arte en la piel con la máxima higiene y detalle",
        fontSize: 16,
        color: "#F4F4F5",
      },
      {
        type: "text",
        text: "Especialistas en realismo, micro-realismo, fineline y blackwork. Envíanos tu idea para cotizarla.",
        fontSize: 14,
        color: "#A1A1AA",
      },
    ],
    links: [
      {
        title: "💬 Cotizar Tatuaje por WhatsApp",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "🎨 Ver Galería de Trabajos y Flashes Disponibles",
        url: "https://tattoostudio.com",
        colorStyle: "blue",
      },
      {
        title: "📸 Portafolio de Artistas en Instagram",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "psicologia_terapia",
    name: "Psicología & Bienestar Emocional",
    colorTheme: "green",
    backgroundStyle: {
      bgColor: "#F0FDF4",
    },
    texts: [
      {
        type: "title",
        text: "🌱 ESPACIO DE PSICOLOGÍA & BIENESTAR",
        fontSize: 26,
        color: "#166534",
      },
      {
        type: "subtitle",
        text: "Acompañamiento psicológico seguro y confidencial",
        fontSize: 16,
        color: "#15803D",
      },
      {
        type: "text",
        text: "Terapia para adultos y adolescentes (presencial y online). Herramientas prácticas para gestionar el estrés y la ansiedad.",
        fontSize: 14,
        color: "#334155",
      },
    ],
    links: [
      {
        title: "💬 Agendar Sesión de Terapia por WhatsApp",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "📖 Descargar Guía Gratuita de Manejo de Ansiedad",
        url: "https://drive.google.com",
        colorStyle: "blue",
      },
      {
        title: "🎙️ Escuchar Podcast de Salud Mental",
        url: "https://spotify.com",
        colorStyle: "green",
      },
    ],
  },
  {
    id: "programacion_devs",
    name: "Programación & Desarrolladores",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
    },
    texts: [
      {
        type: "title",
        text: "💻 DEV COMMUNITY · CODE CLUB",
        fontSize: 27,
        color: "#38BDF8",
      },
      {
        type: "subtitle",
        text: "React, Node.js, Python, Inteligencia Artificial y más",
        fontSize: 16,
        color: "#F1F5F9",
      },
      {
        type: "text",
        text: "Comunidad abierta para resolver dudas de programación, compartir repositorios open source y proyectos colaborativos.",
        fontSize: 14,
        color: "#94A3B8",
      },
    ],
    links: [
      {
        title: "💬 Grupo de WhatsApp para Consultas de Código",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🐙 Perfil de GitHub con Proyectos Open Source",
        url: "https://github.com",
        colorStyle: "blue",
      },
      {
        title: "👾 Servidor de Discord de la Comunidad Tech",
        url: "https://discord.gg",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "veterinaria_mascotas",
    name: "Clínica Veterinaria & Mascotas",
    colorTheme: "green",
    backgroundStyle: {
      bgColor: "#FFFFFF",
    },
    texts: [
      {
        type: "title",
        text: "🐾 CLÍNICA VETERINARIA & PET SHOP",
        fontSize: 26,
        color: "#14532D",
      },
      {
        type: "subtitle",
        text: "El mejor cuidado y cariño para tus mascotas",
        fontSize: 16,
        color: "#16A34A",
      },
      {
        type: "text",
        text: "Consultas médicas, vacunación, estética canina y alimentos balanceados. Atención de urgencias 24 horas.",
        fontSize: 14,
        color: "#475569",
      },
    ],
    links: [
      {
        title: "🚨 Urgencias y Consultas por WhatsApp",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "🐶 Ver Catálogo de Productos y Accesorios",
        url: "https://petshop.com",
        colorStyle: "blue",
      },
      {
        title: "📍 Ubicación y Horarios de Atención",
        url: "https://maps.google.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "eventos_bodas",
    name: "Organización de Eventos & Bodas",
    colorTheme: "green",
    backgroundStyle: {
      bgColor: "#FFF1F2",
    },
    texts: [
      {
        type: "title",
        text: "💍 WEDDING & EVENT PLANNER",
        fontSize: 27,
        color: "#881337",
      },
      {
        type: "subtitle",
        text: "Diseñamos y coordinamos la boda de tus sueños",
        fontSize: 16,
        color: "#BE185D",
      },
      {
        type: "text",
        text: "Decoración integral, sonido, catering y logística completa para que tú solo disfrutes de tu gran día.",
        fontSize: 14,
        color: "#4C0519",
      },
    ],
    links: [
      {
        title: "💬 Solicitar Cotización de Evento (WhatsApp)",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "📸 Ver Fotos de Bodas Anteriores en Instagram",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
      {
        title: "📋 Descargar Guía de Planificación de Bodas",
        url: "https://guiabodas.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "idiomas_ingles",
    name: "Clases de Idiomas & Inglés",
    colorTheme: "blue",
    backgroundStyle: {
      bgColor: "#FFFFFF",
    },
    texts: [
      {
        type: "title",
        text: "🇬🇧 ENGLISH CONVERSATION CLUB",
        fontSize: 27,
        color: "#1E3A8A",
      },
      {
        type: "subtitle",
        text: "Aprende a hablar inglés con fluidez y confianza",
        fontSize: 16,
        color: "#2563EB",
      },
      {
        type: "text",
        text: "Clases dinámicas 100% conversacionales, preparación para exámenes TOEFL/IELTS y materiales gratuitos.",
        fontSize: 14,
        color: "#334155",
      },
    ],
    links: [
      {
        title: "💬 Grupo de WhatsApp para Práctica de Speaking",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📝 Test de Nivel de Inglés Gratuito",
        url: "https://testidiomas.com",
        colorStyle: "blue",
      },
      {
        title: "🎥 Enlace a la Clase de Prueba Gratis (Zoom)",
        url: "https://zoom.us",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "reposteria_pasteles",
    name: "Repostería & Pastelería Fina",
    colorTheme: "green",
    backgroundStyle: {
      bgColor: "#FDF2F8",
    },
    texts: [
      {
        type: "title",
        text: "🎂 PASTELERÍA ARTESANAL DULCE DULZURA",
        fontSize: 26,
        color: "#831843",
      },
      {
        type: "subtitle",
        text: "Pasteles personalizados para cada celebración",
        fontSize: 16,
        color: "#DB2777",
      },
      {
        type: "text",
        text: "Tortas temáticas, cupcakes, alfajores y mesas dulces. Pedidos con 48 horas de anticipación.",
        fontSize: 14,
        color: "#500724",
      },
    ],
    links: [
      {
        title: "💬 Cotizar y Encargar Pastel por WhatsApp",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "📸 Ver Galería de Diseños de Pasteles",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
      {
        title: "🧁 Lista de Sabores y Rellenos Disponibles",
        url: "https://pasteleria.com/sabores",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "abogados_asesoria",
    name: "Abogados & Asesoría Legal",
    colorTheme: "blue",
    backgroundStyle: {
      bgColor: "#F8FAFC",
    },
    texts: [
      {
        type: "title",
        text: "⚖️ BUFETE JURÍDICO & ASOCIADOS",
        fontSize: 27,
        color: "#0F172A",
      },
      {
        type: "subtitle",
        text: "Defensa y asesoría legal profesional y confiable",
        fontSize: 16,
        color: "#334155",
      },
      {
        type: "text",
        text: "Especialistas en derecho civil, laboral, mercantil y contratos comerciales. Consulta inicial confidencial.",
        fontSize: 14,
        color: "#475569",
      },
    ],
    links: [
      {
        title: "💬 Solicitar Asesoría Legal Inicial (WhatsApp)",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "📋 Ver Áreas de Práctica y Servicios Legales",
        url: "https://bufeteabogados.com",
        colorStyle: "blue",
      },
      {
        title: "📍 Dirección de Nuestras Oficinas y Citas",
        url: "https://maps.google.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "arquitectura_diseno",
    name: "Arquitectura & Diseño Interior",
    colorTheme: "green",
    backgroundStyle: {
      bgColor: "#FAFAF9",
    },
    texts: [
      {
        type: "title",
        text: "📐 ESTUDIO DE ARQUITECTURA & DISEÑO",
        fontSize: 26,
        color: "#1C1917",
      },
      {
        type: "subtitle",
        text: "Transformando espacios en experiencias habitables",
        fontSize: 16,
        color: "#78716C",
      },
      {
        type: "text",
        text: "Proyectos residenciales, comerciales, interiorismo y modelado 3D fotorrealista de alta calidad.",
        fontSize: 14,
        color: "#44403C",
      },
    ],
    links: [
      {
        title: "💬 Consultar Proyecto o Remodelación (WhatsApp)",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "🏗️ Ver Portafolio de Obras y Renders 3D",
        url: "https://arquitectura.com",
        colorStyle: "blue",
      },
      {
        title: "📸 Síguenos en Instagram para Ver Procesos",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "amistad_social",
    name: "Grupo de Amistad & Social",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🌍 COMUNIDAD INTERNACIONAL · AMIGOS",
        fontSize: 27,
        color: "#34D399",
      },
      {
        type: "subtitle",
        text: "Gente buena onda para charlar y compartir hobbies",
        fontSize: 16,
        color: "#ECFDF5",
      },
      {
        type: "text",
        text: "Grupo libre de spam para hacer amistades, hablar de música, juegos, películas y salidas en grupo.",
        fontSize: 14,
        color: "#A7F3D0",
      },
    ],
    links: [
      {
        title: "💚 Unirme al Grupo Principal de WhatsApp",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📜 Leer Normas de Convivencia y Respeto",
        url: "https://normas.com",
        colorStyle: "blue",
      },
      {
        title: "💬 Grupo Secundario de Películas y Series",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
    ],
  },
  {
    id: "marketing_digital",
    name: "Marketing Digital & Crecimiento",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #1e1b4b 0%, #31104b 100%)",
    },
    texts: [
      {
        type: "title",
        text: "📈 AGENCIA DE MARKETING & CRECIMIENTO",
        fontSize: 27,
        color: "#C084FC",
      },
      {
        type: "subtitle",
        text: "Escala tus ventas con tráfico pago y contenido viral",
        fontSize: 16,
        color: "#F3E8FF",
      },
      {
        type: "text",
        text: "Campañas en Meta Ads, Google Ads, automatización de WhatsApp y embudos de alta conversión.",
        fontSize: 14,
        color: "#D8B4FE",
      },
    ],
    links: [
      {
        title: "💬 Agendar Auditoría Gratuita de Marketing (WhatsApp)",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "📊 Casos de Éxito y Testimonios de Clientes",
        url: "https://casosdeexito.com",
        colorStyle: "blue",
      },
      {
        title: "🚀 Comunidad Gratuita de Emprendedores y Marketers",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
    ],
  },
  {
    id: "club_autos",
    name: "Club de Autos & Motocicletas",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #1c1917 0%, #09090b 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🏎️ CLUB DE AUTOS & MOTOR SPORT",
        fontSize: 28,
        color: "#F87171",
      },
      {
        type: "subtitle",
        text: "Pasión por los motores, rutas y proyectos de tuning",
        fontSize: 16,
        color: "#F5F5F4",
      },
      {
        type: "text",
        text: "Rodadas de fin de semana, talleres recomendados, compra y venta de repuestos y exhibiciones.",
        fontSize: 14,
        color: "#D6D3D1",
      },
    ],
    links: [
      {
        title: "🏁 Unirme al Grupo Oficial de WhatsApp del Club",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📍 Próxima Ruta de Fin de Semana (Ubicación y Hora)",
        url: "https://rutasdelmotor.com",
        colorStyle: "blue",
      },
      {
        title: "📸 Ver Fotos de Exhibiciones y Proyectos en Instagram",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "grupo_amistad",
    name: "Amistad & Conocer Nuevos Amigos",
    colorTheme: "green",
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1080&auto=format&fit=crop&q=80",
    texts: [
      {
        type: "title",
        text: "🤝 GRUPO DE AMISTAD & SOCIAL",
        fontSize: 28,
        color: "#6EE7B7",
      },
      {
        type: "subtitle",
        text: "Un espacio para conectar, charlar y hacer amigos de todas partes",
        fontSize: 16,
        color: "#F0FDF4",
      },
      {
        type: "text",
        text: "Aquí organizamos salidas, llamadas grupales, noches de juegos y debates para compartir anécdotas con buena vibra.",
        fontSize: 14,
        color: "#E2E8F0",
      },
    ],
    links: [
      {
        title: "💬 Grupo de WhatsApp: Nuevas Amistades",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🎙️ Sala de Voz & Juegos en Discord",
        url: "https://discord.gg",
        colorStyle: "blue",
      },
      {
        title: "📸 Galería de Fotos y Próximas Salidas",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "cine_series",
    name: "Club de Cine, Series & Streaming",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🎬 CINÉFILOS & SERIES CLUB",
        fontSize: 28,
        color: "#60A5FA",
      },
      {
        type: "subtitle",
        text: "Debates de estrenos, teorías y recomendaciones sin spoilers",
        fontSize: 16,
        color: "#F8FAFC",
      },
      {
        type: "text",
        text: "Charlamos sobre lo nuevo de Netflix, HBO, Disney+ y cine de autor. ¡Vota por las mejores películas de la temporada!",
        fontSize: 14,
        color: "#94A3B8",
      },
    ],
    links: [
      {
        title: "🍿 Grupo de WhatsApp: Debate de Estrenos y Series",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📺 Canal de Novedades y Tráilers en Telegram",
        url: "https://t.me",
        colorStyle: "blue",
      },
      {
        title: "⭐ Lista de Películas Recomendadas en Letterboxd",
        url: "https://letterboxd.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "mascotas_perros",
    name: "Comunidad de Mascotas & Adopciones",
    colorTheme: "green",
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1080&auto=format&fit=crop&q=80",
    texts: [
      {
        type: "title",
        text: "🐾 AMANTES DE LAS MASCOTAS",
        fontSize: 28,
        color: "#FDE047",
      },
      {
        type: "subtitle",
        text: "Cuidado animal, consultas veterinarias y adopción responsable",
        fontSize: 16,
        color: "#FFFFFF",
      },
      {
        type: "text",
        text: "Comparte fotos y travesuras de tus perritos o gatitos, encuentra paseadores confiables y ayuda a animales rescatados.",
        fontSize: 14,
        color: "#F1F5F9",
      },
    ],
    links: [
      {
        title: "🐶 Grupo de WhatsApp: Consejos y Cuidados Caninos",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🏡 Red de Adopción y Hogares de Paso",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🩺 Guías Gratuitas de Salud y Nutrición Animal",
        url: "https://saludpet.org",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "cocina_recetas",
    name: "Recetas Fáciles & Cocina Creativa",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🍳 RECETAS & COCINA CASERA",
        fontSize: 28,
        color: "#FBBF24",
      },
      {
        type: "subtitle",
        text: "Platos deliciosos, postres rápidos y trucos de chef",
        fontSize: 16,
        color: "#FAFAF9",
      },
      {
        type: "text",
        text: "Recetas paso a paso en menos de 20 minutos, repostería casera y menús económicos para toda la familia.",
        fontSize: 14,
        color: "#D6D3D1",
      },
    ],
    links: [
      {
        title: "🥗 Grupo de WhatsApp: Recetas y Menús Semanales",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📖 Descargar Ebook con 30 Recetas Saludables",
        url: "https://recetas.com",
        colorStyle: "blue",
      },
      {
        title: "📹 Ver Video-Tutoriales de Cocina en YouTube",
        url: "https://youtube.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "musica_urbana",
    name: "Música Urbana, Trap & Freestyle",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #18181b 0%, #312e81 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🎤 FREESTYLE & TRAP SQUAD",
        fontSize: 28,
        color: "#A78BFA",
      },
      {
        type: "subtitle",
        text: "Batallas de gallos, lanzamientos y barras en vivo",
        fontSize: 16,
        color: "#F4F4F5",
      },
      {
        type: "text",
        text: "Para los apasionados del rap, trap latino y reggaeton. Comparte tus maquetas, rimas en audio y participa en eventos.",
        fontSize: 14,
        color: "#C4B5FD",
      },
    ],
    links: [
      {
        title: "🔥 Grupo de WhatsApp: Batallas y Rimas en Audio",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🎧 Playlist Oficial de Novedades en Spotify",
        url: "https://spotify.com",
        colorStyle: "blue",
      },
      {
        title: "📢 Canal de Lanzamientos y Eventos de Hip-Hop",
        url: "https://t.me",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "senderismo_aventura",
    name: "Senderismo, Trekking & Naturaleza",
    colorTheme: "green",
    backgroundImageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1080&auto=format&fit=crop&q=80",
    texts: [
      {
        type: "title",
        text: "⛰️ SENDERISMO & AVENTURA",
        fontSize: 28,
        color: "#86EFAC",
      },
      {
        type: "subtitle",
        text: "Rutas de montaña, campamentos y conexión natural",
        fontSize: 16,
        color: "#FFFFFF",
      },
      {
        type: "text",
        text: "Únete a nuestras caminatas ecológicas los fines de semana, comparte rutas en Wikiloc y tips de supervivencia y equipo.",
        fontSize: 14,
        color: "#F0FDF4",
      },
    ],
    links: [
      {
        title: "🌲 Grupo de WhatsApp: Próximas Salidas y Rutas",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🗺️ Descargar Mapas y Coordenadas GPS en Wikiloc",
        url: "https://wikiloc.com",
        colorStyle: "blue",
      },
      {
        title: "🎒 Guía de Equipamiento Básico para Senderistas",
        url: "https://guiamontana.org",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "intercambio_idiomas",
    name: "Intercambio de Idiomas & English Club",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🌍 ENGLISH & LANGUAGE CLUB",
        fontSize: 28,
        color: "#38BDF8",
      },
      {
        type: "subtitle",
        text: "Práctica conversación real en inglés y otros idiomas",
        fontSize: 16,
        color: "#F0F9FF",
      },
      {
        type: "text",
        text: "Sesiones de speaking diarias, intercambio nativo español-inglés y recursos gratuitos para ganar fluidez sin miedo.",
        fontSize: 14,
        color: "#BAE6FD",
      },
    ],
    links: [
      {
        title: "🗣️ Grupo de WhatsApp: Daily Speaking Practice",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🎙️ Club de Conversación en Vivo en Discord",
        url: "https://discord.gg",
        colorStyle: "blue",
      },
      {
        title: "📚 Vocabulario Esencial y Expresiones en PDF",
        url: "https://englishclub.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "empleos_vacantes",
    name: "Ofertas de Empleo & Oportunidades Laborales",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)",
    },
    texts: [
      {
        type: "title",
        text: "💼 BOLSA DE EMPLEO & VACANTES",
        fontSize: 28,
        color: "#34D399",
      },
      {
        type: "subtitle",
        text: "Ofertas de trabajo remoto, presencial y asesoría de CV",
        fontSize: 16,
        color: "#ECFDF5",
      },
      {
        type: "text",
        text: "Publicaciones diarias de vacantes verificadas en ventas, administración, marketing, tecnología y atención al cliente.",
        fontSize: 14,
        color: "#A7F3D0",
      },
    ],
    links: [
      {
        title: "🚀 Grupo de WhatsApp: Nuevas Vacantes Publicadas",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📄 Plantilla de Curriculum Vitae de Alto Impacto",
        url: "https://plantillacv.com",
        colorStyle: "blue",
      },
      {
        title: "🌐 Ver Tablero Completo de Empleos Abiertos",
        url: "https://empleos.org",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "anime_manga",
    name: "Anime, Manga & Cultura Otaku",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #2e1065 0%, #1e1b4b 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🌸 COMUNIDAD ANIME & MANGA",
        fontSize: 28,
        color: "#F472B6",
      },
      {
        type: "subtitle",
        text: "Capítulos semanales, cosplay y eventos otakus",
        fontSize: 16,
        color: "#FAF5FF",
      },
      {
        type: "text",
        text: "Debates de los animes del momento, recomendaciones ocultas, spoilers moderados y avisos de convenciones.",
        fontSize: 14,
        color: "#E9D5FF",
      },
    ],
    links: [
      {
        title: "🍙 Grupo de WhatsApp: Fans de Anime & Manga",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📅 Calendario de Emisiones de la Temporada",
        url: "https://myanimelist.net",
        colorStyle: "blue",
      },
      {
        title: "🎨 Galería de Fanarts y Concursos de Cosplay",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "skate_urban",
    name: "Skateboarding & Cultura Callejera",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🛹 SKATE SQUAD & STREET",
        fontSize: 28,
        color: "#FACC15",
      },
      {
        type: "subtitle",
        text: "Spots urbanos, trucos, tablas y sesiones grupales",
        fontSize: 16,
        color: "#FAFAFA",
      },
      {
        type: "text",
        text: "Conoce skaters de tu zona, comparte clips de tus mejores líneas y entérate de las mejores rampas y plazas.",
        fontSize: 14,
        color: "#A1A1AA",
      },
    ],
    links: [
      {
        title: "🛹 Grupo de WhatsApp: Quedadas y Sesiones de Skate",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📍 Mapa de Spots y Skateparks de la Ciudad",
        url: "https://maps.google.com",
        colorStyle: "blue",
      },
      {
        title: "🎥 Ver Videos y Tutoriales de Trucos en YouTube",
        url: "https://youtube.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "bodas_eventos",
    name: "Organización de Bodas & Eventos Exclusivos",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #3b0764 0%, #4a044e 100%)",
    },
    texts: [
      {
        type: "title",
        text: "💍 WEDDING & EVENT PLANNER",
        fontSize: 28,
        color: "#F472B6",
      },
      {
        type: "subtitle",
        text: "Hacemos realidad la celebración de tus sueños",
        fontSize: 16,
        color: "#FDF4FF",
      },
      {
        type: "text",
        text: "Diseño floral, banquetes gourmet, fotografía profesional y coordinación completa para bodas y recepciones de gala.",
        fontSize: 14,
        color: "#F5D0FE",
      },
    ],
    links: [
      {
        title: "💐 Cotizar por WhatsApp con un Wedding Planner",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "📖 Catálogo de Locaciones y Paquetes de Boda",
        url: "https://bodasyeventos.com",
        colorStyle: "blue",
      },
      {
        title: "📸 Galería de Bodas Reales y Decoraciones",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "tecnologia_ia",
    name: "Tecnología, Inteligencia Artificial & Startups",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🤖 IA & STARTUP BUILDERS",
        fontSize: 28,
        color: "#38BDF8",
      },
      {
        type: "subtitle",
        text: "Modelos LLM, prompts, automatizaciones y negocios tech",
        fontSize: 16,
        color: "#F8FAFC",
      },
      {
        type: "text",
        text: "Comunidad para desarrolladores, creadores y fundadores que usan IA para lanzar productos y automatizar flujos de trabajo.",
        fontSize: 14,
        color: "#94A3B8",
      },
    ],
    links: [
      {
        title: "⚡ Grupo de WhatsApp: Herramientas de IA & Prompts",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🛠️ Directorio de Herramientas de Inteligencia Artificial",
        url: "https://futurepedia.io",
        colorStyle: "blue",
      },
      {
        title: "🚀 Newsletter Semanal de Innovación Tech",
        url: "https://substack.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "inversiones_inmobiliarias_pro",
    name: "Bienes Raíces & Inversiones Inmobiliarias",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #042f2e 0%, #134e4a 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🏢 BIENES RAÍCES & PROPIEDADES",
        fontSize: 28,
        color: "#2DD4BF",
      },
      {
        type: "subtitle",
        text: "Venta, alquiler y proyectos de alta plusvalía",
        fontSize: 16,
        color: "#F0FDFA",
      },
      {
        type: "text",
        text: "Departamentos residenciales, casas campestres y locales comerciales con excelente rentabilidad de alquiler.",
        fontSize: 14,
        color: "#CCFBF1",
      },
    ],
    links: [
      {
        title: "📲 Asesoría Inmobiliaria Inmediata por WhatsApp",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "🏡 Catálogo de Casas y Departamentos en Venta",
        url: "https://inmobiliaria.com",
        colorStyle: "blue",
      },
      {
        title: "📈 Guía Gratuita: Cómo Invertir en Bienes Raíces",
        url: "https://guiainversiones.org",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "club_lectura",
    name: "Club de Lectura & Literatura Universal",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #1c1917 0%, #0c0a09 100%)",
    },
    texts: [
      {
        type: "title",
        text: "📚 CLUB DE LECTURA & LIBROS",
        fontSize: 28,
        color: "#FB923C",
      },
      {
        type: "subtitle",
        text: "Lecturas del mes, reseñas profundas y citas literarias",
        fontSize: 16,
        color: "#FAFAF9",
      },
      {
        type: "text",
        text: "Nos reunimos cada semana para comentar novelas clásicas, ficción contemporánea, poesía y libros de crecimiento personal.",
        fontSize: 14,
        color: "#D6D3D1",
      },
    ],
    links: [
      {
        title: "📖 Grupo de WhatsApp: Debate del Libro del Mes",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📝 Lista de Lecturas Recomendadas para el Año",
        url: "https://goodreads.com",
        colorStyle: "blue",
      },
      {
        title: "☕ Enlace a las Sesiones Virtuales de Zoom / Meet",
        url: "https://meet.google.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "psicologia_bienestar",
    name: "Psicología, Autoayuda & Salud Emocional",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🌱 BIENESTAR & PSICOLOGÍA",
        fontSize: 28,
        color: "#818CF8",
      },
      {
        type: "subtitle",
        text: "Herramientas prácticas para calmar la ansiedad y crecer",
        fontSize: 16,
        color: "#EEF2FF",
      },
      {
        type: "text",
        text: "Espacio de reflexión sobre autoestima, límites sanos, relaciones saludables y ejercicios prácticos de mindfulness.",
        fontSize: 14,
        color: "#C7D2FE",
      },
    ],
    links: [
      {
        title: "💬 Grupo de Apoyo y Reflexiones Diarias en WhatsApp",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🧘 Ejercicios Guiados de Respiración y Calma",
        url: "https://mindfulness.com",
        colorStyle: "blue",
      },
      {
        title: "🗓️ Agendar Sesión de Consulta Psicológica Online",
        url: "https://doctoralia.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "ciclismo_mtb",
    name: "Ciclismo de Ruta & Mountain Bike (MTB)",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #14532d 0%, #052e16 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🚴 MTB & CICLISMO DE RUTA",
        fontSize: 28,
        color: "#4ADE80",
      },
      {
        type: "subtitle",
        text: "Salidas en pelotón, trochas y mantenimiento de bicis",
        fontSize: 16,
        color: "#F0FDF4",
      },
      {
        type: "text",
        text: "Organizamos rodadas nocturnas y de fin de semana para todos los niveles: principiantes, intermedios y avanzados.",
        fontSize: 14,
        color: "#BBF7D0",
      },
    ],
    links: [
      {
        title: "🚵 Grupo de WhatsApp: Rodadas de Fin de Semana",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🗺️ Rutas Strava y Tiempos Oficiales del Club",
        url: "https://strava.com",
        colorStyle: "blue",
      },
      {
        title: "🔧 Consejos de Taller y Mecánica Ciclista",
        url: "https://biciasesor.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "baile_ritmos",
    name: "Clases de Baile, Salsa & Bachata",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)",
    },
    texts: [
      {
        type: "title",
        text: "💃 RITMO LATINO · SALSA & BACHATA",
        fontSize: 28,
        color: "#E879F9",
      },
      {
        type: "subtitle",
        text: "Aprende a bailar desde cero y disfruta en la pista",
        fontSize: 16,
        color: "#FDF4FF",
      },
      {
        type: "text",
        text: "Clases grupales y particulares de salsa caleña, bachata sensual, estilo femenino y socials para bailar los fines de semana.",
        fontSize: 14,
        color: "#F5D0FE",
      },
    ],
    links: [
      {
        title: "🎵 WhatsApp: Horarios de Clases e Inscripciones",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "💃 Videos de Pasos Básicos y Coreografías",
        url: "https://tiktok.com",
        colorStyle: "blue",
      },
      {
        title: "🎟️ Entradas para el Próximo Social de Baile",
        url: "https://eventbrite.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "voluntariado_solidario",
    name: "Voluntariado & Ayuda Comunitaria",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #064e3b 0%, #115e59 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🤝 MANOS UNIDAS · VOLUNTARIADO",
        fontSize: 28,
        color: "#34D399",
      },
      {
        type: "subtitle",
        text: "Juntos construimos un futuro con más oportunidades",
        fontSize: 16,
        color: "#ECFDF5",
      },
      {
        type: "text",
        text: "Campañas de donación de alimentos, reforestación ambiental, apoyo escolar infantil y comedores comunitarios.",
        fontSize: 14,
        color: "#A7F3D0",
      },
    ],
    links: [
      {
        title: "💚 Grupo de WhatsApp: Nuevos Voluntarios y Jornadas",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📦 Puntos de Acopio y Elementos Necesarios",
        url: "https://donaciones.org",
        colorStyle: "blue",
      },
      {
        title: "📋 Formulario para Inscribirte como Voluntario",
        url: "https://forms.google.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "padres_familia",
    name: "Crianza Positiva & Red de Padres",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #172554 0%, #1e3a8a 100%)",
    },
    texts: [
      {
        type: "title",
        text: "👶 CRIANZA POSITIVA & FAMILIA",
        fontSize: 28,
        color: "#60A5FA",
      },
      {
        type: "subtitle",
        text: "Consejos de pedagogía, hábitos infantiles y apoyo entre padres",
        fontSize: 16,
        color: "#EFF6FF",
      },
      {
        type: "text",
        text: "Espacio respetuoso para resolver dudas sobre alimentación, sueño, berrinches y actividades divertidas en casa.",
        fontSize: 14,
        color: "#BFDBFE",
      },
    ],
    links: [
      {
        title: "🍼 Grupo de WhatsApp: Tribu de Madres y Padres",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📚 Guía en PDF: Límites con Amor y Sin Gritos",
        url: "https://crianzapositiva.com",
        colorStyle: "blue",
      },
      {
        title: "🧩 Ideas de Juegos Sensoriales y Actividades",
        url: "https://pinterest.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "tattoo_arte",
    name: "Estudio de Tatuajes & Body Art",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🖋️ INK STUDIO · TATTOO & ART",
        fontSize: 28,
        color: "#E2E8F0",
      },
      {
        type: "subtitle",
        text: "Diseños personalizados, fineline, blackwork y realismo",
        fontSize: 16,
        color: "#94A3B8",
      },
      {
        type: "text",
        text: "Máxima higiene, tintas veganas certificadas y artistas profesionales listos para plasmar tus ideas en la piel.",
        fontSize: 14,
        color: "#64748B",
      },
    ],
    links: [
      {
        title: "💬 Cotizaciones y Citas Directas por WhatsApp",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "📸 Portafolio de Tatuajes en Alta Resolución",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
      {
        title: "🧼 Guía de Cuidados Posteriores al Tatuaje",
        url: "https://inkcare.org",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "cafe_especialidad",
    name: "Café de Especialidad & Baristas",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #292524 0%, #1c1917 100%)",
    },
    texts: [
      {
        type: "title",
        text: "☕ CAFÉ DE ESPECIALIDAD & COFFEE LOVERS",
        fontSize: 28,
        color: "#D97706",
      },
      {
        type: "subtitle",
        text: "Orígenes, métodos de filtrado y el arte del buen café",
        fontSize: 16,
        color: "#FEF3C7",
      },
      {
        type: "text",
        text: "Aprende de catas, recetas de V60, Chemex y Aeropress, y compra granos recién tostados de pequeños productores.",
        fontSize: 14,
        color: "#FDE68A",
      },
    ],
    links: [
      {
        title: "📦 WhatsApp: Pedir Granos Tostados Frescos a Domicilio",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "☕ Guía de Extracción y Ratios para Filtrados",
        url: "https://specialtycoffee.com",
        colorStyle: "blue",
      },
      {
        title: "📍 Ubicación de Nuestra Barra de Café y Horarios",
        url: "https://maps.google.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "astrologia_tarot",
    name: "Astrología, Carta Astral & Tarot",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🔮 ASTROLOGÍA & TAROT EVOLUTIVO",
        fontSize: 28,
        color: "#C084FC",
      },
      {
        type: "subtitle",
        text: "Energía celestial, tránsitos planetarios y guía espiritual",
        fontSize: 16,
        color: "#FAF5FF",
      },
      {
        type: "text",
        text: "Interpretación de cartas natales, revolución solar y lecturas terapéuticas para comprender tus procesos personales.",
        fontSize: 14,
        color: "#E9D5FF",
      },
    ],
    links: [
      {
        title: "🌟 Agendar Lectura de Carta Astral por WhatsApp",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "🌙 Horóscopo y Guía de Fases Lunares del Mes",
        url: "https://astrotarot.com",
        colorStyle: "blue",
      },
      {
        title: "🃏 Curso Básico de Arcanos Mayores e Intuición",
        url: "https://cursotarot.org",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "gaming_mobile",
    name: "Comunidad Mobile Games (Free Fire, CODM, Wild Rift)",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #052e16 0%, #064e3b 100%)",
    },
    texts: [
      {
        type: "title",
        text: "📱 MOBILE ESPORTS & CLANES",
        fontSize: 28,
        color: "#34D399",
      },
      {
        type: "subtitle",
        text: "Free Fire, COD Mobile, Wild Rift, PUBG y Brawl Stars",
        fontSize: 16,
        color: "#ECFDF5",
      },
      {
        type: "text",
        text: "Reclutamiento de clanes competitivos, salas privadas diarias, torneos con premios y configuraciones de sensibilidad pro.",
        fontSize: 14,
        color: "#A7F3D0",
      },
    ],
    links: [
      {
        title: "🏆 WhatsApp: Torneos y Salas Privadas Diarias",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🎮 Servidor de Discord para Reclutamiento de Clanes",
        url: "https://discord.gg",
        colorStyle: "blue",
      },
      {
        title: "📺 Ver Directos de Jugadas Épicas y Consejos",
        url: "https://youtube.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "jardineria_plantas",
    name: "Plantas de Interior & Jardinería Urbana",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #064e3b 0%, #042f2e 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🌿 PLANTAS & JARDÍN URBANO",
        fontSize: 28,
        color: "#6EE7B7",
      },
      {
        type: "subtitle",
        text: "Riego, sustratos y propagación de esquejes",
        fontSize: 16,
        color: "#F0FDF4",
      },
      {
        type: "text",
        text: "Convierte tu hogar en una jungla verde. Aprende a cuidar monsteras, potus, suculentas y a combatir plagas de forma natural.",
        fontSize: 14,
        color: "#D1FAE5",
      },
    ],
    links: [
      {
        title: "🪴 Grupo de WhatsApp: Consultas y Fotos de Plantas",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📖 Manual Gratuito: Cuidado de Plantas de Interior",
        url: "https://jardineria.org",
        colorStyle: "blue",
      },
      {
        title: "🌿 Tienda Online de Plantas y Macetas Artesanales",
        url: "https://tiendajardin.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "produccion_musical",
    name: "Productores Musicales, Beats & Audio",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🎛️ BEATMAKERS & PRODUCTORES",
        fontSize: 28,
        color: "#38BDF8",
      },
      {
        type: "subtitle",
        text: "FL Studio, Ableton, plugins, mezcla y masterización",
        fontSize: 16,
        color: "#F8FAFC",
      },
      {
        type: "text",
        text: "Comparte tus instrumentales, descarga drum kits libres de regalías y recibe feedback constructivo de otros productores.",
        fontSize: 14,
        color: "#94A3B8",
      },
    ],
    links: [
      {
        title: "🎹 WhatsApp: Colaboraciones y Feedback de Beats",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📦 Descargar Sample Pack & Drum Kit Gratuito",
        url: "https://samplepack.com",
        colorStyle: "blue",
      },
      {
        title: "🔊 Escuchar Catálogo de Beats para Licenciar",
        url: "https://beatstars.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "moda_streetwear",
    name: "Diseño de Moda, Outfits & Tendencias",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #18181b 0%, #09090b 100%)",
    },
    texts: [
      {
        type: "title",
        text: "👕 STREETWEAR & OUTFIT INSPO",
        fontSize: 28,
        color: "#F43F5E",
      },
      {
        type: "subtitle",
        text: "Tendencias, zapatillas hype y marcas independientes",
        fontSize: 16,
        color: "#FAFAFA",
      },
      {
        type: "text",
        text: "Inspiración diaria de looks urbanos, avisos de drops limitados, moda circular y compra-venta de prendas exclusivas.",
        fontSize: 14,
        color: "#A1A1AA",
      },
    ],
    links: [
      {
        title: "👟 Grupo de WhatsApp: Avisos de Drops y Ofertas",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📸 Galería de Looks y Outfits de la Semana",
        url: "https://instagram.com",
        colorStyle: "blue",
      },
      {
        title: "🛍️ Ver Tienda de Ropa Urbana y Accesorios",
        url: "https://modastreet.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "viajeros_nomadas",
    name: "Nómadas Digitales & Mochileros por el Mundo",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #0c4a6e 0%, #164e63 100%)",
    },
    texts: [
      {
        type: "title",
        text: "✈️ NÓMADAS DIGITALES & VIAJES",
        fontSize: 28,
        color: "#38BDF8",
      },
      {
        type: "subtitle",
        text: "Trabajo remoto por el mundo, vuelos baratos y coworkings",
        fontSize: 16,
        color: "#F0F9FF",
      },
      {
        type: "text",
        text: "Comunidad de viajeros remotos. Consejos sobre visas nómadas, alojamientos accesibles, eSIMs internacionales y coworkings con buen WiFi.",
        fontSize: 14,
        color: "#BAE6FD",
      },
    ],
    links: [
      {
        title: "🗺️ Grupo de WhatsApp: Quedadas de Nómadas en el Mundo",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "💻 Guía de los Mejores Cafés y Coworkings con Buen WiFi",
        url: "https://nomadlist.com",
        colorStyle: "blue",
      },
      {
        title: "✈️ Buscador y Alertas de Vuelos Baratos",
        url: "https://skyscanner.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "cuidado_piel_skincare",
    name: "Skincare, Belleza & Cuidado Personal",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
    },
    texts: [
      {
        type: "title",
        text: "✨ SKINCARE & RUTINAS DE PIEL",
        fontSize: 28,
        color: "#FB7185",
      },
      {
        type: "subtitle",
        text: "Ingredientes activos, protector solar y cuidado diario",
        fontSize: 16,
        color: "#FFF1F2",
      },
      {
        type: "text",
        text: "Aprende a armar tu rutina según tu tipo de piel: mixta, grasa, seca o sensible. Recomendaciones de productos honestas y efectivas.",
        fontSize: 14,
        color: "#FECDD3",
      },
    ],
    links: [
      {
        title: "🌸 Grupo de WhatsApp: Dudas y Rutinas de Skincare",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "🧴 Test Gratuito: Descubre tu Tipo de Piel",
        url: "https://testskincare.org",
        colorStyle: "blue",
      },
      {
        title: "🏷️ Cupones de Descuento en Productos Dermatológicos",
        url: "https://descuentosdermo.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "karate_artes_marciales",
    name: "Artes Marciales & Defensa Personal",
    colorTheme: "green",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🥊 ARTES MARCIALES & DEFENSA PERSONAL",
        fontSize: 28,
        color: "#EF4444",
      },
      {
        type: "subtitle",
        text: "Boxeo, Jiu-Jitsu, Muay Thai y acondicionamiento",
        fontSize: 16,
        color: "#FAFAFA",
      },
      {
        type: "text",
        text: "Entrena con disciplina, aprende técnicas efectivas de defensa personal y mejora tu condición física y mental.",
        fontSize: 14,
        color: "#D4D4D8",
      },
    ],
    links: [
      {
        title: "🥋 WhatsApp: Agendar Clase de Prueba Gratuita",
        url: "https://wa.me",
        colorStyle: "green",
      },
      {
        title: "👊 Videos de Técnicas Básicas de Autodefensa",
        url: "https://youtube.com",
        colorStyle: "blue",
      },
      {
        title: "📅 Horarios de Entrenamiento y Disciplinas",
        url: "https://dojoartesmarciales.com",
        colorStyle: "blue",
      },
    ],
  },
  {
    id: "cocteleria_mixologia",
    name: "Coctelería & Mixología de Autor",
    colorTheme: "blue",
    backgroundStyle: {
      gradient: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
    },
    texts: [
      {
        type: "title",
        text: "🍸 MIXOLOGÍA & CÓCTELES DE AUTOR",
        fontSize: 28,
        color: "#F43F5E",
      },
      {
        type: "subtitle",
        text: "Recetas de tragos clásicos, jarabes caseros y maridajes",
        fontSize: 16,
        color: "#FFF1F2",
      },
      {
        type: "text",
        text: "Aprende a preparar cócteles profesionales en casa con ginebra, ron, tequila, mezcal, aperitivos y mocktails sin alcohol.",
        fontSize: 14,
        color: "#FECDD3",
      },
    ],
    links: [
      {
        title: "🍹 WhatsApp: Recetario y Dudas de Mixología",
        url: "https://chat.whatsapp.com",
        colorStyle: "green",
      },
      {
        title: "📖 Libro Digital: 50 Cócteles para Preparar en Casa",
        url: "https://mixologiafacil.com",
        colorStyle: "blue",
      },
      {
        title: "🥃 Lista de Herramientas y Botellas Esenciales de Bar",
        url: "https://barhouse.org",
        colorStyle: "blue",
      },
    ],
  },
];
