"use client";

import { cn } from "@/lib/utils";

/** Bloque gris que ocupa el lugar del contenido mientras llega. */
export function Esqueleto({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block animate-pulse rounded-sm bg-hueso", className)}
    />
  );
}

/** Fichas de departamento en espera. */
export function EsqueletoTarjetas({ cantidad = 3 }: { cantidad?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Cargando">
      {Array.from({ length: cantidad }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-linea bg-white">
          <Esqueleto className="aspect-16/9 w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Esqueleto className="h-4 w-2/3" />
            <Esqueleto className="h-3 w-full" />
            <Esqueleto className="h-3 w-4/5" />
            <Esqueleto className="h-9 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Filas de tabla en espera. */
export function EsqueletoFilas({ cantidad = 5 }: { cantidad?: number }) {
  return (
    <div className="divide-y divide-linea-suave" role="status" aria-label="Cargando">
      {Array.from({ length: cantidad }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <Esqueleto className="size-9 shrink-0 rounded-full" />
          <div className="grow space-y-2">
            <Esqueleto className="h-3.5 w-1/3" />
            <Esqueleto className="h-3 w-1/2" />
          </div>
          <Esqueleto className="h-8 w-20 shrink-0" />
        </div>
      ))}
    </div>
  );
}
