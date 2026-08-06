import { Insignia } from "@/components/ui/insignia";
import type { EstadoConsulta, EstadoDepto, EstadoReserva } from "@/lib/tipos";

const reserva: Record<EstadoReserva, { tono: "exito" | "aviso" | "alerta" | "neutro"; texto: string }> = {
  confirmada: { tono: "exito", texto: "Confirmada" },
  pendiente: { tono: "aviso", texto: "Pendiente" },
  cancelada: { tono: "alerta", texto: "Cancelada" },
  finalizada: { tono: "neutro", texto: "Finalizada" },
};

const depto: Record<EstadoDepto, { tono: "exito" | "aviso" | "alerta" | "neutro"; texto: string }> = {
  disponible: { tono: "exito", texto: "Disponible" },
  reservado: { tono: "aviso", texto: "Reservado" },
  ocupado: { tono: "neutro", texto: "Ocupado" },
  mantenimiento: { tono: "alerta", texto: "Mantenimiento" },
};

const consulta: Record<EstadoConsulta, { tono: "oro" | "exito" | "neutro"; texto: string }> = {
  nueva: { tono: "oro", texto: "Nueva" },
  respondida: { tono: "exito", texto: "Respondida" },
  archivada: { tono: "neutro", texto: "Archivada" },
};

export function EstadoReservaTag({ estado }: { estado: EstadoReserva }) {
  const { tono, texto } = reserva[estado];
  return <Insignia tono={tono}>{texto}</Insignia>;
}

export function EstadoDeptoTag({ estado }: { estado: EstadoDepto }) {
  const { tono, texto } = depto[estado];
  return <Insignia tono={tono}>{texto}</Insignia>;
}

export function EstadoConsultaTag({ estado }: { estado: EstadoConsulta }) {
  const { tono, texto } = consulta[estado];
  return <Insignia tono={tono}>{texto}</Insignia>;
}
