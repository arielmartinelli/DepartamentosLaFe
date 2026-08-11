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
  consultas.filter((c) => esperaRespuestaDe(c) === "propietaria").length;

export const pendientesParaElVisitante = (consultas: ConsultaCompleta[], cuentaId?: string, email?: string) =>
  consultas.filter(
    (c) =>
      esperaRespuestaDe(c) === "visitante" &&
      (c.cuentaId === cuentaId || (email && c.email.toLowerCase() === email.toLowerCase())),
  ).length;
