"use client";

import Link from "next/link";
import { Pencil, Star } from "lucide-react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { EstadoDeptoTag } from "@/components/admin/estado";
import { EsqueletoTarjetas } from "@/components/admin/esqueleto";
import { Foto } from "@/components/sitio/foto";
import { Boton } from "@/components/ui/boton";
import { useContenido } from "@/lib/contenido";
import { useCargandoInicial } from "@/lib/usar-carga";
import { cn, formatearPrecio } from "@/lib/utils";

export default function PaginaDepartamentos() {
  const { departamentos, edificios, alternarDestacado } = useContenido();
  const cargando = useCargandoInicial();

  return (
    <>
      <EncabezadoPagina
        titulo="Departamentos"
        descripcion="Seis unidades en dos edificios. Entrá a cada una para editar información, servicios, galería y disponibilidad."
      />

      {cargando ? (
        <div className="space-y-10">
          <EsqueletoTarjetas cantidad={4} />
          <EsqueletoTarjetas cantidad={2} />
        </div>
      ) : null}

      {cargando ? null : edificios.map((ed) => {
        const unidades = departamentos.filter((d) => d.edificioId === ed.id);
        if (!unidades.length) return null;

        return (
          <section key={ed.id} className="mb-10">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 className="font-display text-xl text-ink">{ed.nombre}</h2>
              <p className="text-[0.82rem] text-texto-suave">{ed.direccion}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {unidades.map((d) => (
                <article
                  key={d.id}
                  className="flex flex-col overflow-hidden rounded-xl border border-linea bg-white transition-shadow duration-200 ease-salida hover:shadow-carta"
                >
                  <div className="relative">
                    <Foto
                      src={d.fotos[0]}
                      alt={d.nombre}
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="aspect-16/9 w-full"
                    />
                    <button
                      type="button"
                      onClick={() => alternarDestacado(d.id)}
                      aria-pressed={d.destacado}
                      aria-label={`${d.destacado ? "Quitar de" : "Destacar en"} la portada`}
                      className={cn(
                        "absolute right-3 top-3 grid size-9 place-items-center rounded-full backdrop-blur-sm transition-colors duration-200",
                        d.destacado ? "bg-oro text-white" : "bg-white/90 text-texto-suave hover:text-ink",
                      )}
                    >
                      <Star className="size-4" strokeWidth={1.7} fill={d.destacado ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <div className="flex grow flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-sans text-[0.95rem] font-semibold text-ink">{d.nombre}</h3>
                      <EstadoDeptoTag estado={d.estado} />
                    </div>

                    <p className="mt-2 line-clamp-2 text-[0.85rem] leading-snug text-texto-suave">
                      {d.resumen}
                    </p>

                    <dl className="mt-4 grid grid-cols-4 gap-2 border-y border-linea-suave py-3 text-center">
                      {[
                        ["Huésp.", d.capacidad],
                        ["Dorm.", d.dormitorios],
                        ["Baños", d.banos],
                        ["Fotos", d.fotos.length],
                      ].map(([k, v]) => (
                        <div key={String(k)}>
                          <dt className="text-[0.66rem] text-texto-tenue">{k}</dt>
                          <dd className="mt-0.5 text-[0.9rem] font-semibold tabular-nums text-ink">{v}</dd>
                        </div>
                      ))}
                    </dl>

                    <p className="mt-4 text-[0.85rem] text-texto-suave">
                      <span className="font-display text-xl text-ink">
                        {formatearPrecio(d.precioNoche)}
                      </span>{" "}
                      / noche
                    </p>

                    <Boton asChild variante="contorno" medida="sm" className="mt-auto w-full pt-0 [&]:mt-5">
                      <Link href={`/admin/departamentos/${d.id}`}>
                        <Pencil strokeWidth={1.6} /> Editar departamento
                      </Link>
                    </Boton>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
