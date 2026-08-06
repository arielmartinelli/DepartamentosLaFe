import { foto, retrato } from "./imagenes";
import type {
  Cercania,
  Consulta,
  Departamento,
  Edificio,
  Experiencia,
  ImagenGaleria,
  Pregunta,
  Resena,
  Reserva,
  Servicio,
} from "./tipos";

/* ────────────────────────────────────────────────────────────────
   Edificios
   ──────────────────────────────────────────────────────────────── */

export const edificios: Edificio[] = [
  {
    id: "ed-1",
    slug: "la-fe-i",
    nombre: "La Fe I",
    titular: "La casa de siempre, sobre la calle Ushuaia",
    bajada:
      "Tres departamentos en la casa donde creció la familia. Techos altos, madera a la vista y la cocina mirando al cordón montañoso.",
    descripcion:
      "Es la propiedad original: una casa de dos plantas que se fue reformando de a poco hasta convertirse en tres departamentos independientes. Cada uno tiene su entrada, su cocina y su calefacción, pero comparten el mismo patio de piedra y la misma vista al Monte Olivia. La dueña vive en la planta baja del fondo, así que la puerta se abre a cualquier hora.",
    direccion: "Ushuaia 1569, Ushuaia",
    aLosPies: "12 cuadras del centro · 8 min al puerto en auto",
    coordenadas: { lat: -54.8021, lng: -68.3095 },
    portada: foto.fachada,
    fotos: [foto.fachada, foto.livingEstufa, foto.comedorMadera, foto.dormitorioVentana, foto.detallePuerta],
    rasgos: [
      { titulo: "Estacionamiento propio", detalle: "Dos lugares dentro de la propiedad, sin cargo" },
      { titulo: "Patio compartido", detalle: "Con parrilla cubierta, se usa todo el año" },
      { titulo: "Atendido por la dueña", detalle: "Vive en la misma propiedad" },
    ],
  },
  {
    id: "ed-2",
    slug: "la-fe-ii",
    nombre: "La Fe II",
    titular: "El edificio nuevo, tres cuadras más arriba",
    bajada:
      "Tres departamentos estrenados en 2022, más silenciosos y con mejor vista a la bahía. Pensados para estadías largas.",
    descripcion:
      "Se construyó pensando en cómo viaja la gente hoy: doble vidrio contra el viento, buena señal de internet en todos los ambientes y un lavadero por unidad. Está en una calle sin salida, así que de noche no pasa nadie. Desde el primer piso se ve la Bahía Encerrada y, en los días claros, el otro lado del canal.",
    direccion: "Gobernador Paz 2140, Ushuaia",
    aLosPies: "15 cuadras del centro · vista a la Bahía Encerrada",
    coordenadas: { lat: -54.7968, lng: -68.3161 },
    portada: foto.livingVentanal,
    fotos: [foto.livingVentanal, foto.livingAmplio, foto.dormitorioDoble, foto.cocinaLena, foto.smartTv],
    rasgos: [
      { titulo: "Doble vidrio", detalle: "Silencio real y menos gasto de calefacción" },
      { titulo: "Lavarropas por unidad", detalle: "Cómodo para estadías de más de cuatro noches" },
      { titulo: "Calle sin salida", detalle: "Sin tránsito, con vereda ancha" },
    ],
  },
];

/* ────────────────────────────────────────────────────────────────
   Departamentos — tres por edificio
   ──────────────────────────────────────────────────────────────── */

