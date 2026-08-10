"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Boton } from "@/components/ui/boton";
import { Entrada, Etiqueta } from "@/components/ui/campo";
import { useSesion } from "@/lib/sesion";

/** Traduce el motivo del rechazo en algo accionable. */
function explicar(motivo: string | null, correo: string | null) {
  const cuenta = correo ? ` (${correo})` : "";
  switch (motivo) {
    case "sin-perfil":
      return `La cuenta${cuenta} entró bien, pero no tiene una fila en la tabla “perfiles”. Creala y asignale el rol de propietaria desde el editor SQL de Supabase.`;
    case "otro-rol":
      return `La cuenta${cuenta} entró bien, pero su rol no es “propietaria”. Cambialo en la tabla “perfiles”.`;
    case "consulta":
      return `No se pudo leer el perfil de${cuenta || " la cuenta"}. Revisá que el esquema de Supabase se haya ejecutado completo, sobre todo los permisos de la tabla “perfiles”.`;
    case "sin-permiso":
      return "Esa cuenta no tiene acceso al panel. Entrá con la cuenta de la propietaria.";
    case "sin-base":
      return "El panel está cerrado porque este sitio se publicó sin las claves de la base de datos. Cargá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel, marcá el entorno Production y volvé a desplegar.";
    default:
      return "";
  }
}

export function FormularioIngreso() {
  const router = useRouter();
  const parametros = useSearchParams();
  const { entrar, conBase } = useSesion();

  /* El atajo sin contraseña existe sólo para recorrer la demostración local. */
  const enDemostracion = !conBase && process.env.NODE_ENV !== "production";

  const [email, setEmail] = useState(enDemostracion ? "maria@lafedepartamentos.com.ar" : "");
  const [clave, setClave] = useState(enDemostracion ? "demostracion" : "");
  const [verClave, setVerClave] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(() => explicar(parametros.get("error"), parametros.get("correo")));

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    if (enDemostracion) {
      setTimeout(() => router.push(parametros.get("volver") ?? "/admin"), 400);
      return;
    }

    if (!conBase) {
      setCargando(false);
      setError(explicar("sin-base", null));
      return;
    }

    const r = await entrar(email, clave);
    setCargando(false);
    if (r.ok) router.push(parametros.get("volver") ?? "/admin");
    else setError(r.error);
  };

  return (
    <form onSubmit={(e) => void enviar(e)} className="mt-9">
      <div className="space-y-4">
        <div>
          <Etiqueta htmlFor="usuario">Correo electrónico</Etiqueta>
          <Entrada
            id="usuario"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Etiqueta htmlFor="clave">Contraseña</Etiqueta>
          <div className="relative">
            <Entrada
              id="clave"
              type={verClave ? "text" : "password"}
              autoComplete="current-password"
              required
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setVerClave((v) => !v)}
              aria-label={verClave ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-texto-tenue transition-colors hover:bg-hueso hover:text-ink"
            >
              {verClave ? <EyeOff className="size-4" strokeWidth={1.6} /> : <Eye className="size-4" strokeWidth={1.6} />}
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-4 rounded-sm bg-alerta/8 px-3.5 py-2.5 text-[0.85rem] text-alerta">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-4">
        <label className="flex items-center gap-2.5 text-[0.84rem] text-texto-suave">
          <input type="checkbox" defaultChecked className="size-4 accent-[#b07d2b]" />
          Mantener sesión iniciada
        </label>
        <a
          href="/recuperar"
          className="text-[0.84rem] font-medium text-oro-oscuro hover:underline"
        >
          Olvidé mi contraseña
        </a>
      </div>

      <Boton type="submit" variante="principal" medida="lg" className="mt-7 w-full gap-2" disabled={cargando}>
        <LogIn className="size-4" strokeWidth={1.8} aria-hidden />
        {cargando ? "Ingresando…" : "Ingresar"}
      </Boton>

      {enDemostracion ? (
        <p className="mt-6 rounded-sm border border-linea bg-white px-4 py-3 text-[0.78rem] leading-relaxed text-texto-suave">
          <span className="font-semibold text-ink">Demostración local:</span> no hay base de
          datos conectada, así que cualquier envío entra al panel. Esto sólo funciona en tu
          computadora: publicado, el panel queda cerrado hasta configurar Supabase.
        </p>
      ) : null}
    </form>
  );
}
