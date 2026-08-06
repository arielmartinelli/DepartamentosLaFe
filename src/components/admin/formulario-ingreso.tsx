"use client";

import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Boton } from "@/components/ui/boton";
import { Entrada, Etiqueta } from "@/components/ui/campo";

export function FormularioIngreso() {
  const router = useRouter();
  const [verClave, setVerClave] = useState(false);
  const [cargando, setCargando] = useState(false);

  const enviar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    // Demo: la validación real se resuelve al conectar la autenticación.
    setTimeout(() => router.push("/admin"), 450);
  };

  return (
    <form onSubmit={enviar} className="mt-9">
      <div className="space-y-4">
        <div>
          <Etiqueta htmlFor="usuario">Correo electrónico</Etiqueta>
          <Entrada
            id="usuario"
            type="email"
            autoComplete="username"
            defaultValue="maria@lafedepartamentos.com.ar"
            required
          />
        </div>

        <div>
          <Etiqueta htmlFor="clave">Contraseña</Etiqueta>
          <div className="relative">
            <Entrada
              id="clave"
              type={verClave ? "text" : "password"}
              autoComplete="current-password"
              defaultValue="demostracion"
              required
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setVerClave((v) => !v)}
              aria-label={verClave ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-texto-tenue transition-colors hover:bg-hueso hover:text-ink"
            >
              {verClave ? (
                <EyeOff className="size-4" strokeWidth={1.6} />
              ) : (
                <Eye className="size-4" strokeWidth={1.6} />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <label className="flex items-center gap-2.5 text-[0.84rem] text-texto-suave">
          <input type="checkbox" defaultChecked className="size-4 accent-[#c08b33]" />
          Mantener sesión iniciada
        </label>
        <button
          type="button"
          className="text-[0.84rem] font-medium text-oro-oscuro hover:underline"
        >
          Olvidé mi contraseña
        </button>
      </div>

      <Boton
        type="submit"
        variante="principal"
        medida="lg"
        className="mt-7 w-full gap-2"
        disabled={cargando}
      >
        <LogIn className="size-4" strokeWidth={1.8} aria-hidden />
        {cargando ? "Ingresando…" : "Ingresar"}
      </Boton>

      <p className="mt-6 rounded-sm border border-linea bg-white px-4 py-3 text-[0.78rem] leading-relaxed text-texto-suave">
        <span className="font-semibold text-ink">Demostración:</span> los campos vienen
        completados y cualquier envío entra al panel. La autenticación real se conecta al
        implementar el backend.
      </p>
    </form>
  );
}