export const departamentos: Departamento[] = [
  {
    id: "dep-101",
    slug: "la-fe-i-1",
    edificioId: "ed-1",
    nombre: "Departamento 1",
    numero: 1,
    piso: "Planta baja, sin escaleras",
    resumen: "Dos ambientes en planta baja, con acceso directo desde el estacionamiento.",
    descripcion:
      "El más práctico de los tres: se entra desde el estacionamiento sin subir un escalón. Cocina y living comparten un ambiente amplio con la mesa junto a la ventana, y el dormitorio da al patio interno, así que no entra ruido de la calle.",
    parrafoExtra:
      "Lo eligen sobre todo parejas y familias con chicos muy chicos, porque el cochecito entra sin problemas y hay lugar para dejarlo bajo techo.",
    capacidad: 3,
    dormitorios: 1,
    banos: 1,
    metros: 46,
    camas: [
      { tipo: "Cama matrimonial", cantidad: 1, ambiente: "Dormitorio" },
      { tipo: "Sofá cama", cantidad: 1, ambiente: "Living" },
    ],
    bano: ["Ducha con mampara de vidrio", "Agua caliente permanente", "Toallas y amenities incluidos"],
    cocina: ["Horno y anafe", "Heladera con freezer", "Microondas y pava eléctrica", "Vajilla completa para 4"],
    comodidades: ["Escritorio junto a la ventana", "Placard amplio", "Secarropas plegable", "Cuna a pedido"],
    servicios: ["wifi", "cocina", "calefaccion", "tv", "estacionamiento", "ropa-blanca", "check-in"],
    precioNoche: 82000,
    puntaje: 4.9,
    opiniones: 46,
    estado: "disponible",
    destacado: true,
    vista: "Patio interno",
    fotos: [foto.livingEstufa, foto.comedorMadera, foto.dormitorioVentana, foto.cocinaLena, foto.detallePuerta, foto.calefaccion],
  },
  {
    id: "dep-102",
    slug: "la-fe-i-2",
    edificioId: "ed-1",
    nombre: "Departamento 2",
    numero: 2,
    piso: "Primer piso, frente",
    resumen: "Tres ambientes con vista al Monte Olivia. El más pedido por familias.",
    descripcion:
      "Dos dormitorios y un living con salamandra que calienta todo el departamento en veinte minutos. La mesa entra seis personas cómodas y la cocina tiene horno grande, así que se puede cocinar de verdad para varios días.",
    parrafoExtra:
      "Desde el ventanal del living se ve el Monte Olivia entero. En invierno, con nieve, es la foto que todos los huéspedes terminan mandando a su casa.",
    capacidad: 5,
    dormitorios: 2,
    banos: 1,
    metros: 71,
    camas: [
      { tipo: "Cama matrimonial", cantidad: 1, ambiente: "Dormitorio principal" },
      { tipo: "Camas individuales", cantidad: 2, ambiente: "Segundo dormitorio" },
      { tipo: "Sofá cama", cantidad: 1, ambiente: "Living" },
    ],
    bano: ["Bañera con ducha", "Ideal para bañar chicos", "Toallón por huésped"],
    cocina: ["Horno grande y anafe de cuatro hornallas", "Heladera con freezer", "Microondas, tostadora y pava", "Vajilla completa para 6"],
    comodidades: ["Salamandra a leña con leña incluida", "Mesa para 6", "Juegos de mesa y libros", "Silla alta a pedido"],
    servicios: ["wifi", "cocina", "calefaccion", "tv", "estacionamiento", "ropa-blanca", "check-in", "parrilla"],
    precioNoche: 118000,
    puntaje: 4.95,
    opiniones: 61,
    estado: "ocupado",
    destacado: true,
    vista: "Monte Olivia",
    fotos: [foto.livingChimenea, foto.livingSillon, foto.dormitorioDoble, foto.comedorMadera, foto.montanaNevada, foto.estarLeer],
  },
  {
    id: "dep-103",
    slug: "la-fe-i-3",
    edificioId: "ed-1",
    nombre: "Departamento 3",
    numero: 3,
    piso: "Primer piso, contrafrente",
    resumen: "Monoambiente luminoso y silencioso, con buen escritorio.",
    descripcion:
      "Compacto y bien resuelto. Cama queen, mesa para dos junto a la ventana y un escritorio con buena luz. Da al patio, así que es el más silencioso de la casa.",
    parrafoExtra:
      "Es el que eligen quienes se quedan varias semanas trabajando desde acá: la señal de internet llega bien a todos los rincones y hay enchufes junto al escritorio.",
    capacidad: 2,
    dormitorios: 1,
    banos: 1,
    metros: 34,
    camas: [{ tipo: "Cama queen", cantidad: 1, ambiente: "Ambiente principal" }],
    bano: ["Ducha con mampara", "Ventilación propia", "Toallas incluidas"],
    cocina: ["Anafe y horno eléctrico", "Heladera", "Microondas y pava", "Vajilla para 2"],
    comodidades: ["Escritorio con luz propia", "Cortinas blackout", "Calefacción individual regulable"],
    servicios: ["wifi", "cocina", "calefaccion", "tv", "ropa-blanca", "check-in"],
    precioNoche: 71000,
    puntaje: 4.87,
    opiniones: 33,
    estado: "reservado",
    destacado: false,
    vista: "Patio y bosque",
    fotos: [foto.estarLeer, foto.dormitorioVentana, foto.smartTv, foto.detallePuerta, foto.livingLampara, foto.cocinaLena],
  },
  {
    id: "dep-201",
    slug: "la-fe-ii-1",
    edificioId: "ed-2",
    nombre: "Departamento 1",
    numero: 1,
    piso: "Planta baja con patio",
    resumen: "Dos ambientes con patio propio protegido del viento.",
    descripcion:
      "Tiene un patio chico al frente, cerrado con paredón, donde se puede desayunar cuando el día acompaña. Adentro, doble vidrio y piso radiante en el baño.",
    parrafoExtra:
      "El patio es el detalle que más comentan: en Ushuaia encontrar un espacio al aire libre sin viento es raro, y este mira al norte.",
    capacidad: 4,
    dormitorios: 1,
    banos: 1,
    metros: 52,
    camas: [
      { tipo: "Cama matrimonial", cantidad: 1, ambiente: "Dormitorio" },
      { tipo: "Sofá cama doble", cantidad: 1, ambiente: "Living" },
    ],
    bano: ["Piso radiante", "Ducha amplia con mampara", "Toallas y amenities"],
    cocina: ["Horno y anafe", "Heladera con freezer", "Microondas y pava eléctrica", "Vajilla para 4"],
    comodidades: ["Patio propio con mesa", "Lavarropas", "Doble vidrio", "Cuna a pedido"],
    servicios: ["wifi", "cocina", "calefaccion", "tv", "estacionamiento", "ropa-blanca", "check-in", "lavarropas"],
    precioNoche: 96000,
    puntaje: 4.92,
    opiniones: 28,
    estado: "disponible",
    destacado: true,
    vista: "Patio propio",
    fotos: [foto.livingVentanal, foto.comedorMadera, foto.dormitorioVentana, foto.cocinaLena, foto.livingSillon, foto.detallePuerta],
  },
  {
    id: "dep-202",
    slug: "la-fe-ii-2",
    edificioId: "ed-2",
    nombre: "Departamento 2",
    numero: 2,
    piso: "Primer piso, vista a la bahía",
    resumen: "Tres ambientes con ventanal a la Bahía Encerrada.",
    descripcion:
      "El ventanal ocupa toda la pared del living y da a la bahía. Dos dormitorios, cocina con isla y una mesa larga que entra ocho personas sentadas.",
    parrafoExtra:
      "Al atardecer la luz entra baja y naranja durante casi una hora. Es el departamento que más fotos genera y el primero que se reserva en temporada.",
    capacidad: 6,
    dormitorios: 2,
    banos: 2,
    metros: 84,
    camas: [
      { tipo: "Cama king", cantidad: 1, ambiente: "Dormitorio principal" },
      { tipo: "Camas individuales", cantidad: 2, ambiente: "Segundo dormitorio" },
      { tipo: "Sofá cama doble", cantidad: 1, ambiente: "Living" },
    ],
    bano: ["Dos baños completos", "Uno en suite", "Piso radiante en ambos"],
    cocina: ["Cocina con isla", "Horno, anafe y microondas", "Heladera grande con freezer", "Vajilla para 8"],
    comodidades: ["Ventanal a la bahía", "Mesa para 8", "Lavarropas y tendedero", "Smart TV en living y dormitorio"],
    servicios: ["wifi", "cocina", "calefaccion", "tv", "estacionamiento", "ropa-blanca", "check-in", "lavarropas", "parrilla"],
    precioNoche: 164000,
    puntaje: 4.98,
    opiniones: 39,
    estado: "disponible",
    destacado: true,
    vista: "Bahía Encerrada",
    fotos: [foto.livingAmplio, foto.bahia, foto.dormitorioDoble, foto.livingLampara, foto.comedorMadera, foto.smartTv],
  },
  {
    id: "dep-203",
    slug: "la-fe-ii-3",
    edificioId: "ed-2",
    nombre: "Departamento 3",
    numero: 3,
    piso: "Segundo piso, dúplex",
    resumen: "Dúplex con altillo y cama nido, el favorito de las familias con chicos.",
    descripcion:
      "Abajo, living con estufa y cocina; arriba, un altillo con la cama matrimonial y una cama nido para los más chicos. La escalera tiene baranda alta y protección.",
    parrafoExtra:
      "Los días de lluvia —que en Ushuaia son varios— el altillo se convierte en el lugar donde los chicos se instalan a jugar mientras los grandes cocinan abajo.",
    capacidad: 5,
    dormitorios: 2,
    banos: 1,
    metros: 66,
    camas: [
      { tipo: "Cama matrimonial", cantidad: 1, ambiente: "Altillo" },
      { tipo: "Cama nido (2 plazas)", cantidad: 1, ambiente: "Altillo" },
      { tipo: "Sofá cama", cantidad: 1, ambiente: "Living" },
    ],
    bano: ["Ducha con mampara", "Banquito y accesorios para chicos", "Toallas incluidas"],
    cocina: ["Horno y anafe", "Heladera con freezer", "Microondas y pava", "Vajilla irrompible para chicos"],
    comodidades: ["Escalera con protección", "Estufa a leña", "Lavarropas", "Juegos y libros infantiles"],
    servicios: ["wifi", "cocina", "calefaccion", "tv", "estacionamiento", "ropa-blanca", "check-in", "lavarropas"],
    precioNoche: 124000,
    puntaje: 4.91,
    opiniones: 24,
    estado: "disponible",
    destacado: false,
    vista: "Techos y montaña",
    fotos: [foto.livingSalamandra, foto.estarLeer, foto.dormitorioDoble, foto.calefaccion, foto.comedorMadera, foto.livingChimenea],
  },
];

