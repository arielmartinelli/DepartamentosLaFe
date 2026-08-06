"use client";

import { ArrowLeftRight, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { Panel, PanelCabecera } from "@/components/admin/tarjeta";
import { iconos } from "@/components/sitio/iconos-servicio";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Entrada, Etiqueta, Selector } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { Modal } from "@/components/ui/modal";
import { useContenido } from "@/lib/contenido";
import type { Prestacion } from "@/lib/tipos";
import { cn, slugificar } from "@/lib/utils";

export default function PaginaServicios() {
  const { prestaciones, guardarPrestacion, eliminarPrestacion, moverPrestacion } = useContenido();
  const [editando, setEditando] = useState<Prestacion | null>(null);
  const lista = [...prestaciones].sort((a, b) => a.orden - b.orden);

  const vacio = (): Prestacion => ({
    id: "",
    nombre: "",
    descripcion: "",
    icono: "wifi",
    foto: null,
    orden: prestaciones.length,
    activo: true,
    destacadoEnHome: true,
  });

  return (
    <>
      <EncabezadoPagina
        titulo="Servicios"
        descripcion="El catálogo de “Todo lo que vas a necesitar”. Cada departamento elige cuáles ofrece desde su propio editor."
        acciones={
          <Boton variante="principal" medida="sm" onClick={() => setEditando(vacio())}>
            <Plus strokeWidth={2} /> Nuevo servicio
          </Boton>
        }
      />

      <Panel>
        <PanelCabecera
          titulo="Catálogo"
          detalle={`${lista.filter((s) => s.destacadoEnHome && s.activo).length} se muestran en la portada`}
        />
        <ul className="divide-y divide-linea-suave">
          {lista.map((s, i) => {
            const Icono = iconos[s.icono];
            return (
              <li
                key={s.id}
                className={cn("flex flex-wrap items-center gap-4 px-5 py-4 sm:px-6", !s.activo && "opacity-60")}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-oro/20 bg-oro-vidrio/60 text-oro-oscuro">
                  {Icono ? <Icono className="size-[1.1rem]" strokeWidth={1.5} aria-hidden /> : null}
                </span>

                <div className="min-w-0 grow">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-sans text-[0.92rem] font-semibold text-ink">
                      {s.nombre || "Sin nombre"}
                    </h2>
                    {s.destacadoEnHome ? <Insignia tono="oro">En la portada</Insignia> : null}
                    {!s.activo ? <Insignia tono="neutro">Oculto</Insignia> : null}
                  </div>
                  <p className="mt-1 text-[0.83rem] leading-snug text-texto-suave">{s.descripcion}</p>
                </div>

                <div className="flex items-center gap-1">
                  <Boton variante="fantasma" medida="iconoSm" aria-label="Mover antes" disabled={i === 0} onClick={() => moverPrestacion(s.id, -1)}>
                    <ArrowLeftRight className="rotate-180" strokeWidth={1.7} />
                  </Boton>
                  <Boton variante="fantasma" medida="iconoSm" aria-label="Mover después" disabled={i === lista.length - 1} onClick={() => moverPrestacion(s.id, 1)}>
                    <ArrowLeftRight strokeWidth={1.7} />
                  </Boton>
                  <Boton
                    variante="fantasma"
                    medida="iconoSm"
                    aria-label={s.activo ? "Ocultar" : "Mostrar"}
                    onClick={() => guardarPrestacion({ ...s, activo: !s.activo })}
                  >
                    {s.activo ? <Eye strokeWidth={1.7} /> : <EyeOff strokeWidth={1.7} />}
                  </Boton>
                  <Boton variante="contorno" medida="sm" onClick={() => setEditando(s)}>
                    <Pencil strokeWidth={1.6} /> Editar
                  </Boton>
                  <Boton
                    variante="fantasma"
                    medida="iconoSm"
                    aria-label="Eliminar servicio"
                    className="text-alerta hover:bg-alerta/10"
                    onClick={() => eliminarPrestacion(s.id)}
                  >
                    <Trash2 strokeWidth={1.6} />
                  </Boton>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Modal
        abierto={Boolean(editando)}
        onCerrar={() => setEditando(null)}
        titulo={editando?.id ? "Editar servicio" : "Nuevo servicio"}
        pie={
          <>
            <Boton variante="fantasma" medida="sm" onClick={() => setEditando(null)}>
              Cancelar
            </Boton>
            <Boton
              variante="principal"
              medida="sm"
              onClick={() => {
                if (editando?.nombre.trim()) {
                  guardarPrestacion({ ...editando, id: editando.id || slugificar(editando.nombre) });
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
          <div className="space-y-4">
            <div>
              <Etiqueta htmlFor="s-nombre">Nombre</Etiqueta>
              <Entrada id="s-nombre" value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} placeholder="Parrilla cubierta" />
            </div>
            <div>
              <Etiqueta htmlFor="s-desc">Descripción</Etiqueta>
              <AreaTexto id="s-desc" rows={3} value={editando.descripcion} onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })} />
            </div>
            <div>
              <Etiqueta htmlFor="s-icono">Ícono</Etiqueta>
              <Selector id="s-icono" value={editando.icono} onChange={(e) => setEditando({ ...editando, icono: e.target.value })}>
                {Object.keys(iconos).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </Selector>
            </div>
            <div>
              <Etiqueta htmlFor="s-foto">Fotografía (opcional)</Etiqueta>
              <Entrada
                id="s-foto"
                value={editando.foto ?? ""}
                onChange={(e) => setEditando({ ...editando, foto: e.target.value || null })}
                placeholder="/media/parrilla.jpg"
              />
            </div>
            <div className="space-y-2.5 rounded-md bg-hueso p-4">
              <label className="flex items-center gap-3 text-[0.88rem] text-texto">
                <input
                  type="checkbox"
                  checked={editando.activo}
                  onChange={(e) => setEditando({ ...editando, activo: e.target.checked })}
                  className="size-4 accent-[#b07d2b]"
                />
                Disponible para asignar a departamentos
              </label>
              <label className="flex items-center gap-3 text-[0.88rem] text-texto">
                <input
                  type="checkbox"
                  checked={editando.destacadoEnHome}
                  onChange={(e) => setEditando({ ...editando, destacadoEnHome: e.target.checked })}
                  className="size-4 accent-[#b07d2b]"
                />
                Mostrar en “Todo lo que vas a necesitar”
              </label>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
