"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, Phone, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Boton } from "@/components/ui/boton";
import { useSesion } from "@/lib/sesion";
import { sitio, urlWhatsApp } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * El logotipo está dibujado en blanco y oro, así que sobre fondo claro
 * se apoya en una placa oscura. Es la misma pieza, montada.
 */
function Logotipo({ enPlaca }: { enPlaca: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center transition-[background-color,padding] duration-300 ease-salida",
        enPlaca ? "rounded-md bg-ink px-3 py-2" : "px-0 py-0",
      )}
    >
      <Image
        src={sitio.marca.logo}
        alt={sitio.nombre}
        width={1200}
        height={465}
        priority
        className={cn("w-auto transition-[height] duration-300", enPlaca ? "h-6 sm:h-7" : "h-8 sm:h-9")}
      />
    </span>
  );
}

export function Nav() {
  const ruta = usePathname();
  const { cuenta } = useSesion();
  const enPortada = ruta === "/";
  const [abierto, setAbierto] = useState(false);
  const [scrolleado, setScrolleado] = useState(false);

  useEffect(() => {
    const alScroll = () => setScrolleado(window.scrollY > 24);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  const solida = !enPortada || scrolleado;

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Saltar al contenido
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ease-salida",
          solida
            ? "border-b border-linea bg-white/92 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Navegación principal"
          className="contenedor flex h-[4.5rem] items-center justify-between gap-6 sm:h-20"
        >
          <Link href="/" aria-label={`${sitio.nombre} — inicio`} className="shrink-0">
            <Logotipo enPlaca={solida} />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {sitio.navegacion.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-full px-3.5 py-2 text-[0.875rem] font-medium transition-colors duration-200",
                    solida
                      ? "text-texto-suave hover:bg-hueso hover:text-ink"
                      : "text-white/80 hover:bg-white/12 hover:text-white",
                  )}
                >
                  {item.etiqueta}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={sitio.contacto.telefonoHref}
              className={cn(
                "hidden items-center gap-2 rounded-full px-3.5 py-2 text-[0.875rem] font-medium transition-colors duration-200 xl:inline-flex",
                solida ? "text-texto-suave hover:text-ink" : "text-white/80 hover:text-white",
              )}
            >
              <Phone className="size-4" strokeWidth={1.6} aria-hidden />
              {sitio.contacto.telefono}
            </a>

            <Link
              href={cuenta ? "/mis-consultas" : "/entrar"}
              aria-label={cuenta ? "Mis consultas" : "Entrar a mi cuenta"}
              className={cn(
                "hidden items-center gap-2 rounded-full px-3 py-2 text-[0.875rem] font-medium transition-colors duration-200 sm:inline-flex",
                solida ? "text-texto-suave hover:bg-hueso hover:text-ink" : "text-white/80 hover:bg-white/12 hover:text-white",
              )}
            >
              <UserRound className="size-4" strokeWidth={1.7} aria-hidden />
              {cuenta ? cuenta.nombre.split(" ")[0] : "Mi cuenta"}
            </Link>

            <Boton
              asChild
              variante={solida ? "principal" : "vidrio"}
              medida="sm"
              pastilla
              className="hidden sm:inline-flex"
            >
              <a href={urlWhatsApp()} target="_blank" rel="noopener noreferrer">
                Consultar disponibilidad
              </a>
            </Boton>

            <button
              type="button"
              onClick={() => setAbierto(true)}
              aria-label="Abrir menú"
              aria-expanded={abierto}
              className={cn(
                "grid size-10 place-items-center rounded-full transition-colors duration-200 lg:hidden",
                solida ? "text-ink hover:bg-hueso" : "text-white hover:bg-white/12",
              )}
            >
              <Menu className="size-5" strokeWidth={1.7} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {abierto ? (
          <motion.div
            className="fixed inset-0 z-60 flex flex-col bg-white lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="contenedor flex h-[4.5rem] items-center justify-between sm:h-20">
              <Logotipo enPlaca />
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar menú"
                className="grid size-10 place-items-center rounded-full text-ink hover:bg-hueso"
              >
                <X className="size-5" strokeWidth={1.7} />
              </button>
            </div>

            <div className="contenedor flex grow flex-col justify-center pb-16">
              <ul>
                {sitio.navegacion.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.04, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setAbierto(false)}
                      className="block border-b border-linea-suave py-4 font-display text-[1.75rem] text-ink"
                    >
                      {item.etiqueta}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-3">
                <Boton asChild variante="principal" medida="lg" pastilla>
                  <a href={urlWhatsApp()} target="_blank" rel="noopener noreferrer">
                    Hablar por WhatsApp
                  </a>
                </Boton>
                <Boton asChild variante="contorno" medida="lg" pastilla>
                  <Link href={cuenta ? "/mis-consultas" : "/entrar"} onClick={() => setAbierto(false)}>
                    {cuenta ? "Mis consultas" : "Entrar a mi cuenta"}
                  </Link>
                </Boton>
                <a
                  href={sitio.contacto.telefonoHref}
                  className="text-center text-[0.9rem] text-texto-suave"
                >
                  {sitio.contacto.telefono}
                </a>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