export const horarios = {
  ingreso: "Desde las 15:00",
  salida: "Hasta las 10:30",
  nota: "Si tu vuelo llega de madrugada, coordinamos el ingreso sin costo adicional.",
};

export const politicas = [
  "Reserva confirmada con el 30 % de seña; el resto se abona al llegar.",
  "Cancelación sin cargo hasta 15 días antes de la fecha de ingreso.",
  "Estadía mínima de 2 noches; 3 noches en fines de semana largos.",
  "No se permite fumar dentro de los departamentos.",
  "Mascotas pequeñas, consultando antes de reservar.",
  "Eventos y fiestas no están permitidos.",
];

/* ────────────────────────────────────────────────────────────────
   Contenido turístico
   ──────────────────────────────────────────────────────────────── */

export const experiencias: Experiencia[] = [
  {
    id: "exp-1",
    nombre: "Navegación por el Canal Beagle",
    duracion: "4 horas",
    temporada: "Todo el año",
    descripcion:
      "Lobos marinos, cormoranes y el faro Les Eclaireurs. La salida de las 15 h suele tener menos gente y mejor luz.",
    foto: foto.navegacion,
  },
  {
    id: "exp-2",
    nombre: "Parque Nacional Tierra del Fuego",
    duracion: "Día completo",
    temporada: "Todo el año",
    descripcion:
      "Senderos de dificultad baja que los chicos hacen sin problema, bosque de lenga, castoreras y la bahía Lapataia.",
    foto: foto.lagos,
  },
  {
    id: "exp-3",
    nombre: "Tren del Fin del Mundo",
    duracion: "2 horas",
    temporada: "Todo el año",
    descripcion:
      "El recorrido más corto y el que mejor funciona con chicos chicos. Se combina bien con la entrada al Parque.",
    foto: foto.ciudadDesdeElAgua,
  },
  {
    id: "exp-4",
    nombre: "Cerro Castor",
    duracion: "Día completo",
    temporada: "Junio a octubre",
    descripcion:
      "Esquí, trineos y escuela para principiantes a 26 km. Guardamos el equipo en la propiedad sin cargo.",
    foto: foto.montanaNevada,
  },
  {
    id: "exp-5",
    nombre: "Avistaje de pingüinos",
    duracion: "5 horas",
    temporada: "Octubre a marzo",
    descripcion:
      "Colonia de pingüinos papúa y magallánicos en la isla Martillo. Conviene reservar con varios días de anticipación.",
    foto: foto.pinguinos,
  },
  {
    id: "exp-6",
    nombre: "Lagos Escondido y Fagnano",
    duracion: "Día completo",
    temporada: "Todo el año",
    descripcion:
      "Se cruza el paso Garibaldi y se llega a los dos lagos grandes de la isla. Hay excursiones en 4x4 y también se hace en auto.",
    foto: foto.canalBeagle,
  },
];

