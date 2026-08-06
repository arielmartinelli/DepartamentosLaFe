"use client";

import { ExternalLink } from "lucide-react";
import { Foto } from "./foto";
import { Revelar } from "./revelar";
import { useContenido } from "@/lib/contenido";
import { aLaVuelta } from "@/lib/data";
import { cn } from "@/lib/utils";

/* Alturas alternadas: el mosaico respira y no parece una grilla de plantilla. */
const proporciones = [
  "aspect-4/3",
  "aspect-3/4",
  "aspect-square",
  "aspect-3/4",
  "aspect-4/3",
  "aspect-square",
  "aspect-square",
  "aspect-4/3",
  "aspect-3/4",
];

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
  const { actividades } = useContenido();
  const lista = [...actividades].filter((a) => a.activa).sort((a, b) => a.orden - b.orden);
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
        <Revelar className="max-w-2xl">
          <h2 id="que-hacer-titulo" className="titulo-seccion">
            {titulo}
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-texto-suave">{bajada}</p>
        </Revelar>

        <div className="mt-14 gap-6 [column-fill:balance] columns-1 sm:columns-2 lg:columns-3">
          {lista.map((a, i) => (
            <Revelar key={a.id} retraso={(i % 3) * 0.06} className="mb-6 break-inside-avoid">
              <article className="group">
                {a.mapa ? (
                  <a
                    href={a.mapa}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg outline-offset-4"
                  >
                    <Contenido a={a} proporcion={proporciones[i % proporciones.length]} conEnlace />
                  </a>
                ) : (
                  <Contenido a={a} proporcion={proporciones[i % proporciones.length]} />
                )}
              </article>
            </Revelar>
          ))}
        </div>

        {mostrarPracticos ? (
          <Revelar
            className={cn(
              "mt-6 rounded-xl p-6 sm:p-8",
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
        ) : null}
      </div>
    </section>
  );
}

function Contenido({
  a,
  proporcion,
  conEnlace = false,
}: {
  a: {
    titulo: string;
    descripcion: string;
    categoria: string;
    duracion: string;
    distancia: string;
    temporada: string;
    foto: string;
  };
  proporcion: string;
  conEnlace?: boolean;
}) {
  const marcas = [a.duracion, a.distancia].filter(Boolean);

  return (
    <>
      <Foto
        src={a.foto}
        alt={a.titulo}
        zoom
        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
        className={cn("w-full rounded-lg", proporcion)}
      />

      <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.74rem] font-semibold uppercase tracking-[0.12em] text-oro-oscuro">
        <span>{a.categoria}</span>
        {a.temporada && a.temporada !== "Todo el año" ? (
          <>
            <span aria-hidden className="text-linea">·</span>
            <span className="text-texto-tenue">{a.temporada}</span>
          </>
        ) : null}
      </p>

      <h3 className="mt-1.5 font-display text-[1.35rem] leading-tight text-ink">{a.titulo}</h3>

      <p className="mt-2 text-[0.9rem] leading-relaxed text-texto-suave">{a.descripcion}</p>

      <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.82rem] text-texto-suave">
        {marcas.map((m, k) => (
          <span key={m} className="flex items-center gap-2.5">
            {k > 0 ? (
              <span aria-hidden className="text-linea">·</span>
            ) : null}
            {m}
          </span>
        ))}
      </p>

      {conEnlace ? (
        <span className="mt-2.5 inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-texto-tenue transition-colors duration-200 group-hover:text-ink">
          Cómo llegar
          <ExternalLink className="size-3.5" strokeWidth={1.7} aria-hidden />
        </span>
      ) : null}
    </>
  );
}
