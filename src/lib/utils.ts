import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatearPrecio(valor: number, moneda = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatearFecha(iso: string, estilo: "corta" | "larga" = "corta") {
  const d = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: estilo === "larga" ? "long" : "2-digit",
    year: "numeric",
  }).format(d);
}

export function noches(desde: string, hasta: string) {
  const a = new Date(`${desde}T12:00:00`).getTime();
  const b = new Date(`${hasta}T12:00:00`).getTime();
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

export function iniciales(nombre: string) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function slugificar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