export const cercanias: Cercania[] = [
  { id: "cer-1", nombre: "Parque Nacional Tierra del Fuego", categoria: "Naturaleza", distancia: "15 min en auto", descripcion: "Senderos, bahía Lapataia y el bosque de lengas.", foto: foto.lagos },
  { id: "cer-2", nombre: "Puerto de Ushuaia", categoria: "Ciudad", distancia: "8 min en auto", descripcion: "Punto de salida de todas las navegaciones por el canal.", foto: foto.puerto },
  { id: "cer-3", nombre: "Canal Beagle", categoria: "Naturaleza", distancia: "10 min en auto", descripcion: "El faro, los lobos marinos y la vista a la isla Redonda.", foto: foto.faroEclaireurs },
  { id: "cer-4", nombre: "Tren del Fin del Mundo", categoria: "Paseos", distancia: "20 min en auto", descripcion: "Estación del Fin del Mundo, sobre la Ruta 3.", foto: foto.ciudadDesdeElAgua },
  { id: "cer-5", nombre: "Cerro Castor", categoria: "Naturaleza", distancia: "30 min en auto", descripcion: "El centro de esquí más austral, abierto de junio a octubre.", foto: foto.montanaNevada },
  { id: "cer-6", nombre: "Glaciar Martial", categoria: "Naturaleza", distancia: "12 min en auto", descripcion: "Caminata corta con vista a toda la ciudad y al canal.", foto: foto.faroRoca },
];

