import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FormularioIngreso } from "@/components/admin/formulario-ingreso";
import { foto } from "@/lib/imagenes";
import { sitio } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ingresar al panel",
  robots: { index: false, follow: false },
};

export default function PaginaIngreso() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Misma portada que la del inicio del sitio */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src={foto.fachada}
          alt="Fachada de La Fe Departamentos al atardecer, con el cordón montañoso de Ushuaia detrás"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="velo-foto absolute inset-0" />

        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="text-[0.75rem] font-medium text-white/70">
            {sitio.ciudad}, {sitio.provincia}
          </p>
          <p className="mt-4 max-w-md font-display text-[2.6rem] leading-[1.05] text-white">
            Todo el alojamiento, desde un solo lugar.
          </p>
          <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-white/75">
            Reservas, consultas, calendario, departamentos y contenido de la web. Sin
            planillas sueltas.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex flex-col justify-center bg-white px-6 py-14 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-texto-suave transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-4" strokeWidth={1.7} aria-hidden />
            Volver al sitio
          </Link>

          <h1 className="mt-10 font-display text-[2.1rem] leading-tight text-ink">
            Ingresar al panel
          </h1>
          <p className="mt-3 text-[0.92rem] leading-relaxed text-texto-suave">
            Acceso exclusivo para la administración de {sitio.nombre}.
          </p>

          <FormularioIngreso />
        </div>
      </div>
    </div>
  );
}
