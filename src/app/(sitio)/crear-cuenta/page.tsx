"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { TarjetaCuenta } from "@/components/sitio/tarjeta-cuenta";
import { Boton } from "@/components/ui/boton";
import { Entrada, Etiqueta } from "@/components/ui/campo";
import { useSesion } from "@/lib/sesion";

export default function PaginaCrearCuenta() {
  const router = useRouter();
  const { registrar } = useSesion();
  const [datos, setDatos] = useState({ nombre: "", email: "", telefono: "", clave: "" });
  const [error, setError] = useState("");

  const campo = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setDatos((d) => ({ ...d, [k]: e.target.value }));

  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    const r = await registrar(datos);
    setEnviando(false);
    if (r.ok) router.push("/mis-consultas");
    else setError(r.error);
  };

  return (
    <TarjetaCuenta
      titulo="Creá tu cuenta"
      bajada="Vas a poder consultar desde la web, ver tus consultas y continuar la conversación. Para escribirnos por WhatsApp no hace falta cuenta."
      pie={
        <>
          ¿Ya tenés una?{" "}
          <Link href="/entrar" className="font-semibold text-ink underline underline-offset-4">
            Entrá
          </Link>
        </>
      }
    >
      <form onSubmit={(e) => void enviar(e)} className="space-y-4">
        <div>
          <Etiqueta htmlFor="r-nombre">Nombre y apellido</Etiqueta>
          <Entrada id="r-nombre" required autoComplete="name" value={datos.nombre} onChange={campo("nombre")} />
        </div>
        <div>
          <Etiqueta htmlFor="r-mail">Correo electrónico</Etiqueta>
          <Entrada id="r-mail" type="email" required autoComplete="email" value={datos.email} onChange={campo("email")} />
        </div>
        <div>
          <Etiqueta htmlFor="r-tel">Teléfono</Etiqueta>
          <Entrada id="r-tel" type="tel" autoComplete="tel" value={datos.telefono} onChange={campo("telefono")} placeholder="+54 9 11 5555 5555" />
        </div>
        <div>
          <Etiqueta htmlFor="r-clave">Contraseña</Etiqueta>
          <Entrada
            id="r-clave"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={datos.clave}
            onChange={campo("clave")}
          />
          <p className="mt-1.5 text-[0.78rem] text-texto-tenue">Al menos 6 caracteres.</p>
        </div>

        {error ? (
          <p role="alert" className="rounded-sm bg-alerta/8 px-3.5 py-2.5 text-[0.85rem] text-alerta">
            {error}
          </p>
        ) : null}

        <Boton type="submit" variante="principal" medida="lg" className="w-full" disabled={enviando}>
          {enviando ? "Creando…" : "Crear cuenta"}
        </Boton>
      </form>
    </TarjetaCuenta>
  );
}