/** Servicios prácticos: van como lista, no como tarjetas con foto. */
export const aLaVuelta = [
  { nombre: "Supermercado La Anónima", detalle: "3 cuadras · abierto hasta las 22 h" },
  { nombre: "Restaurantes de la calle San Martín", detalle: "12 cuadras · centolla, cordero y cervecerías" },
  { nombre: "Alquiler de autos", detalle: "Retiro en el aeropuerto o entrega en la puerta" },
  { nombre: "Farmacia de turno", detalle: "5 cuadras · listado actualizado en la carpeta del departamento" },
  { nombre: "Parada de colectivo al Parque Nacional", detalle: "2 cuadras" },
  { nombre: "Estación de servicio", detalle: "6 cuadras, sobre la avenida" },
];

export const resenas: Resena[] = [
  {
    id: "res-1",
    texto:
      "Viajamos con dos nenas y fue la mejor decisión. El departamento estaba impecable y calentito, y nos dejaron entrar a las siete de la mañana después del vuelo nocturno. María nos armó el itinerario de los cuatro días en una hoja.",
    autor: "Marina D.",
    procedencia: "Rosario",
    fecha: "Julio 2026",
    departamento: "La Fe I · Departamento 2",
    retrato: retrato.marina,
  },
  {
    id: "res-2",
    texto:
      "La cocina tiene absolutamente todo, así que comimos varias noches ahí y nos ahorramos una fortuna. El ventanal a la bahía al atardecer no se puede describir, hay que verlo.",
    autor: "Gonzalo P.",
    procedencia: "Mendoza",
    fecha: "Junio 2026",
    departamento: "La Fe II · Departamento 2",
    retrato: retrato.gonzalo,
  },
  {
    id: "res-3",
    texto:
      "Tranquilo pero cerca de todo. Nos ayudaron a conseguir lugar en la navegación cuando ya estaba completa y nos guardaron las valijas el último día hasta la hora del vuelo. Volvemos seguro.",
    autor: "Sofía & Andrés",
    procedencia: "Montevideo",
    fecha: "Mayo 2026",
    departamento: "La Fe II · Departamento 1",
    retrato: retrato.sofia,
  },
];

