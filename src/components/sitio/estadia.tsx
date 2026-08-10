"use client";

import { Foto } from "./foto";
import { Revelar } from "./revelar";
import { iconos } from "./iconos-servicio";
import { useContenido } from "@/lib/contenido";
import { horarios } from "@/lib/data";
import { foto } from "@/lib/imagenes";

export function Estadia() {
  const { prestaciones, galerias } = useContenido();

  const sector = galerias.find((g) => g.tipo === "estadia");
  const imagen =
    sector?.imagenes.find((i) => i.principal)?.src ?? sector?.imagenes[0]?.src ?? foto.comedorMadera;
  const lista = [...prestaciones]
    .filter((s) => s.activo && s.destacadoEnHome)
    .sort((a, b) => a.orden - b.orden);

  return (
    <section
      id="estadia"
      aria-labelledby="estadia-titulo"
      className="scroll-mt-24 py-20 sm:py-28 lg:py-32"
    >
      <div className="contenedor grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <Revelar className="lg:col-span-6">
          <Foto
            src={imagen}
            alt="Mesa de madera junto a la ventana, puesta para el desayuno"
            zoom
            sizes="(max-width: 1024px) 100vw, 46vw"
            className="aspect-4/5 w-full rounded-xl"
          />
        </Revelar>

        <div className="lg:col-span-6 lg:pt-6">
          <Revelar>
            <h2 id="estadia-titulo" className="titulo-seccion">
              Contamos con todo lo que necesitas
            </h2>
            <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-texto-suave">
              Lo que figura acá viene incluido en los seis departamentos y no se cobra
              aparte. Sin cargos por limpieza ni por ropa de cama.
            </p>
          </Revelar>

          <Revelar retraso={0.06}>
            <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {lista.map((s) => {
                const Icono = iconos[s.icono];
                return (
                  <li key={s.id} className="flex gap-3.5">
                    {s.foto ? (
                      <Foto
                        src={s.foto}
                        alt=""
                        sizes="48px"
                        className="size-11 shrink-0 rounded-md"
                      />
                    ) : Icono ? (
                      <Icono className="mt-0.5 size-5 shrink-0 text-oro" strokeWidth={1.4} aria-hidden />
                    ) : null}
                    <span>
                      <span className="block text-[0.925rem] font-semibold text-ink">{s.nombre}</span>
                      <span className="mt-0.5 block text-[0.85rem] leading-snug text-texto-suave">
                        {s.descripcion}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Revelar>

          <Revelar retraso={0.1}>
            <dl className="mt-12 grid gap-6 border-t border-linea pt-8 sm:grid-cols-3">
              <div>
                <dt className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-texto-tenue">
                  Ingreso
                </dt>
                <dd className="mt-1.5 font-display text-xl text-ink">{horarios.ingreso}</dd>
              </div>
              <div>
                <dt className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-texto-tenue">
                  Salida
                </dt>
                <dd className="mt-1.5 font-display text-xl text-ink">{horarios.salida}</dd>
              </div>
              <div>
                <dt className="text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-texto-tenue">
                  Vuelos de madrugada
                </dt>
                <dd className="mt-1.5 text-[0.875rem] leading-snug text-texto-suave">
                  Coordinamos el ingreso sin costo adicional.
                </dd>
              </div>
            </dl>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
