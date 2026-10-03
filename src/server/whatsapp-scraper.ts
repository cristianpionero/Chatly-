/**
 * Extractor de metadatos públicos de grupos de WhatsApp.
 * Solo consulta la cabecera / HTML público de chat.whatsapp.com.
 * No ingresa al grupo ni almacena datos.
 */

export interface ScrapedPreview {
  success: boolean;
  title: string | null;
  image: string | null;
  hasImage: boolean;
  code: number;
}

export async function scrapeWhatsappInvite(targetUrl: string): Promise<ScrapedPreview> {
  if (!targetUrl || (!targetUrl.includes("chat.whatsapp.com") && !targetUrl.includes("wa.me"))) {
    return {
      success: false,
      title: null,
      image: null,
      hasImage: false,
      code: 101,
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        success: false,
        title: null,
        image: null,
        hasImage: false,
        code: 101,
      };
    }

    const html = await response.text();

    // Extraer og:title
    const titleMatch =
      html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i) ||
      html.match(/<meta\s+content=["']([^"']*)["']\s+property=["']og:title["']/i);

    // Extraer og:image
    const imageMatch =
      html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i) ||
      html.match(/<meta\s+content=["']([^"']*)["']\s+property=["']og:image["']/i);

    let title: string | null = null;
    if (titleMatch && titleMatch[1]) {
      const decoded = decodeHtmlEntities(titleMatch[1].trim());
      if (
        decoded &&
        !decoded.toLowerCase().includes("whatsapp group invite") &&
        !decoded.toLowerCase().includes("invitación a grupo de whatsapp")
      ) {
        title = decoded;
      }
    }

    const rawImage = imageMatch && imageMatch[1] ? imageMatch[1].trim() : null;

    // Detectar si la imagen es el ícono genérico estático de WhatsApp o no existe
    const isGenericIcon =
      !rawImage ||
      rawImage.includes("static.whatsapp.net") ||
      rawImage.includes("whatsapp.com/img") ||
      rawImage.includes("rukeqTVNJDY.png") ||
      rawImage.endsWith(".svg");

    if (isGenericIcon) {
      return {
        success: true,
        title,
        image: null,
        hasImage: false,
        code: 101, // Código 101: sin imagen
      };
    }

    return {
      success: true,
      title,
      image: rawImage,
      hasImage: true,
      code: 200,
    };
  } catch {
    return {
      success: false,
      title: null,
      image: null,
      hasImage: false,
      code: 101,
    };
  }
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, "/");
}
