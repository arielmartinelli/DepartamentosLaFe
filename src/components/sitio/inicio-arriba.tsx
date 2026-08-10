"use client";

import { useEffect } from "react";

/**
 * Al entrar al sitio sin ancla, el navegador restauraba la posición de la
 * visita anterior y la página abría a la altura de los departamentos.
 * Acá se desactiva esa restauración, respetando el botón de volver.
 */
export function InicioArriba() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (window.location.hash) return;

    const navegacion = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navegacion?.type === "back_forward") return;

    window.scrollTo(0, 0);
  }, []);

  return null;
}
