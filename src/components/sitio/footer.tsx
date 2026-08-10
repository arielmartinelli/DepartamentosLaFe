"use client";

import Image from "next/image";
import Link from "next/link";
import { buscarEdificio, departamentos } from "@/lib/data";
import { useContenido } from "@/lib/contenido";
import { sitio } from "@/lib/site";
import { useResolverImagen } from "@/lib/usar-imagen";

function IconoInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconoFacebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden {...props}>
      <path d="M14.6 8.4h2.2V5.6h-2.2c-2 0-3.4 1.5-3.4 3.5v1.7H9v2.8h2.2v6.8h2.9v-6.8h2.3l.4-2.8h-2.7V9.4c0-.6.3-1 .5-1Z" />
    </svg>
  );
}

export function Footer() {
  const { ajustes } = useContenido();
  const resolver = useResolverImagen();
  const logo = resolver(ajustes.logo);
  const anio = new Date().getFullYear();
  const wa = `https://wa.me/${ajustes.whatsapp}`;
  const enlace = "text-[0.875rem] text-texto-suave transition-colors duration-200 hover:text-ink";

  return (
    <footer className="border-t border-linea bg-white">
      <div className="contenedor py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <span className="inline-flex rounded-md bg-ink px-3.5 py-2.5">
              <Image
                src={logo}
                alt={sitio.nombre}
                width={1200}
                height={465}
                unoptimized={logo.startsWith("data:")}
                className="h-8 w-auto"
              />
            </span>
            <p className="mt-6 max-w-xs text-[0.9rem] leading-relaxed text-texto-suave">
              Alquiler temporario en Ushuaia, atendido por sus dueños. Dos edificios,
              seis departamentos, todo el año.
            </p>
            <div className="mt-6 flex gap-2">
              <a
                href={ajustes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Departamentos La Fe"
                className="grid size-10 place-items-center rounded-full border border-linea text-texto-suave transition-colors duration-200 hover:border-ink/30 hover:text-ink"
              >
                <IconoInstagram className="size-[1.05rem]" />
              </a>
              <a
                href={ajustes.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Departamentos La Fe"
                className="grid size-10 place-items-center rounded-full border border-linea text-texto-suave transition-colors duration-200 hover:border-ink/30 hover:text-ink"
              >
                <IconoFacebook className="size-[1.05rem]" />
              </a>
            </div>
          </div>

          <nav aria-label="Departamentos">
            <h2 className="font-sans text-[0.8rem] font-semibold text-ink">Departamentos</h2>
            <ul className="mt-5 space-y-3">
              {departamentos.map((d) => (
                <li key={d.id}>
                  <Link href={`/departamentos/${d.slug}`} className={enlace}>
                    {buscarEdificio(d.edificioId)?.nombre} · {d.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Secciones">
            <h2 className="font-sans text-[0.8rem] font-semibold text-ink">El alojamiento</h2>
            <ul className="mt-5 space-y-3">
              {sitio.navegacion.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className={enlace}>
                    {i.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-sans text-[0.8rem] font-semibold text-ink">Contacto</h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={`tel:${ajustes.telefono.replace(/\s/g, "")}`} className={enlace}>
                  {ajustes.telefono}
                </a>
              </li>
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className={enlace}>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${ajustes.email}`} className={enlace}>
                  {ajustes.email}
                </a>
              </li>
              <li className="text-[0.875rem] leading-relaxed text-texto-tenue">
                {ajustes.direccion}
              </li>
              <li className="text-[0.875rem] text-texto-tenue">{ajustes.horarios}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-linea pt-7 text-[0.8rem] text-texto-tenue sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {anio} {sitio.nombre} · {sitio.ciudad}, {sitio.provincia}
          </p>
          <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/mis-consultas" className="transition-colors duration-200 hover:text-ink">
              Mis consultas
            </Link>
            <Link href="/ingresar" className="transition-colors duration-200 hover:text-ink">
              Acceso propietaria
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
