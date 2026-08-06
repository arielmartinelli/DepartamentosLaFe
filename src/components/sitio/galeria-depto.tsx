"use client";

import Image from "next/image";
import { Grid2x2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Visor } from "./visor";
import { cn } from "@/lib/utils";

/**
 * Galería de portada de la ficha.
 *
 * En escritorio: una foto grande a la izquierda y cuatro en mosaico a la
 * derecha, con altura fija para que las imágenes con `fill` tengan de dónde
 * agarrarse. En móvil: carrusel deslizable a pantalla completa.
 */
export function GaleriaDepto({ fotos, titulo }: { fotos: string[]; titulo: string }) {
  const [indice, setIndice] = useState<number | null>(null);
  const [actual, setActual] = useState(0);
  const cinco = fotos.slice(0, 5);
  const hay = fotos.length;

  if (hay === 0) {
    return (
      <div className="grid h-72 place-items-center rounded-xl bg-hueso text-[0.85rem] text-texto-tenue">
        Todavía no hay fotos cargadas para este departamento.
      </div>
    );
  }

  const mover = (paso: number) => setActual((v) => (v + paso + hay) % hay);

  return (
    <>
      {/* Móvil: carrusel */}
      <div className="relative sm:hidden">
        <button
          type="button"
          onClick={() => setIndice(actual)}
          aria-label={`Ampliar foto ${actual + 1} de ${titulo}`}
          className="relative block aspect-4/3 w-full overflow-hidden rounded-lg bg-hueso"
        >
          <Image
            src={fotos[actual]}
            alt={`${titulo} — foto ${actual + 1}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </button>

        {hay > 1 ? (
          <>
            <button
              type="button"
              onClick={() => mover(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-carta active:scale-95"
            >
              <ChevronLeft className="size-4" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => mover(1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-carta active:scale-95"
            >
              <ChevronRight className="size-4" strokeWidth={2.2} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-ink/55 px-2.5 py-1.5 backdrop-blur-sm">
              {fotos.slice(0, 8).map((_, i) => (
                <span
                  key={i}
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full transition-colors duration-200",
                    i === actual ? "bg-white" : "bg-white/40",
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* Escritorio: mosaico con altura propia */}
      <div className="relative hidden h-[clamp(22rem,42vw,32rem)] gap-2 sm:grid sm:grid-cols-4 sm:grid-rows-2">
        {cinco.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setIndice(i)}
            aria-label={`Ver foto ${i + 1} de ${titulo}`}
            className={cn(
              "group relative overflow-hidden bg-hueso",
              i === 0
                ? "col-span-2 row-span-2 rounded-l-xl"
                : i === 1
                  ? "rounded-none"
                  : i === 2
                    ? "rounded-tr-xl"
                    : i === 3
                      ? "rounded-none"
                      : "rounded-br-xl",
            )}
          >
            <Image
              src={src}
              alt={`${titulo} — foto ${i + 1}`}
              fill
              priority={i === 0}
              sizes={i === 0 ? "50vw" : "25vw"}
              className="object-cover transition-transform duration-500 ease-salida group-hover:scale-[1.04]"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-ink/0 transition-colors duration-200 group-hover:bg-ink/12"
            />
          </button>
        ))}

        <button
          type="button"
          onClick={() => setIndice(0)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-sm border border-ink/15 bg-white px-4 py-2.5 text-[0.8125rem] font-semibold text-ink shadow-carta transition-[box-shadow,transform] duration-200 ease-salida hover:shadow-alza active:scale-[0.97]"
        >
          <Grid2x2 className="size-4" strokeWidth={1.8} aria-hidden />
          Mostrar las {hay} fotos
        </button>
      </div>

      <Visor
        fotos={fotos}
        indice={indice}
        titulo={titulo}
        onCerrar={() => setIndice(null)}
        onCambiar={setIndice}
      />
    </>
  );
}
