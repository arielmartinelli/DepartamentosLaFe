"use client";

import { Eye, EyeOff, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { Panel } from "@/components/admin/tarjeta";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Entrada, Etiqueta, Selector } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { Modal } from "@/components/ui/modal";
import { useContenido } from "@/lib/contenido";
import { nuevoId } from "@/lib/repositorio";
import type { Comentario } from "@/lib/tipos";
import { cn, normalizarEnlacesEnTexto } from "@/lib/utils";

export default function PaginaComentarios() {
  const { comentarios, guardarComentario, eliminarComentario } = useContenido();
  const [editando, setEditando] = useState<Comentario | null>(null);
  const lista = [...comentarios].sort((a, b) => a.orden - b.orden);

  const vacio = (): Comentario => ({
    id: nuevoId("com"),
    texto: "",
    autor: "",
    procedencia: "",
    fecha: "",
    departamento: "",
    puntaje: 5,
    orden: comentarios.length,
    publicado: true,
  });

  return (
    <>
      <EncabezadoPagina
        titulo="Comentarios"
        descripcion="Las opiniones que se muestran en la portada. Sin foto del huésped: sólo el texto y de dónde vino."
        acciones={
          <Boton variante="principal" medida="sm" onClick={() => setEditando(vacio())}>
            <Plus strokeWidth={2} /> Nuevo comentario
          </Boton>
        }
      />

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lista.map((c) => (
          <li key={c.id}>
            <Panel className={cn("h-full", !c.publicado && "opacity-60")}>
              <div className="flex h-full flex-col p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-0.5" aria-label={`${c.puntaje} de 5`}>
                    {Array.from({ length: 5 }, (_, k) => (
                      <Star
                        key={k}
                        className={k < c.puntaje ? "size-3.5 fill-ink text-ink" : "size-3.5 fill-linea text-linea"}
                        strokeWidth={0}
                        aria-hidden
                      />
                    ))}
                  </div>
                  {!c.publicado ? <Insignia tono="neutro">Oculto</Insignia> : null}
                </div>

                <blockquote className="mt-4 grow text-[0.9rem] leading-relaxed text-texto">
                  {c.texto || "Sin texto"}
                </blockquote>

                <div className="mt-5 border-t border-linea-suave pt-4">
                  <p className="text-[0.86rem] font-semibold text-ink">{c.autor || "Sin autor"}</p>
                  <p className="text-[0.78rem] text-texto-tenue">
                    {[c.procedencia, c.fecha, c.departamento].filter(Boolean).join(" · ")}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1">
                  <Boton
                    variante="fantasma"
                    medida="iconoSm"
                    aria-label={c.publicado ? "Ocultar" : "Publicar"}
                    onClick={() => guardarComentario({ ...c, publicado: !c.publicado })}
                  >
                    {c.publicado ? <Eye strokeWidth={1.7} /> : <EyeOff strokeWidth={1.7} />}
                  </Boton>
                  <Boton variante="contorno" medida="sm" className="ml-auto" onClick={() => setEditando(c)}>
                    <Pencil strokeWidth={1.6} /> Editar
                  </Boton>
                  <Boton
                    variante="fantasma"
                    medida="iconoSm"
                    aria-label="Eliminar comentario"
                    className="text-alerta hover:bg-alerta/10"
                    onClick={() => eliminarComentario(c.id)}
                  >
                    <Trash2 strokeWidth={1.6} />
                  </Boton>
                </div>
              </div>
            </Panel>
          </li>
        ))}
      </ul>

      <Modal
        abierto={Boolean(editando)}
        onCerrar={() => setEditando(null)}
        titulo={editando && comentarios.some((c) => c.id === editando.id) ? "Editar comentario" : "Nuevo comentario"}
        pie={
          <>
            <Boton variante="fantasma" medida="sm" onClick={() => setEditando(null)}>
              Cancelar
            </Boton>
            <Boton
              variante="principal"
              medida="sm"
              onClick={() => {
                if (editando?.texto.trim()) {
                  guardarComentario({
                    ...editando,
                    texto: normalizarEnlacesEnTexto(editando.texto.trim()),
                    procedencia: normalizarEnlacesEnTexto(editando.procedencia.trim()),
                  });
                }
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
              <Etiqueta htmlFor="c-texto">Comentario</Etiqueta>
              <AreaTexto id="c-texto" rows={5} value={editando.texto} onChange={(e) => setEditando({ ...editando, texto: e.target.value })} />
            </div>
            <div>
              <Etiqueta htmlFor="c-autor">Autor</Etiqueta>
              <Entrada id="c-autor" value={editando.autor} onChange={(e) => setEditando({ ...editando, autor: e.target.value })} placeholder="Marina D." />
            </div>
            <div>
              <Etiqueta htmlFor="c-proc">Procedencia</Etiqueta>
              <Entrada id="c-proc" value={editando.procedencia} onChange={(e) => setEditando({ ...editando, procedencia: e.target.value })} placeholder="Rosario" />
            </div>
            <div>
              <Etiqueta htmlFor="c-fecha">Fecha</Etiqueta>
              <Entrada id="c-fecha" value={editando.fecha} onChange={(e) => setEditando({ ...editando, fecha: e.target.value })} placeholder="Julio 2026" />
            </div>
            <div>
              <Etiqueta htmlFor="c-depto">Departamento</Etiqueta>
              <Entrada id="c-depto" value={editando.departamento} onChange={(e) => setEditando({ ...editando, departamento: e.target.value })} placeholder="La Fe I · Departamento 2" />
            </div>
            <div>
              <Etiqueta htmlFor="c-punt">Puntaje</Etiqueta>
              <Selector
                id="c-punt"
                value={editando.puntaje}
                onChange={(e) => setEditando({ ...editando, puntaje: Number(e.target.value) })}
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "estrella" : "estrellas"}
                  </option>
                ))}
              </Selector>
            </div>
            <label className="flex items-center gap-3 text-[0.88rem] text-texto sm:col-span-2">
              <input
                type="checkbox"
                checked={editando.publicado}
                onChange={(e) => setEditando({ ...editando, publicado: e.target.checked })}
                className="size-4 accent-[#b07d2b]"
              />
              Publicado en la web
            </label>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
