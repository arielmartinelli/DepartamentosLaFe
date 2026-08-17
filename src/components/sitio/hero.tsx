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
    <section id="inicio" className="relative">
      <div className="group relative h-[min(94svh,52rem)] min-h-[34rem] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.3, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0 size-full overflow-hidden"
        >
          <Image
            src={portada}
            alt="Fachada de Departamentos La Fe al atardecer, con el cordón montañoso de Ushuaia detrás"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            unoptimized={portada.startsWith("data:")}
            className="object-cover object-center transition-transform duration-1000 ease-salida group-hover:scale-105"
          />
        </motion.div>
        <div aria-hidden className="velo-foto absolute inset-0 transition-opacity duration-700 group-hover:opacity-90" />

        <div className="contenedor absolute inset-x-0 bottom-0 pb-16 sm:pb-20 lg:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="text-[0.8rem] font-medium tracking-wide uppercase text-white/80"
          >
            {sitio.ciudad}, {sitio.provincia}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="mt-3 max-w-3xl text-[clamp(2.9rem,8vw,6rem)] leading-[0.94] text-white drop-shadow-sm"
          >
            Viví Ushuaia sin apuro
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/85"
          >
            Seis departamentos propios en dos edificios, a cinco cuadras del centro.
            Llegás, dejás las valijas y salís a caminar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Boton asChild variante="blanco" medida="lg" pastilla className="transition-all duration-300 hover:-translate-y-0.5 hover:shadow-alza">
              <a href="#departamentos">Ver los departamentos</a>
            </Boton>
            <Boton asChild variante="vidrio" medida="lg" pastilla className="transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/25">
              <a
                href={`https://wa.me/${ajustes.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Consultar disponibilidad
              </a>
            </Boton>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease: [0.23, 1, 0.32, 1] }}
            className="mt-8 flex items-center gap-2.5 text-white/80"
          >
            <Star className="size-4 fill-white text-white transition-transform duration-300 hover:scale-125" strokeWidth={0} aria-hidden />
            <span className="text-[0.875rem]">
              <span className="font-semibold text-white">4,93</span> · 231 opiniones ·
              atendido por sus dueños
            </span>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
