/**
 * Configuración central del sitio.
 * Todo lo editable por la propietaria vive acá y en el panel (/admin/configuracion).
 * Reemplazar estos valores no requiere tocar componentes.
 */
export const sitio = {
  nombre: "Departamentos La Fe",
  nombreCorto: "Departamentos La Fe",
  descripcion:
    "Departamentos de alquiler temporario en Ushuaia, a cinco cuadras del centro. Seis unidades con cocina-comedor equipada, fibra óptica y TV en cada ambiente.",
  url: "https://lafedepartamentos.com.ar",
  ciudad: "Ushuaia",
  provincia: "Tierra del Fuego",
  pais: "Argentina",
  coordenadas: "54°48′ S · 68°18′ O",
  marca: {
    logo: "/brand/logo-lafe.png",
    isotipo: "/brand/isotipo-lafe.png",
    portada: "/media/fachada.jpg",
  },
  contacto: {
    telefono: "+54 2901 000000",
    telefonoHref: "tel:+542901000000",
    whatsapp: "5492901000000",
    whatsappTexto:
      "Hola, escribo desde la web de Departamentos La Fe. Quisiera consultar disponibilidad.",
    email: "reservas@lafedepartamentos.com.ar",
    direccion: "Ushuaia 1589, Ushuaia",
    horarios: "Todos los días, de 9 a 21 h",
  },
  redes: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
  navegacion: [
    { etiqueta: "Departamentos", href: "/#departamentos" },
    { etiqueta: "Qué hacer", href: "/#que-hacer" },
    { etiqueta: "La estadía", href: "/#estadia" },
    { etiqueta: "Ubicación", href: "/#ubicacion" },
    { etiqueta: "Preguntas", href: "/#preguntas" },
  ],
} as const;

/**
 * Dirección pública del sitio.
 *
 * Las vistas previas de WhatsApp, Instagram y Google necesitan la imagen en
 * una URL absoluta. Si queda apuntando a un dominio que todavía no existe, el
 * enlace se comparte sin foto. Por eso se toma, en este orden:
 *
 *   1. NEXT_PUBLIC_SITIO_URL (el dominio propio, cuando esté)
 *   2. el dominio que asigna Vercel
 *   3. el de `sitio.url`, como último recurso
 */
export function urlBase() {
  const propia = process.env.NEXT_PUBLIC_SITIO_URL?.trim();
  if (propia) return propia.replace(/\/$/, "");

  const produccion = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (produccion) return `https://${produccion}`;

  const despliegue = process.env.VERCEL_URL;
  if (despliegue) return `https://${despliegue}`;

  return sitio.url;
}

/**
 * Dirección real desde la que se está sirviendo la página.
 *
 * Es la única forma de que la vista previa funcione sin depender de que
 * alguien configure una variable: se lee del propio pedido. Si
 * `NEXT_PUBLIC_SITIO_URL` está definida se usa esa y la página sigue siendo
 * estática; si no, se toma la cabecera `host`.
 */
export async function urlBaseDelPedido() {
  const propia = process.env.NEXT_PUBLIC_SITIO_URL?.trim();
  if (propia) return propia.replace(/\/$/, "");

  try {
    const { headers } = await import("next/headers");
    const cabeceras = await headers();
    const anfitrion = cabeceras.get("x-forwarded-host") ?? cabeceras.get("host");
    if (anfitrion) {
      const protocolo =
        cabeceras.get("x-forwarded-proto") ??
        (anfitrion.startsWith("localhost") || anfitrion.startsWith("127.") ? "http" : "https");
      return `${protocolo}://${anfitrion}`;
    }
  } catch {
    /* Fuera de un pedido (por ejemplo, al generar el sitemap). */
  }

  return urlBase();
}

/** Imagen que se ve al compartir el enlace. */
export const imagenAlCompartir = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Departamentos La Fe — Ushuaia, Tierra del Fuego",
};

export function urlWhatsApp(texto: string = sitio.contacto.whatsappTexto) {
  return `https://wa.me/${sitio.contacto.whatsapp}?text=${encodeURIComponent(texto)}`;
}
