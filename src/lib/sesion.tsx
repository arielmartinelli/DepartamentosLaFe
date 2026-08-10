"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { CLAVES, guardar, leer, nuevoId, suscribir } from "./repositorio";
import { useContenido } from "./contenido";
import { hayBaseDeDatos, supabase } from "./supabase/cliente";
import type { Cuenta } from "./tipos";

type Resultado = { ok: true; cuenta: Cuenta } | { ok: false; error: string };
type Aviso = { ok: boolean; mensaje: string };

type Sesion = {
  cuenta: Cuenta | null;
  esPropietaria: boolean;
  listo: boolean;
  conBase: boolean;
  registrar: (datos: {
    nombre: string;
    email: string;
    clave: string;
    telefono: string;
  }) => Promise<Resultado>;
  entrar: (email: string, clave: string) => Promise<Resultado>;
  salir: () => Promise<void>;
  recuperar: (email: string) => Promise<Aviso>;
  cambiarClave: (email: string, clave: string) => Promise<Aviso>;
};

const Ctx = createContext<Sesion | null>(null);

/**
 * Sesión de visitantes y de la propietaria.
 *
 * Con Supabase configurado usa autenticación real, con contraseñas cifradas y
 * recuperación por correo. Sin configurar, sigue funcionando sobre el
 * repositorio local para poder mostrar el recorrido completo.
 */
