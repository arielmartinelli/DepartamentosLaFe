"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect } from "react";

type Props = {
  fotos: string[];
  indice: number | null;
  titulo: string;
  onCerrar: () => void;
  onCambiar: (i: number) => void;
};

/** Visor a pantalla completa. Se cierra con Escape y se navega con flechas. */
export function Visor({ fotos, indice, titulo, onCerrar, onCambiar }: Props) {
  const abierto = indice !== null;

  const mover = useCallback(
    (paso: number) => {
      if (indice === null) return;
      onCambiar((indice + paso + fotos.length) % fotos.length);
    },
    [indice, fotos.length, onCambiar],
  );

  useEffect(() => {
    if (!abierto) return;
    const alTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    document.addEventListener("keydown", alTecla);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", alTecla);
      document.body.style.overflow = "";
    };
  }, [abierto, mover, onCerrar]);

  const control =
    "grid size-11 place-items-center rounded-full bg-white/12 text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/25 active:scale-95";

  return (
    <AnimatePresence>
      {abierto ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Fotos de ${titulo}`}
          className="fixed inset-0 z-70 flex flex-col bg-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <p className="text-[0.875rem] font-medium text-white/70 tabular-nums">
              {(indice ?? 0) + 1} / {fotos.length}
            </p>
            <button type="button" onClick={onCerrar} aria-label="Cerrar visor" className={control}>
              <X className="size-5" strokeWidth={1.7} />
            </button>
          </div>

          <div className="relative flex grow items-center justify-center px-4 pb-6 sm:px-16">
            <button
              type="button"
              onClick={() => mover(-1)}
              aria-label="Foto anterior"
              className={`${control} absolute left-2 z-10 sm:left-5`}
            >
              <ChevronLeft className="size-5" strokeWidth={2} />
            </button>

            <motion.div
              key={indice}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
              className="relative h-full w-full max-w-5xl"
            >
              <Image
                src={fotos[indice ?? 0]}
                alt={`${titulo} — foto ${(indice ?? 0) + 1}`}
                fill
                sizes="100vw"
                unoptimized={fotos[indice ?? 0]?.startsWith("data:")}
                className="object-contain"
                priority
              />
            </motion.div>

            <button
              type="button"
              onClick={() => mover(1)}
              aria-label="Foto siguiente"
              className={`${control} absolute right-2 z-10 sm:right-5`}
            >
              <ChevronRight className="size-5" strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
