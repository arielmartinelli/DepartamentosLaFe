import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CLAVE = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hayBaseDeDatos = Boolean(URL_BASE && CLAVE);

/** Conexión desde el servidor, leyendo la sesión de las cookies. */
export async function supabaseServidor() {
  if (!hayBaseDeDatos) return null;
  const almacen = await cookies();

  return createServerClient(URL_BASE!, CLAVE!, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll: (nuevas) => {
        try {
          nuevas.forEach(({ name, value, options }) => almacen.set(name, value, options));
        } catch {
          /* En componentes de servidor no se pueden escribir cookies: lo hace el middleware. */
        }
      },
    },
  });
}
