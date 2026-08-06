/**
 * Configuración central del sitio.
 * Todo lo editable por la propietaria vive acá y en el panel (/admin/configuracion).
 * Reemplazar estos valores no requiere tocar componentes.
 */
export const sitio = {
  nombre: "La Fe Departamentos",
  nombreCorto: "La Fe",
  descripcion:
    "Departamentos de alquiler temporario en Ushuaia. Dos edificios, seis unidades con cocina completa y calefacción, atendidos por sus dueños.",
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
      "Hola, escribo desde la web de La Fe Departamentos. Quisiera consultar disponibilidad.",
    email: "reservas@lafedepartamentos.com.ar",
    direccion: "Ushuaia 1569 y Gobernador Paz 2140, Ushuaia",
    horarios: "Todos los días, de 9 a 21 h",
  },
  redes: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
  },
  navegacion: [
    { etiqueta: "Departamentos", href: "/#departamentos" },
    { etiqueta: "Experiencias", href: "/#experiencias" },
    { etiqueta: "La estadía", href: "/#estadia" },
    { etiqueta: "Ubicación", href: "/#ubicacion" },
    { etiqueta: "Preguntas", href: "/#preguntas" },
  ],
} as const;

export function urlWhatsApp(texto: string = sitio.contacto.whatsappTexto) {
  return `https://wa.me/${sitio.contacto.whatsapp}?text=${encodeURIComponent(texto)}`;
}
