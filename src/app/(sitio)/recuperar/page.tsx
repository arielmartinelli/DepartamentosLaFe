"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { TarjetaCuenta } from "@/components/sitio/tarjeta-cuenta";
import { Boton } from "@/components/ui/boton";
import { Entrada, Etiqueta } from "@/components/ui/campo";
import { useSesion } from "@/lib/sesion";

export default function PaginaRecuperar() {
  const { recuperar, cambiarClave } = useSesion();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [paso, setPaso] = useState<"pedir" | "cambiar" | "listo">("pedir");
  const [aviso, setAviso] = useState("");
  const [error, setError] = useState("");

  const pedir = async (e: FormEvent) => {
    e.preventDefault();
    const r = await recuperar(email);
    if (r.ok) {
      setAviso(r.mensaje);
      setError("");
      setPaso("cambiar");
    } else {
      setError(r.mensaje);
    }
  };

  const cambiar = async (e: FormEvent) => {
    e.preventDefault();
    const r = await cambiarClave(email, clave);
    if (r.ok) {
      setAviso(r.mensaje);
      setError("");
      setPaso("listo");
    } else {
      setError(r.mensaje);
    }
  };

  return (
    <TarjetaCuenta
      titulo="Recuperar contraseña"
      bajada="Ponés tu correo y elegís una contraseña nueva."
      pie={
        <Link href="/entrar" className="font-semibold text-ink underline underline-offset-4">
          Volver a entrar
        </Link>
      }
    >
      {paso === "listo" ? (
        <div className="py-4 text-center">
          <p className="font-display text-xl text-ink">Contraseña actualizada</p>
          <p className="mx-auto mt-2 max-w-xs text-[0.9rem] leading-relaxed text-texto-suave">{aviso}</p>
          <Boton asChild variante="principal" medida="lg" className="mt-6 w-full">
            <Link href="/entrar">Entrar ahora</Link>
          </Boton>
        </div>
      ) : (
        <form onSubmit={(e) => void (paso === "pedir" ? pedir(e) : cambiar(e))} className="space-y-4">
          <div>
            <Etiqueta htmlFor="rc-mail">Correo electrónico</Etiqueta>
            <Entrada
              id="rc-mail"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={paso === "cambiar"}
            />
          </div>

          {paso === "cambiar" ? (
            <div>
              <Etiqueta htmlFor="rc-clave">Contraseña nueva</Etiqueta>
              <Entrada
                id="rc-clave"
                type="password"
                required
                minLength={6}
                value={clave}
                onChange={(e) => setClave(e.target.value)}
              />
            </div>
          ) : null}

          {aviso && paso === "cambiar" ? (
            <p className="rounded-sm bg-exito/8 px-3.5 py-2.5 text-[0.85rem] text-exito">{aviso}</p>
          ) : null}
          {error ? (
            <p role="alert" className="rounded-sm bg-alerta/8 px-3.5 py-2.5 text-[0.85rem] text-alerta">
              {error}
            </p>
          ) : null}

          <Boton type="submit" variante="principal" medida="lg" className="w-full">
            {paso === "pedir" ? "Continuar" : "Guardar contraseña"}
          </Boton>
        </form>
      )}
    </TarjetaCuenta>
  );
}
