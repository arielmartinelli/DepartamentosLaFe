"use client";

import Link from "next/link";
import {
  Bath,
  BedDouble,
  ChevronRight,
  CookingPot,
  KeyRound,
  Maximize,
  Mountain,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import { CalendarioDepto } from "./calendario-depto";
import { Cercanias } from "./cercanias";
import { GaleriaDepto } from "./galeria-depto";
import { Mapa } from "./mapa";
import { PanelReserva } from "./panel-reserva";
import { Revelar } from "./revelar";
import { TarjetaDepto } from "./tarjeta-depto";
import { iconos } from "./iconos-servicio";
import { Boton } from "@/components/ui/boton";
import { useContenido } from "@/lib/contenido";
import { horarios, politicas } from "@/lib/data";
import { formatearPrecio } from "@/lib/utils";

function Bloque({
  titulo,
  children,
  id,
}: {
  titulo?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-linea py-9 first:border-t-0 first:pt-0">
      {titulo ? (
        <h2 className="mb-6 font-display text-[1.5rem] leading-tight text-ink">{titulo}</h2>
      ) : null}
      {children}
    </section>
  );
}

export function FichaDepartamento({ slug }: { slug: string }) {
  const { departamentos, edificios, prestaciones } = useContenido();

  const dep = departamentos.find((d) => d.slug === slug);
  if (!dep) return null;

  const ed = edificios.find((e) => e.id === dep.edificioId);
  if (!ed) return null;

  const hermanos = departamentos.filter((d) => d.edificioId === ed.id && d.id !== dep.id);
  const suyos = prestaciones.filter((p) => p.activo && dep.servicios.includes(p.id));

  const destacados = [
    {
      icono: KeyRound,
      titulo: "Entrada independiente",
      detalle: "Vas a tener el departamento para vos, sin pasar por espacios comunes.",
    },
    {
      icono: ShieldCheck,
      titulo: "Atendido por la dueña",
      detalle: "María vive en la propiedad y resuelve cualquier cosa en el momento.",
    },
    { icono: Mountain, titulo: `Vista: ${dep.vista}`, detalle: ed.aLosPies },
  ];

  return (
    <>
      <div className="contenedor pt-28 sm:pt-32">
        <nav
          aria-label="Migas de pan"
          className="flex flex-wrap items-center gap-1.5 text-[0.8rem] text-texto-tenue"
        >
          <Link href="/" className="transition-colors hover:text-ink">Inicio</Link>
          <ChevronRight className="size-3.5" strokeWidth={1.8} aria-hidden />
          <span>{ed.nombre}</span>
          <ChevronRight className="size-3.5" strokeWidth={1.8} aria-hidden />
          <span className="text-texto-suave">{dep.nombre}</span>
        </nav>

        <header className="mt-4">
          <h1 className="text-[clamp(2rem,4.6vw,3rem)] leading-[1.03]">
            {ed.nombre} · {dep.nombre}
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.9rem] text-texto-suave">
            <span className="flex items-center gap-1.5 text-ink">
              <Star className="size-3.5 fill-ink text-ink" strokeWidth={0} aria-hidden />
              <span className="font-semibold tabular-nums">{dep.puntaje.toFixed(2)}</span>
              <span className="text-texto-suave">· {dep.opiniones} opiniones</span>
            </span>
            <span aria-hidden>·</span>
            <span>{dep.piso}</span>
            <span aria-hidden>·</span>
            <span>{ed.direccion}</span>
          </p>
        </header>
      </div>

      <div className="contenedor mt-7">
        <GaleriaDepto fotos={dep.fotos} titulo={`${ed.nombre} · ${dep.nombre}`} />
      </div>

      <div className="contenedor mt-10 grid gap-10 pb-20 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-16">
        {/* En móvil el panel va arriba; en escritorio queda pegado a la derecha. */}
        <aside className="lg:order-2 lg:sticky lg:top-28 lg:self-start">
          <PanelReserva dep={dep} edificio={ed.nombre} />
        </aside>

        <div className="lg:order-1">
          <Bloque>
            <h2 className="font-display text-[1.6rem] leading-tight text-ink">{dep.resumen}</h2>
            <ul className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.95rem] text-texto-suave">
              <li className="flex items-center gap-1.5">
                <Users className="size-4 text-oro" strokeWidth={1.6} aria-hidden />
                {dep.capacidad} huéspedes
              </li>
              <li aria-hidden>·</li>
              <li className="flex items-center gap-1.5">
                <BedDouble className="size-4 text-oro" strokeWidth={1.6} aria-hidden />
                {dep.dormitorios} {dep.dormitorios === 1 ? "dormitorio" : "dormitorios"}
              </li>
              <li aria-hidden>·</li>
              <li className="flex items-center gap-1.5">
                <Bath className="size-4 text-oro" strokeWidth={1.6} aria-hidden />
                {dep.banos} {dep.banos === 1 ? "baño" : "baños"}
              </li>
              <li aria-hidden>·</li>
              <li className="flex items-center gap-1.5">
                <Maximize className="size-4 text-oro" strokeWidth={1.6} aria-hidden />
                {dep.metros} m²
              </li>
              <li aria-hidden>·</li>
              <li>{formatearPrecio(dep.precioNoche)} la noche</li>
            </ul>
          </Bloque>

          <Bloque>
            <ul className="space-y-6">
              {destacados.map(({ icono: Icono, titulo, detalle }) => (
                <li key={titulo} className="flex gap-4">
                  <Icono className="mt-0.5 size-5 shrink-0 text-ink" strokeWidth={1.4} aria-hidden />
                  <span>
                    <span className="block text-[0.95rem] font-semibold text-ink">{titulo}</span>
                    <span className="mt-0.5 block text-[0.9rem] leading-snug text-texto-suave">
                      {detalle}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Bloque>

          <Bloque>
            <p className="max-w-2xl text-[1rem] leading-relaxed text-texto">{dep.descripcion}</p>
            {dep.parrafoExtra ? (
              <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-texto-suave">
                {dep.parrafoExtra}
              </p>
            ) : null}
          </Bloque>

          {dep.camas.length ? (
            <Bloque titulo="Dónde vas a dormir">
              <ul className="grid gap-4 sm:grid-cols-2">
                {dep.camas.map((c) => (
                  <li key={c.ambiente + c.tipo} className="rounded-lg border border-linea p-5">
                    <BedDouble className="size-6 text-ink" strokeWidth={1.3} aria-hidden />
                    <p className="mt-4 text-[0.95rem] font-semibold text-ink">{c.ambiente}</p>
                    <p className="mt-1 text-[0.875rem] text-texto-suave">
                      {c.cantidad > 1 ? `${c.cantidad} × ` : ""}
                      {c.tipo}
                    </p>
                  </li>
                ))}
              </ul>
            </Bloque>
          ) : null}

          <Bloque titulo="Lo que ofrece este departamento">
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {suyos.map((s) => {
                const Icono = iconos[s.icono];
                return (
                  <li key={s.id} className="flex items-center gap-3.5 py-1">
                    {Icono ? (
                      <Icono className="size-5 shrink-0 text-ink" strokeWidth={1.35} aria-hidden />
                    ) : null}
                    <span className="text-[0.925rem] text-texto">{s.nombre}</span>
                  </li>
                );
              })}
              {dep.comodidades.map((c) => (
                <li key={c} className="flex items-center gap-3.5 py-1">
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-oro" />
                  <span className="text-[0.925rem] text-texto">{c}</span>
                </li>
              ))}
            </ul>
          </Bloque>

          {dep.cocina.length || dep.bano.length ? (
            <Bloque titulo="Cocina y baño">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-2.5 text-[0.95rem] font-semibold text-ink">
                    <CookingPot className="size-5 text-oro" strokeWidth={1.4} aria-hidden />
                    Cocina
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {dep.cocina.map((c) => (
                      <li key={c} className="text-[0.9rem] leading-snug text-texto-suave">{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="flex items-center gap-2.5 text-[0.95rem] font-semibold text-ink">
                    <Bath className="size-5 text-oro" strokeWidth={1.4} aria-hidden />
                    Baño
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {dep.bano.map((b) => (
                      <li key={b} className="text-[0.9rem] leading-snug text-texto-suave">{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Bloque>
          ) : null}

          <Bloque titulo="Fechas libres" id="disponibilidad">
            <CalendarioDepto departamentoId={dep.id} />
          </Bloque>

          <Bloque titulo="Horarios y condiciones">
            <dl className="grid gap-6 sm:grid-cols-3">
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
                  Estadía mínima
                </dt>
                <dd className="mt-1.5 font-display text-xl text-ink">2 noches</dd>
              </div>
            </dl>
            <ul className="mt-8 space-y-3">
              {politicas.map((p) => (
                <li key={p} className="flex gap-3 text-[0.9rem] leading-relaxed text-texto-suave">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-linea" />
                  {p}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-md bg-hueso p-4 text-[0.875rem] leading-relaxed text-texto">
              {horarios.nota}
            </p>
          </Bloque>
        </div>
      </div>

      <div className="border-t border-linea bg-hueso py-20 sm:py-24">
        <div className="contenedor">
          <Cercanias />
        </div>
      </div>

      <div className="contenedor py-20 sm:py-24">
        <Revelar className="max-w-2xl">
          <h2 className="titulo-seccion">Dónde queda</h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-texto-suave">
            {ed.direccion}. {ed.aLosPies}. La dirección exacta se confirma al reservar.
          </p>
        </Revelar>
        <Revelar className="mt-10">
          <Mapa
            lat={ed.coordenadas.lat}
            lng={ed.coordenadas.lng}
            titulo={ed.nombre}
            direccion={ed.direccion}
          />
        </Revelar>
      </div>

      {hermanos.length ? (
        <div className="border-t border-linea py-20 sm:py-24">
          <div className="contenedor">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="titulo-seccion">Otros departamentos de {ed.nombre}</h2>
              <Boton asChild variante="contorno" medida="md" pastilla>
                <Link href="/#departamentos">Ver los seis</Link>
              </Boton>
            </div>
            <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {hermanos.map((d) => (
                <TarjetaDepto key={d.id} dep={d} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
