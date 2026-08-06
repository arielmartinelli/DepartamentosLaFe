import type { Bloqueo, EstadoDia, Reserva } from "./tipos";

/** Estado de un día concreto en una unidad. */
export function estadoDelDia(
  iso: string,
  reservas: Reserva[],
  bloqueos: Bloqueo[],
): EstadoDia {
  const reservado = reservas.some(
    (r) => r.estado !== "cancelada" && iso >= r.desde && iso < r.hasta,
  );
  if (reservado) return "reservada";
  const bloqueado = bloqueos.some((b) => iso >= b.desde && iso < b.hasta);
  if (bloqueado) return "bloqueada";
  return "disponible";
}

/** Lista de días entre dos fechas, sin incluir la de salida. */
export function diasEntre(desde: string, hasta: string) {
  const salida: string[] = [];
  const a = new Date(`${desde}T12:00:00`);
  const b = new Date(`${hasta}T12:00:00`);
  for (let d = new Date(a); d < b; d.setDate(d.getDate() + 1)) {
    salida.push(d.toISOString().slice(0, 10));
  }
  return salida;
}

/** ¿Se puede reservar todo el tramo? Devuelve el primer día ocupado. */
export function tramoLibre(
  desde: string,
  hasta: string,
  reservas: Reserva[],
  bloqueos: Bloqueo[],
): { libre: boolean; primerOcupado?: string } {
  for (const dia of diasEntre(desde, hasta)) {
    if (estadoDelDia(dia, reservas, bloqueos) !== "disponible") {
      return { libre: false, primerOcupado: dia };
    }
  }
  return { libre: true };
}
