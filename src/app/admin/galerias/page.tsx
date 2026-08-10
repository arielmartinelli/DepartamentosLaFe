"use client";

import { ArrowLeftRight, Check, Images, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { Panel, PanelCabecera } from "@/components/admin/tarjeta";
import { ZonaSubida } from "@/components/admin/zona-subida";
import { Foto } from "@/components/sitio/foto";
import { Boton } from "@/components/ui/boton";
import { Entrada } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { useContenido } from "@/lib/contenido";
import { nuevoId } from "@/lib/repositorio";
import type { ImagenSector, SectorGaleria } from "@/lib/tipos";

export default function PaginaGalerias() {
  const { galerias, guardarGaleria } = useContenido();

  /** Los cambios se acumulan acá hasta que se toca Guardar. */
  const [borradores, setBorradores] = useState<Record<string, SectorGaleria>>({});
  const [guardadas, setGuardadas] = useState<string[]>([]);

  const versionDe = (g: SectorGaleria) => borradores[g.id] ?? g;
  const hayCambios = (g: SectorGaleria) => Boolean(borradores[g.id]);

  const editar = (g: SectorGaleria, imagenes: ImagenSector[]) => {
    setBorradores((b) => ({ ...b, [g.id]: { ...versionDe(g), imagenes } }));
    setGuardadas((v) => v.filter((id) => id !== g.id));
  };

  const olvidar = (id: string) =>
    setBorradores((b) => {
      const copia = { ...b };
      delete copia[id];
      return copia;
    });

  const guardar = (g: SectorGaleria) => {
    const borrador = borradores[g.id];
    if (!borrador) return;
    guardarGaleria(borrador);
    olvidar(g.id);
    setGuardadas((v) => [...v, g.id]);
  };

  const descartar = (g: SectorGaleria) => olvidar(g.id);

  const mover = (g: SectorGaleria, i: number, paso: -1 | 1) => {
    const actual = versionDe(g);
    const j = i + paso;
    if (j < 0 || j >= actual.imagenes.length) return;
    const copia = [...actual.imagenes];
    [copia[i], copia[j]] = [copia[j], copia[i]];
    editar(g, copia);
  };

  return (
    <>
      <EncabezadoPagina
        titulo="Galerías"
        descripcion="Las fotos de la portada: las que acompañan a cada edificio y la de la sección de servicios. Las fotos de cada departamento se editan en su propio editor."
      />

      <div className="space-y-4">
        {galerias.map((original) => {
          const g = versionDe(original);
          const sinGuardar = hayCambios(original);

          return (
            <Panel key={g.id}>
              <PanelCabecera
                titulo={g.nombre}
                detalle={g.descripcion}
                accion={
                  <div className="flex items-center gap-2">
                    {sinGuardar ? (
                      <>
                        <Insignia tono="aviso">Sin guardar</Insignia>
                        <Boton
                          variante="fantasma"
                          medida="sm"
                          onClick={() => descartar(original)}
                        >
                          Descartar
                        </Boton>
                      </>
                    ) : null}
                    <Boton
                      variante="principal"
                      medida="sm"
                      disabled={!sinGuardar}
                      onClick={() => guardar(original)}
                    >
                      {!sinGuardar && guardadas.includes(g.id) ? (
                        <Check strokeWidth={2.2} />
                      ) : null}
                      {!sinGuardar && guardadas.includes(g.id) ? "Guardado" : "Guardar"}
                    </Boton>
                  </div>
                }
              />

              <div className="px-5 pt-5 sm:px-6 sm:pt-6">
                <ZonaSubida
                  multiple={g.tipo === "edificio"}
                  onListo={(refs) =>
                    editar(original, [
                      ...g.imagenes,
                      ...refs.map((src, i) => ({
                        id: nuevoId("img"),
                        src,
                        titulo: "Sin título",
                        principal: g.imagenes.length === 0 && i === 0,
                      })),
                    ])
                  }
                  ayuda={
                    g.tipo === "edificio"
                      ? "La marcada como principal es la foto grande del bloque; la siguiente va al costado."
                      : "Se usa la marcada como principal. Conviene una foto vertical."
                  }
                />
              </div>

              {g.imagenes.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Images className="mx-auto size-6 text-texto-tenue" strokeWidth={1.3} aria-hidden />
                  <p className="mt-3 text-[0.88rem] text-texto-suave">
                    Todavía no hay fotos en este sector.
                  </p>
                </div>
              ) : (
                <ul className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
                  {g.imagenes.map((img, i) => (
                    <li key={img.id} className="overflow-hidden rounded-lg border border-linea bg-white">
                      <div className="relative">
                        <Foto src={img.src} alt={img.titulo} sizes="25vw" className="aspect-4/3 w-full" />
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
                            editar(
                              original,
                              g.imagenes.map((x) =>
                                x.id === img.id ? { ...x, titulo: e.target.value } : x,
                              ),
                            )
                          }
                          className="h-10 text-[0.82rem]"
                        />
                        <div className="mt-2 flex items-center gap-1">
                          <Boton
                            variante="fantasma"
                            medida="iconoSm"
                            aria-label="Mover antes"
                            disabled={i === 0}
                            onClick={() => mover(original, i, -1)}
                          >
                            <ArrowLeftRight className="rotate-180" strokeWidth={1.7} />
                          </Boton>
                          <Boton
                            variante="fantasma"
                            medida="iconoSm"
                            aria-label="Mover después"
                            disabled={i === g.imagenes.length - 1}
                            onClick={() => mover(original, i, 1)}
                          >
                            <ArrowLeftRight strokeWidth={1.7} />
                          </Boton>
                          <Boton
                            variante="fantasma"
                            medida="iconoSm"
                            aria-label="Marcar como principal"
                            className={img.principal ? "text-oro" : ""}
                            onClick={() =>
                              editar(
                                original,
                                g.imagenes.map((x) => ({ ...x, principal: x.id === img.id })),
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
                            onClick={() =>
                              editar(original, g.imagenes.filter((x) => x.id !== img.id))
                            }
                          >
                            <Trash2 strokeWidth={1.6} />
                          </Boton>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          );
        })}
      </div>

      <p className="mt-6 rounded-md bg-white px-5 py-4 text-[0.85rem] leading-relaxed text-texto-suave ring-1 ring-linea">
        Las fotos de cada departamento se administran desde{" "}
        <span className="font-medium text-ink">Departamentos → Editar → Galería</span>, junto
        al resto de sus datos.
      </p>
    </>
  );
}
