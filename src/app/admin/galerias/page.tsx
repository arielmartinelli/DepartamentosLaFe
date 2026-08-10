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
import type { Actividad, ImagenSector, SectorGaleria } from "@/lib/tipos";

/** Sólo se usan las dos primeras fotos del bloque de cada edificio. */
const TOPE_EDIFICIO = 2;

export default function PaginaGalerias() {
  const { galerias, actividades, guardarGaleria, guardarActividad } = useContenido();

  const [borradores, setBorradores] = useState<Record<string, SectorGaleria>>({});
  const [guardadas, setGuardadas] = useState<string[]>([]);
  const [fotosActividad, setFotosActividad] = useState<Record<string, string>>({});
  const [actividadesGuardadas, setActividadesGuardadas] = useState(false);

  const versionDe = (g: SectorGaleria) => borradores[g.id] ?? g;
  const hayCambios = (g: SectorGaleria) => Boolean(borradores[g.id]);

  const olvidar = (id: string) =>
    setBorradores((b) => {
      const copia = { ...b };
      delete copia[id];
      return copia;
    });

  const editar = (g: SectorGaleria, imagenes: ImagenSector[]) => {
    setBorradores((b) => ({ ...b, [g.id]: { ...versionDe(g), imagenes } }));
    setGuardadas((v) => v.filter((id) => id !== g.id));
  };

  const guardar = (g: SectorGaleria) => {
    const borrador = borradores[g.id];
    if (!borrador) return;
    guardarGaleria(borrador);
    olvidar(g.id);
    setGuardadas((v) => [...v, g.id]);
  };

  const mover = (g: SectorGaleria, i: number, paso: -1 | 1) => {
    const actual = versionDe(g);
    const j = i + paso;
    if (j < 0 || j >= actual.imagenes.length) return;
    const copia = [...actual.imagenes];
    [copia[i], copia[j]] = [copia[j], copia[i]];
    editar(g, copia);
  };

  /* ── Qué hacer: una foto por actividad ───────────────────────────── */

  const lista = [...actividades].sort((a, b) => a.orden - b.orden);
  const pendientesActividad = Object.keys(fotosActividad).length;

  const guardarFotosActividad = () => {
    lista.forEach((a) => {
      const nueva = fotosActividad[a.id];
      if (nueva) guardarActividad({ ...a, foto: nueva });
    });
    setFotosActividad({});
    setActividadesGuardadas(true);
  };

  const fotoDe = (a: Actividad) => fotosActividad[a.id] ?? a.foto;

  return (
    <>
      <EncabezadoPagina
        titulo="Galerías"
        descripcion="Las fotos de la portada: los títulos de cada edificio, las actividades y la sección de servicios."
      />

      <div className="space-y-4">
        {galerias.map((original) => {
          const g = versionDe(original);
          const sinGuardar = hayCambios(original);
          const esEdificio = g.tipo === "edificio";
          const lleno = esEdificio && g.imagenes.length >= TOPE_EDIFICIO;

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
                        <Boton variante="fantasma" medida="sm" onClick={() => olvidar(g.id)}>
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
                      {!sinGuardar && guardadas.includes(g.id) ? <Check strokeWidth={2.2} /> : null}
                      {!sinGuardar && guardadas.includes(g.id) ? "Guardado" : "Guardar"}
                    </Boton>
                  </div>
                }
              />

              {lleno ? (
                <p className="px-5 pt-5 text-[0.82rem] text-texto-suave sm:px-6 sm:pt-6">
                  Ya están las dos fotos que usa el bloque. Para cambiar una, eliminala y
                  subí la nueva.
                </p>
              ) : (
                <div className="px-5 pt-5 sm:px-6 sm:pt-6">
                  <ZonaSubida
                    multiple={esEdificio}
                    onListo={(refs) =>
                      editar(original, [
                        ...g.imagenes,
                        ...refs
                          .slice(0, esEdificio ? TOPE_EDIFICIO - g.imagenes.length : 1)
                          .map((src, i) => ({
                            id: nuevoId("img"),
                            src,
                            titulo: g.imagenes.length + i === 0 ? "Foto grande" : "Foto del costado",
                            principal: g.imagenes.length === 0 && i === 0,
                          })),
                      ])
                    }
                    ayuda={
                      esEdificio
                        ? "La marcada como principal es la foto grande; la otra va al costado."
                        : "Conviene una foto vertical. Se usa la marcada como principal."
                    }
                  />
                </div>
              )}

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

        {/* Qué hacer: se cambia la foto de cada actividad, no la lista */}
        <Panel>
          <PanelCabecera
            titulo="Qué hacer mientras estás acá"
            detalle="Una foto por actividad. Los textos y el orden se editan en Qué hacer."
            accion={
              <div className="flex items-center gap-2">
                {pendientesActividad ? (
                  <>
                    <Insignia tono="aviso">Sin guardar</Insignia>
                    <Boton variante="fantasma" medida="sm" onClick={() => setFotosActividad({})}>
                      Descartar
                    </Boton>
                  </>
                ) : null}
                <Boton
                  variante="principal"
                  medida="sm"
                  disabled={!pendientesActividad}
                  onClick={guardarFotosActividad}
                >
                  {!pendientesActividad && actividadesGuardadas ? <Check strokeWidth={2.2} /> : null}
                  {!pendientesActividad && actividadesGuardadas ? "Guardado" : "Guardar"}
                </Boton>
              </div>
            }
          />

          <ul className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
            {lista.map((a) => (
              <li key={a.id} className="overflow-hidden rounded-lg border border-linea bg-white">
                <Foto src={fotoDe(a)} alt={a.titulo} sizes="33vw" className="aspect-16/10 w-full" />
                <div className="p-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-oro-oscuro">
                    {a.categoria}
                  </p>
                  <p className="mt-1 text-[0.9rem] font-semibold text-ink">{a.titulo}</p>
                  {fotosActividad[a.id] ? (
                    <p className="mt-1 text-[0.76rem] text-aviso">Foto nueva sin guardar</p>
                  ) : null}
                  <ZonaSubida
                    compacta
                    className="mt-3"
                    onListo={([ref]) => {
                      setFotosActividad((f) => ({ ...f, [a.id]: ref }));
                      setActividadesGuardadas(false);
                    }}
                    ayuda="Reemplaza la foto de esta actividad."
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <p className="mt-6 rounded-md bg-white px-5 py-4 text-[0.85rem] leading-relaxed text-texto-suave ring-1 ring-linea">
        Las fotos de cada departamento no se tocan acá: se administran desde{" "}
        <span className="font-medium text-ink">Departamentos → Editar → Galería</span>, junto
        al resto de sus datos.
      </p>
    </>
  );
}
