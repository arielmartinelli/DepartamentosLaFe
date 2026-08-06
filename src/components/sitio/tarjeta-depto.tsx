import Link from "next/link";
import { Star } from "lucide-react";
import { Insignia } from "@/components/ui/insignia";
import { Foto } from "./foto";
import { buscarEdificio } from "@/lib/data";
import type { Departamento } from "@/lib/tipos";
import { cn, formatearPrecio } from "@/lib/utils";

export function TarjetaDepto({
  dep,
  mostrarEdificio = false,
  prioridad = false,
  className,
}: {
  dep: Departamento;
  mostrarEdificio?: boolean;
  prioridad?: boolean;
  className?: string;
}) {
  const edificio = buscarEdificio(dep.edificioId);
  const libre = dep.estado === "disponible";

  return (
    <article className={cn("group", className)}>
      <Link href={`/departamentos/${dep.slug}`} className="block rounded-lg outline-offset-4">
        <div className="relative">
          <Foto
            src={dep.fotos[0]}
            alt={`${edificio?.nombre} — ${dep.nombre}`}
            zoom
            prioridad={prioridad}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
            className="aspect-4/3 w-full rounded-lg"
          />
          {!libre ? (
            <span className="absolute left-3 top-3">
              <Insignia tono="blanco">
                {dep.estado === "ocupado" ? "Ocupado ahora" : "Con reserva"}
              </Insignia>
            </span>
          ) : null}
        </div>

        <div className="pt-3.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-sans text-[1rem] font-semibold tracking-[-0.012em] text-ink">
              {mostrarEdificio ? `${edificio?.nombre} · ` : ""}
              {dep.nombre}
            </h3>
            <span className="flex shrink-0 items-center gap-1 pt-0.5 text-[0.85rem] text-ink">
              <Star className="size-3.5 fill-ink text-ink" strokeWidth={0} aria-hidden />
              <span className="tabular-nums">{dep.puntaje.toFixed(2)}</span>
              <span className="text-texto-tenue">({dep.opiniones})</span>
            </span>
          </div>

          <p className="mt-1 text-[0.875rem] leading-snug text-texto-suave">{dep.resumen}</p>

          <p className="mt-1.5 text-[0.875rem] text-texto-tenue">
            {dep.capacidad} huéspedes · {dep.dormitorios}{" "}
            {dep.dormitorios === 1 ? "dormitorio" : "dormitorios"} · {dep.metros} m²
          </p>

          <p className="mt-3 text-[0.9rem] text-ink">
            <span className="font-semibold">{formatearPrecio(dep.precioNoche)}</span>
            <span className="text-texto-suave"> la noche</span>
          </p>
        </div>
      </Link>
    </article>
  );
}
