"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { DIAS, etiquetaMes, grillaMes } from "@/lib/calendario";
import { useContenido } from "@/lib/contenido";
import { estadoDelDia } from "@/lib/disponibilidad";
import { cn } from "@/lib/utils";

type Props = {
  departamentoId: string;
  /** Fechas elegidas en el panel de reserva: se pintan sobre el calendario. */
  desde?: string;
  hasta?: string;
  /** Si viene, tocar un día libre elige entrada y salida. */
  onElegir?: (desde: string, hasta: string) => void;
};

export function CalendarioDepto({ departamentoId, desde, hasta, onElegir }: Props) {
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

  /** Al tocar: el primer clic fija la entrada, el segundo la salida. */
  const elegir = (iso: string) => {
    if (!onElegir) return;
    if (!desde || !hasta || iso <= desde || (desde && hasta && desde !== hasta && iso > hasta)) {
      const salida = new Date(new Date(`${iso}T12:00:00`).getTime() + 86_400_000)
        .toISOString()
        .slice(0, 10);
      onElegir(iso, salida);
    } else {
      onElegir(desde, iso);
    }
  };

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
                const libre = !c.pasado && est === "disponible";

                /* Tramo elegido: extremos llenos, días del medio en tono suave. */
                const esEntrada = Boolean(desde) && c.iso === desde;
                const esSalida = Boolean(hasta) && c.iso === hasta;
                const enElMedio =
                  Boolean(desde) && Boolean(hasta) && c.iso > desde! && c.iso < hasta!;
                const enElTramo = esEntrada || esSalida || enElMedio;

                const Elemento = libre && onElegir ? "button" : "span";

                return (
                  <Elemento
                    key={c.iso}
                    {...(libre && onElegir
                      ? { type: "button" as const, onClick: () => elegir(c.iso) }
                      : { role: "gridcell" })}
                    aria-label={`${c.dia} — ${enElTramo ? "elegido, " : ""}${est}`}
                    aria-pressed={libre && onElegir ? enElTramo : undefined}
                    className={cn(
                      "relative mx-auto grid size-9 place-items-center rounded-full text-[0.8125rem] tabular-nums transition-colors duration-200",
                      c.otroMes && "invisible",
                      c.pasado && !c.otroMes && "text-texto-tenue/45",

                      /* Fuera del tramo */
                      !enElTramo && libre && "font-medium text-ink",
                      !enElTramo && libre && onElegir && "cursor-pointer hover:bg-oro-vidrio",
                      !enElTramo && !c.pasado && est === "reservada" && "bg-ink font-medium text-white",
                      !enElTramo &&
                        !c.pasado &&
                        est === "bloqueada" &&
                        "bg-hueso font-medium text-texto-tenue line-through decoration-texto-tenue/50",

                      /* Tramo elegido */
                      enElMedio && "bg-oro-vidrio font-medium text-oro-oscuro",
                      (esEntrada || esSalida) && "bg-oro font-semibold text-white",
                    )}
                  >
                    {c.dia}
                    {c.iso === claveHoy && !enElTramo ? (
                      <span aria-hidden className="absolute -bottom-0.5 size-1 rounded-full bg-oro" />
                    ) : null}
                  </Elemento>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-linea px-5 py-4 text-[0.78rem] text-texto-suave sm:px-6">
        <li className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full bg-oro" />
          Tu estadía
        </li>
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
