/**
 * Utilidad para consultar metadatos públicos de vista previa de un grupo de WhatsApp.
 * Obtiene la imagen de perfil actual y el nombre del grupo en tiempo real.
 * No se almacena en base de datos.
 */

export interface WhatsappPreviewResult {
  success: boolean;
  title: string | null;
  image: string | null;
  hasImage: boolean;
  code: number;
}

export async function consultarVistaPreviaWhatsApp(link: string): Promise<WhatsappPreviewResult> {
  if (!link || (!link.includes("chat.whatsapp.com") && !link.includes("wa.me"))) {
    return {
      success: false,
      title: null,
      image: null,
      hasImage: false,
      code: 101,
    };
  }

  try {
    const res = await fetch(`/api/whatsapp-preview?url=${encodeURIComponent(link)}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return {
        success: false,
        title: null,
        image: null,
        hasImage: false,
        code: 101,
      };
    }

    const data = (await res.json()) as WhatsappPreviewResult;
    return {
      success: Boolean(data.success),
      title: data.title || null,
      image: data.hasImage ? data.image : null,
      hasImage: Boolean(data.hasImage && data.image),
      code: data.code || (data.hasImage ? 200 : 101),
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
