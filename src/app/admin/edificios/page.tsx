"use client";

import { Check, ExternalLink, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { Panel, PanelCabecera } from "@/components/admin/tarjeta";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Entrada, Etiqueta } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { useContenido } from "@/lib/contenido";
import type { Edificio } from "@/lib/tipos";

export default function PaginaEdificios() {
  const { edificios, departamentos, guardarEdificio } = useContenido();

  const [borradores, setBorradores] = useState<Record<string, Edificio>>({});
  const [guardados, setGuardados] = useState<string[]>([]);

  const version = (e: Edificio) => borradores[e.id] ?? e;
  const cambiado = (e: Edificio) => Boolean(borradores[e.id]);

  const editar = (e: Edificio, cambios: Partial<Edificio>) => {
    setBorradores((b) => ({ ...b, [e.id]: { ...version(e), ...cambios } }));
    setGuardados((v) => v.filter((id) => id !== e.id));
  };

  const olvidar = (id: string) =>
    setBorradores((b) => {
      const copia = { ...b };
      delete copia[id];
      return copia;
    });

  const guardar = (e: Edificio) => {
    const borrador = borradores[e.id];
    if (!borrador) return;
    guardarEdificio(borrador);
    olvidar(e.id);
    setGuardados((v) => [...v, e.id]);
  };

  return (
    <>
      <EncabezadoPagina
        titulo="Edificios"
        descripcion="Los textos, la dirección y el mapa de La Fe I y La Fe II, tal como se ven en la portada."
      />

      <div className="space-y-4">
        {edificios.map((original) => {
          const ed = version(original);
          const sinGuardar = cambiado(original);
          const unidades = departamentos.filter((d) => d.edificioId === ed.id).length;

          return (
            <Panel key={ed.id}>
              <PanelCabecera
                titulo={ed.nombre || "Sin nombre"}
                detalle={`${unidades} ${unidades === 1 ? "departamento" : "departamentos"}`}
                accion={
                  <div className="flex items-center gap-2">
                    {sinGuardar ? (
                      <>
                        <Insignia tono="aviso">Sin guardar</Insignia>
                        <Boton variante="fantasma" medida="sm" onClick={() => olvidar(ed.id)}>
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
                      {!sinGuardar && guardados.includes(ed.id) ? <Check strokeWidth={2.2} /> : null}
                      {!sinGuardar && guardados.includes(ed.id) ? "Guardado" : "Guardar"}
                    </Boton>
                  </div>
                }
              />

              <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
                {/* Textos */}
                <div className="space-y-4">
                  <div>
                    <Etiqueta htmlFor={`n-${ed.id}`}>Nombre</Etiqueta>
                    <Entrada
                      id={`n-${ed.id}`}
                      value={ed.nombre}
                      onChange={(e) => editar(original, { nombre: e.target.value })}
                      placeholder="La Fe I"
                    />
                    <p className="mt-1.5 text-[0.78rem] text-texto-tenue">
                      En la portada se muestra como “Departamentos {ed.nombre || "…"}”.
                    </p>
                  </div>

                  <div>
                    <Etiqueta htmlFor={`t-${ed.id}`}>Título del bloque</Etiqueta>
                    <Entrada
                      id={`t-${ed.id}`}
                      value={ed.titular}
                      onChange={(e) => editar(original, { titular: e.target.value })}
                    />
                  </div>

                  <div>
                    <Etiqueta htmlFor={`b-${ed.id}`}>Bajada</Etiqueta>
                    <AreaTexto
                      id={`b-${ed.id}`}
                      rows={3}
                      value={ed.bajada}
                      onChange={(e) => editar(original, { bajada: e.target.value })}
                    />
                  </div>

                  <div>
                    <Etiqueta htmlFor={`d-${ed.id}`}>Descripción larga</Etiqueta>
                    <AreaTexto
                      id={`d-${ed.id}`}
                      rows={5}
                      value={ed.descripcion}
                      onChange={(e) => editar(original, { descripcion: e.target.value })}
                    />
                  </div>
                </div>

                {/* Ubicación y rasgos */}
                <div className="space-y-4">
                  <div>
                    <Etiqueta htmlFor={`dir-${ed.id}`}>Dirección</Etiqueta>
                    <Entrada
                      id={`dir-${ed.id}`}
                      value={ed.direccion}
                      onChange={(e) => editar(original, { direccion: e.target.value })}
                      placeholder="Ushuaia 1589, Ushuaia"
                    />
                  </div>

                  <div>
                    <Etiqueta htmlFor={`ap-${ed.id}`}>Referencia de distancia</Etiqueta>
                    <Entrada
                      id={`ap-${ed.id}`}
                      value={ed.aLosPies}
                      onChange={(e) => editar(original, { aLosPies: e.target.value })}
                      placeholder="5 cuadras del centro · comercios a 100 m"
                    />
                  </div>

                  <div className="rounded-md border border-linea p-4">
                    <p className="flex items-center gap-2 text-[0.82rem] font-semibold text-ink">
                      <MapPin className="size-4 text-oro" strokeWidth={1.7} aria-hidden />
                      Punto en el mapa
                    </p>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <Etiqueta htmlFor={`lat-${ed.id}`}>Latitud</Etiqueta>
                        <Entrada
                          id={`lat-${ed.id}`}
                          type="number"
                          step="0.0001"
                          value={ed.coordenadas.lat}
                          onChange={(e) =>
                            editar(original, {
                              coordenadas: { ...ed.coordenadas, lat: Number(e.target.value) },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Etiqueta htmlFor={`lng-${ed.id}`}>Longitud</Etiqueta>
                        <Entrada
                          id={`lng-${ed.id}`}
                          type="number"
                          step="0.0001"
                          value={ed.coordenadas.lng}
                          onChange={(e) =>
                            editar(original, {
                              coordenadas: { ...ed.coordenadas, lng: Number(e.target.value) },
                            })
                          }
                        />
                      </div>
                    </div>

                    <p className="mt-3 text-[0.78rem] leading-relaxed text-texto-suave">
                      Para sacarlos: abrí Google Maps, hacé clic derecho sobre la puerta del
                      edificio y tocá el primer renglón del menú. Copia los dos números
                      separados por coma: el primero es la latitud.
                    </p>

                    <Boton asChild variante="contorno" medida="sm" className="mt-3">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${ed.coordenadas.lat},${ed.coordenadas.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver dónde cae ahora
                        <ExternalLink strokeWidth={1.6} />
                      </a>
                    </Boton>
                  </div>

                  <fieldset>
                    <legend className="mb-2 text-[0.78rem] font-semibold text-ink">
                      Tres cosas destacadas
                    </legend>
                    <div className="space-y-2">
                      {ed.rasgos.map((r, i) => (
                        <div key={i} className="flex gap-2">
                          <Entrada
                            aria-label={`Título del rasgo ${i + 1}`}
                            value={r.titulo}
                            placeholder="Fibra óptica y cable"
                            onChange={(e) => {
                              const copia = [...ed.rasgos];
                              copia[i] = { ...r, titulo: e.target.value };
                              editar(original, { rasgos: copia });
                            }}
                            className="w-2/5"
                          />
                          <Entrada
                            aria-label={`Detalle del rasgo ${i + 1}`}
                            value={r.detalle}
                            placeholder="Sirve para trabajar desde el departamento"
                            onChange={(e) => {
                              const copia = [...ed.rasgos];
                              copia[i] = { ...r, detalle: e.target.value };
                              editar(original, { rasgos: copia });
                            }}
                          />
                          <Boton
                            variante="fantasma"
                            medida="icono"
                            aria-label="Quitar"
                            className="shrink-0 text-alerta hover:bg-alerta/10"
                            onClick={() =>
                              editar(original, { rasgos: ed.rasgos.filter((_, k) => k !== i) })
                            }
                          >
                            <Trash2 strokeWidth={1.6} />
                          </Boton>
                        </div>
                      ))}
                    </div>
                    <Boton
                      variante="suave"
                      medida="sm"
                      className="mt-2.5"
                      onClick={() =>
                        editar(original, { rasgos: [...ed.rasgos, { titulo: "", detalle: "" }] })
                      }
                    >
                      <Plus strokeWidth={2} /> Agregar
                    </Boton>
                  </fieldset>
                </div>
              </div>

              <p className="border-t border-linea px-5 py-4 text-[0.8rem] leading-relaxed text-texto-suave sm:px-6">
                Las fotos de este bloque se cambian en{" "}
                <span className="font-medium text-ink">Galerías</span>.
              </p>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
