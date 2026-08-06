import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormularioIngreso } from "@/components/admin/formulario-ingreso";
import { sitio } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ingresar al panel",
  robots: { index: false, follow: false },
};

export default function PaginaIngreso() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Panel de marca */}
      <div className="grano relative hidden overflow-hidden bg-ink lg:block">
        <Image
          src={sitio.marca.portada}
          alt=""
          fill
          sizes="50vw"
          className="object-cover opacity-30"
        />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink via-ink/70 to-ink/30" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Image
            src={sitio.marca.logo}
            alt={sitio.nombre}
            width={1200}
            height={465}
            className="h-10 w-auto"
          />
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-oro-claro">
              {sitio.coordenadas}
            </p>
            <p className="mt-5 max-w-md font-display text-[2.4rem] leading-[1.08] text-white">
              Todo el alojamiento, desde un solo lugar.
            </p>
            <p className="mt-4 max-w-sm text-[0.92rem] leading-relaxed text-white/55">
              Reservas, consultas, calendario, departamentos y contenido de la web. Sin
              planillas sueltas.
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex flex-col justify-center bg-hueso px-6 py-14 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-texto-suave transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" strokeWidth={1.7} aria-hidden />
            Volver al sitio
          </Link>

          <div className="mt-10 lg:hidden">
            <div className="inline-grid place-items-center rounded-lg bg-ink px-5 py-4">
              <Image
                src={sitio.marca.logo}
                alt={sitio.nombre}
                width={1200}
                height={465}
                className="h-8 w-auto"
              />
            </div>
          </div>

          <h1 className="mt-8 font-display text-[2.1rem] leading-tight text-ink">
            Ingresar al panel
          </h1>
          <p className="mt-3 text-[0.92rem] leading-relaxed text-texto-suave">
            Acceso exclusivo para la administración de La Fe Departamentos.
          </p>

          <FormularioIngreso />
        </div>
      </div>
    </div>
  );
}
