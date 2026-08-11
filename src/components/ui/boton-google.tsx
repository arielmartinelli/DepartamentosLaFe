"use client";

import { useState } from "react";
import { useSesion } from "@/lib/sesion";

/** El logotipo oficial, en sus cuatro colores: es como Google pide que se use. */
function LogoGoogle() {
  return (
    <svg viewBox="0 0 48 48" className="size-[1.15rem] shrink-0" aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A13.2 13.2 0 0 1 11 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

/**
 * Entrar con Google. Sirve tanto para crear la cuenta como para volver:
 * si el correo ya existe, Google reconoce a la persona y entra directo.
 */
export function BotonGoogle({
  destino,
  texto = "Continuar con Google",
}: {
  destino?: string;
  texto?: string;
}) {
  const { entrarConGoogle, conBase } = useSesion();
  const [yendo, setYendo] = useState(false);
  const [error, setError] = useState("");

  if (!conBase) return null;

  const ir = async () => {
    setError("");
    setYendo(true);
    const r = await entrarConGoogle(destino);
    if (!r.ok) {
      setYendo(false);
      setError(r.mensaje);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3" aria-hidden>
        <span className="h-px grow bg-linea" />
        <span className="text-[0.72rem] uppercase tracking-[0.14em] text-texto-tenue">o</span>
        <span className="h-px grow bg-linea" />
      </div>

      <button
        type="button"
        onClick={() => void ir()}
        disabled={yendo}
        className="flex w-full items-center justify-center gap-3 rounded-full border border-linea bg-white px-5 py-3 font-sans text-[0.92rem] font-medium text-ink transition-colors duration-200 hover:bg-hueso focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60"
      >
        <LogoGoogle />
        {yendo ? "Abriendo Google…" : texto}
      </button>

      {error ? (
        <p role="alert" className="rounded-sm bg-alerta/8 px-3.5 py-2.5 text-[0.85rem] text-alerta">
          {error}
        </p>
      ) : null}
    </div>
  );
}
