import Image from "next/image";
import { Star } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import { foto } from "@/lib/imagenes";
import { sitio, urlWhatsApp } from "@/lib/site";

export function Hero() {
  return (
    <section id="inicio" className="relative">
      <div className="relative h-[min(94svh,52rem)] min-h-[34rem] w-full overflow-hidden">
        <Image
          src={foto.fachada}
          alt="Fachada de La Fe Departamentos al atardecer, con el cordón montañoso de Ushuaia detrás"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="velo-foto absolute inset-0" />

        <div className="contenedor absolute inset-x-0 bottom-0 pb-16 sm:pb-20 lg:pb-24">
          <p className="text-[0.8rem] font-medium text-white/70">
            {sitio.ciudad}, {sitio.provincia}
          </p>

          <h1 className="mt-3 max-w-3xl text-[clamp(2.9rem,8vw,6rem)] leading-[0.94] text-white">
            Viví Ushuaia sin apuro
          </h1>

          <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/80">
            Seis departamentos propios en dos edificios, a cinco cuadras del centro.
            Llegás, dejás las valijas y salís a caminar.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Boton asChild variante="blanco" medida="lg" pastilla>
              <a href="#departamentos">Ver los departamentos</a>
            </Boton>
            <Boton asChild variante="vidrio" medida="lg" pastilla>
              <a href={urlWhatsApp()} target="_blank" rel="noopener noreferrer">
                Consultar disponibilidad
              </a>
            </Boton>
          </div>

          <p className="mt-8 flex items-center gap-2.5 text-white/75">
            <Star className="size-4 fill-white text-white" strokeWidth={0} aria-hidden />
            <span className="text-[0.875rem]">
              <span className="font-semibold text-white">4,93</span> · 231 opiniones ·
              atendido por sus dueños
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
