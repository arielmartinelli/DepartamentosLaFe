import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabaseServidor } from "@/lib/supabase/servidor";

/** Vuelve a la pantalla de ingreso contando qué pasó, en vez de un error mudo. */
function conMotivo(origen: string, motivo: string) {
  const destino = new URL("/entrar", origen);
  destino.searchParams.set("error", "google");
  destino.searchParams.set("motivo", motivo.slice(0, 300));
  return NextResponse.redirect(destino);
}

/**
 * Única puerta de vuelta desde Supabase.
 *
 * Atiende dos casos:
 *  · Google y cualquier otro proveedor, que vuelven con un `code`.
 *  · Los enlaces de correo (confirmar la cuenta, cambiar el correo de acceso),
 *    que vuelven con `token_hash` y `type`.
 *
 * En los dos casos hay que canjear lo recibido: si no, el enlace abre el sitio
 * y no cambia nada, que es justo lo que pasaba antes.
 */
export async function GET(pedido: Request) {
  const url = new URL(pedido.url);
  const codigo = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const tipo = url.searchParams.get("type") as EmailOtpType | null;
  const destino = url.searchParams.get("next") ?? "/mis-consultas";

  /* Sólo rutas internas: evita que alguien arme un enlace que lleve afuera. */
  const seguro = destino.startsWith("/") && !destino.startsWith("//") ? destino : "/mis-consultas";

  /* Si Google o Supabase rechazaron antes de llegar acá, lo dicen en la dirección. */
  const rechazo =
    url.searchParams.get("error_description") ??
    url.searchParams.get("error_code") ??
    url.searchParams.get("error");
  if (rechazo) return conMotivo(url.origin, rechazo);

  const bd = await supabaseServidor();
  if (!bd) return conMotivo(url.origin, "El sitio no tiene las claves de Supabase cargadas.");

  if (tokenHash && tipo) {
    const { error } = await bd.auth.verifyOtp({ token_hash: tokenHash, type: tipo });
    if (error) return conMotivo(url.origin, error.message);
    return NextResponse.redirect(new URL(seguro, url.origin));
  }

  if (codigo) {
    const { error } = await bd.auth.exchangeCodeForSession(codigo);
    if (error) return conMotivo(url.origin, error.message);
    return NextResponse.redirect(new URL(seguro, url.origin));
  }

  return conMotivo(
    url.origin,
    "El enlace no traía código. Suele faltar esta dirección en Supabase → Authentication → URL Configuration → Redirect URLs.",
  );
}