export const preguntas: Pregunta[] = [
  {
    pregunta: "¿Cuál es el horario de ingreso y de salida?",
    respuesta:
      "El ingreso es desde las 15:00 y la salida hasta las 10:30. Si tu vuelo llega de madrugada o sale muy tarde, avisanos al reservar: coordinamos el horario sin costo adicional y, si hace falta, te guardamos las valijas.",
  },
  {
    pregunta: "¿Cómo se reserva y qué formas de pago aceptan?",
    respuesta:
      "Se reserva con el 30 % de seña por transferencia y el resto se abona al llegar, en pesos o en dólares. No cobramos comisiones ni cargos administrativos: el trato es directo con la propietaria.",
  },
  {
    pregunta: "¿Qué incluye la ropa de blanco y la limpieza?",
    respuesta:
      "Sábanas, toallas y toallones limpios al llegar, y recambio cada cuatro noches en estadías largas. La limpieza final está incluida en el precio; no hay cargo aparte.",
  },
  {
    pregunta: "¿Los departamentos tienen buena calefacción?",
    respuesta:
      "Sí. En La Fe I hay calefacción central más salamandra a leña en el Departamento 2, con la leña incluida. En La Fe II hay calefacción central, doble vidrio y piso radiante en los baños. Es la consulta más frecuente y la que más nos importa responder bien.",
  },
  {
    pregunta: "¿Aceptan mascotas?",
    respuesta:
      "Sí, mascotas pequeñas y educadas, avisando antes de reservar. Pedimos no dejarlas solas dentro del departamento y cuidar los muebles.",
  },
  {
    pregunta: "¿Hay estacionamiento?",
    respuesta:
      "Sí, en ambos edificios y sin costo. En La Fe I son dos lugares dentro de la propiedad y en La Fe II hay cochera para cada unidad. Si venís con auto alquilado, avisanos para reservarte el lugar.",
  },
];

/* ────────────────────────────────────────────────────────────────
   Servicios
   ──────────────────────────────────────────────────────────────── */

export const servicios: Servicio[] = [
  { id: "wifi", nombre: "WiFi de fibra", icono: "wifi", descripcion: "Estable en todos los ambientes, sirve para videollamadas.", activo: true, destacadoEnHome: true },
  { id: "cocina", nombre: "Cocina equipada", icono: "utensilios", descripcion: "Horno, heladera con freezer y vajilla completa.", activo: true, destacadoEnHome: true },
  { id: "calefaccion", nombre: "Calefacción central", icono: "llama", descripcion: "Ambientes templados todo el año, también en julio.", activo: true, destacadoEnHome: true },
  { id: "tv", nombre: "Smart TV", icono: "tv", descripcion: "Con acceso a plataformas de streaming.", activo: true, destacadoEnHome: true },
  { id: "estacionamiento", nombre: "Estacionamiento", icono: "auto", descripcion: "Lugar propio dentro de la propiedad, sin cargo.", activo: true, destacadoEnHome: true },
  { id: "ropa-blanca", nombre: "Ropa blanca incluida", icono: "cama", descripcion: "Sábanas y toallas limpias, con recambio en estadías largas.", activo: true, destacadoEnHome: true },
  { id: "check-in", nombre: "Check-in flexible", icono: "reloj", descripcion: "Coordinamos según tu vuelo, también de madrugada.", activo: true, destacadoEnHome: true },
  { id: "lavarropas", nombre: "Lavarropas", icono: "lavarropas", descripcion: "En todas las unidades de La Fe II.", activo: true, destacadoEnHome: true },
  { id: "parrilla", nombre: "Parrilla cubierta", icono: "parrilla", descripcion: "En el patio, protegida del viento.", activo: true, destacadoEnHome: false },
];

/* ────────────────────────────────────────────────────────────────
   Datos del panel
   ──────────────────────────────────────────────────────────────── */

