"use client";

import { ArrowLeftRight, ImagePlus, Images, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { Panel, PanelCabecera } from "@/components/admin/tarjeta";
import { Foto } from "@/components/sitio/foto";
import { Boton } from "@/components/ui/boton";
import { Entrada, Etiqueta } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { Modal } from "@/components/ui/modal";
import { useContenido } from "@/lib/contenido";
import { nuevoId } from "@/lib/repositorio";
import type { SectorGaleria } from "@/lib/tipos";
import { cn } from "@/lib/utils";

const grupos = [
  { tipo: "edificio", titulo: "Edificios", detalle: "Se usan en la portada y en la presentación de cada edificio." },
  { tipo: "departamento", titulo: "Departamentos", detalle: "La primera imagen encabeza la ficha y las tarjetas." },
  { tipo: "actividades", titulo: "Actividades", detalle: "Fotos de “Qué hacer mientras estás acá”." },
  { tipo: "alrededores", titulo: "Alrededores", detalle: "Fotos de “Descubrí los alrededores”." },
] as const;

export default function PaginaGalerias() {
  const { galerias, guardarGaleria } = useContenido();
  const [abierta, setAbierta] = useState<string | null>(galerias[0]?.id ?? null);
  const [nueva, setNueva] = useState<{ galeria: string; src: string; titulo: string } | null>(null);

  const sector = galerias.find((g) => g.id === abierta);

  const actualizar = (g: SectorGaleria, imagenes: SectorGaleria["imagenes"]) =>
    guardarGaleria({ ...g, imagenes });

  const mover = (g: SectorGaleria, i: number, paso: -1 | 1) => {
    const j = i + paso;
    if (j < 0 || j >= g.imagenes.length) return;
    const copia = [...g.imagenes];
    [copia[i], copia[j]] = [copia[j], copia[i]];
    actualizar(g, copia);
  };

  return (
    <>
      <EncabezadoPagina
        titulo="Galerías"
        descripcion="Cada sector del sitio tiene su propia galería. Elegí una a la izquierda y administrá sus imágenes."
      />

      <div className="grid gap-4 lg:grid-cols-[19rem_minmax(0,1fr)]">
        <Panel className="h-max">
          <PanelCabecera titulo="Sectores" detalle={`${galerias.length} galerías`} />
          <div className="space-y-5 p-3 pt-4">
            {grupos.map((grupo) => {
              const suyas = galerias.filter((g) => g.tipo === grupo.tipo);
              if (!suyas.length) return null;
              return (
                <div key={grupo.tipo}>
                  <p className="px-3 pb-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-texto-tenue">
                    {grupo.titulo}
                  </p>
                  <ul className="space-y-0.5">
                    {suyas.map((g) => (
                      <li key={g.id}>
                        <button
                          type="button"
                          onClick={() => setAbierta(g.id)}
                          aria-pressed={abierta === g.id}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2 text-left text-[0.85rem] transition-colors duration-200",
                            abierta === g.id
                              ? "bg-ink font-medium text-white"
                              : "text-texto-suave hover:bg-hueso hover:text-ink",
                          )}
                        >
                          <span className="truncate">{g.nombre}</span>
                          <span
                            className={cn(
                              "shrink-0 text-[0.72rem] tabular-nums",
                              abierta === g.id ? "text-white/50" : "text-texto-tenue",
                            )}
                          >
                            {g.imagenes.length}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </Panel>

        {sector ? (
          <Panel>
            <PanelCabecera
              titulo={sector.nombre}
              detalle={sector.descripcion}
              accion={
                <Boton
                  variante="principal"
                  medida="sm"
                  onClick={() => setNueva({ galeria: sector.id, src: "", titulo: "" })}
                >
                  <ImagePlus strokeWidth={1.8} /> Agregar
                </Boton>
              }
            />

            {sector.imagenes.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Images className="mx-auto size-7 text-texto-tenue" strokeWidth={1.3} aria-hidden />
                <p className="mt-4 font-display text-lg text-ink">Galería vacía</p>
                <p className="mx-auto mt-2 max-w-sm text-[0.85rem] text-texto-suave">
                  Agregá la primera imagen de este sector.
                </p>
              </div>
            ) : (
              <ul className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                {sector.imagenes.map((img, i) => (
                  <li key={img.id} className="overflow-hidden rounded-lg border border-linea bg-white">
                    <div className="relative">
                      <Foto src={img.src} alt={img.titulo} sizes="33vw" className="aspect-4/3 w-full" />
                      {img.principal ? (
                        <span className="absolute left-2.5 top-2.5">
                          <Insignia tono="blanco">
                            <Star className="size-3" fill="currentColor" strokeWidth={0} aria-hidden />
                            Principal
                          </Insignia>
                        </span>
                      ) : null}
                      <span className="absolute right-2.5 top-2.5 rounded-full bg-ink/70 px-2 py-0.5 text-[0.68rem] font-semibold tabular-nums text-white">
                        {i + 1}
                      </span>
                    </div>
                    <div className="p-3">
                      <Entrada
                        aria-label="Título de la imagen"
                        value={img.titulo}
                        onChange={(e) =>
                          actualizar(
                            sector,
                            sector.imagenes.map((x) =>
                              x.id === img.id ? { ...x, titulo: e.target.value } : x,
                            ),
                          )
                        }
                        className="h-10 text-[0.82rem]"
                      />
                      <div className="mt-2 flex items-center gap-1">
                        <Boton variante="fantasma" medida="iconoSm" aria-label="Mover antes" disabled={i === 0} onClick={() => mover(sector, i, -1)}>
                          <ArrowLeftRight className="rotate-180" strokeWidth={1.7} />
                        </Boton>
                        <Boton variante="fantasma" medida="iconoSm" aria-label="Mover después" disabled={i === sector.imagenes.length - 1} onClick={() => mover(sector, i, 1)}>
                          <ArrowLeftRight strokeWidth={1.7} />
                        </Boton>
                        <Boton
                          variante="fantasma"
                          medida="iconoSm"
                          aria-label="Marcar como principal"
                          className={img.principal ? "text-oro" : ""}
                          onClick={() =>
                            actualizar(
                              sector,
                              sector.imagenes.map((x) => ({ ...x, principal: x.id === img.id })),
                            )
                          }
                        >
                          <Star strokeWidth={1.7} fill={img.principal ? "currentColor" : "none"} />
                        </Boton>
                        <Boton
                          variante="fantasma"
                          medida="iconoSm"
                          aria-label="Eliminar imagen"
                          className="ml-auto text-alerta hover:bg-alerta/10"
                          onClick={() => actualizar(sector, sector.imagenes.filter((x) => x.id !== img.id))}
                        >
                          <Trash2 strokeWidth={1.6} />
                        </Boton>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {sector.tipo === "departamento" ? (
              <p className="border-t border-linea px-5 py-4 text-[0.8rem] leading-relaxed text-texto-suave sm:px-6">
                Los cambios de esta galería se publican en la ficha del departamento.
              </p>
            ) : null}
          </Panel>
        ) : null}
      </div>

      <Modal
        abierto={Boolean(nueva)}
        onCerrar={() => setNueva(null)}
        titulo="Agregar imagen"
        descripcion="Pegá la dirección de la imagen. Al conectar el almacenamiento, este campo pasa a ser una subida de archivos."
        pie={
          <>
            <Boton variante="fantasma" medida="sm" onClick={() => setNueva(null)}>
              Cancelar
            </Boton>
            <Boton
              variante="principal"
              medida="sm"
              onClick={() => {
                const g = galerias.find((x) => x.id === nueva?.galeria);
                if (g && nueva?.src.trim()) {
                  guardarGaleria({
                    ...g,
                    imagenes: [
                      ...g.imagenes,
                      {
                        id: nuevoId("img"),
                        src: nueva.src.trim(),
                        titulo: nueva.titulo.trim() || "Sin título",
                        principal: g.imagenes.length === 0,
                      },
                    ],
                  });
                }
                setNueva(null);
              }}
            >
              Agregar
            </Boton>
          </>
        }
      >
        {nueva ? (
          <div className="space-y-4">
            <div>
              <Etiqueta htmlFor="g-src">Dirección de la imagen</Etiqueta>
              <Entrada
                id="g-src"
                value={nueva.src}
                onChange={(e) => setNueva({ ...nueva, src: e.target.value })}
                placeholder="/media/living-1.jpg"
              />
            </div>
            <div>
              <Etiqueta htmlFor="g-titulo">Título</Etiqueta>
              <Entrada
                id="g-titulo"
                value={nueva.titulo}
                onChange={(e) => setNueva({ ...nueva, titulo: e.target.value })}
                placeholder="Living con salamandra"
              />
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
