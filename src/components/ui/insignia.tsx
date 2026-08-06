import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variantes = cva(
  "inline-flex items-center gap-1.5 rounded-full text-[0.72rem] font-semibold leading-none",
  {
    variants: {
      tono: {
        neutro: "bg-hueso text-texto-suave",
        oro: "bg-oro-vidrio text-oro-oscuro",
        exito: "bg-exito/10 text-exito",
        aviso: "bg-aviso/12 text-aviso",
        alerta: "bg-alerta/10 text-alerta",
        ink: "bg-ink text-white",
        blanco: "bg-white text-ink shadow-carta",
        contorno: "border border-linea text-texto-suave",
      },
      medida: { sm: "px-2 py-1", md: "px-2.5 py-1.5" },
    },
    defaultVariants: { tono: "neutro", medida: "sm" },
  },
);

export function Insignia({
  className,
  tono,
  medida,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof variantes>) {
  return <span className={cn(variantes({ tono, medida }), className)} {...props} />;
}
