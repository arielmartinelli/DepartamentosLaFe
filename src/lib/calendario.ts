import type { Reserva } from "./tipos";

export const DIAS = ["L", "M", "M", "J", "V", "S", "D"];
export const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export type Celda = {
  iso: string;
  dia: number;
  otroMes: boolean;
  pasado: boolean;
  reserva?: Reserva;
  inicio: boolean;
  fin: boolean;
};

function iso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/** Devuelve la grilla de 6 semanas (lunes a domingo) de un mes. */
export function grillaMes(anio: number, mes: number, reservas: Reserva[]): Celda[] {
  const primero = new Date(anio, mes, 1);
  const desplazamiento = (primero.getDay() + 6) % 7; // lunes = 0
  const inicio = new Date(anio, mes, 1 - desplazamiento);
  const hoy = iso(new Date());

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i);
    const clave = iso(d);
    const reserva = reservas.find(
      (r) => r.estado !== "cancelada" && clave >= r.desde && clave < r.hasta,
    );
    return {
      iso: clave,
      dia: d.getDate(),
      otroMes: d.getMonth() !== mes,
      pasado: clave < hoy,
      reserva,
      inicio: reserva?.desde === clave,
      fin: reserva ? new Date(new Date(`${clave}T12:00:00`).getTime() + 86_400_000)
        .toISOString()
        .slice(0, 10) === reserva.hasta : false,
    };
  });
}

export function etiquetaMes(anio: number, mes: number) {
  return `${MESES[mes]} ${anio}`;
}
