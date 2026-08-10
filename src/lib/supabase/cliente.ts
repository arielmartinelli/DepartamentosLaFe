"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Conexión a Supabase desde el navegador.
 *
 * Todo el proyecto funciona sin base de datos: si estas variables no están
 * definidas, el repositorio guarda en el navegador como hasta ahora. En cuanto
 * se completan, pasa a leer y escribir en Supabase sin tocar ningún componente.
 */
const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CLAVE = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hayBaseDeDatos = Boolean(URL_BASE && CLAVE);

let instancia: ReturnType<typeof createBrowserClient> | null = null;

export function supabase() {
  if (!hayBaseDeDatos) return null;
  if (!instancia) instancia = createBrowserClient(URL_BASE!, CLAVE!);
  return instancia;
}
