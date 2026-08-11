"use client";

import { useSyncExternalStore } from "react";
import { cargandoPrimeraVez, estadoDeLaBase, suscribir } from "./repositorio";

/** Estado de la sincronización con la base, para pintar indicadores. */
export function useEstadoCarga() {
  return useSyncExternalStore(suscribir, estadoDeLaBase, () => "sin-base" as const);
}

/** True mientras se espera la primera respuesta del servidor. */
export function useCargandoInicial() {
  return useSyncExternalStore(suscribir, cargandoPrimeraVez, () => false);
}
