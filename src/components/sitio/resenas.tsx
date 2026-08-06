"use client";

import { Star } from "lucide-react";
import { Revelar } from "./revelar";
import { useContenido } from "@/lib/contenido";

export function Resenas() {
  const { comentarios } = useContenido();
  const lista = [...comentarios].filter((c) => c.publicado).sort((a, b) => a.orden - b.orden);
  if (!lista.length) return null;

  const promedio = (lista.reduce((t, c) => t + c.puntaje, 0) / lista.length).toFixed(2);

  return (
    <section aria-labelledby="resenas-titulo" className="py-20 sm:py-28 lg:py-32">
      <div className="contenedor">
        <Revelar className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="resenas-titulo" className="titulo-seccion max-w-lg">
            Lo que dicen quienes ya vinieron
          </h2>
          <p className="flex items-center gap-2 text-[0.95rem] text-texto-suave">
            <Star className="size-4 fill-ink text-ink" strokeWidth={0} aria-hidden />
            <span className="font-semibold text-ink">{promedio.replace(".", ",")}</span> de 5 ·{" "}
            {lista.length} {lista.length === 1 ? "opinión" : "opiniones"}
          </p>
        </Revelar>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {lista.slice(0, 6).map((r, i) => (
            <Revelar as="li" key={r.id} retraso={i * 0.07}>
              <figure className="flex h-full flex-col rounded-lg border border-linea p-6 sm:p-7">
                <div className="flex gap-0.5" aria-label={`${r.puntaje} de 5 estrellas`}>
                  {Array.from({ length: 5 }, (_, k) => (
                    <Star
                      key={k}
                      className={k < r.puntaje ? "size-3.5 fill-ink text-ink" : "size-3.5 fill-linea text-linea"}
                      strokeWidth={0}
                      aria-hidden
                    />
                  ))}
                </div>
                <blockquote className="mt-5 grow text-[0.95rem] leading-relaxed text-texto">
                  {r.texto}
                </blockquote>
                <figcaption className="mt-6 border-t border-linea-suave pt-5">
                  <span className="block text-[0.875rem] font-semibold text-ink">{r.autor}</span>
                  <span className="block text-[0.78rem] text-texto-tenue">
                    {[r.procedencia, r.fecha].filter(Boolean).join(" · ")}
                  </span>
                  {r.departamento ? (
                    <span className="block text-[0.78rem] text-texto-tenue">{r.departamento}</span>
                  ) : null}
                </figcaption>
              </figure>
            </Revelar>
          ))}
        </ul>
      </div>
    </section>
  );
}
