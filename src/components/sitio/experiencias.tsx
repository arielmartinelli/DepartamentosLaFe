"use client";

import { Foto } from "./foto";
import { Carrusel } from "./carrusel";
import { Revelar } from "./revelar";
import { useContenido } from "@/lib/contenido";

export function Experiencias() {
  const { actividades } = useContenido();
  const lista = [...actividades].filter((a) => a.activa).sort((a, b) => a.orden - b.orden);
  if (!lista.length) return null;

  return (
    <section
      id="experiencias"
      aria-labelledby="experiencias-titulo"
      className="scroll-mt-24 bg-hueso py-20 sm:py-28 lg:py-32"
    >
      <div className="contenedor">
        <Revelar className="max-w-2xl">
          <h2 id="experiencias-titulo" className="titulo-seccion">
            Qué hacer mientras estás acá
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-texto-suave">
            Te ayudamos a ordenar los días según el clima, que en Ushuaia cambia varias
            veces en la misma jornada. Estas son las salidas que más recomendamos.
          </p>
        </Revelar>
      </div>

      <div className="contenedor mt-14">
        <Carrusel etiqueta="Experiencias recomendadas">
          {lista.map((e) => (
            <li key={e.id} className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[26rem] xl:w-[27rem]">
              <article className="group">
                <div className="relative">
                  <Foto
                    src={e.foto}
                    alt={e.titulo}
                    zoom
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 27rem"
                    className="aspect-16/11 w-full rounded-lg"
                  />
                  <div aria-hidden className="velo-pie pointer-events-none absolute inset-0 rounded-lg" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    {e.duracion || e.temporada ? (
                      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/75">
                        {[e.duracion, e.temporada].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                    <h3 className="mt-1.5 font-display text-[1.4rem] leading-tight text-white">
                      {e.titulo}
                    </h3>
                  </div>
                </div>
                <p className="mt-4 text-[0.9rem] leading-relaxed text-texto-suave">
                  {e.descripcion}
                </p>
              </article>
            </li>
          ))}
        </Carrusel>
      </div>
    </section>
  );
}
