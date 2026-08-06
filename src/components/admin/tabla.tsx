import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Tabla({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full min-w-3xl border-collapse text-left", className)} {...props} />
    </div>
  );
}

export function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      scope="col"
      className={cn(
        "border-y border-linea bg-hueso/60 px-4 py-2.5 text-[0.75rem] font-semibold text-texto-suave",
        className,
      )}
      {...props}
    />
  );
}

export function Td({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn("border-b border-linea-suave px-4 py-3.5 text-[0.86rem] text-texto", className)}
      {...props}
    />
  );
}

export function Fila({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr className={cn("transition-colors duration-150 hover:bg-hueso/50", className)} {...props} />
  );
}

export function SinResultados({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <p className="font-display text-lg text-ink">Nada por acá</p>
      <p className="max-w-sm text-[0.85rem] leading-relaxed text-texto-suave">{mensaje}</p>
    </div>
  );
}
