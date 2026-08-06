"use client";

import { MapPin } from "lucide-react";
import { Foto } from "./foto";
import { Revelar } from "./revelar";
import { TarjetaDepto } from "./tarjeta-depto";
import { useContenido } from "@/lib/contenido";

export function Edificios() {
  const { edificios, departamentos } = useContenido();

  return (
    <section id="departamentos" className="scroll-mt-24 py-20 sm:py-28 lg:py-32">
      <div className="contenedor">
        <Revelar className="max-w-2xl">
          <h2 className="titulo-seccion">Dos casas, seis departamentos</h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-texto-suave">
            Todos con entrada independiente, cocina completa y calefacción. Elegí el que
            mejor entre en tu grupo.
          </p>
        </Revelar>
      </div>

      {edificios.map((ed, indice) => {
        const unidades = departamentos.filter((d) => d.edificioId === ed.id);
        const invertido = indice % 2 === 1;

        return (
          <div key={ed.id} className="mt-20 sm:mt-28">
            {/* Presentación del edificio */}
            <div className="contenedor">
              <Revelar className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
                <div
                  className={`grid grid-cols-5 gap-3 sm:gap-4 lg:col-span-6 ${
                    invertido ? "lg:order-2" : ""
                  }`}
                >
                  <Foto
                    src={ed.portada}
                    alt={`${ed.nombre}, ${ed.direccion}`}
                    zoom
                    sizes="(max-width: 1024px) 60vw, 32vw"
                    className={`aspect-4/5 rounded-lg ${invertido ? "col-span-2 mt-10" : "col-span-3"}`}
                  />
                  <Foto
                    src={ed.fotos[1] ?? ed.portada}
                    alt={`Interior de ${ed.nombre}`}
                    zoom
                    sizes="(max-width: 1024px) 40vw, 22vw"
                    className={`aspect-3/4 rounded-lg ${invertido ? "col-span-3" : "col-span-2 mt-10"}`}
                  />
                </div>

                <div className={`lg:col-span-6 ${invertido ? "lg:order-1" : ""}`}>
                  {/* Título de máxima jerarquía del bloque */}
                  <h3 className="text-[clamp(2.4rem,6.4vw,4.4rem)] leading-[0.94]">
                    Departamentos
                    <br />
                    <span className="texto-marca">{ed.nombre}</span>
                  </h3>

                  <p className="mt-7 max-w-lg text-[1.05rem] leading-relaxed text-texto-suave">
                    {ed.bajada}
                  </p>

                  <p className="mt-6 flex items-center gap-2 text-[0.875rem] text-texto-suave">
                    <MapPin className="size-4 shrink-0 text-oro" strokeWidth={1.7} aria-hidden />
                    {ed.direccion} — {ed.aLosPies}
                  </p>

                  <ul className="mt-8 space-y-3 border-t border-linea-suave pt-7">
                    {ed.rasgos.map((r) => (
                      <li key={r.titulo} className="text-[0.9rem] leading-snug">
                        <span className="font-semibold text-ink">{r.titulo}.</span>{" "}
                        <span className="text-texto-suave">{r.detalle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Revelar>
            </div>

            {/* Sus tres departamentos */}
            <div className="contenedor mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
              {unidades.map((dep, i) => (
                <Revelar key={dep.id} retraso={i * 0.06}>
                  <TarjetaDepto dep={dep} />
                </Revelar>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
