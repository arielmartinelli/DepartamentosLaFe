"use client";

import { ArrowLeftRight, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { Foto } from "@/components/sitio/foto";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Entrada, Etiqueta } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { Modal } from "@/components/ui/modal";
import { useContenido } from "@/lib/contenido";
import { nuevoId } from "@/lib/repositorio";
import type { Actividad } from "@/lib/tipos";
import { cn } from "@/lib/utils";

export default function PaginaActividades() {
  const { actividades, guardarActividad, eliminarActividad, moverActividad } = useContenido();
  const [editando, setEditando] = useState<Actividad | null>(null);
  const lista = [...actividades].sort((a, b) => a.orden - b.orden);

  const vacia = (): Actividad => ({
    id: nuevoId("act"),
    titulo: "",
    descripcion: "",
    duracion: "",
    temporada: "",
    foto: "",
    orden: actividades.length,
    activa: true,
  });

  return (
    <>
      <EncabezadoPagina
        titulo="Actividades"
        descripcion="La sección “Qué hacer mientras estás acá” de la portada. El orden de esta lista es el orden del carrusel."
        acciones={
          <Boton variante="principal" medida="sm" onClick={() => setEditando(vacia())}>
            <Plus strokeWidth={2} /> Nueva actividad
          </Boton>
        }
      />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {lista.map((a, i) => (
          <li
            key={a.id}
            className={cn(
              "overflow-hidden rounded-xl border border-linea bg-white transition-shadow duration-200 hover:shadow-carta",
              !a.activa && "opacity-60",
            )}
          >
            <div className="relative">
              <Foto src={a.foto} alt={a.titulo} sizes="33vw" className="aspect-16/10 w-full" />
              <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2 py-0.5 text-[0.68rem] font-semibold tabular-nums text-white">
                {i + 1}
              </span>
              {!a.activa ? (
                <span className="absolute right-3 top-3">
                  <Insignia tono="blanco">Oculta</Insignia>
                </span>
              ) : null}
            </div>
            <div className="p-5">
              <h2 className="font-sans text-[0.95rem] font-semibold text-ink">
                {a.titulo || "Sin título"}
              </h2>
              {a.duracion || a.temporada ? (
                <p className="mt-1 text-[0.76rem] text-texto-tenue">
                  {[a.duracion, a.temporada].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              <p className="mt-2 line-clamp-3 text-[0.85rem] leading-snug text-texto-suave">
                {a.descripcion}
              </p>

              <div className="mt-4 flex items-center gap-1">
                <Boton variante="fantasma" medida="iconoSm" aria-label="Mover antes" disabled={i === 0} onClick={() => moverActividad(a.id, -1)}>
                  <ArrowLeftRight className="rotate-180" strokeWidth={1.7} />
                </Boton>
                <Boton variante="fantasma" medida="iconoSm" aria-label="Mover después" disabled={i === lista.length - 1} onClick={() => moverActividad(a.id, 1)}>
                  <ArrowLeftRight strokeWidth={1.7} />
                </Boton>
                <Boton
                  variante="fantasma"
                  medida="iconoSm"
                  aria-label={a.activa ? "Ocultar de la web" : "Mostrar en la web"}
                  onClick={() => guardarActividad({ ...a, activa: !a.activa })}
                >
                  {a.activa ? <Eye strokeWidth={1.7} /> : <EyeOff strokeWidth={1.7} />}
                </Boton>
                <Boton variante="contorno" medida="sm" className="ml-auto" onClick={() => setEditando(a)}>
                  <Pencil strokeWidth={1.6} /> Editar
                </Boton>
                <Boton
                  variante="fantasma"
                  medida="iconoSm"
                  aria-label="Eliminar actividad"
                  className="text-alerta hover:bg-alerta/10"
                  onClick={() => eliminarActividad(a.id)}
                >
                  <Trash2 strokeWidth={1.6} />
                </Boton>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        abierto={Boolean(editando)}
        onCerrar={() => setEditando(null)}
        titulo={editando && actividades.some((a) => a.id === editando.id) ? "Editar actividad" : "Nueva actividad"}
        pie={
          <>
            <Boton variante="fantasma" medida="sm" onClick={() => setEditando(null)}>
              Cancelar
            </Boton>
            <Boton
              variante="principal"
              medida="sm"
              onClick={() => {
                if (editando?.titulo.trim()) guardarActividad(editando);
                setEditando(null);
              }}
            >
              Guardar
            </Boton>
          </>
        }
      >
        {editando ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="a-titulo">Título</Etiqueta>
              <Entrada id="a-titulo" value={editando.titulo} onChange={(e) => setEditando({ ...editando, titulo: e.target.value })} placeholder="Navegación por el Canal Beagle" />
            </div>
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="a-foto">Imagen</Etiqueta>
              <Entrada id="a-foto" value={editando.foto} onChange={(e) => setEditando({ ...editando, foto: e.target.value })} placeholder="/media/canal-beagle.jpg" />
            </div>
            <div>
              <Etiqueta htmlFor="a-duracion">Duración</Etiqueta>
              <Entrada id="a-duracion" value={editando.duracion} onChange={(e) => setEditando({ ...editando, duracion: e.target.value })} placeholder="4 horas" />
            </div>
            <div>
              <Etiqueta htmlFor="a-temporada">Temporada</Etiqueta>
              <Entrada id="a-temporada" value={editando.temporada} onChange={(e) => setEditando({ ...editando, temporada: e.target.value })} placeholder="Todo el año" />
            </div>
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="a-desc">Descripción</Etiqueta>
              <AreaTexto id="a-desc" rows={4} value={editando.descripcion} onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })} />
            </div>
            <label className="flex items-center gap-3 text-[0.88rem] text-texto sm:col-span-2">
              <input
                type="checkbox"
                checked={editando.activa}
                onChange={(e) => setEditando({ ...editando, activa: e.target.checked })}
                className="size-4 accent-[#b07d2b]"
              />
              Visible en la web
            </label>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
