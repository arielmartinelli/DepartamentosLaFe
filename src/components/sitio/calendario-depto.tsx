"use client";

import { CalendarCheck, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { DIAS, etiquetaMes, grillaMes } from "@/lib/calendario";
import { useContenido } from "@/lib/contenido";
import { estadoDelDia, tramoLibre } from "@/lib/disponibilidad";
import { cn, formatearFecha, noches } from "@/lib/utils";

type Props = {
  departamentoId: string;
  /** Fechas elegidas: vienen del panel de reserva y se pintan acá. */
  desde: string;
  hasta: string;
  /** Devuelve el tramo elegido desde el calendario al panel. */
  onElegir: (desde: string, hasta: string) => void;
};

const sumarDia = (iso: string, dias = 1) =>
  new Date(new Date(`${iso}T12:00:00`).getTime() + dias * 86_400_000)
    .toISOString()
    .slice(0, 10);

export function CalendarioDepto({ departamentoId, desde, hasta, onElegir }: Props) {
  const { reservas, bloqueos } = useContenido();
  const hoy = new Date();

  /** Paso actual: primero la entrada, después la salida. */
  const [paso, setPaso] = useState<"entrada" | "salida">("entrada");
  const [encima, setEncima] = useState<string | null>(null);

  const mesDe = (iso: string) => {
    const d = new Date(`${iso}T12:00:00`);
    return { anio: d.getFullYear(), mes: d.getMonth() };
  };

  const [ancla, setAncla] = useState(() => mesDe(desde));

  /**
   * Si el panel cambia la fecha a un mes que no está a la vista, el calendario
   * se mueve solo. Se ajusta durante el render (patrón admitido por React),
   * no dentro de un efecto: así no hay un fotograma con el mes viejo.
   */
  const [desdeAnterior, setDesdeAnterior] = useState(desde);
  if (desde !== desdeAnterior) {
    setDesdeAnterior(desde);
    const objetivo = mesDe(desde);
    const visible =
      (objetivo.anio === ancla.anio && objetivo.mes === ancla.mes) ||
      (objetivo.anio === ancla.anio && objetivo.mes === ancla.mes + 1) ||
      (objetivo.anio === ancla.anio + 1 && ancla.mes === 11 && objetivo.mes === 0);
    if (!visible) setAncla(objetivo);
  }

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

  const mover = (salto: number) => {
    const d = new Date(ancla.anio, ancla.mes + salto, 1);
    setAncla({ anio: d.getFullYear(), mes: d.getMonth() });
  };

  const claveHoy = hoy.toISOString().slice(0, 10);

  /** Tramo que se está dibujando: el elegido, o el que sugiere el mouse. */
  const tramo = useMemo(() => {
    if (paso === "salida" && encima && encima > desde) return { a: desde, b: encima };
    return { a: desde, b: hasta };
  }, [paso, encima, desde, hasta]);

  const elegir = (iso: string) => {
    if (paso === "entrada" || iso <= desde) {
      /* Arranca un tramo nuevo: una noche por ahora, la salida se elige después. */
      onElegir(iso, sumarDia(iso));
      setPaso("salida");
      return;
    }

    /* Si el camino choca con algo ocupado, la salida se corta ahí mismo. */
    const { libre, primerOcupado } = tramoLibre(desde, iso, propias, bloqueosPropios);
    onElegir(desde, libre || !primerOcupado ? iso : primerOcupado);
    setPaso("entrada");
  };

  const cantidad = noches(tramo.a, tramo.b);
  const flecha =
    "grid size-9 place-items-center rounded-full text-texto-suave transition-colors duration-200 hover:bg-hueso hover:text-ink";

  return (
    <div className="rounded-xl border border-linea bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linea px-5 py-4">
        <div className="min-w-0">
          <h3 className="font-sans text-[0.95rem] font-semibold text-ink">
            {paso === "entrada" ? "Elegí la fecha de entrada" : "Ahora elegí la salida"}
          </h3>
          <p className="mt-0.5 text-[0.8rem] text-texto-suave">
            {cantidad > 0 ? (
              <>
                {formatearFecha(tramo.a, "larga")} → {formatearFecha(tramo.b, "larga")} ·{" "}
                <span className="font-medium text-ink">
                  {cantidad} {cantidad === 1 ? "noche" : "noches"}
                </span>
              </>
            ) : (
              "Tocá un día libre para empezar"
            )}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {paso === "salida" ? (
            <button
              type="button"
              onClick={() => {
                setPaso("entrada");
                setEncima(null);
              }}
              className="mr-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.78rem] font-medium text-texto-suave transition-colors hover:bg-hueso hover:text-ink"
            >
              <RotateCcw className="size-3.5" strokeWidth={1.8} aria-hidden />
              Cambiar la entrada
            </button>
          ) : null}
          <button type="button" onClick={() => mover(-1)} aria-label="Mes anterior" className={flecha}>
            <ChevronLeft className="size-4" strokeWidth={1.9} />
          </button>
          <button type="button" onClick={() => mover(1)} aria-label="Mes siguiente" className={flecha}>
            <ChevronRight className="size-4" strokeWidth={1.9} />
          </button>
        </div>
      </div>

      <div
        className="grid gap-8 p-5 sm:grid-cols-2 sm:gap-6 sm:p-6"
        onMouseLeave={() => setEncima(null)}
      >
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

                const esEntrada = c.iso === tramo.a;
                const esSalida = c.iso === tramo.b && cantidad > 0;
                const enElMedio = cantidad > 0 && c.iso > tramo.a && c.iso < tramo.b;
                const enElTramo = esEntrada || esSalida || enElMedio;

                return (
                  <button
                    key={c.iso}
                    type="button"
                    disabled={!libre}
                    onClick={() => elegir(c.iso)}
                    onMouseEnter={() => libre && setEncima(c.iso)}
                    onFocus={() => libre && setEncima(c.iso)}
                    aria-label={`${c.dia} de ${etiquetaMes(anio, mes)} — ${
                      enElTramo ? "elegido, " : ""
                    }${est}`}
                    aria-pressed={enElTramo}
                    className={cn(
                      "relative mx-auto grid size-9 place-items-center rounded-full text-[0.8125rem] tabular-nums transition-colors duration-150",
                      c.otroMes && "invisible",
                      c.pasado && !c.otroMes && "cursor-default text-texto-tenue/40",

                      /* Fuera del tramo */
                      !enElTramo && libre && "cursor-pointer font-medium text-ink hover:bg-oro-vidrio",
                      !enElTramo &&
                        !c.pasado &&
                        est === "reservada" &&
                        "cursor-not-allowed bg-ink font-medium text-white",
                      !enElTramo &&
                        !c.pasado &&
                        est === "bloqueada" &&
                        "cursor-not-allowed bg-hueso font-medium text-texto-tenue line-through decoration-texto-tenue/50",

                      /* Tramo elegido */
                      enElMedio && "bg-oro-vidrio font-medium text-oro-oscuro",
                      (esEntrada || esSalida) && "bg-oro font-semibold text-white",
                    )}
                  >
                    {c.dia}
                    {c.iso === claveHoy && !enElTramo ? (
                      <span aria-hidden className="absolute -bottom-0.5 size-1 rounded-full bg-oro" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-linea px-5 py-4 text-[0.78rem] text-texto-suave sm:px-6">
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full bg-oro" />
          Tu estadía
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full border border-linea bg-white" />
          Disponible
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full bg-ink" />
          Reservada
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="size-3.5 rounded-full bg-hueso ring-1 ring-linea" />
          No disponible
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-texto-tenue">
          <CalendarCheck className="size-3.5" strokeWidth={1.7} aria-hidden />
          Se aplica al panel de consulta
        </span>
      </div>
    </div>
  );
}
