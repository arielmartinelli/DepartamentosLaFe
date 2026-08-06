import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Metrica({
  etiqueta,
  valor,
  detalle,
  icono: Icono,
  tendencia,
  destacada = false,
}: {
  etiqueta: string;
  valor: string | number;
  detalle?: string;
  icono: LucideIcon;
  tendencia?: { valor: string; positiva: boolean };
  destacada?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-shadow duration-200 ease-salida hover:shadow-carta",
        destacada ? "border-ink bg-ink" : "border-linea bg-white",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={cn("text-[0.8rem] font-medium", destacada ? "text-white/55" : "text-texto-suave")}>
          {etiqueta}
        </p>
        <Icono
          className={cn("size-4 shrink-0", destacada ? "text-oro-claro" : "text-texto-tenue")}
          strokeWidth={1.5}
          aria-hidden
        />
      </div>

      <p
        className={cn(
          "mt-4 font-display text-[2rem] leading-none tabular-nums",
          destacada ? "text-white" : "text-ink",
        )}
      >
        {valor}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {tendencia ? (
          <span
            className={cn(
              "rounded-full px-1.5 py-0.5 text-[0.7rem] font-semibold",
              destacada
                ? "bg-white/10 text-oro-claro"
                : tendencia.positiva
                  ? "bg-exito/10 text-exito"
                  : "bg-alerta/10 text-alerta",
            )}
          >
            {tendencia.valor}
          </span>
        ) : null}
        {detalle ? (
          <p className={cn("text-[0.78rem]", destacada ? "text-white/45" : "text-texto-tenue")}>
            {detalle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
