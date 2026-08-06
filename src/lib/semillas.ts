/**
 * Datos iniciales con la forma que usa el panel.
 * Se derivan del contenido de `data.ts` para no duplicar textos.
 * En cuanto la propietaria edita algo, el repositorio guarda su versión.
 */
import {
  cercanias,
  consultas as consultasBase,
  departamentos,
  edificios,
  experiencias,
  resenas,
  servicios,
} from "./data";
import type {
  Actividad,
  Bloqueo,
  Comentario,
  ConsultaCompleta,
  Cuenta,
  Lugar,
  Prestacion,
  SectorGaleria,
} from "./tipos";

export const actividadesSemilla: Actividad[] = experiencias.map((e, i) => ({
  id: e.id,
  titulo: e.nombre,
  descripcion: e.descripcion,
  duracion: e.duracion,
  temporada: e.temporada,
  foto: e.foto,
  orden: i,
  activa: true,
}));

const mapaDe = (nombre: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${nombre}, Ushuaia, Tierra del Fuego`)}`;

export const lugaresSemilla: Lugar[] = cercanias.map((c, i) => ({
  id: c.id,
  nombre: c.nombre,
  descripcion: c.descripcion,
  distancia: c.distancia,
  categoria: c.categoria,
  foto: c.foto,
  mapa: mapaDe(c.nombre),
  orden: i,
  activo: true,
}));

export const comentariosSemilla: Comentario[] = resenas.map((r, i) => ({
  id: r.id,
  texto: r.texto,
  autor: r.autor,
  procedencia: r.procedencia,
  fecha: r.fecha,
  departamento: r.departamento,
  puntaje: 5,
  orden: i,
  publicado: true,
}));

export const prestacionesSemilla: Prestacion[] = servicios.map((s, i) => ({
  id: s.id,
  nombre: s.nombre,
  descripcion: s.descripcion,
  icono: s.icono,
  foto: null,
  orden: i,
  activo: s.activo,
  destacadoEnHome: s.destacadoEnHome,
}));

export const galeriasSemilla: SectorGaleria[] = [
  ...edificios.map<SectorGaleria>((e) => ({
    id: `gal-${e.slug}`,
    nombre: `Inicio ${e.nombre}`,
    descripcion: `Fotos del edificio ${e.nombre} en la portada y en su presentación.`,
    tipo: "edificio",
    referencia: e.id,
    imagenes: e.fotos.map((src, i) => ({
      id: `${e.id}-img-${i}`,
      src,
      titulo: i === 0 ? `Fachada de ${e.nombre}` : `${e.nombre} — ambiente ${i}`,
      principal: i === 0,
    })),
  })),
  ...departamentos.map<SectorGaleria>((d) => {
    const ed = edificios.find((e) => e.id === d.edificioId);
    return {
      id: `gal-${d.slug}`,
      nombre: `${ed?.nombre} · ${d.nombre}`,
      descripcion: `Galería de la ficha del ${d.nombre.toLowerCase()} de ${ed?.nombre}.`,
      tipo: "departamento",
      referencia: d.id,
      imagenes: d.fotos.map((src, i) => ({
        id: `${d.id}-img-${i}`,
        src,
        titulo: i === 0 ? "Foto principal" : `Ambiente ${i}`,
        principal: i === 0,
      })),
    };
  }),
  {
    id: "gal-actividades",
    nombre: "Actividades",
    descripcion: "Fotos de la sección “Qué hacer mientras estás acá”.",
    tipo: "actividades",
    imagenes: experiencias.map((e, i) => ({
      id: `act-img-${i}`,
      src: e.foto,
      titulo: e.nombre,
      principal: i === 0,
    })),
  },
  {
    id: "gal-alrededores",
    nombre: "Descubrí los alrededores",
    descripcion: "Fotos de los lugares cercanos.",
    tipo: "alrededores",
    imagenes: cercanias.map((c, i) => ({
      id: `alr-img-${i}`,
      src: c.foto,
      titulo: c.nombre,
      principal: i === 0,
    })),
  },
];

export const bloqueosSemilla: Bloqueo[] = [
  {
    id: "blq-1",
    departamentoId: "dep-103",
    desde: "2026-09-01",
    hasta: "2026-09-05",
    motivo: "Pintura y mantenimiento",
  },
  {
    id: "blq-2",
    departamentoId: "dep-202",
    desde: "2026-10-12",
    hasta: "2026-10-15",
    motivo: "Uso de la familia",
  },
];

export const consultasSemilla: ConsultaCompleta[] = consultasBase.map((c, i) => ({
  id: c.id,
  nombre: c.nombre,
  email: c.email,
  telefono: c.telefono,
  departamentoId: [null, "dep-101", "dep-202", null, "dep-103"][i] ?? null,
  desde: [null, "2026-08-20", "2026-10-05", null, null][i] ?? null,
  hasta: [null, "2026-08-24", "2026-10-10", null, null][i] ?? null,
  personas: c.personas,
  mensaje: c.mensaje,
  fecha: c.fecha,
  estado: c.estado,
  canal: i % 2 === 0 ? "Web" : "WhatsApp",
  cuentaId: null,
  conversacion: [
    { id: `${c.id}-m1`, autor: "visitante", texto: c.mensaje, fecha: c.fecha },
    ...(c.estado === "respondida"
      ? [
          {
            id: `${c.id}-m2`,
            autor: "propietaria" as const,
            texto:
              "¡Hola! Sí, tenemos disponibilidad para esas fechas. Te paso el detalle de precios y formas de pago por correo. Cualquier duda quedo a disposición.",
            fecha: c.fecha,
          },
        ]
      : []),
  ],
}));

export const cuentasSemilla: Cuenta[] = [
  {
    id: "cta-demo",
    nombre: "Verónica Paz",
    email: "vero.paz@correo.com",
    clave: "demostracion",
    telefono: "+54 11 6677 4433",
    creada: "2026-08-05",
  },
];
