"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  descripcion?: string;
  children: ReactNode;
  pie?: ReactNode;
  ancho?: "sm" | "md" | "lg";
};

const anchos = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl" };

export function Modal({
  abierto,
  onCerrar,
  titulo,
  descripcion,
  children,
  pie,
  ancho = "md",
}: Props) {
  return (
    <Dialog.Root open={abierto} onOpenChange={(v) => !v && onCerrar()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-60 bg-ink/40 backdrop-blur-[2px] data-[state=closed]:animate-[desaparecer_.16s_ease] data-[state=open]:animate-[aparecer_.2s_ease]" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-70 flex max-h-[88dvh] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-linea bg-white shadow-flotante focus:outline-none data-[state=open]:animate-[surgir_.28s_cubic-bezier(.23,1,.32,1)]",
            anchos[ancho],
          )}
        >
          <div className="flex items-start justify-between gap-6 border-b border-linea px-6 py-5">
            <div>
              <Dialog.Title className="font-sans text-base font-semibold tracking-[-0.012em] text-ink">
                {titulo}
              </Dialog.Title>
              {descripcion ? (
                <Dialog.Description className="mt-1 text-[0.85rem] leading-relaxed text-texto-suave">
                  {descripcion}
                </Dialog.Description>
              ) : null}
            </div>
            <Dialog.Close
              aria-label="Cerrar"
              className="grid size-8 shrink-0 place-items-center rounded-full text-texto-tenue transition-colors duration-200 hover:bg-hueso hover:text-ink"
            >
              <X className="size-4" strokeWidth={1.7} />
            </Dialog.Close>
          </div>

          <div className="grow overflow-y-auto px-6 py-5">{children}</div>

          {pie ? (
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-linea bg-hueso px-6 py-4">
              {pie}
            </div>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