export const reservas: Reserva[] = [
  { id: "r-1041", codigo: "LF-1041", huesped: "Familia Alcaraz", email: "m.alcaraz@correo.com", telefono: "+54 11 5544 2211", departamentoId: "dep-102", desde: "2026-08-03", hasta: "2026-08-09", personas: 5, estado: "confirmada", origen: "Web", total: 708000, notas: "Llegan en el vuelo de las 22:40. Piden cuna." },
  { id: "r-1042", codigo: "LF-1042", huesped: "Lucía Ferrari", email: "lucia.ferrari@correo.com", telefono: "+54 341 611 8890", departamentoId: "dep-103", desde: "2026-08-06", hasta: "2026-08-10", personas: 2, estado: "confirmada", origen: "WhatsApp", total: 284000 },
  { id: "r-1043", codigo: "LF-1043", huesped: "Peter Janssen", email: "p.janssen@mail.nl", telefono: "+31 6 2233 8877", departamentoId: "dep-101", desde: "2026-08-11", hasta: "2026-08-16", personas: 2, estado: "pendiente", origen: "Airbnb", total: 410000, notas: "Consulta si puede dejar equipaje después del check-out." },
  { id: "r-1044", codigo: "LF-1044", huesped: "Familia Nakamura", email: "nakamura.family@mail.jp", telefono: "+81 90 1122 3344", departamentoId: "dep-202", desde: "2026-08-14", hasta: "2026-08-21", personas: 6, estado: "confirmada", origen: "Booking", total: 1148000 },
  { id: "r-1045", codigo: "LF-1045", huesped: "Sergio Bustos", email: "sbustos@correo.com", telefono: "+54 291 445 1200", departamentoId: "dep-201", desde: "2026-08-18", hasta: "2026-08-22", personas: 4, estado: "pendiente", origen: "Web", total: 384000 },
  { id: "r-1046", codigo: "LF-1046", huesped: "Carla Miranda", email: "carla.miranda@correo.com", telefono: "+54 351 233 7788", departamentoId: "dep-203", desde: "2026-08-22", hasta: "2026-08-27", personas: 4, estado: "confirmada", origen: "Web", total: 620000 },
  { id: "r-1047", codigo: "LF-1047", huesped: "Grupo Trekking Sur", email: "contacto@trekkingsur.com", telefono: "+54 11 4477 9900", departamentoId: "dep-202", desde: "2026-09-02", hasta: "2026-09-06", personas: 6, estado: "pendiente", origen: "Teléfono", total: 656000 },
  { id: "r-1048", codigo: "LF-1048", huesped: "Ana y Diego Ruiz", email: "adruiz@correo.com", telefono: "+54 223 500 4411", departamentoId: "dep-101", desde: "2026-07-24", hasta: "2026-07-29", personas: 2, estado: "finalizada", origen: "Web", total: 410000 },
  { id: "r-1049", codigo: "LF-1049", huesped: "Martín Ojeda", email: "mojeda@correo.com", telefono: "+54 388 411 2200", departamentoId: "dep-103", desde: "2026-08-28", hasta: "2026-08-31", personas: 2, estado: "cancelada", origen: "Booking", total: 213000, notas: "Canceló por cambio de vuelo. Reprogramaría para octubre." },
  { id: "r-1050", codigo: "LF-1050", huesped: "Familia Ledesma", email: "ledesma.flia@correo.com", telefono: "+54 264 500 3322", departamentoId: "dep-102", desde: "2026-09-10", hasta: "2026-09-17", personas: 4, estado: "confirmada", origen: "Web", total: 826000 },
  { id: "r-1051", codigo: "LF-1051", huesped: "Paula Sández", email: "psandez@correo.com", telefono: "+54 299 400 1188", departamentoId: "dep-201", desde: "2026-09-04", hasta: "2026-09-08", personas: 3, estado: "confirmada", origen: "WhatsApp", total: 384000 },
  { id: "r-1052", codigo: "LF-1052", huesped: "Familia Sosa", email: "sosa.flia@correo.com", telefono: "+54 376 455 2200", departamentoId: "dep-203", desde: "2026-09-18", hasta: "2026-09-24", personas: 5, estado: "pendiente", origen: "Web", total: 744000 },
];

