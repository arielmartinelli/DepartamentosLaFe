"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  consultas as consultasViejas,
  departamentos as departamentosSemilla,
  edificios as edificiosSemilla,
  reservas as reservasSemilla,
} from "./data";
import {
  actividadesSemilla,
  bloqueosSemilla,
  comentariosSemilla,
  consultasSemilla,
  cuentasSemilla,
  galeriasSemilla,
  prestacionesSemilla,
} from "./semillas";
import { CLAVES, guardar, leer, nuevoId, suscribir, type Clave } from "./repositorio";
import { sitio } from "./site";
import type {
  Actividad,
  Bloqueo,
  Comentario,
  ConsultaCompleta,
  Cuenta,
  Departamento,
  Edificio,
  EstadoConsulta,
  EstadoReserva,
  Prestacion,
  Reserva,
  SectorGaleria,
} from "./tipos";

void consultasViejas;

export type Ajustes = {
  telefono: string;
  whatsapp: string;
  email: string;
  direccion: string;
  horarios: string;
  instagram: string;
  facebook: string;
  logo: string;
  marca: string;
  portada: string;
  guia: string;
  guiaActualizada: string;
};

const ajustesSemilla: Ajustes = {
  telefono: sitio.contacto.telefono,
  whatsapp: sitio.contacto.whatsapp,
  email: sitio.contacto.email,
  direccion: sitio.contacto.direccion,
  horarios: sitio.contacto.horarios,
  instagram: sitio.redes.instagram,
  facebook: sitio.redes.facebook,
  logo: sitio.marca.logo,
  marca: "/brand/marca-lafe.png",
  portada: sitio.marca.portada,
  guia: "/guias/que-hacer-en-ushuaia.pdf",
  guiaActualizada: "4 de agosto de 2026",
};

type Contenido = {
  listo: boolean;
  edificios: Edificio[];
  departamentos: Departamento[];
  reservas: Reserva[];
  bloqueos: Bloqueo[];
  consultas: ConsultaCompleta[];
  actividades: Actividad[];
  comentarios: Comentario[];
  prestaciones: Prestacion[];
  galerias: SectorGaleria[];
  cuentas: Cuenta[];
  ajustes: Ajustes;

  guardarEdificio: (e: Edificio) => void;
  guardarDepartamento: (d: Departamento) => void;
  eliminarDepartamento: (id: string) => void;
  alternarDestacado: (id: string) => void;

  guardarReserva: (r: Reserva) => void;
  cambiarEstadoReserva: (id: string, estado: EstadoReserva) => void;
  eliminarReserva: (id: string) => void;

  guardarBloqueo: (b: Bloqueo) => void;
  eliminarBloqueo: (id: string) => void;

  crearConsulta: (c: Omit<ConsultaCompleta, "id" | "fecha" | "estado" | "conversacion">) => ConsultaCompleta;
  responderConsulta: (id: string, texto: string, autor?: "visitante" | "propietaria") => void;
  cambiarEstadoConsulta: (id: string, estado: EstadoConsulta) => void;
  eliminarConsulta: (id: string) => void;

  guardarActividad: (a: Actividad) => void;
  eliminarActividad: (id: string) => void;
  moverActividad: (id: string, paso: -1 | 1) => void;

  guardarComentario: (c: Comentario) => void;
  eliminarComentario: (id: string) => void;

  guardarPrestacion: (p: Prestacion) => void;
  eliminarPrestacion: (id: string) => void;
  moverPrestacion: (id: string, paso: -1 | 1) => void;

  guardarGaleria: (g: SectorGaleria) => void;

  guardarCuenta: (c: Cuenta) => void;
  guardarAjustes: (a: Partial<Ajustes>) => void;

  buscarEdificio: (id: string) => Edificio | undefined;
  buscarDepartamento: (id: string) => Departamento | undefined;
};

const Ctx = createContext<Contenido | null>(null);

