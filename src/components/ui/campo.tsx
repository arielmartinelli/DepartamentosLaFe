import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-sm border border-linea bg-white px-3.5 text-sm text-texto outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-texto-tenue focus:border-ink/45 focus:shadow-[0_0_0_3px_rgb(19_20_23_/_0.07)] disabled:bg-hueso";

export function Entrada({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(base, "h-12", className)} {...props} />;
}

export function AreaTexto({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(base, "min-h-28 py-3 leading-relaxed", className)} {...props} />;
}

export function Selector({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(base, "h-12 cursor-pointer flecha-selector", className)} {...props}>
      {children}
    </select>
  );
}

export function Etiqueta({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn("mb-1.5 block text-[0.78rem] font-semibold text-ink", className)}
      {...props}
    />
  );
}
