"use client";

import { useCargandoInicial } from "@/lib/usar-carga";
import { cn } from "@/lib/utils";

/**
 * Barra fina arriba de todo mientras llegan los datos de la base.
 * No tapa nada: el contenido se sigue viendo y se actualiza al terminar.
 */
export function BarraCarga() {
  const cargando = useCargandoInicial();

  return (
    <div
      aria-hidden={!cargando}
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-100 h-0.5 transition-opacity duration-500",
        cargando ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="barra-avance h-full w-full" />
      <span className="sr-only" role="status" aria-live="polite">
        {cargando ? "Cargando la información del alojamiento" : "Información actualizada"}
      </span>
    </div>
  );
}
