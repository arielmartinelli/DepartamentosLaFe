"use client";

import {
  ArrowLeftRight,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { Panel, PanelCabecera } from "@/components/admin/tarjeta";
import { ZonaSubida } from "@/components/admin/zona-subida";
import { Foto } from "@/components/sitio/foto";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Entrada, Etiqueta } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { Modal } from "@/components/ui/modal";
import { useContenido } from "@/lib/contenido";
import { nuevoId } from "@/lib/repositorio";
import type { Actividad } from "@/lib/tipos";
import { cn, normalizarUrl } from "@/lib/utils";

export default function PaginaQueHacer() {
  const { actividades, ajustes, guardarActividad, eliminarActividad, moverActividad, guardarAjustes } =
    useContenido();
  const [guia, setGuia] = useState({ ruta: ajustes.guia, fecha: ajustes.guiaActualizada });
  const [guiaGuardada, setGuiaGuardada] = useState(false);
  const [editando, setEditando] = useState<Actividad | null>(null);
  const lista = [...actividades].sort((a, b) => a.orden - b.orden);
  const visibles = lista.filter((a) => a.activa).length;

  const vacia = (): Actividad => ({
    id: nuevoId("qh"),
    titulo: "",
    descripcion: "",
    categoria: "Excursión",
    duracion: "",
    distancia: "",
    temporada: "Todo el año",
    foto: "",
    mapa: "",
    orden: actividades.length,
    activa: true,
  });

  return (
    <>
      <EncabezadoPagina
        titulo="Qué hacer"
        descripcion="Excursiones y lugares cercanos en una sola lista. Es la sección que se muestra en la portada y en cada ficha de departamento."
        acciones={
          <Boton variante="principal" medida="sm" onClick={() => setEditando(vacia())}>
            <Plus strokeWidth={2} /> Agregar
          </Boton>
        }
      />

      {/* Guía descargable */}
      <Panel className="mb-6">
        <PanelCabecera
          titulo="Guía completa en PDF"
          detalle="Es el archivo que se descarga con el botón “Descargar guía completa” de la web."
          accion={
            ajustes.guia ? (
              <Boton asChild variante="contorno" medida="sm">
                <a href={ajustes.guia} target="_blank" rel="noopener noreferrer">
                  <Download strokeWidth={1.7} /> Ver la actual
                </a>
              </Boton>
            ) : null
          }
        />
        <div className="grid gap-4 p-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] sm:items-end sm:p-6">
          <div>
            <Etiqueta htmlFor="g-ruta">Archivo</Etiqueta>
            <Entrada
              id="g-ruta"
              value={guia.ruta}
              onChange={(e) => {
                setGuia({ ...guia, ruta: e.target.value });
                setGuiaGuardada(false);
              }}
              placeholder="/guias/que-hacer-en-ushuaia.pdf"
            />
          </div>
          <div>
            <Etiqueta htmlFor="g-fecha">Última actualización</Etiqueta>
            <Entrada
              id="g-fecha"
              value={guia.fecha}
              onChange={(e) => {
                setGuia({ ...guia, fecha: e.target.value });
                setGuiaGuardada(false);
              }}
              placeholder="4 de agosto de 2026"
            />
          </div>
          <Boton
            variante="principal"
            medida="md"
            onClick={() => {
              guardarAjustes({ guia: guia.ruta.trim(), guiaActualizada: guia.fecha.trim() });
              setGuiaGuardada(true);
            }}
          >
            {guiaGuardada ? "Guardado" : "Guardar"}
          </Boton>

          <p className="flex items-start gap-2.5 rounded-md bg-hueso p-4 text-[0.82rem] leading-relaxed text-texto-suave sm:col-span-3">
            <FileText className="mt-0.5 size-4 shrink-0 text-texto-tenue" strokeWidth={1.6} aria-hidden />
            <span>
              Para publicar una guía nueva, copiá el PDF en la carpeta{" "}
              <code className="rounded-xs bg-white px-1.5 py-0.5 text-[0.78rem]">public/guias/</code>{" "}
              y escribí acá su nombre, o pegá un enlace completo si la tenés en Drive. Al
              conectar el almacenamiento, este campo pasa a ser una subida de archivos.
            </span>
          </p>
        </div>
      </Panel>

      <p className="mb-5 text-[0.85rem] text-texto-suave">
        {visibles} {visibles === 1 ? "visible" : "visibles"} de {lista.length} · el orden de
        esta lista es el orden del carrusel en la web.
        {visibles > 9 ? (
          <span className="ml-1 font-medium text-aviso">
            En la web se muestran las primeras nueve; el resto queda guardado acá.
          </span>
        ) : null}
      </p>

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
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-oro-oscuro">
                {a.categoria || "Sin categoría"}
              </p>
              <h2 className="mt-1 font-sans text-[0.95rem] font-semibold text-ink">
                {a.titulo || "Sin título"}
              </h2>
              <p className="mt-1.5 line-clamp-2 text-[0.85rem] leading-snug text-texto-suave">
                {a.descripcion}
              </p>
              <p className="mt-2 text-[0.78rem] text-texto-tenue">
                {[a.duracion, a.distancia, a.temporada].filter(Boolean).join(" · ")}
              </p>

              {a.mapa ? (
                <a
                  href={a.mapa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-[0.78rem] text-texto-tenue hover:text-ink"
                >
                  Probar el enlace
                  <ExternalLink className="size-3.5" strokeWidth={1.7} aria-hidden />
                </a>
              ) : (
                <p className="mt-2 text-[0.78rem] text-aviso">Sin enlace a Google Maps</p>
              )}

              <div className="mt-4 flex items-center gap-1">
                <Boton
                  variante="fantasma"
                  medida="iconoSm"
                  aria-label="Mover antes"
                  disabled={i === 0}
                  onClick={() => moverActividad(a.id, -1)}
                >
                  <ArrowLeftRight className="rotate-180" strokeWidth={1.7} />
                </Boton>
                <Boton
                  variante="fantasma"
                  medida="iconoSm"
                  aria-label="Mover después"
                  disabled={i === lista.length - 1}
                  onClick={() => moverActividad(a.id, 1)}
                >
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
                  aria-label="Eliminar"
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
        titulo={editando && actividades.some((a) => a.id === editando.id) ? "Editar" : "Agregar a Qué hacer"}
        descripcion="Sirve tanto para una excursión como para un lugar cercano: completá la duración, la distancia o las dos."
        pie={
          <>
            <Boton variante="fantasma" medida="sm" onClick={() => setEditando(null)}>
              Cancelar
            </Boton>
            <Boton
              variante="principal"
              medida="sm"
              onClick={() => {
                if (editando?.titulo.trim()) {
                  guardarActividad({
                    ...editando,
                    mapa:
                      normalizarUrl(editando.mapa.trim()) ||
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${editando.titulo}, Ushuaia`)}`,
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
              <Etiqueta htmlFor="q-titulo">Título</Etiqueta>
              <Entrada
                id="q-titulo"
                value={editando.titulo}
                onChange={(e) => setEditando({ ...editando, titulo: e.target.value })}
                placeholder="Navegación por el Canal Beagle"
              />
            </div>
            <div className="sm:col-span-2">
              <ZonaSubida
                compacta
                etiqueta="Imagen"
                onListo={([ref]) => setEditando({ ...editando, foto: ref })}
                ayuda="O pegá una ruta o un enlace en el campo de abajo."
              />
              <Entrada
                id="q-foto"
                className="mt-2"
                value={editando.foto}
                onChange={(e) => setEditando({ ...editando, foto: e.target.value })}
                placeholder="/media/canal-beagle.jpg"
                aria-label="Ruta o enlace de la imagen"
              />
            </div>
            <div>
              <Etiqueta htmlFor="q-cat">Categoría</Etiqueta>
              <Entrada
                id="q-cat"
                value={editando.categoria}
                onChange={(e) => setEditando({ ...editando, categoria: e.target.value })}
                placeholder="Excursión, Naturaleza, Ciudad…"
              />
            </div>
            <div>
              <Etiqueta htmlFor="q-temp">Temporada</Etiqueta>
              <Entrada
                id="q-temp"
                value={editando.temporada}
                onChange={(e) => setEditando({ ...editando, temporada: e.target.value })}
                placeholder="Todo el año"
              />
            </div>
            <div>
              <Etiqueta htmlFor="q-dur">Duración</Etiqueta>
              <Entrada
                id="q-dur"
                value={editando.duracion}
                onChange={(e) => setEditando({ ...editando, duracion: e.target.value })}
                placeholder="4 horas"
              />
            </div>
            <div>
              <Etiqueta htmlFor="q-dist">Distancia</Etiqueta>
              <Entrada
                id="q-dist"
                value={editando.distancia}
                onChange={(e) => setEditando({ ...editando, distancia: e.target.value })}
                placeholder="15 min en auto"
              />
            </div>
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="q-desc">Descripción</Etiqueta>
              <AreaTexto
                id="q-desc"
                rows={4}
                value={editando.descripcion}
                onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="q-mapa">Enlace a Google Maps</Etiqueta>
              <Entrada
                id="q-mapa"
                value={editando.mapa}
                onChange={(e) => setEditando({ ...editando, mapa: e.target.value })}
                placeholder="https://maps.google.com/…"
              />
              <p className="mt-1.5 text-[0.78rem] text-texto-tenue">
                Si lo dejás vacío, generamos una búsqueda con el título del lugar.
              </p>
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
