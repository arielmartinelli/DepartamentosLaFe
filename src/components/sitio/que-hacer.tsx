"use client";

import { Download, ExternalLink } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import { Carrusel } from "./carrusel";
import { Foto } from "./foto";
import { Revelar } from "./revelar";
import { useContenido } from "@/lib/contenido";
import { aLaVuelta } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Se muestran hasta nueve; el resto queda cargado en el panel. */
const TOPE = 9;

export function QueHacer({
  titulo = "Qué hacer mientras estás acá",
  bajada = "Excursiones y lugares cercanos, con el tiempo que toma llegar desde la puerta. Ushuaia es chica: casi todo queda a menos de media hora.",
  fondo = "hueso",
  mostrarPracticos = true,
}: {
  titulo?: string;
  bajada?: string;
  fondo?: "hueso" | "blanco";
  mostrarPracticos?: boolean;
}) {
  const { actividades, ajustes } = useContenido();
  const lista = [...actividades]
    .filter((a) => a.activa)
    .sort((a, b) => a.orden - b.orden)
    .slice(0, TOPE);

  if (!lista.length) return null;

  return (
    <section
      id="que-hacer"
      aria-labelledby="que-hacer-titulo"
      className={cn(
        "scroll-mt-24 py-20 sm:py-28 lg:py-32",
        fondo === "hueso" ? "bg-hueso" : "bg-white",
      )}
    >
      <div className="contenedor">
        <Revelar className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 id="que-hacer-titulo" className="titulo-seccion">
              {titulo}
            </h2>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-texto-suave">{bajada}</p>
          </div>

          {ajustes.guia ? (
            <div className="shrink-0 lg:max-w-xs lg:text-right">
              <Boton asChild variante="principal" medida="md" pastilla>
                <a href={ajustes.guia} target="_blank" rel="noopener noreferrer">
                  <Download strokeWidth={1.8} aria-hidden />
                  Descargar guía completa
                </a>
              </Boton>
              <p className="mt-3 text-[0.8rem] leading-relaxed text-texto-tenue">
                Excursiones, museos y actividades con precios y horarios de referencia.
                {ajustes.guiaActualizada
                  ? ` Última actualización: ${ajustes.guiaActualizada}.`
                  : ""}{" "}
                Descargala cuando ya estés en Ushuaia: la información cambia seguido.
              </p>
            </div>
          ) : null}
        </Revelar>
      </div>

      <div className="contenedor mt-14">
        <Carrusel etiqueta="Qué hacer en Ushuaia">
          {lista.map((a) => {
            const marcas = [a.duracion, a.distancia].filter(Boolean);

            return (
              <li key={a.id} className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[24rem] xl:w-[25rem]">
                <article className="group h-full">
                  <a
                    href={a.mapa || undefined}
                    target={a.mapa ? "_blank" : undefined}
                    rel={a.mapa ? "noopener noreferrer" : undefined}
                    className="block rounded-lg outline-offset-4"
                  >
                    <div className="relative">
                      <Foto
                        src={a.foto}
                        alt={a.titulo}
                        zoom
                        sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 25rem"
                        className="aspect-16/11 w-full rounded-lg"
                      />
                      <div
                        aria-hidden
                        className="velo-pie pointer-events-none absolute inset-0 rounded-lg"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-oro-claro">
                          {a.categoria}
                        </p>
                        <h3 className="mt-1.5 font-display text-[1.4rem] leading-tight text-white">
                          {a.titulo}
                        </h3>
                      </div>
                    </div>

                    <p className="mt-4 text-[0.9rem] leading-relaxed text-texto-suave">
                      {a.descripcion}
                    </p>

                    <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.82rem] text-texto-suave">
                      {marcas.map((m, k) => (
                        <span key={m} className="flex items-center gap-2.5">
                          {k > 0 ? <span aria-hidden className="text-linea">·</span> : null}
                          {m}
                        </span>
                      ))}
                      {a.temporada && a.temporada !== "Todo el año" ? (
                        <span className="flex items-center gap-2.5 text-texto-tenue">
                          {marcas.length ? <span aria-hidden className="text-linea">·</span> : null}
                          {a.temporada}
                        </span>
                      ) : null}
                    </p>

                    {a.mapa ? (
                      <span className="mt-2.5 inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-texto-tenue transition-colors duration-200 group-hover:text-ink">
                        Cómo llegar
                        <ExternalLink className="size-3.5" strokeWidth={1.7} aria-hidden />
                      </span>
                    ) : null}
                  </a>
                </article>
              </li>
            );
          })}
        </Carrusel>
      </div>

      {mostrarPracticos ? (
        <div className="contenedor">
          <Revelar
            className={cn(
              "mt-14 rounded-xl p-6 sm:p-8",
              fondo === "hueso" ? "bg-white ring-1 ring-linea" : "bg-hueso",
            )}
          >
            <h3 className="font-sans text-[0.95rem] font-semibold text-ink">
              A la vuelta de la esquina
            </h3>
            <ul className="mt-5 grid gap-x-10 gap-y-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {aLaVuelta.map((s) => (
                <li key={s.nombre} className="text-[0.875rem] leading-snug">
                  <span className="font-medium text-ink">{s.nombre}</span>
                  <span className="block text-texto-suave">{s.detalle}</span>
                </li>
              ))}
            </ul>
          </Revelar>
        </div>
      ) : null}
    </section>
  );
}
