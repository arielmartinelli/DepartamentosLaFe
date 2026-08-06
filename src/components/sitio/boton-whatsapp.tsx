"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useContenido } from "@/lib/contenido";
import { cn } from "@/lib/utils";

/** Aparece pasado el hero para no tapar la portada. */
export function BotonWhatsApp() {
  const { ajustes } = useContenido();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const alScroll = () => setVisible(window.scrollY > 640);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  return (
    <a
      href={`https://wa.me/${ajustes.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className={cn(
        "fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-ink text-white shadow-alza transition-[opacity,transform] duration-300 ease-salida hover:bg-ink-soft active:scale-95",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <MessageCircle className="size-6" strokeWidth={1.6} aria-hidden />
    </a>
  );
}
