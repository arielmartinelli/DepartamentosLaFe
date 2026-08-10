"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  instantaneaArchivos,
  instantaneaServidor,
  resolverArchivo,
  suscribirArchivos,
} from "./archivos";

/**
 * Devuelve una función que traduce las referencias `local:<id>` a la imagen
 * guardada en el navegador. Las rutas y URLs normales pasan sin cambios.
 */
export function useResolverImagen() {
  const mapa = useSyncExternalStore(
    suscribirArchivos,
    instantaneaArchivos,
    instantaneaServidor,
  );

  return useCallback((src: string | null | undefined) => resolverArchivo(src, mapa), [mapa]);
}
