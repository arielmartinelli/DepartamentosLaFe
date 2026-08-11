import { NextResponse } from "next/server";
import { supabaseServidor } from "@/lib/supabase/servidor";

/** Vuelve a la pantalla de ingreso contando qué pasó, en vez de un error mudo. */
function conMotivo(origen: string, motivo: string) {
  const destino = new URL("/entrar", origen);
  destino.searchParams.set("error", "google");
  destino.searchParams.set("motivo", motivo.slice(0, 300));
  return NextResponse.redirect(destino);
}

/**
 * Vuelta de Google.
 *
 * Google manda a la persona acá con un código de un solo uso; se canjea por la
 * sesión y se la lleva a donde quería ir.
 */
export async function GET(pedido: Request) {
  const url = new URL(pedido.url);
  const codigo = url.searchParams.get("code");
  const destino = url.searchParams.get("next") ?? "/mis-consultas";

  /* Sólo rutas internas: evita que alguien arme un enlace que lleve afuera. */
  const seguro = destino.startsWith("/") && !destino.startsWith("//") ? destino : "/mis-consultas";

  /* Si Google o Supabase rechazaron antes de llegar acá, lo dicen en la dirección. */
  const rechazo =
    url.searchParams.get("error_description") ??
    url.searchParams.get("error_code") ??
    url.searchParams.get("error");
  if (rechazo) return conMotivo(url.origin, rechazo);

  if (!codigo) {
    return conMotivo(
      url.origin,
      "Google no devolvió el código. Suele faltar esta dirección en Supabase → Authentication → URL Configuration → Redirect URLs.",
    );
  }

  const bd = await supabaseServidor();
  if (!bd) return conMotivo(url.origin, "El sitio no tiene las claves de Supabase cargadas.");

  const { error } = await bd.auth.exchangeCodeForSession(codigo);
  if (error) return conMotivo(url.origin, error.message);

  return NextResponse.redirect(new URL(seguro, url.origin));
}
