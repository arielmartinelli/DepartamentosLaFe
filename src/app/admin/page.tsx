"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CalendarCheck,
  Inbox,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { Metrica } from "@/components/admin/metrica";
import { Panel, PanelCabecera } from "@/components/admin/tarjeta";
import { EstadoReservaTag } from "@/components/admin/estado";
import { Boton } from "@/components/ui/boton";
import { Insignia } from "@/components/ui/insignia";
import { useContenido } from "@/lib/contenido";
import { formatearFecha, formatearPrecio, iniciales, noches } from "@/lib/utils";

const tonoConsulta = { nueva: "oro", respondida: "exito", archivada: "neutro" } as const;
const rotuloConsulta = { nueva: "Nueva", respondida: "Respondida", archivada: "Archivada" };

export default function PanelPrincipal() {
  const { reservas, consultas, departamentos, edificios, bloqueos } = useContenido();
  const hoy = new Date().toISOString().slice(0, 10);

  const d = useMemo(() => {
    const pendientes = reservas.filter((r) => r.estado === "pendiente");
    const confirmadas = reservas.filter((r) => r.estado === "confirmada");
    const nuevas = consultas.filter((c) => c.estado === "nueva");

    const entradas = reservas
      .filter((r) => r.estado !== "cancelada" && r.desde >= hoy)
      .sort((a, b) => a.desde.localeCompare(b.desde))
      .slice(0, 5);

    const salidas = reservas
      .filter((r) => r.estado !== "cancelada" && r.hasta >= hoy)
      .sort((a, b) => a.hasta.localeCompare(b.hasta))
      .slice(0, 5);

    const ingresos = confirmadas.reduce((t, r) => t + r.total, 0);
    const nochesVendidas = confirmadas.reduce((t, r) => t + noches(r.desde, r.hasta), 0);

    return { pendientes, confirmadas, nuevas, entradas, salidas, ingresos, nochesVendidas };
  }, [reservas, consultas, hoy]);

  const nombre = (id: string | null) => {
    if (!id) return "Consulta general";
    const dep = departamentos.find((x) => x.id === id);
    if (!dep) return "—";
    return `${edificios.find((e) => e.id === dep.edificioId)?.nombre} · ${dep.nombre}`;
  };

  return (
    <>
      <EncabezadoPagina
        titulo="Buen día, María"
        descripcion="El estado de la propiedad hoy. Los datos se actualizan con cada reserva, bloqueo y consulta."
        acciones={
          <>
            <Boton asChild variante="contorno" medida="sm">
              <Link href="/admin/calendario">Calendario</Link>
            </Boton>
            <Boton asChild variante="principal" medida="sm">
              <Link href="/admin/consultas">
                Ver consultas
                {d.nuevas.length ? ` (${d.nuevas.length})` : ""}
              </Link>
            </Boton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica
          etiqueta="Consultas nuevas"
          valor={d.nuevas.length}
          detalle="sin responder"
          icono={Inbox}
          destacada
        />
        <Metrica
          etiqueta="Reservas pendientes"
          valor={d.pendientes.length}
          detalle="esperando confirmación"
          icono={CalendarCheck}
        />
        <Metrica
          etiqueta="Reservas confirmadas"
          valor={d.confirmadas.length}
          detalle={`${d.nochesVendidas} noches vendidas`}
          icono={CalendarCheck}
          tendencia={{ valor: formatearPrecio(d.ingresos), positiva: true }}
        />
        <Metrica
          etiqueta="Departamentos publicados"
          valor={departamentos.length}
          detalle={`${bloqueos.length} bloqueos activos`}
          icono={Building2}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelCabecera
            titulo="Próximos check-in"
            detalle="Ordenados por fecha de llegada"
            accion={
              <Link
                href="/admin/reservas"
                className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-ink"
              >
                Todas
                <ArrowUpRight className="size-3.5 text-oro" strokeWidth={2} aria-hidden />
              </Link>
            }
          />
          <ul className="px-3 py-3">
            {d.entradas.length === 0 ? (
              <li className="px-2 py-6 text-center text-[0.85rem] text-texto-suave">
                No hay llegadas próximas.
              </li>
            ) : (
              d.entradas.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-hueso/70"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-hueso text-[0.72rem] font-bold text-ink">
                    {iniciales(r.huesped)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.86rem] font-medium text-ink">
                      {r.huesped}
                    </span>
                    <span className="block truncate text-[0.76rem] text-texto-suave">
                      {nombre(r.departamentoId)} · {r.personas}p
                    </span>
                  </span>
                  <span className="ml-auto shrink-0 text-right">
                    <span className="block text-[0.8rem] font-semibold tabular-nums text-ink">
                      {formatearFecha(r.desde)}
                    </span>
                    <EstadoReservaTag estado={r.estado} />
                  </span>
                </li>
              ))
            )}
          </ul>
        </Panel>

        <Panel>
          <PanelCabecera titulo="Próximos check-out" detalle="Para coordinar la limpieza" />
          <ul className="px-3 py-3">
            {d.salidas.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-hueso/70"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-hueso text-[0.72rem] font-bold text-ink">
                  {iniciales(r.huesped)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[0.86rem] font-medium text-ink">
                    {r.huesped}
                  </span>
                  <span className="block truncate text-[0.76rem] text-texto-suave">
                    {nombre(r.departamentoId)}
                  </span>
                </span>
                <span className="ml-auto shrink-0 text-[0.8rem] font-semibold tabular-nums text-ink">
                  {formatearFecha(r.hasta)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel className="mt-4">
        <PanelCabecera
          titulo="Últimas consultas"
          detalle="Llegan del formulario de la web y de WhatsApp"
          accion={
            <Link
              href="/admin/consultas"
              className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-ink"
            >
              Ver todas
              <ArrowUpRight className="size-3.5 text-oro" strokeWidth={2} aria-hidden />
            </Link>
          }
        />
        <ul className="mt-4 divide-y divide-linea-suave">
          {consultas.slice(0, 4).map((c) => (
            <li
              key={c.id}
              className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4 sm:px-6"
            >
              <span className="flex min-w-0 items-center gap-3 sm:w-64">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-hueso text-[0.72rem] font-bold text-ink">
                  {iniciales(c.nombre)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[0.86rem] font-medium text-ink">
                    {c.nombre}
                  </span>
                  <span className="block truncate text-[0.76rem] text-texto-suave">
                    {nombre(c.departamentoId)}
                  </span>
                </span>
              </span>
              <p className="min-w-0 grow truncate text-[0.84rem] text-texto-suave">{c.mensaje}</p>
              <span className="flex shrink-0 items-center gap-2">
                <span className="text-[0.76rem] text-texto-tenue">{formatearFecha(c.fecha)}</span>
                <Insignia tono={tonoConsulta[c.estado]}>{rotuloConsulta[c.estado]}</Insignia>
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="mt-4 border-ink bg-ink">
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[0.95rem] font-semibold text-white">
              <TrendingUp className="size-4 text-oro-claro" strokeWidth={1.8} aria-hidden />
              Todo lo que ves en la web se edita desde acá
            </p>
            <p className="mt-1.5 max-w-xl text-[0.85rem] leading-relaxed text-white/55">
              Departamentos, galerías, actividades, servicios, comentarios y alrededores.
              Los cambios se publican al instante.
            </p>
          </div>
          <Boton asChild variante="blanco" medida="sm" className="shrink-0">
            <Link href="/admin/departamentos">Editar contenido</Link>
          </Boton>
        </div>
      </Panel>
    </>
  );
}
