"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { motion } from "motion/react";
import { Boton } from "@/components/ui/boton";
import { useContenido } from "@/lib/contenido";
import { foto } from "@/lib/imagenes";
import { sitio } from "@/lib/site";
import { useResolverImagen } from "@/lib/usar-imagen";

export function Hero() {
  const { ajustes } = useContenido();
  const resolver = useResolverImagen();
  const portada = resolver(ajustes.portada) || foto.fachada;

  return (
    <section id="inicio" className="relative pb-10 pt-20 sm:pt-24">
      <div className="contenedor">
        {/* Banner principal presentado de forma limpia sin textos ni velos oscuros que pisen la imagen gráfica */}
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
          className="group relative w-full overflow-hidden rounded-2xl border border-linea/60 bg-hueso shadow-alza"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[2/1] lg:aspect-[2.2/1]">
            <Image
              src={portada}
              alt="Departamentos La Fe — Ushuaia"
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              unoptimized={portada.startsWith("data:")}
              className="object-cover object-center transition-transform duration-1000 ease-salida group-hover:scale-[1.02]"
            />
          </div>
        </motion.div>

        {/* Barra de acciones e información ubicada justo abajo del banner para no tapar la imagen */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className="mt-5 flex flex-col gap-4 rounded-xl border border-linea/80 bg-white p-4 shadow-carta sm:flex-row sm:items-center sm:justify-between sm:px-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-oro/10 text-oro">
              <Star className="size-4 fill-oro text-oro" strokeWidth={0} aria-hidden />
            </div>
            <div>
              <p className="text-[0.925rem] font-semibold text-ink">
                4,93 <span className="font-normal text-texto-suave">· 231 opiniones</span>
              </p>
              <p className="text-[0.78rem] text-texto-tenue">
                Atendido directamente por sus dueños · {sitio.ciudad}, {sitio.provincia}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Boton
              asChild
              variante="principal"
              medida="md"
              pastilla
              className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-alza"
            >
              <a href="#departamentos">Ver los departamentos</a>
            </Boton>
            <Boton
              asChild
              variante="oro"
              medida="md"
              pastilla
              className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-alza"
            >
              <a
                href={`https://wa.me/${ajustes.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultar disponibilidad
              </a>
            </Boton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
