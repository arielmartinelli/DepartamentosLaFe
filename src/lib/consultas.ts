import type { ConsultaCompleta } from "./tipos";

/**
 * Una consulta queda “pendiente” para quien tiene que contestar: si el último
 * mensaje lo escribió el visitante, le toca a la propietaria, y al revés.
 *
 * Se deduce de la conversación, sin guardar estados de leído: así funciona
 * igual en cualquier dispositivo y no hay nada que se desincronice.
 */
export function esperaRespuestaDe(consulta: ConsultaCompleta): "propietaria" | "visitante" | null {
  if (consulta.estado === "archivada") return null;

  const ultimo = consulta.conversacion[consulta.conversacion.length - 1];
  if (!ultimo) return consulta.estado === "nueva" ? "propietaria" : null;

  return ultimo.autor === "visitante" ? "propietaria" : "visitante";
}

export const pendientesParaLaPropietaria = (consultas: ConsultaCompleta[]) =>
  sumar(consultas, "propietaria");

export const pendientesParaElVisitante = (consultas: ConsultaCompleta[], cuentaId?: string, email?: string) =>
  sumar(
    consultas.filter(
      (c) => c.cuentaId === cuentaId || (email && c.email.toLowerCase() === email.toLowerCase()),
    ),
    "visitante",
  );

/**
 * Cuántos mensajes seguidos quedaron sin contestar al final de la conversación.
 * Si la persona escribió tres veces y nadie respondió, son tres pendientes.
 */
export function mensajesPendientes(consulta: ConsultaCompleta): number {
  const espera = esperaRespuestaDe(consulta);
  if (!espera) return 0;

  const autor = espera === "propietaria" ? "visitante" : "propietaria";
  let cuenta = 0;
  for (let i = consulta.conversacion.length - 1; i >= 0; i--) {
    if (consulta.conversacion[i].autor !== autor) break;
    cuenta++;
  }
  return cuenta || 1;
}

/** El último mensaje sin contestar, para mostrarlo como vista previa. */
export function ultimoPendiente(consulta: ConsultaCompleta): string {
  if (!esperaRespuestaDe(consulta)) return consulta.mensaje;
  const ultimo = consulta.conversacion[consulta.conversacion.length - 1];
  return ultimo?.texto ?? consulta.mensaje;
}

const sumar = (consultas: ConsultaCompleta[], quien: "propietaria" | "visitante") =>
  consultas.reduce((t, c) => (esperaRespuestaDe(c) === quien ? t + mensajesPendientes(c) : t), 0);
