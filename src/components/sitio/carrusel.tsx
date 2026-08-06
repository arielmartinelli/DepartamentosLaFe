"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Carril horizontal con desplazamiento por tarjeta.
 * En móvil se arrastra con el dedo; en escritorio aparecen las flechas.
 */
export function Carrusel({
  children,
  etiqueta,
  className,
}: {
  children: ReactNode;
  etiqueta: string;
  className?: string;
}) {
  const carril = useRef<HTMLUListElement>(null);
  const [alInicio, setAlInicio] = useState(true);
  const [alFinal, setAlFinal] = useState(false);

  const revisar = useCallback(() => {
    const el = carril.current;
    if (!el) return;
    setAlInicio(el.scrollLeft < 8);
    setAlFinal(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    revisar();
    const el = carril.current;
    if (!el) return;
    el.addEventListener("scroll", revisar, { passive: true });
    window.addEventListener("resize", revisar);
    return () => {
      el.removeEventListener("scroll", revisar);
      window.removeEventListener("resize", revisar);
    };
  }, [revisar]);

  const mover = (direccion: -1 | 1) => {
    const el = carril.current;
    if (!el) return;
    const primero = el.querySelector("li");
    const paso = primero ? primero.clientWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: paso * direccion, behavior: "smooth" });
  };

  const flecha =
    "grid size-10 place-items-center rounded-full border border-linea bg-white text-ink shadow-carta transition-[opacity,transform,box-shadow] duration-200 ease-salida hover:shadow-alza active:scale-95 disabled:pointer-events-none disabled:opacity-30";

  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute -top-14 right-0 hidden gap-2 md:flex">
        <button
          type="button"
          onClick={() => mover(-1)}
          disabled={alInicio}
          aria-label={`${etiqueta}: anterior`}
          className={cn(flecha, "pointer-events-auto")}
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => mover(1)}
          disabled={alFinal}
          aria-label={`${etiqueta}: siguiente`}
          className={cn(flecha, "pointer-events-auto")}
        >
          <ChevronRight className="size-4" strokeWidth={2} />
        </button>
      </div>

      <ul
        ref={carril}
        aria-label={etiqueta}
        className="sin-barra desliza -mx-5 flex gap-6 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 xl:-mx-10 xl:px-10"
      >
        {children}
      </ul>
    </div>
  );
}
