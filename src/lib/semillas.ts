/**
 * Datos iniciales con la forma que usa el panel.
 * Se derivan del contenido de `data.ts` para no duplicar textos.
 * En cuanto la propietaria edita algo, el repositorio guarda su versión.
 */
import {
  consultas as consultasBase,
  edificios,
  queHacer,
  resenas,
  servicios,
} from "./data";
import { foto } from "./imagenes";
import type {
  Actividad,
  Bloqueo,
  Comentario,
  ConsultaCompleta,
  Cuenta,
  Prestacion,
  SectorGaleria,
} from "./tipos";

export const actividadesSemilla: Actividad[] = queHacer.map((q, i) => ({
  ...q,
  orden: i,
  activa: true,
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
    nombre: `Título ${e.nombre}`,
    descripcion: `Las dos fotos que acompañan al título “Departamentos ${e.nombre}” en la portada. La primera es la grande.`,
    tipo: "edificio",
    referencia: e.id,
    imagenes: e.fotos.slice(0, 4).map((src, i) => ({
      id: `${e.id}-img-${i}`,
      src,
      titulo: i === 0 ? `Foto grande de ${e.nombre}` : `Foto ${i + 1} de ${e.nombre}`,
      principal: i === 0,
    })),
  })),
  {
    id: "gal-estadia",
    nombre: "Contamos con todo lo que necesitas",
    descripcion: "La fotografía vertical que acompaña a la lista de servicios en la portada.",
    tipo: "estadia",
    imagenes: [
      {
        id: "estadia-img-0",
        src: foto.comedorMadera,
        titulo: "Mesa junto a la ventana",
        principal: true,
      },
    ],
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