export function ProveedorSesion({ children }: { children: ReactNode }) {
  const { cuentas, guardarCuenta } = useContenido();

  /* ── Modo local ──────────────────────────────────────────────── */
  const cuentaLocalId = useSyncExternalStore(
    suscribir,
    () => leer<string | null>(CLAVES.sesion, null),
    () => null,
  );

  /* ── Modo Supabase ───────────────────────────────────────────── */
  const [cuentaRemota, setCuentaRemota] = useState<Cuenta | null>(null);
  const [rol, setRol] = useState<string>("visitante");
  const [listoRemoto, setListoRemoto] = useState(!hayBaseDeDatos);

  useEffect(() => {
    const bd = supabase();
    if (!bd) return;

    const cargar = async () => {
      const { data } = await bd.auth.getUser();
      const usuario = data.user;

      if (!usuario) {
        setCuentaRemota(null);
        setRol("visitante");
        setListoRemoto(true);
        return;
      }

      const { data: perfil } = await bd
        .from("perfiles")
        .select("nombre, telefono, rol")
        .eq("id", usuario.id)
        .maybeSingle();

      setCuentaRemota({
        id: usuario.id,
        nombre: perfil?.nombre || (usuario.user_metadata?.nombre as string) || "",
        email: usuario.email ?? "",
        clave: "",
        telefono: perfil?.telefono || (usuario.user_metadata?.telefono as string) || "",
        creada: usuario.created_at?.slice(0, 10) ?? "",
      });
      setRol(perfil?.rol ?? "visitante");
      setListoRemoto(true);
    };

    void cargar();
    const { data: escucha } = bd.auth.onAuthStateChange(() => void cargar());
    return () => escucha.subscription.unsubscribe();
  }, []);

  const cuentaLocal = useMemo(
    () => cuentas.find((c) => c.id === cuentaLocalId) ?? null,
    [cuentas, cuentaLocalId],
  );

  const abrirLocal = useCallback((id: string | null) => guardar(CLAVES.sesion, id), []);

  const valor = useMemo<Sesion>(() => {
    const bd = supabase();

    if (bd) {
      return {
        cuenta: cuentaRemota,
        esPropietaria: rol === "propietaria",
        listo: listoRemoto,
        conBase: true,

        registrar: async ({ nombre, email, clave, telefono }) => {
          const { data, error } = await bd.auth.signUp({
            email: email.trim().toLowerCase(),
            password: clave,
            options: { data: { nombre: nombre.trim(), telefono: telefono.trim() } },
          });
          if (error) return { ok: false, error: traducir(error.message) };
          return {
            ok: true,
            cuenta: {
              id: data.user?.id ?? "",
              nombre,
              email,
              clave: "",
              telefono,
              creada: new Date().toISOString().slice(0, 10),
            },
          };
        },

        entrar: async (email, clave) => {
          const { data, error } = await bd.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password: clave,
          });
          if (error) return { ok: false, error: traducir(error.message) };
          return {
            ok: true,
            cuenta: {
              id: data.user.id,
              nombre: (data.user.user_metadata?.nombre as string) ?? "",
              email: data.user.email ?? "",
              clave: "",
              telefono: (data.user.user_metadata?.telefono as string) ?? "",
              creada: data.user.created_at?.slice(0, 10) ?? "",
            },
          };
        },

        salir: async () => {
          await bd.auth.signOut();
        },

        recuperar: async (email) => {
          const { error } = await bd.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
            redirectTo: `${window.location.origin}/recuperar`,
          });
          return error
            ? { ok: false, mensaje: traducir(error.message) }
            : {
                ok: true,
                mensaje:
                  "Te enviamos un correo con el enlace para elegir una contraseña nueva. Revisá también el correo no deseado.",
              };
        },

        cambiarClave: async (_email, clave) => {
          const { error } = await bd.auth.updateUser({ password: clave });
          return error
            ? { ok: false, mensaje: traducir(error.message) }
            : { ok: true, mensaje: "Listo, tu contraseña quedó actualizada." };
        },
      };
    }

    /* ── Sin base de datos ─────────────────────────────────────── */
    return {
      cuenta: cuentaLocal,
      esPropietaria: false,
      listo: true,
      conBase: false,

      registrar: async ({ nombre, email, clave, telefono }) => {
        const limpio = email.trim().toLowerCase();
        if (cuentas.some((c) => c.email.toLowerCase() === limpio)) {
          return { ok: false, error: "Ya existe una cuenta con ese correo. Probá iniciar sesión." };
        }
        if (clave.length < 6) {
          return { ok: false, error: "La contraseña necesita al menos 6 caracteres." };
        }
        const nueva: Cuenta = {
          id: nuevoId("cta"),
          nombre: nombre.trim(),
          email: limpio,
          clave,
          telefono: telefono.trim(),
          creada: new Date().toISOString().slice(0, 10),
        };
        guardarCuenta(nueva);
        abrirLocal(nueva.id);
        return { ok: true, cuenta: nueva };
      },

      entrar: async (email, clave) => {
        const c = cuentas.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
        if (!c) return { ok: false, error: "No encontramos una cuenta con ese correo." };
        if (c.clave !== clave) return { ok: false, error: "La contraseña no coincide." };
        abrirLocal(c.id);
        return { ok: true, cuenta: c };
      },

      salir: async () => abrirLocal(null),

      recuperar: async (email) => {
        const c = cuentas.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
        return c
          ? { ok: true, mensaje: "Elegí una contraseña nueva." }
          : { ok: false, mensaje: "No encontramos una cuenta con ese correo." };
      },

      cambiarClave: async (email, clave) => {
        const c = cuentas.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
        if (!c) return { ok: false, mensaje: "No encontramos esa cuenta." };
        if (clave.length < 6) return { ok: false, mensaje: "La contraseña necesita al menos 6 caracteres." };
        guardarCuenta({ ...c, clave });
        return { ok: true, mensaje: "Listo, ya podés entrar con la contraseña nueva." };
      },
    };
  }, [cuentaRemota, rol, listoRemoto, cuentaLocal, cuentas, guardarCuenta, abrirLocal]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

/** Mensajes de Supabase en castellano. */
function traducir(mensaje: string) {
  const m = mensaje.toLowerCase();
  if (m.includes("invalid login")) return "El correo o la contraseña no coinciden.";
  if (m.includes("already registered")) return "Ya existe una cuenta con ese correo.";
  if (m.includes("password should be")) return "La contraseña necesita al menos 6 caracteres.";
  if (m.includes("email not confirmed")) return "Falta confirmar el correo. Revisá tu bandeja de entrada.";
  if (m.includes("rate limit")) return "Demasiados intentos seguidos. Probá de nuevo en un minuto.";
  return mensaje;
}

export function useSesion() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useSesion debe usarse dentro de <ProveedorSesion>");
  return s;
}
