"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Building2,
  CalendarRange,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Mountain,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { useContenido } from "@/lib/contenido";
import { sitio } from "@/lib/site";
import { useResolverImagen } from "@/lib/usar-imagen";
import { cn } from "@/lib/utils";

const secciones = [
  {
    titulo: "Operación",
    items: [
      { href: "/admin", etiqueta: "Panel", icono: LayoutDashboard },
      { href: "/admin/reservas", etiqueta: "Reservas", icono: CalendarRange },
      { href: "/admin/calendario", etiqueta: "Calendario", icono: CalendarRange },
      { href: "/admin/consultas", etiqueta: "Consultas", icono: Inbox },
    ],
  },
  {
    titulo: "Alojamiento",
    items: [
      { href: "/admin/departamentos", etiqueta: "Departamentos", icono: Building2 },
      { href: "/admin/galerias", etiqueta: "Galerías", icono: Images },
      { href: "/admin/servicios", etiqueta: "Servicios", icono: Sparkles },
    ],
  },
  {
    titulo: "Contenido de la web",
    items: [
      { href: "/admin/actividades", etiqueta: "Qué hacer", icono: Mountain },
      { href: "/admin/comentarios", etiqueta: "Comentarios", icono: MessageSquareQuote },
      { href: "/admin/configuracion", etiqueta: "Configuración", icono: Settings },
    ],
  },
];

function Marca({ compacta = false }: { compacta?: boolean }) {
  const { ajustes } = useContenido();
  const resolver = useResolverImagen();
  const marca = resolver(ajustes.marca);

  return (
    <span className="flex items-center gap-3">
      <Image
        src={marca}
        alt=""
        width={160}
        height={160}
        unoptimized={marca.startsWith("data:")}
        className={cn("shrink-0 rounded-md object-cover", compacta ? "size-9" : "size-10")}
      />
      <span className="min-w-0">
        <span className="block truncate text-[0.875rem] font-semibold leading-tight text-white">
          {sitio.nombreCorto}
        </span>
        <span className="block truncate text-[0.72rem] leading-tight text-white/45">
          Departamentos · Ushuaia
        </span>
      </span>
    </span>
  );
}

export function Cascara({ children }: { children: React.ReactNode }) {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const { consultas } = useContenido();
  const nuevas = consultas.filter((c) => c.estado === "nueva").length;

  const navegacion = (
    <nav aria-label="Secciones del panel" className="flex grow flex-col gap-6 overflow-y-auto px-3">
      {secciones.map((s) => (
        <div key={s.titulo}>
          <p className="px-3 pb-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/30">
            {s.titulo}
          </p>
          <ul className="space-y-0.5">
            {s.items.map((item) => {
              const activo =
                item.href === "/admin" ? ruta === "/admin" : ruta.startsWith(item.href);
              const Icono = item.icono;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setAbierto(false)}
                    aria-current={activo ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-sm px-3 py-2 text-[0.86rem] font-medium transition-colors duration-200",
                      activo ? "text-white" : "text-white/55 hover:bg-white/6 hover:text-white/90",
                    )}
                  >
                    {activo ? (
                      <motion.span
                        layoutId="admin-activo"
                        className="absolute inset-0 rounded-sm bg-white/10"
                        transition={{ type: "spring", stiffness: 420, damping: 38 }}
                      />
                    ) : null}
                    <Icono className="relative size-[1.05rem] shrink-0" strokeWidth={1.5} aria-hidden />
                    <span className="relative">{item.etiqueta}</span>
                    {item.href === "/admin/consultas" && nuevas > 0 ? (
                      <span className="relative ml-auto rounded-full bg-oro px-1.5 py-0.5 text-[0.65rem] font-bold text-white">
                        {nuevas}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const pie = (
    <div className="mt-auto p-3">
      <Link
        href="/"
        className="flex items-center gap-3 rounded-sm px-3 py-2 text-[0.86rem] font-medium text-white/55 transition-colors hover:bg-white/6 hover:text-white/90"
      >
        <LogOut className="size-[1.05rem]" strokeWidth={1.5} aria-hidden />
        Salir del panel
      </Link>
    </div>
  );

  return (
    <div className="min-h-dvh bg-hueso lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col bg-ink py-5 lg:flex">
        <Link href="/admin" className="mb-7 block px-5">
          <Marca />
        </Link>
        {navegacion}
        {pie}
      </aside>

      <div className="sticky top-0 z-40 flex items-center justify-between bg-ink px-4 py-3 lg:hidden">
        <Link href="/admin">
          <Marca compacta />
        </Link>
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label="Abrir menú del panel"
          className="grid size-10 place-items-center rounded-full text-white hover:bg-white/10"
        >
          <Menu className="size-5" strokeWidth={1.6} />
        </button>
      </div>

      <AnimatePresence>
        {abierto ? (
          <motion.div
            className="fixed inset-0 z-60 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" onClick={() => setAbierto(false)} />
            <motion.aside
              className="absolute inset-y-0 left-0 flex w-[16.5rem] flex-col bg-ink py-5 shadow-alza"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="mb-7 flex items-center justify-between px-5">
                <Marca />
                <button
                  type="button"
                  onClick={() => setAbierto(false)}
                  aria-label="Cerrar menú"
                  className="grid size-8 place-items-center rounded-full text-white/70 hover:bg-white/10"
                >
                  <X className="size-4" strokeWidth={1.7} />
                </button>
              </div>
              {navegacion}
              {pie}
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 hidden items-center justify-between gap-6 border-b border-linea bg-hueso/85 px-8 py-3.5 backdrop-blur-xl lg:flex">
          <p className="text-[0.82rem] capitalize text-texto-suave">
            {new Intl.DateTimeFormat("es-AR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            }).format(new Date())}
          </p>
          <div className="flex items-center gap-2.5 rounded-full border border-linea bg-white py-1 pl-1 pr-3.5">
            <span className="grid size-7 place-items-center rounded-full bg-ink text-[0.7rem] font-bold text-oro-claro">
              MF
            </span>
            <span className="text-[0.82rem] font-medium text-ink">María — Propietaria</span>
          </div>
        </header>

        <main className="grow px-4 py-7 sm:px-6 lg:px-8 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
