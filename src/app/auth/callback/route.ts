import { NextResponse } from "next/server";
import { supabaseServidor } from "@/lib/supabase/servidor";

/**
 * Vuelta de Google.
 *
 * Google manda a la persona acá con un código de un solo uso; se canjea por la
 * sesión y se la lleva a donde quería ir. Si algo falla, vuelve al ingreso con
 * el motivo, sin dejarla en una pantalla en blanco.
 */
export async function GET(pedido: Request) {
  const url = new URL(pedido.url);
  const codigo = url.searchParams.get("code");
  const destino = url.searchParams.get("next") ?? "/mis-consultas";

  /* Sólo rutas internas: evita que alguien arme un enlace que lleve afuera. */
  const seguro = destino.startsWith("/") && !destino.startsWith("//") ? destino : "/mis-consultas";

  if (!codigo) {
    return NextResponse.redirect(new URL("/entrar?error=google", url.origin));
  }

  const bd = await supabaseServidor();
  if (!bd) {
    return NextResponse.redirect(new URL("/entrar?error=sin-base", url.origin));
  }

  const { error } = await bd.auth.exchangeCodeForSession(codigo);
  if (error) {
    return NextResponse.redirect(new URL("/entrar?error=google", url.origin));
  }

  return NextResponse.redirect(new URL(seguro, url.origin));
}
