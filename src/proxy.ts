import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CLAVE = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Mantiene viva la sesión y cierra el panel a quien no sea la propietaria.
 *
 * Sin Supabase configurado no hace nada: el proyecto sigue siendo la
 * demostración que se puede recorrer sin claves.
 */
export async function proxy(pedido: NextRequest) {
  const vaAlPanel = pedido.nextUrl.pathname.startsWith("/admin");

  /**
   * Sin base de datos configurada no hay forma de comprobar quién entra.
   * En desarrollo se deja pasar para poder recorrer la demostración, pero en
   * producción el panel queda cerrado: un descuido en las variables de entorno
   * no puede dejarlo abierto a cualquiera.
   */
  if (!URL_BASE || !CLAVE) {
    if (vaAlPanel && process.env.NODE_ENV === "production") {
      const destino = pedido.nextUrl.clone();
      destino.pathname = "/ingresar";
      destino.searchParams.set("error", "sin-base");
      return NextResponse.redirect(destino);
    }
    return NextResponse.next();
  }

  let respuesta = NextResponse.next({ request: pedido });

  const bd = createServerClient(URL_BASE, CLAVE, {
    cookies: {
      getAll: () => pedido.cookies.getAll(),
      setAll: (nuevas) => {
        nuevas.forEach(({ name, value }) => pedido.cookies.set(name, value));
        respuesta = NextResponse.next({ request: pedido });
        nuevas.forEach(({ name, value, options }) => respuesta.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await bd.auth.getUser();

  if (!vaAlPanel) return respuesta;

  if (!user) {
    const destino = pedido.nextUrl.clone();
    destino.pathname = "/ingresar";
    destino.searchParams.set("volver", pedido.nextUrl.pathname);
    return NextResponse.redirect(destino);
  }

  const { data: perfil, error } = await bd
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .maybeSingle();

  if (perfil?.rol === "propietaria") return respuesta;

  /* Se distingue la causa: sin fila, con otro rol, o consulta rechazada. */
  const motivo = error ? "consulta" : !perfil ? "sin-perfil" : "otro-rol";

  const destino = pedido.nextUrl.clone();
  destino.pathname = "/ingresar";
  destino.searchParams.set("error", motivo);
  destino.searchParams.set("correo", user.email ?? "");
  return NextResponse.redirect(destino);
}

export const config = {
  matcher: ["/admin/:path*", "/mis-consultas", "/entrar", "/crear-cuenta"],
};
