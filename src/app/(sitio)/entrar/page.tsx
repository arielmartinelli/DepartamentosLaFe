"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { TarjetaCuenta } from "@/components/sitio/tarjeta-cuenta";
import { Boton } from "@/components/ui/boton";
import { BotonGoogle } from "@/components/ui/boton-google";
import { Entrada, Etiqueta } from "@/components/ui/campo";
import { useSesion } from "@/lib/sesion";

/** Si la vuelta de Google se cortó, se explica en lugar de dejar la pantalla muda. */
function AvisoGoogle() {
  const motivo = useSearchParams().get("error");
  if (motivo !== "google") return null;
  return (
    <p role="alert" className="rounded-sm bg-alerta/8 px-3.5 py-2.5 text-[0.85rem] text-alerta">
      No pudimos completar el ingreso con Google. Probá de nuevo o entrá con tu correo y contraseña.
    </p>
  );
}

export default function PaginaEntrar() {
  const router = useRouter();
  const { entrar } = useSesion();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    const r = await entrar(email, clave);
    setEnviando(false);
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
      <form onSubmit={(e) => void enviar(e)} className="space-y-4">
        <Suspense fallback={null}>
          <AvisoGoogle />
        </Suspense>

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

        <Boton type="submit" variante="principal" medida="lg" className="w-full" disabled={enviando}>
          {enviando ? "Entrando…" : "Entrar"}
        </Boton>

        <BotonGoogle destino="/mis-consultas" texto="Entrar con Google" />

        <p className="text-center text-[0.85rem]">
          <Link href="/recuperar" className="text-texto-suave underline underline-offset-4 hover:text-ink">
            Olvidé mi contraseña
          </Link>
        </p>
      </form>
    </TarjetaCuenta>
  );
}
