"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { DIAS, etiquetaMes, grillaMes } from "@/lib/calendario";
import { useContenido } from "@/lib/contenido";
import { estadoDelDia } from "@/lib/disponibilidad";
import { cn } from "@/lib/utils";

/** Disponibilidad pública de una unidad: disponible, reservada o bloqueada. */
export function CalendarioDepto({ departamentoId }: { departamentoId: string }) {
  const { reservas, bloqueos } = useContenido();
  const hoy = new Date();
  const [ancla, setAncla] = useState({ anio: hoy.getFullYear(), mes: hoy.getMonth() });

  const propias = useMemo(
    () => reservas.filter((r) => r.departamentoId === departamentoId),
    [reservas, departamentoId],
  );
  const bloqueosPropios = useMemo(
    () => bloqueos.filter((b) => b.departamentoId === departamentoId),
    [bloqueos, departamentoId],
  );

  const meses = useMemo(() => {
    const segundo = new Date(ancla.anio, ancla.mes + 1, 1);
    return [
      { anio: ancla.anio, mes: ancla.mes },
      { anio: segundo.getFullYear(), mes: segundo.getMonth() },
    ];
  }, [ancla]);

  const mover = (paso: number) => {
    const d = new Date(ancla.anio, ancla.mes + paso, 1);
    setAncla({ anio: d.getFullYear(), mes: d.getMonth() });
  };

  const claveHoy = hoy.toISOString().slice(0, 10);
  const flecha =
    "grid size-9 place-items-center rounded-full text-texto-suave transition-colors duration-200 hover:bg-hueso hover:text-ink";

  return (
    <div className="rounded-xl border border-linea bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-linea px-5 py-4">
        <h3 className="font-sans text-[0.95rem] font-semibold text-ink">Disponibilidad</h3>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => mover(-1)} aria-label="Mes anterior" className={flecha}>
            <ChevronLeft className="size-4" strokeWidth={1.9} />
          </button>
          <button type="button" onClick={() => mover(1)} aria-label="Mes siguiente" className={flecha}>
            <ChevronRight className="size-4" strokeWidth={1.9} />
          </button>
        </div>
      </div>

      <div className="grid gap-8 p-5 sm:grid-cols-2 sm:gap-6 sm:p-6">
        {meses.map(({ anio, mes }) => (
          <div key={`${anio}-${mes}`}>
            <p className="mb-4 text-center font-display text-[1.05rem] capitalize text-ink">
              {etiquetaMes(anio, mes)}
            </p>
            <div
              role="grid"
              aria-label={`Disponibilidad de ${etiquetaMes(anio, mes)}`}
              className="grid grid-cols-7 gap-y-1 text-center"
            >
              {DIAS.map((d, i) => (
                <span
                  key={`${d}-${i}`}
                  role="columnheader"
                  className="pb-2 text-[0.66rem] font-semibold uppercase tracking-wider text-texto-tenue"
                >
                  {d}
                </span>
              ))}
              {grillaMes(anio, mes, propias).map((c) => {
                const est = estadoDelDia(c.iso, propias, bloqueosPropios);
                return (
                  <span
                    key={c.iso}
                    role="gridcell"
                    aria-label={`${c.dia} — ${est}`}
                    className={cn(
                      "relative mx-auto grid size-9 place-items-center rounded-full text-[0.8125rem] tabular-nums",
                      c.otroMes && "opacity-0",
                      c.pasado && !c.otroMes && "text-texto-tenue/45",
                      !c.pasado && est === "disponible" && "font-medium text-ink",
                      !c.pasado && est === "reservada" && "bg-ink font-medium text-white",
                      !c.pasado && est === "bloqueada" &&
                        "bg-hueso font-medium text-texto-tenue line-through decoration-texto-tenue/50",
                    )}
                  >
                    {c.dia}
                    {c.iso === claveHoy ? (
                      <span aria-hidden className="absolute -bottom-0.5 size-1 rounded-full bg-oro" />
                    ) : null}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-linea px-5 py-4 text-[0.78rem] text-texto-suave sm:px-6">
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full border border-linea bg-white" />
          Disponible
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full bg-ink" />
          Reservada
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full bg-hueso ring-1 ring-linea" />
          No disponible
        </li>
      </ul>
    </div>
  );
}
