"use client";

import { ExternalLink } from "lucide-react";
import { Foto } from "./foto";
import { Revelar } from "./revelar";
import { useContenido } from "@/lib/contenido";
import { aLaVuelta } from "@/lib/data";

export function Cercanias({ titulo = "Descubrí los alrededores" }: { titulo?: string }) {
  const { lugares } = useContenido();
  const lista = [...lugares].filter((l) => l.activo).sort((a, b) => a.orden - b.orden);

  return (
    <section aria-labelledby="cercanias-titulo">
      <Revelar className="max-w-2xl">
        <h2 id="cercanias-titulo" className="titulo-seccion">
          {titulo}
        </h2>
        <p className="mt-5 text-[1.05rem] leading-relaxed text-texto-suave">
          Distancias reales, medidas en auto desde la puerta. Ushuaia es chica: casi todo
          queda a menos de media hora.
        </p>
      </Revelar>

      <ul className="mt-12 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((c, i) => (
          <Revelar as="li" key={c.id} retraso={(i % 3) * 0.06}>
            <article className="group">
              <a
                href={c.mapa}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg outline-offset-4"
              >
                <Foto
                  src={c.foto}
                  alt={c.nombre}
                  zoom
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
                  className="aspect-3/2 w-full rounded-lg"
                />
                <div className="flex items-baseline justify-between gap-3 pt-3.5">
                  <h3 className="font-sans text-[0.95rem] font-semibold text-ink">{c.nombre}</h3>
                  <span className="shrink-0 text-[0.8rem] font-medium text-oro-oscuro">
                    {c.distancia}
                  </span>
                </div>
                <p className="mt-1 text-[0.875rem] leading-snug text-texto-suave">
                  {c.descripcion}
                </p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-texto-tenue transition-colors duration-200 group-hover:text-ink">
                  Ver en Google Maps
                  <ExternalLink className="size-3.5" strokeWidth={1.7} aria-hidden />
                </span>
              </a>
            </article>
          </Revelar>
        ))}
      </ul>

      <Revelar className="mt-14 rounded-xl bg-white p-6 ring-1 ring-linea sm:p-8">
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
    </section>
  );
}
