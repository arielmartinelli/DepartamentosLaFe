import Link from "next/link";
import type { ReactNode } from "react";

/** Envoltorio común de las pantallas de cuenta. */
export function TarjetaCuenta({
  titulo,
  bajada,
  children,
  pie,
}: {
  titulo: string;
  bajada: string;
  children: ReactNode;
  pie?: ReactNode;
}) {
  return (
    <div className="contenedor flex min-h-[80svh] items-center justify-center py-32">
      <div className="w-full max-w-md">
        <h1 className="text-[clamp(1.9rem,4vw,2.6rem)] leading-tight">{titulo}</h1>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-texto-suave">{bajada}</p>

        <div className="mt-8 rounded-xl border border-linea bg-white p-6 shadow-carta sm:p-7">
          {children}
        </div>

        {pie ? <div className="mt-6 text-center text-[0.875rem] text-texto-suave">{pie}</div> : null}

        <p className="mt-8 rounded-md bg-hueso px-4 py-3 text-[0.78rem] leading-relaxed text-texto-suave">
          <span className="font-semibold text-ink">Demostración:</span> las cuentas se
          guardan en este navegador. Al conectar el backend se reemplaza por autenticación
          real, sin cambiar estas pantallas.
        </p>

        <p className="mt-5 text-center text-[0.8rem] text-texto-tenue">
          <Link href="/" className="transition-colors hover:text-ink">
            Volver al sitio
          </Link>
        </p>
      </div>
    </div>
  );
}
