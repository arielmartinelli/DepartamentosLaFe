import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-xl border border-linea bg-white", className)}
      {...props}
    />
  );
}

export function PanelCabecera({
  titulo,
  detalle,
  accion,
  className,
}: {
  titulo: string;
  detalle?: string;
  accion?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6", className)}>
      <div>
        <h2 className="font-sans text-[0.95rem] font-semibold tracking-[-0.012em] text-ink">
          {titulo}
        </h2>
        {detalle ? <p className="mt-1 text-[0.82rem] text-texto-suave">{detalle}</p> : null}
      </div>
      {accion ? <div className="shrink-0">{accion}</div> : null}
    </div>
  );
}
