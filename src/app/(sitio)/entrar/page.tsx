"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { TarjetaCuenta } from "@/components/sitio/tarjeta-cuenta";
import { Boton } from "@/components/ui/boton";
import { Entrada, Etiqueta } from "@/components/ui/campo";
import { useSesion } from "@/lib/sesion";

export default function PaginaEntrar() {
  const router = useRouter();
  const { entrar } = useSesion();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const r = entrar(email, clave);
    if (r.ok) router.push("/mis-consultas");
    else setError(r.error);
  };

  return (
    <TarjetaCuenta
      titulo="Entrar a tu cuenta"
      bajada="Para ver tus consultas y seguir la conversación con nosotros."
      pie={
        <>
          ¿Todavía no tenés cuenta?{" "}
          <Link href="/crear-cuenta" className="font-semibold text-ink underline underline-offset-4">
            Creá una
          </Link>
        </>
      }
    >
      <form onSubmit={enviar} className="space-y-4">
        <div>
          <Etiqueta htmlFor="e-mail">Correo electrónico</Etiqueta>
          <Entrada
            id="e-mail"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="vero.paz@correo.com"
          />
        </div>
        <div>
          <Etiqueta htmlFor="e-clave">Contraseña</Etiqueta>
          <Entrada
            id="e-clave"
            type="password"
            autoComplete="current-password"
            required
            value={clave}
            onChange={(ev) => setClave(ev.target.value)}
          />
        </div>

        {error ? (
          <p role="alert" className="rounded-sm bg-alerta/8 px-3.5 py-2.5 text-[0.85rem] text-alerta">
            {error}
          </p>
        ) : null}

        <Boton type="submit" variante="principal" medida="lg" className="w-full">
          Entrar
        </Boton>

        <p className="text-center text-[0.85rem]">
          <Link href="/recuperar" className="text-texto-suave underline underline-offset-4 hover:text-ink">
            Olvidé mi contraseña
          </Link>
        </p>
      </form>
    </TarjetaCuenta>
  );
}