export const consultas: Consulta[] = [
  { id: "c-301", nombre: "Verónica Paz", email: "vero.paz@correo.com", telefono: "+54 11 6677 4433", fecha: "2026-08-05", personas: 4, mensaje: "Hola, viajamos con dos nenes de 6 y 9 años del 12 al 18 de septiembre. ¿Tienen algún departamento en planta baja? Gracias.", estado: "nueva" },
  { id: "c-302", nombre: "Tomás Ferreyra", email: "tferreyra@correo.com", telefono: "+54 351 700 2211", fecha: "2026-08-04", personas: 2, mensaje: "Buenas tardes. ¿El estacionamiento es cubierto? Llegamos con auto alquilado el 20 de agosto.", estado: "nueva" },
  { id: "c-303", nombre: "Helena Costa", email: "helena.costa@mail.br", telefono: "+55 21 99887 1122", fecha: "2026-08-03", personas: 3, mensaje: "Olá! Gostaria de saber se há disponibilidade para 3 pessoas entre 5 e 10 de outubro. Obrigada!", estado: "respondida" },
  { id: "c-304", nombre: "Grupo Aurora Austral", email: "reservas@auroraaustral.com", telefono: "+54 2901 44 1200", fecha: "2026-08-01", personas: 12, mensaje: "Somos una agencia y buscamos alojamiento para grupos de 12 personas en temporada alta. ¿Manejan tarifas corporativas?", estado: "nueva" },
  { id: "c-305", nombre: "Julián Ríos", email: "julian.rios@correo.com", telefono: "+54 342 511 9080", fecha: "2026-07-30", personas: 2, mensaje: "¿Aceptan mascotas pequeñas? Viajamos con un perro de 6 kg.", estado: "archivada" },
];

export const galeria: ImagenGaleria[] = [
  { id: "g-01", titulo: "Fachada de La Fe I al atardecer", categoria: "Entorno", principal: true, alto: "alto", src: foto.fachada },
  { id: "g-02", titulo: "Living con salamandra", categoria: "Departamentos", principal: false, alto: "medio", src: foto.livingEstufa },
  { id: "g-03", titulo: "Cocina equipada", categoria: "Departamentos", principal: false, alto: "bajo", src: foto.cocinaLena },
  { id: "g-04", titulo: "Dormitorio principal", categoria: "Departamentos", principal: false, alto: "alto", src: foto.dormitorioVentana },
  { id: "g-05", titulo: "Bahía Encerrada", categoria: "Ushuaia", principal: false, alto: "medio", src: foto.bahia },
  { id: "g-06", titulo: "Mesa junto a la ventana", categoria: "Detalles", principal: false, alto: "bajo", src: foto.comedorMadera },
  { id: "g-07", titulo: "Faro Les Eclaireurs", categoria: "Ushuaia", principal: false, alto: "medio", src: foto.faroEclaireurs },
  { id: "g-08", titulo: "Estar del dúplex", categoria: "Departamentos", principal: false, alto: "alto", src: foto.livingSalamandra },
  { id: "g-09", titulo: "Detalle de la entrada", categoria: "Detalles", principal: false, alto: "bajo", src: foto.detallePuerta },
  { id: "g-10", titulo: "Puerto de Ushuaia", categoria: "Entorno", principal: false, alto: "medio", src: foto.puerto },
];

export const ocupacionMensual = [
  { mes: "Feb", ocupacion: 88, ingresos: 4120000 },
  { mes: "Mar", ocupacion: 72, ingresos: 3380000 },
  { mes: "Abr", ocupacion: 54, ingresos: 2460000 },
  { mes: "May", ocupacion: 41, ingresos: 1870000 },
  { mes: "Jun", ocupacion: 63, ingresos: 2940000 },
  { mes: "Jul", ocupacion: 91, ingresos: 4480000 },
  { mes: "Ago", ocupacion: 84, ingresos: 4110000 },
];

export const origenReservas = [
  { origen: "Web", valor: 42 },
  { origen: "WhatsApp", valor: 24 },
  { origen: "Booking", valor: 18 },
  { origen: "Airbnb", valor: 12 },
  { origen: "Teléfono", valor: 4 },
];

/* Ayudas */
export const porEdificio = (edificioId: string) =>
  departamentos.filter((d) => d.edificioId === edificioId);

export const buscarEdificio = (id: string) => edificios.find((e) => e.id === id);
