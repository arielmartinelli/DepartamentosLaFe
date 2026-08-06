export type EstadoDepto = "disponible" | "reservado" | "ocupado" | "mantenimiento";
export type EstadoReserva = "pendiente" | "confirmada" | "cancelada" | "finalizada";
export type EstadoConsulta = "nueva" | "respondida" | "archivada";

export type Edificio = {
  id: string;
  slug: string;
  nombre: string;
  titular: string;
  bajada: string;
  descripcion: string;
  direccion: string;
  aLosPies: string;
  coordenadas: { lat: number; lng: number };
  portada: string;
  fotos: string[];
  rasgos: { titulo: string; detalle: string }[];
};

export type Cama = { tipo: string; cantidad: number; ambiente: string };

export type Departamento = {
  id: string;
  slug: string;
  edificioId: string;
  nombre: string;
  numero: number;
  piso: string;
  resumen: string;
  descripcion: string;
  parrafoExtra: string;
  capacidad: number;
  dormitorios: number;
  banos: number;
  metros: number;
  camas: Cama[];
  bano: string[];
  cocina: string[];
  comodidades: string[];
  servicios: string[];
  precioNoche: number;
  puntaje: number;
  opiniones: number;
  estado: EstadoDepto;
  destacado: boolean;
  vista: string;
  fotos: string[];
};

export type Reserva = {
  id: string;
  codigo: string;
  huesped: string;
  email: string;
  telefono: string;
  departamentoId: string;
  desde: string;
  hasta: string;
  personas: number;
  estado: EstadoReserva;
  origen: "Web" | "WhatsApp" | "Booking" | "Airbnb" | "Teléfono";
  total: number;
  notas?: string;
};

export type Consulta = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fecha: string;
  personas: number;
  mensaje: string;
  estado: EstadoConsulta;
};

export type Servicio = {
  id: string;
  nombre: string;
  icono: string;
  descripcion: string;
  activo: boolean;
  destacadoEnHome: boolean;
};

export type Experiencia = {
  id: string;
  nombre: string;
  duracion: string;
  temporada: string;
  descripcion: string;
  foto: string;
};

export type Cercania = {
  id: string;
  nombre: string;
  categoria: "Naturaleza" | "Paseos" | "Ciudad" | "Servicios";
  distancia: string;
  descripcion: string;
  foto: string;
};

export type ImagenGaleria = {
  id: string;
  titulo: string;
  categoria: "Departamentos" | "Entorno" | "Detalles" | "Ushuaia";
  principal: boolean;
  alto: "alto" | "medio" | "bajo";
  src: string | null;
};

export type Pregunta = { pregunta: string; respuesta: string };

export type Resena = {
  id: string;
  texto: string;
  autor: string;
  procedencia: string;
  fecha: string;
  departamento: string;
  retrato: string;
};

/* ── Ampliaciones del producto administrable ─────────────────── */

export type EstadoDia = "disponible" | "reservada" | "bloqueada";

/** Bloqueo manual de fechas: no implica que exista una reserva. */
export type Bloqueo = {
  id: string;
  departamentoId: string;
  desde: string;
  hasta: string;
  motivo: string;
};

export type Actividad = {
  id: string;
  titulo: string;
  descripcion: string;
  duracion: string;
  temporada: string;
  foto: string;
  orden: number;
  activa: boolean;
};

export type Lugar = {
  id: string;
  nombre: string;
  descripcion: string;
  distancia: string;
  categoria: string;
  foto: string;
  mapa: string;
  orden: number;
  activo: boolean;
};

export type Comentario = {
  id: string;
  texto: string;
  autor: string;
  procedencia: string;
  fecha: string;
  departamento: string;
  puntaje: number;
  orden: number;
  publicado: boolean;
};

export type Prestacion = {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  foto: string | null;
  orden: number;
  activo: boolean;
  destacadoEnHome: boolean;
};

/** Cada galería es un sector independiente del sitio. */
export type SectorGaleria = {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: "edificio" | "departamento" | "actividades" | "alrededores";
  referencia?: string;
  imagenes: ImagenSector[];
};

export type ImagenSector = {
  id: string;
  src: string;
  titulo: string;
  principal: boolean;
};

export type MensajeConsulta = {
  id: string;
  autor: "visitante" | "propietaria";
  texto: string;
  fecha: string;
};

export type ConsultaCompleta = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  departamentoId: string | null;
  desde: string | null;
  hasta: string | null;
  personas: number;
  mensaje: string;
  fecha: string;
  estado: EstadoConsulta;
  canal: "Web" | "WhatsApp" | "Cuenta";
  cuentaId?: string | null;
  conversacion: MensajeConsulta[];
};

export type Cuenta = {
  id: string;
  nombre: string;
  email: string;
  clave: string;
  telefono: string;
  creada: string;
};
