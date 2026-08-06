"use client";

import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import { foto } from "@/lib/imagenes";
import { useContenido } from "@/lib/contenido";

export function Cierre() {
  const { ajustes } = useContenido();
  return (
    <section id="contacto" className="scroll-mt-24">
      <div className="relative isolate overflow-hidden">
        <Image
          src={foto.faroEclaireurs}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-ink/72" />

        <div className="contenedor relative py-24 text-center sm:py-32">
          <h2 className="mx-auto max-w-3xl text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.05] text-white">
            Tu próximo descanso empieza acá
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/75">
            Contanos las fechas y cuántos son. Te confirmamos disponibilidad, precio final
            y forma de pago en el día, sin vueltas ni comisiones.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Boton asChild variante="blanco" medida="lg" pastilla className="w-full sm:w-auto">
              <a href={`https://wa.me/${ajustes.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle strokeWidth={1.8} aria-hidden />
                Hablar por WhatsApp
              </a>
            </Boton>
            <Boton asChild variante="vidrio" medida="lg" pastilla className="w-full sm:w-auto">
              <a href={`tel:${ajustes.telefono.replace(/\s/g, "")}`}>
                <Phone strokeWidth={1.8} aria-hidden />
                {ajustes.telefono}
              </a>
            </Boton>
          </div>

          <p className="mt-8 text-[0.85rem] text-white/55">
            {ajustes.horarios} · {ajustes.email}
          </p>
        </div>
      </div>
    </section>
  );
}
