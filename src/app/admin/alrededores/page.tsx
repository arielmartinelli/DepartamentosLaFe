"use client";

import { ArrowLeftRight, ExternalLink, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { Foto } from "@/components/sitio/foto";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Entrada, Etiqueta } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { Modal } from "@/components/ui/modal";
import { useContenido } from "@/lib/contenido";
import { nuevoId } from "@/lib/repositorio";
import type { Lugar } from "@/lib/tipos";
import { cn } from "@/lib/utils";

export default function PaginaAlrededores() {
  const { lugares, guardarLugar, eliminarLugar, moverLugar } = useContenido();
  const [editando, setEditando] = useState<Lugar | null>(null);
  const lista = [...lugares].sort((a, b) => a.orden - b.orden);

  const vacio = (): Lugar => ({
    id: nuevoId("lug"),
    nombre: "",
    descripcion: "",
    distancia: "",
    categoria: "Naturaleza",
    foto: "",
    mapa: "",
    orden: lugares.length,
    activo: true,
  });

  return (
    <>
      <EncabezadoPagina
        titulo="Descubrí los alrededores"
        descripcion="Los lugares cercanos que se muestran en la portada y en cada ficha. Podés agregar todos los que quieras."
        acciones={
          <Boton variante="principal" medida="sm" onClick={() => setEditando(vacio())}>
            <Plus strokeWidth={2} /> Nuevo lugar
          </Boton>
        }
      />

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {lista.map((l, i) => (
          <li
            key={l.id}
            className={cn(
              "overflow-hidden rounded-xl border border-linea bg-white transition-shadow duration-200 hover:shadow-carta",
              !l.activo && "opacity-60",
            )}
          >
            <div className="relative">
              <Foto src={l.foto} alt={l.nombre} sizes="33vw" className="aspect-3/2 w-full" />
              <span className="absolute left-3 top-3 rounded-full bg-ink/70 px-2 py-0.5 text-[0.68rem] font-semibold tabular-nums text-white">
                {i + 1}
              </span>
              {!l.activo ? (
                <span className="absolute right-3 top-3">
                  <Insignia tono="blanco">Oculto</Insignia>
                </span>
              ) : null}
            </div>
            <div className="p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-sans text-[0.95rem] font-semibold text-ink">
                  {l.nombre || "Sin nombre"}
                </h2>
                <span className="shrink-0 text-[0.78rem] font-medium text-oro-oscuro">{l.distancia}</span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[0.85rem] leading-snug text-texto-suave">
                {l.descripcion}
              </p>
              {l.mapa ? (
                <a
                  href={l.mapa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-[0.78rem] text-texto-tenue hover:text-ink"
                >
                  Probar el enlace
                  <ExternalLink className="size-3.5" strokeWidth={1.7} aria-hidden />
                </a>
              ) : (
                <p className="mt-2 text-[0.78rem] text-aviso">Falta el enlace a Google Maps</p>
              )}

              <div className="mt-4 flex items-center gap-1">
                <Boton variante="fantasma" medida="iconoSm" aria-label="Mover antes" disabled={i === 0} onClick={() => moverLugar(l.id, -1)}>
                  <ArrowLeftRight className="rotate-180" strokeWidth={1.7} />
                </Boton>
                <Boton variante="fantasma" medida="iconoSm" aria-label="Mover después" disabled={i === lista.length - 1} onClick={() => moverLugar(l.id, 1)}>
                  <ArrowLeftRight strokeWidth={1.7} />
                </Boton>
                <Boton
                  variante="fantasma"
                  medida="iconoSm"
                  aria-label={l.activo ? "Ocultar" : "Mostrar"}
                  onClick={() => guardarLugar({ ...l, activo: !l.activo })}
                >
                  {l.activo ? <Eye strokeWidth={1.7} /> : <EyeOff strokeWidth={1.7} />}
                </Boton>
                <Boton variante="contorno" medida="sm" className="ml-auto" onClick={() => setEditando(l)}>
                  <Pencil strokeWidth={1.6} /> Editar
                </Boton>
                <Boton
                  variante="fantasma"
                  medida="iconoSm"
                  aria-label="Eliminar lugar"
                  className="text-alerta hover:bg-alerta/10"
                  onClick={() => eliminarLugar(l.id)}
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
        titulo={editando && lugares.some((l) => l.id === editando.id) ? "Editar lugar" : "Nuevo lugar"}
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
                  guardarLugar({
                    ...editando,
                    mapa:
                      editando.mapa.trim() ||
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${editando.nombre}, Ushuaia`)}`,
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
              <Etiqueta htmlFor="l-nombre">Nombre</Etiqueta>
              <Entrada id="l-nombre" value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} placeholder="Glaciar Martial" />
            </div>
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="l-foto">Imagen</Etiqueta>
              <Entrada id="l-foto" value={editando.foto} onChange={(e) => setEditando({ ...editando, foto: e.target.value })} placeholder="/media/glaciar.jpg" />
            </div>
            <div>
              <Etiqueta htmlFor="l-dist">Tiempo o distancia</Etiqueta>
              <Entrada id="l-dist" value={editando.distancia} onChange={(e) => setEditando({ ...editando, distancia: e.target.value })} placeholder="12 min en auto" />
            </div>
            <div>
              <Etiqueta htmlFor="l-cat">Categoría</Etiqueta>
              <Entrada id="l-cat" value={editando.categoria} onChange={(e) => setEditando({ ...editando, categoria: e.target.value })} placeholder="Naturaleza" />
            </div>
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="l-desc">Descripción</Etiqueta>
              <AreaTexto id="l-desc" rows={3} value={editando.descripcion} onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="l-mapa">Enlace a Google Maps</Etiqueta>
              <Entrada id="l-mapa" value={editando.mapa} onChange={(e) => setEditando({ ...editando, mapa: e.target.value })} placeholder="https://maps.google.com/…" />
              <p className="mt-1.5 text-[0.78rem] text-texto-tenue">
                Si lo dejás vacío, generamos una búsqueda con el nombre del lugar.
              </p>
            </div>
            <label className="flex items-center gap-3 text-[0.88rem] text-texto sm:col-span-2">
              <input
                type="checkbox"
                checked={editando.activo}
                onChange={(e) => setEditando({ ...editando, activo: e.target.checked })}
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
