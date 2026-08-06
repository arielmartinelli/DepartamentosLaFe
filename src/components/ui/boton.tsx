"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variantes = cva(
  [
    "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-semibold",
    "transition-[transform,background-color,color,border-color,box-shadow] duration-200 ease-salida",
    "active:scale-[0.975] disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variante: {
        principal: "bg-ink text-white hover:bg-ink-soft",
        oro: "bg-oro text-white hover:bg-oro-oscuro",
        contorno: "border border-ink/15 bg-transparent text-ink hover:border-ink/40 hover:bg-ink/[0.035]",
        blanco: "bg-white text-ink shadow-carta hover:shadow-alza",
        vidrio: "border border-white/30 bg-white/12 text-white backdrop-blur-md hover:bg-white/22",
        suave: "bg-hueso text-ink hover:bg-hueso",
        fantasma: "text-texto-suave hover:bg-ink/[0.05] hover:text-ink",
        enlace: "text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink",
        peligro: "bg-alerta/10 text-alerta hover:bg-alerta/18",
      },
      medida: {
        sm: "h-10 rounded-sm px-4 text-[0.8125rem] [&_svg]:size-4",
        md: "h-12 rounded-sm px-5 text-[0.875rem] [&_svg]:size-[1.05rem]",
        lg: "h-14 rounded-md px-7 text-[0.9375rem] [&_svg]:size-[1.15rem]",
        icono: "size-10 rounded-sm [&_svg]:size-[1.05rem]",
        iconoSm: "size-8 rounded-xs [&_svg]:size-4",
      },
      pastilla: { true: "rounded-full", false: "" },
    },
    defaultVariants: { variante: "principal", medida: "md", pastilla: false },
  },
);

type Props = ComponentProps<"button"> & VariantProps<typeof variantes> & { asChild?: boolean };

export function Boton({ className, variante, medida, pastilla, asChild = false, ...props }: Props) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(variantes({ variante, medida, pastilla }), className)} {...props} />;
}

export { variantes as variantesBoton };
