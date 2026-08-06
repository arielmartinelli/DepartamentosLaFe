"use client";

import { ChevronLeft, ChevronRight, Lock, Plus, Unlock } from "lucide-react";
import { useMemo, useState } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { Panel } from "@/components/admin/tarjeta";
import { Boton } from "@/components/ui/boton";
import { Entrada, Etiqueta, Selector } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { Modal } from "@/components/ui/modal";
import { DIAS, MESES, grillaMes } from "@/lib/calendario";
import { useContenido } from "@/lib/contenido";
import { estadoDelDia } from "@/lib/disponibilidad";
import { nuevoId } from "@/lib/repositorio";
import type { Bloqueo } from "@/lib/tipos";
import { cn, formatearFecha, noches } from "@/lib/utils";

export default function PaginaCalendario() {
  const { departamentos, edificios, reservas, bloqueos, guardarBloqueo, eliminarBloqueo } =
    useContenido();

  const hoy = new Date();
  const [depId, setDepId] = useState(departamentos[0]?.id ?? "");
  const [anio, setAnio] = useState(hoy.getFullYear());
  const [mes, setMes] = useState(hoy.getMonth());
  const [nuevo, setNuevo] = useState<Bloqueo | null>(null);

  const dep = departamentos.find((d) => d.id === depId) ?? departamentos[0];
  const edificio = edificios.find((e) => e.id === dep?.edificioId);
  const unidadId = dep ? dep.id : "";

  const propias = useMemo(
    () => reservas.filter((r) => r.departamentoId === unidadId),
    [reservas, unidadId],
  );
  const bloqueosPropios = useMemo(
    () => bloqueos.filter((b) => b.departamentoId === unidadId),
    [bloqueos, unidadId],
  );

  const celdas = useMemo(() => grillaMes(anio, mes, propias), [anio, mes, propias]);

  const resumen = useMemo(() => {
    const delMes = celdas.filter((c) => !c.otroMes);
    const cuenta = { disponible: 0, reservada: 0, bloqueada: 0 };
    delMes.forEach((c) => {
      cuenta[estadoDelDia(c.iso, propias, bloqueosPropios)] += 1;
    });
    return { ...cuenta, total: delMes.length };
  }, [celdas, propias, bloqueosPropios]);

  const mover = (paso: number) => {
    const d = new Date(anio, mes + paso, 1);
    setAnio(d.getFullYear());
    setMes(d.getMonth());
  };

  const abrirBloqueo = (iso?: string) =>
    setNuevo({
      id: nuevoId("blq"),
      departamentoId: dep.id,
      desde: iso ?? new Date().toISOString().slice(0, 10),
      hasta: iso
        ? new Date(new Date(`${iso}T12:00:00`).getTime() + 86_400_000).toISOString().slice(0, 10)
        : new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
      motivo: "",
    });

  const anios = [hoy.getFullYear() - 1, hoy.getFullYear(), hoy.getFullYear() + 1, hoy.getFullYear() + 2];

  if (!dep) {
    return <EncabezadoPagina titulo="Calendario" descripcion="Todavía no hay departamentos cargados." />;
  }

  return (
    <>
      <EncabezadoPagina
        titulo="Calendario"
        descripcion="Un departamento por vez. Además de las reservas, podés cerrar fechas a mano sin que exista una reserva detrás."
        acciones={
          <Boton variante="principal" medida="sm" onClick={() => abrirBloqueo()}>
            <Plus strokeWidth={2} /> Bloquear fechas
          </Boton>
        }
      />

      {/* Filtros */}
      <Panel className="mb-4">
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-end">
          <div>
            <Etiqueta htmlFor="cal-depto">Departamento</Etiqueta>
            <Selector id="cal-depto" value={depId} onChange={(e) => setDepId(e.target.value)}>
              {edificios.map((ed) => (
                <optgroup key={ed.id} label={ed.nombre}>
                  {departamentos
                    .filter((d) => d.edificioId === ed.id)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nombre}
                      </option>
                    ))}
                </optgroup>
              ))}
            </Selector>
          </div>
          <div>
            <Etiqueta htmlFor="cal-mes">Mes</Etiqueta>
            <Selector id="cal-mes" value={mes} onChange={(e) => setMes(Number(e.target.value))}>
              {MESES.map((m, i) => (
                <option key={m} value={i}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </Selector>
          </div>
          <div>
            <Etiqueta htmlFor="cal-anio">Año</Etiqueta>
            <Selector id="cal-anio" value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
              {anios.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </Selector>
          </div>
          <div className="flex gap-2">
            <Boton variante="contorno" medida="icono" aria-label="Mes anterior" onClick={() => mover(-1)}>
              <ChevronLeft strokeWidth={1.9} />
            </Boton>
            <Boton variante="contorno" medida="icono" aria-label="Mes siguiente" onClick={() => mover(1)}>
              <ChevronRight strokeWidth={1.9} />
            </Boton>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-linea px-5 py-4">
            <div>
              <h2 className="font-display text-xl capitalize text-ink">
                {MESES[mes]} {anio}
              </h2>
              <p className="mt-0.5 text-[0.82rem] text-texto-suave">
                {edificio?.nombre} · {dep.nombre}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[0.75rem] tabular-nums">
              <Insignia tono="exito">{resumen.disponible} libres</Insignia>
              <Insignia tono="ink">{resumen.reservada} reservadas</Insignia>
              <Insignia tono="neutro">{resumen.bloqueada} bloqueadas</Insignia>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-7 gap-1.5">
              {DIAS.map((d, i) => (
                <span
                  key={`${d}-${i}`}
                  className="pb-1 text-center text-[0.68rem] font-semibold uppercase tracking-wider text-texto-tenue"
                >
                  {d}
                </span>
              ))}

              {celdas.map((c) => {
                const est = estadoDelDia(c.iso, propias, bloqueosPropios);
                const reserva = propias.find(
                  (r) => r.estado !== "cancelada" && c.iso >= r.desde && c.iso < r.hasta,
                );
                return (
                  <button
                    key={c.iso}
                    type="button"
                    onClick={() => est === "disponible" && abrirBloqueo(c.iso)}
                    disabled={c.otroMes || est !== "disponible"}
                    title={
                      est === "reservada"
                        ? `Reservado — ${reserva?.huesped}`
                        : est === "bloqueada"
                          ? "Fecha bloqueada"
                          : "Bloquear esta fecha"
                    }
                    className={cn(
                      "group relative flex min-h-[4.5rem] flex-col items-start gap-1 rounded-md border p-2 text-left transition-colors duration-150 sm:min-h-[5.5rem]",
                      c.otroMes && "invisible",
                      est === "disponible" &&
                        "border-linea bg-white hover:border-ink/25 hover:bg-hueso",
                      est === "reservada" && "border-ink bg-ink",
                      est === "bloqueada" && "border-linea bg-hueso",
                    )}
                  >
                    <span
                      className={cn(
                        "text-[0.75rem] font-semibold tabular-nums",
                        est === "reservada" ? "text-white/70" : "text-texto-suave",
                      )}
                    >
                      {c.dia}
                    </span>

                    {est === "reservada" && reserva ? (
                      <span className="line-clamp-2 text-[0.68rem] font-medium leading-tight text-oro-claro">
                        {reserva.huesped}
                      </span>
                    ) : est === "bloqueada" ? (
                      <span className="flex items-center gap-1 text-[0.68rem] font-medium text-texto-tenue">
                        <Lock className="size-3" strokeWidth={2} aria-hidden />
                        Bloqueada
                      </span>
                    ) : (
                      <span className="mt-auto text-[0.66rem] font-medium text-texto-tenue opacity-0 transition-opacity group-hover:opacity-100">
                        + Bloquear
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <div className="border-b border-linea px-5 py-4">
              <h2 className="font-sans text-[0.95rem] font-semibold text-ink">Fechas bloqueadas</h2>
              <p className="mt-1 text-[0.8rem] text-texto-suave">
                Cerradas a mano, sin reserva detrás.
              </p>
            </div>
            {bloqueosPropios.length === 0 ? (
              <p className="px-5 py-8 text-center text-[0.85rem] text-texto-suave">
                No hay fechas bloqueadas en este departamento.
              </p>
            ) : (
              <ul className="divide-y divide-linea-suave">
                {bloqueosPropios
                  .slice()
                  .sort((a, b) => a.desde.localeCompare(b.desde))
                  .map((b) => (
                    <li key={b.id} className="flex items-start gap-3 px-5 py-4">
                      <Lock className="mt-0.5 size-4 shrink-0 text-texto-tenue" strokeWidth={1.7} aria-hidden />
                      <span className="min-w-0 grow">
                        <span className="block text-[0.85rem] font-medium tabular-nums text-ink">
                          {formatearFecha(b.desde)} → {formatearFecha(b.hasta)}
                        </span>
                        <span className="block text-[0.78rem] text-texto-suave">
                          {noches(b.desde, b.hasta)} noches · {b.motivo || "Sin motivo"}
                        </span>
                      </span>
                      <Boton
                        variante="fantasma"
                        medida="iconoSm"
                        aria-label="Liberar estas fechas"
                        className="text-alerta hover:bg-alerta/10"
                        onClick={() => eliminarBloqueo(b.id)}
                      >
                        <Unlock strokeWidth={1.7} />
                      </Boton>
                    </li>
                  ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <div className="border-b border-linea px-5 py-4">
              <h2 className="font-sans text-[0.95rem] font-semibold text-ink">Reservas del mes</h2>
            </div>
            {propias.filter((r) => r.estado !== "cancelada" && r.desde.slice(0, 7) === `${anio}-${String(mes + 1).padStart(2, "0")}`).length === 0 ? (
              <p className="px-5 py-8 text-center text-[0.85rem] text-texto-suave">
                Sin reservas este mes.
              </p>
            ) : (
              <ul className="divide-y divide-linea-suave">
                {propias
                  .filter(
                    (r) =>
                      r.estado !== "cancelada" &&
                      r.desde.slice(0, 7) === `${anio}-${String(mes + 1).padStart(2, "0")}`,
                  )
                  .sort((a, b) => a.desde.localeCompare(b.desde))
                  .map((r) => (
                    <li key={r.id} className="px-5 py-4">
                      <p className="text-[0.85rem] font-medium text-ink">{r.huesped}</p>
                      <p className="mt-0.5 text-[0.78rem] tabular-nums text-texto-suave">
                        {formatearFecha(r.desde)} → {formatearFecha(r.hasta)} ·{" "}
                        {noches(r.desde, r.hasta)} noches · {r.personas}p
                      </p>
                    </li>
                  ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <ul className="space-y-3 p-5 text-[0.82rem] text-texto-suave">
              <li className="flex items-center gap-2.5">
                <span aria-hidden className="size-4 rounded-xs border border-linea bg-white" />
                Disponible — hacé clic para bloquear
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden className="size-4 rounded-xs bg-ink" />
                Reservada
              </li>
              <li className="flex items-center gap-2.5">
                <span aria-hidden className="size-4 rounded-xs bg-hueso ring-1 ring-linea" />
                Bloqueada a mano
              </li>
            </ul>
          </Panel>
        </div>
      </div>

      <Modal
        abierto={Boolean(nuevo)}
        onCerrar={() => setNuevo(null)}
        titulo="Bloquear fechas"
        descripcion="Las fechas quedan cerradas en la web sin necesidad de crear una reserva."
        pie={
          <>
            <Boton variante="fantasma" medida="sm" onClick={() => setNuevo(null)}>
              Cancelar
            </Boton>
            <Boton
              variante="principal"
              medida="sm"
              onClick={() => {
                if (nuevo && noches(nuevo.desde, nuevo.hasta) > 0) guardarBloqueo(nuevo);
                setNuevo(null);
              }}
            >
              Bloquear
            </Boton>
          </>
        }
      >
        {nuevo ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="b-depto">Departamento</Etiqueta>
              <Selector
                id="b-depto"
                value={nuevo.departamentoId}
                onChange={(e) => setNuevo({ ...nuevo, departamentoId: e.target.value })}
              >
                {edificios.map((ed) => (
                  <optgroup key={ed.id} label={ed.nombre}>
                    {departamentos
                      .filter((d) => d.edificioId === ed.id)
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nombre}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </Selector>
            </div>
            <div>
              <Etiqueta htmlFor="b-desde">Desde</Etiqueta>
              <Entrada
                id="b-desde"
                type="date"
                value={nuevo.desde}
                onChange={(e) => setNuevo({ ...nuevo, desde: e.target.value })}
              />
            </div>
            <div>
              <Etiqueta htmlFor="b-hasta">Hasta (sin incluir)</Etiqueta>
              <Entrada
                id="b-hasta"
                type="date"
                min={nuevo.desde}
                value={nuevo.hasta}
                onChange={(e) => setNuevo({ ...nuevo, hasta: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="b-motivo">Motivo</Etiqueta>
              <Entrada
                id="b-motivo"
                value={nuevo.motivo}
                onChange={(e) => setNuevo({ ...nuevo, motivo: e.target.value })}
                placeholder="Mantenimiento, uso familiar, reforma…"
              />
            </div>
            <p className="text-[0.8rem] text-texto-suave sm:col-span-2">
              {noches(nuevo.desde, nuevo.hasta) > 0
                ? `Se van a cerrar ${noches(nuevo.desde, nuevo.hasta)} noches.`
                : "La fecha de fin tiene que ser posterior a la de inicio."}
            </p>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
