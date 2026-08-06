"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { CLAVES, guardar, leer, nuevoId, suscribir } from "./repositorio";
import { useContenido } from "./contenido";
import type { Cuenta } from "./tipos";

type Resultado = { ok: true; cuenta: Cuenta } | { ok: false; error: string };

type Sesion = {
  cuenta: Cuenta | null;
  listo: boolean;
  registrar: (datos: { nombre: string; email: string; clave: string; telefono: string }) => Resultado;
  entrar: (email: string, clave: string) => Resultado;
  salir: () => void;
  recuperar: (email: string) => { ok: boolean; mensaje: string };
  cambiarClave: (email: string, clave: string) => { ok: boolean; mensaje: string };
};

const Ctx = createContext<Sesion | null>(null);

/**
 * Sesión simulada sobre el repositorio local.
 * Al conectar Auth.js, sólo cambia el cuerpo de estas funciones.
 */
export function ProveedorSesion({ children }: { children: ReactNode }) {
  const { cuentas, guardarCuenta } = useContenido();

  const cuentaId = useSyncExternalStore(
    suscribir,
    () => leer<string | null>(CLAVES.sesion, null),
    () => null,
  );
  const listo = true;

  const cuenta = useMemo(
    () => cuentas.find((c) => c.id === cuentaId) ?? null,
    [cuentas, cuentaId],
  );

  const abrir = useCallback((id: string | null) => guardar(CLAVES.sesion, id), []);

  const valor = useMemo<Sesion>(
    () => ({
      cuenta,
      listo,
      registrar: ({ nombre, email, clave, telefono }) => {
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
        abrir(nueva.id);
        return { ok: true, cuenta: nueva };
      },
      entrar: (email, clave) => {
        const c = cuentas.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
        if (!c) return { ok: false, error: "No encontramos una cuenta con ese correo." };
        if (c.clave !== clave) return { ok: false, error: "La contraseña no coincide." };
        abrir(c.id);
        return { ok: true, cuenta: c };
      },
      salir: () => abrir(null),
      recuperar: (email) => {
        const c = cuentas.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
        return c
          ? {
              ok: true,
              mensaje:
                "Te enviamos un enlace para elegir una contraseña nueva. Revisá tu bandeja de entrada y el correo no deseado.",
            }
          : { ok: false, mensaje: "No encontramos una cuenta con ese correo." };
      },
      cambiarClave: (email, clave) => {
        const c = cuentas.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
        if (!c) return { ok: false, mensaje: "No encontramos esa cuenta." };
        if (clave.length < 6) return { ok: false, mensaje: "La contraseña necesita al menos 6 caracteres." };
        guardarCuenta({ ...c, clave });
        return { ok: true, mensaje: "Listo, ya podés entrar con la contraseña nueva." };
      },
    }),
    [cuenta, cuentas, guardarCuenta, abrir, listo],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useSesion() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useSesion debe usarse dentro de <ProveedorSesion>");
  return s;
}