/** Reordena por el campo `orden` y reasigna índices consecutivos. */
function reordenar<T extends { id: string; orden: number }>(lista: T[], id: string, paso: -1 | 1) {
  const ordenada = [...lista].sort((a, b) => a.orden - b.orden);
  const i = ordenada.findIndex((x) => x.id === id);
  const j = i + paso;
  if (i < 0 || j < 0 || j >= ordenada.length) return lista;
  [ordenada[i], ordenada[j]] = [ordenada[j], ordenada[i]];
  return ordenada.map((x, k) => ({ ...x, orden: k }));
}

/**
 * Lee una colección del repositorio.
 *
 * `useSyncExternalStore` es la forma correcta de consumir una fuente externa:
 * en el servidor devuelve la semilla (mismo HTML que verá el navegador) y en
 * el cliente devuelve lo guardado, sin efectos ni renders en cascada.
 */
function useDato<T>(clave: Clave, semilla: T): T {
  return useSyncExternalStore(
    suscribir,
    () => leer(clave, semilla),
    () => semilla,
  );
}

export function ProveedorContenido({ children }: { children: ReactNode }) {
  const edificios = useDato(CLAVES.edificios, edificiosSemilla);
  const departamentos = useDato(CLAVES.departamentos, departamentosSemilla);
  const reservas = useDato(CLAVES.reservas, reservasSemilla);
  const bloqueos = useDato(CLAVES.bloqueos, bloqueosSemilla);
  const consultas = useDato(CLAVES.consultas, consultasSemilla);
  const actividades = useDato(CLAVES.actividades, actividadesSemilla);
  const comentarios = useDato(CLAVES.comentarios, comentariosSemilla);
  const prestaciones = useDato(CLAVES.prestaciones, prestacionesSemilla);
  const galerias = useDato(CLAVES.galerias, galeriasSemilla);
  const cuentas = useDato(CLAVES.cuentas, cuentasSemilla);
  const ajustes = useDato(CLAVES.ajustes, ajustesSemilla);
  const listo = true;

  /* Guarda y publica en un solo paso. */
  const persistir = useCallback(<T,>(clave: Clave, valor: T) => guardar(clave, valor), []);

  const valor = useMemo<Contenido>(() => {
    return {
      listo,
      edificios,
      departamentos,
      reservas,
      bloqueos,
      consultas,
      actividades,
      comentarios,
      prestaciones,
      galerias,
      cuentas,
      ajustes,

      guardarEdificio: (e) =>
        persistir(
          CLAVES.edificios,
          edificios.map((x) => (x.id === e.id ? e : x)),
        ),

      guardarDepartamento: (d) =>
        persistir(
          CLAVES.departamentos,
          departamentos.some((x) => x.id === d.id)
            ? departamentos.map((x) => (x.id === d.id ? d : x))
            : [...departamentos, d],
        ),

      eliminarDepartamento: (id) =>
        persistir(
          CLAVES.departamentos,
          departamentos.filter((d) => d.id !== id),
        ),

      alternarDestacado: (id) =>
        persistir(
          CLAVES.departamentos,
          departamentos.map((d) => (d.id === id ? { ...d, destacado: !d.destacado } : d)),
        ),

      guardarReserva: (r) =>
        persistir(
          CLAVES.reservas,
          reservas.some((x) => x.id === r.id)
            ? reservas.map((x) => (x.id === r.id ? r : x))
            : [...reservas, r],
        ),

      cambiarEstadoReserva: (id, estado) =>
        persistir(
          CLAVES.reservas,
          reservas.map((r) => (r.id === id ? { ...r, estado } : r)),
        ),

      eliminarReserva: (id) =>
        persistir(CLAVES.reservas, reservas.filter((r) => r.id !== id)),

      guardarBloqueo: (b) =>
        persistir(
          CLAVES.bloqueos,
          bloqueos.some((x) => x.id === b.id)
            ? bloqueos.map((x) => (x.id === b.id ? b : x))
            : [...bloqueos, b],
        ),

      eliminarBloqueo: (id) =>
        persistir(CLAVES.bloqueos, bloqueos.filter((b) => b.id !== id)),

      crearConsulta: (c) => {
        const hoy = new Date().toISOString().slice(0, 10);
        const nueva: ConsultaCompleta = {
          ...c,
          id: nuevoId("con"),
          fecha: hoy,
          estado: "nueva",
          conversacion: [
            { id: nuevoId("msg"), autor: "visitante", texto: c.mensaje, fecha: hoy },
          ],
        };
        persistir(CLAVES.consultas, [nueva, ...consultas]);
        return nueva;
      },

      responderConsulta: (id, texto, autor = "propietaria") =>
        persistir(
          CLAVES.consultas,
          consultas.map((c) =>
            c.id === id
              ? {
                  ...c,
                  estado: autor === "propietaria" ? "respondida" : c.estado,
                  conversacion: [
                    ...c.conversacion,
                    {
                      id: nuevoId("msg"),
                      autor,
                      texto,
                      fecha: new Date().toISOString().slice(0, 10),
                    },
                  ],
                }
              : c,
          ),
        ),

      cambiarEstadoConsulta: (id, estado) =>
        persistir(
          CLAVES.consultas,
          consultas.map((c) => (c.id === id ? { ...c, estado } : c)),
        ),

      eliminarConsulta: (id) =>
        persistir(CLAVES.consultas, consultas.filter((c) => c.id !== id)),

      guardarActividad: (a) =>
        persistir(
          CLAVES.actividades,
          actividades.some((x) => x.id === a.id)
            ? actividades.map((x) => (x.id === a.id ? a : x))
            : [...actividades, { ...a, orden: actividades.length }],
        ),

      eliminarActividad: (id) =>
        persistir(CLAVES.actividades, actividades.filter((a) => a.id !== id)),

      moverActividad: (id, paso) =>
        persistir(CLAVES.actividades, reordenar(actividades, id, paso)),

      guardarComentario: (c) =>
        persistir(
          CLAVES.comentarios,
          comentarios.some((x) => x.id === c.id)
            ? comentarios.map((x) => (x.id === c.id ? c : x))
            : [...comentarios, { ...c, orden: comentarios.length }],
        ),

      eliminarComentario: (id) =>
        persistir(CLAVES.comentarios, comentarios.filter((c) => c.id !== id)),

      guardarPrestacion: (p) =>
        persistir(
          CLAVES.prestaciones,
          prestaciones.some((x) => x.id === p.id)
            ? prestaciones.map((x) => (x.id === p.id ? p : x))
            : [...prestaciones, { ...p, orden: prestaciones.length }],
        ),

      eliminarPrestacion: (id) =>
        persistir(CLAVES.prestaciones, prestaciones.filter((p) => p.id !== id)),

      moverPrestacion: (id, paso) =>
        persistir(CLAVES.prestaciones, reordenar(prestaciones, id, paso)),

      guardarGaleria: (g) => {
        persistir(CLAVES.galerias, galerias.map((x) => (x.id === g.id ? g : x)));

        /* La galería de un edificio es la fuente de sus fotos en la portada. */
        if (g.tipo === "edificio" && g.referencia) {
          const ordenadas = [...g.imagenes].sort((a, b) =>
            a.principal === b.principal ? 0 : a.principal ? -1 : 1,
          );
          const fotos = ordenadas.map((i) => i.src).filter(Boolean);
          if (fotos.length) {
            persistir(
              CLAVES.edificios,
              edificios.map((e) =>
                e.id === g.referencia ? { ...e, portada: fotos[0], fotos } : e,
              ),
            );
          }
        }
      },

      guardarCuenta: (c) =>
        persistir(
          CLAVES.cuentas,
          cuentas.some((x) => x.id === c.id) ? cuentas.map((x) => (x.id === c.id ? c : x)) : [...cuentas, c],
        ),

      guardarAjustes: (a) => persistir(CLAVES.ajustes, { ...ajustes, ...a }),

      buscarEdificio: (id) => edificios.find((e) => e.id === id),
      buscarDepartamento: (id) => departamentos.find((d) => d.id === id),
    } as Contenido;
  }, [
    listo,
    edificios,
    departamentos,
    reservas,
    bloqueos,
    consultas,
    actividades,
    comentarios,
    prestaciones,
    galerias,
    cuentas,
    ajustes,
    persistir,
  ]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useContenido() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useContenido debe usarse dentro de <ProveedorContenido>");
  return c;
}
