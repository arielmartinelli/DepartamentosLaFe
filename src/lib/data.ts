import { foto, retrato } from "./imagenes";
import type {
  Consulta,
  Departamento,
  Edificio,
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
    titular: "Cuatro departamentos a cinco cuadras del centro",
    bajada:
      "Cada uno con su dormitorio, su cocina-comedor equipada y todo lo necesario para instalarse sin comprar nada.",
    descripcion:
      "Son cuatro departamentos independientes en la misma propiedad. Todos tienen un dormitorio con cama matrimonial y cama simple, cocina-comedor completa, televisor en cada ambiente y fibra óptica. Están a cinco cuadras paralelas del centro, así que se llega caminando, y a menos de cien metros hay panadería, rotisería, carnicería, verdulería, kioscos y despensas.",
    direccion: "Ushuaia 1589, Ushuaia",
    aLosPies: "5 cuadras del centro · comercios a 100 m",
    coordenadas: { lat: -54.8021, lng: -68.3095 },
    portada: foto.fachada,
    fotos: [foto.fachada, foto.livingEstufa, foto.comedorMadera, foto.dormitorioVentana, foto.detallePuerta],
    rasgos: [
      { titulo: "Fibra óptica y cable", detalle: "Sirve para trabajar desde el departamento" },
      { titulo: "Todo a mano", detalle: "Panadería, carnicería y verdulería a menos de 100 m" },
      { titulo: "Atendido por la dueña", detalle: "Trato directo, sin intermediarios" },
    ],
  },
  {
    id: "ed-2",
    slug: "la-fe-ii",
    nombre: "La Fe II",
    titular: "Dos departamentos con cama king",
    bajada:
      "Dormitorio con cama king y un sofá hotelero en el living, con el mismo equipamiento que el resto.",
    descripcion:
      "Dos unidades con dormitorio de cama king y un sofá hotelero en el living. El equipamiento es el mismo que en La Fe I: cocina-comedor completa, televisor en cada ambiente, fibra óptica y cable.",
    direccion: "Ushuaia, Tierra del Fuego",
    aLosPies: "5 cuadras del centro · comercios a 100 m",
    coordenadas: { lat: -54.8015, lng: -68.3078 },
    portada: foto.livingVentanal,
    fotos: [foto.livingVentanal, foto.livingAmplio, foto.dormitorioDoble, foto.cocinaLena, foto.smartTv],
    rasgos: [
      { titulo: "Cama king", detalle: "Más sofá hotelero en el living" },
      { titulo: "Sofá que se arma a medida", detalle: "Matrimonial y simple, o tres individuales" },
      { titulo: "Mismo equipamiento", detalle: "Cocina completa, fibra óptica y TV en cada ambiente" },
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
    piso: "",
    resumen: "Dormitorio con cama matrimonial y simple, cocina-comedor completa.",
    descripcion:
      "Un dormitorio con cama matrimonial y cama simple, y una cocina-comedor equipada con todo lo necesario para cocinar de verdad durante la estadía. Televisor en cada ambiente y fibra óptica en todo el departamento.",
    parrafoExtra:
      "A cinco cuadras paralelas del centro y con panadería, rotisería, carnicería y verdulería a menos de cien metros: se sale a comprar en pantuflas.",
    capacidad: 3,
    dormitorios: 1,
    banos: 1,
    metros: 0,
    camas: [
      { tipo: "Cama matrimonial", cantidad: 1, ambiente: "Dormitorio" },
      { tipo: "Cama simple", cantidad: 1, ambiente: "Dormitorio" },
    ],
    bano: ["Baño completo", "Toallas de línea blanca", "Secador de pelo"],
    cocina: [
      "Cocina-comedor completamente equipada",
      "Heladera, microondas y pava eléctrica",
      "Cafetera, tostadora y extractor de jugo",
      "Todos los utensilios y la vajilla",
      "Desayuno seco incluido",
    ],
    comodidades: [
      "Televisor en cada ambiente",
      "WiFi con fibra óptica y cable",
      "Ropa de cama y toallas incluidas",
      "Espacio de trabajo con buena señal",
    ],
    servicios: ["wifi", "cable", "tv", "cocina", "desayuno", "ropa-blanca", "secador", "calefaccion"],
    precioNoche: 80000,
    puntaje: 4.9,
    opiniones: 22,
    estado: "disponible",
    destacado: true,
    vista: "Interior",
    fotos: [foto.livingEstufa, foto.comedorMadera, foto.dormitorioVentana, foto.cocinaLena, foto.detallePuerta, foto.calefaccion],
  },
  {
    id: "dep-102",
    slug: "la-fe-i-2",
    edificioId: "ed-1",
    nombre: "Departamento 2",
    numero: 2,
    piso: "",
    resumen: "Dormitorio con cama matrimonial y simple, cocina-comedor completa.",
    descripcion:
      "Un dormitorio con cama matrimonial y cama simple, y una cocina-comedor equipada con todo lo necesario para cocinar de verdad durante la estadía. Televisor en cada ambiente y fibra óptica en todo el departamento.",
    parrafoExtra:
      "A cinco cuadras paralelas del centro y con panadería, rotisería, carnicería y verdulería a menos de cien metros: se sale a comprar en pantuflas.",
    capacidad: 3,
    dormitorios: 1,
    banos: 1,
    metros: 0,
    camas: [
      { tipo: "Cama matrimonial", cantidad: 1, ambiente: "Dormitorio" },
      { tipo: "Cama simple", cantidad: 1, ambiente: "Dormitorio" },
    ],
    bano: ["Baño completo", "Toallas de línea blanca", "Secador de pelo"],
    cocina: [
      "Cocina-comedor completamente equipada",
      "Heladera, microondas y pava eléctrica",
      "Cafetera, tostadora y extractor de jugo",
      "Todos los utensilios y la vajilla",
      "Desayuno seco incluido",
    ],
    comodidades: [
      "Televisor en cada ambiente",
      "WiFi con fibra óptica y cable",
      "Ropa de cama y toallas incluidas",
      "Espacio de trabajo con buena señal",
    ],
    servicios: ["wifi", "cable", "tv", "cocina", "desayuno", "ropa-blanca", "secador", "calefaccion"],
    precioNoche: 80000,
    puntaje: 4.92,
    opiniones: 26,
    estado: "disponible",
    destacado: true,
    vista: "Interior",
    fotos: [foto.livingChimenea, foto.livingSillon, foto.dormitorioDoble, foto.comedorMadera, foto.estarLeer, foto.smartTv],
  },
  {
    id: "dep-103",
    slug: "la-fe-i-3",
    edificioId: "ed-1",
    nombre: "Departamento 3",
    numero: 3,
    piso: "",
    resumen: "Dormitorio con cama matrimonial y simple, cocina-comedor completa.",
    descripcion:
      "Un dormitorio con cama matrimonial y cama simple, y una cocina-comedor equipada con todo lo necesario para cocinar de verdad durante la estadía. Televisor en cada ambiente y fibra óptica en todo el departamento.",
    parrafoExtra:
      "A cinco cuadras paralelas del centro y con panadería, rotisería, carnicería y verdulería a menos de cien metros: se sale a comprar en pantuflas.",
    capacidad: 3,
    dormitorios: 1,
    banos: 1,
    metros: 0,
    camas: [
      { tipo: "Cama matrimonial", cantidad: 1, ambiente: "Dormitorio" },
      { tipo: "Cama simple", cantidad: 1, ambiente: "Dormitorio" },
    ],
    bano: ["Baño completo", "Toallas de línea blanca", "Secador de pelo"],
    cocina: [
      "Cocina-comedor completamente equipada",
      "Heladera, microondas y pava eléctrica",
      "Cafetera, tostadora y extractor de jugo",
      "Todos los utensilios y la vajilla",
      "Desayuno seco incluido",
    ],
    comodidades: [
      "Televisor en cada ambiente",
      "WiFi con fibra óptica y cable",
      "Ropa de cama y toallas incluidas",
      "Espacio de trabajo con buena señal",
    ],
    servicios: ["wifi", "cable", "tv", "cocina", "desayuno", "ropa-blanca", "secador", "calefaccion"],
    precioNoche: 80000,
    puntaje: 4.9,
    opiniones: 30,
    estado: "disponible",
    destacado: false,
    vista: "Interior",
    fotos: [foto.estarLeer, foto.dormitorioVentana, foto.smartTv, foto.detallePuerta, foto.livingLampara, foto.cocinaLena],
  },
  {
    id: "dep-104",
    slug: "la-fe-i-4",
    edificioId: "ed-1",
    nombre: "Departamento 4",
    numero: 4,
    piso: "",
    resumen: "Dormitorio con cama matrimonial y simple, cocina-comedor completa.",
    descripcion:
      "Un dormitorio con cama matrimonial y cama simple, y una cocina-comedor equipada con todo lo necesario para cocinar de verdad durante la estadía. Televisor en cada ambiente y fibra óptica en todo el departamento.",
    parrafoExtra:
      "A cinco cuadras paralelas del centro y con panadería, rotisería, carnicería y verdulería a menos de cien metros: se sale a comprar en pantuflas.",
    capacidad: 3,
    dormitorios: 1,
    banos: 1,
    metros: 0,
    camas: [
      { tipo: "Cama matrimonial", cantidad: 1, ambiente: "Dormitorio" },
      { tipo: "Cama simple", cantidad: 1, ambiente: "Dormitorio" },
    ],
    bano: ["Baño completo", "Toallas de línea blanca", "Secador de pelo"],
    cocina: [
      "Cocina-comedor completamente equipada",
      "Heladera, microondas y pava eléctrica",
      "Cafetera, tostadora y extractor de jugo",
      "Todos los utensilios y la vajilla",
      "Desayuno seco incluido",
    ],
    comodidades: [
      "Televisor en cada ambiente",
      "WiFi con fibra óptica y cable",
      "Ropa de cama y toallas incluidas",
      "Espacio de trabajo con buena señal",
    ],
    servicios: ["wifi", "cable", "tv", "cocina", "desayuno", "ropa-blanca", "secador", "calefaccion"],
    precioNoche: 80000,
    puntaje: 4.92,
    opiniones: 34,
    estado: "disponible",
    destacado: false,
    vista: "Interior",
    fotos: [foto.livingSalamandra, foto.comedorMadera, foto.dormitorioDoble, foto.calefaccion, foto.livingChimenea, foto.detallePuerta],
  },
  {
    id: "dep-201",
    slug: "la-fe-ii-1",
    edificioId: "ed-2",
    nombre: "Departamento 1",
    numero: 1,
    piso: "",
    resumen: "Cama king en el dormitorio y sofá hotelero en el living.",
    descripcion:
      "El dormitorio tiene cama king y el living un sofá hotelero que se arma como cama matrimonial más una simple, o como tres individuales, según venga el grupo. Cocina-comedor completa y televisor en cada ambiente.",
    parrafoExtra:
      "Es la opción para familias o grupos de amigos que no quieren separarse en dos departamentos. Mismo equipamiento que el resto, con más lugar para dormir.",
    capacidad: 3,
    dormitorios: 1,
    banos: 1,
    metros: 0,
    camas: [
      { tipo: "Cama king", cantidad: 1, ambiente: "Dormitorio" },
      { tipo: "Sofá hotelero (matrimonial + simple, o 3 individuales)", cantidad: 1, ambiente: "Living" },
    ],
    bano: ["Baño completo", "Toallas de línea blanca", "Secador de pelo"],
    cocina: [
      "Cocina-comedor completamente equipada",
      "Heladera, microondas y pava eléctrica",
      "Cafetera, tostadora y extractor de jugo",
      "Todos los utensilios y la vajilla",
      "Desayuno seco incluido",
    ],
    comodidades: [
      "Televisor en cada ambiente",
      "WiFi con fibra óptica y cable",
      "Ropa de cama y toallas incluidas",
      "Espacio de trabajo con buena señal",
    ],
    servicios: ["wifi", "cable", "tv", "cocina", "desayuno", "ropa-blanca", "secador", "calefaccion"],
    precioNoche: 80000,
    puntaje: 4.9,
    opiniones: 22,
    estado: "disponible",
    destacado: true,
    vista: "Interior",
    fotos: [foto.livingVentanal, foto.comedorMadera, foto.dormitorioVentana, foto.cocinaLena, foto.livingSillon, foto.smartTv],
  },
  {
    id: "dep-202",
    slug: "la-fe-ii-2",
    edificioId: "ed-2",
    nombre: "Departamento 2",
    numero: 2,
    piso: "",
    resumen: "Cama king en el dormitorio y sofá hotelero en el living.",
    descripcion:
      "El dormitorio tiene cama king y el living un sofá hotelero que se arma como cama matrimonial más una simple, o como tres individuales, según venga el grupo. Cocina-comedor completa y televisor en cada ambiente.",
    parrafoExtra:
      "Es la opción para familias o grupos de amigos que no quieren separarse en dos departamentos. Mismo equipamiento que el resto, con más lugar para dormir.",
    capacidad: 3,
    dormitorios: 1,
    banos: 1,
    metros: 0,
    camas: [
      { tipo: "Cama king", cantidad: 1, ambiente: "Dormitorio" },
      { tipo: "Sofá hotelero (matrimonial + simple, o 3 individuales)", cantidad: 1, ambiente: "Living" },
    ],
    bano: ["Baño completo", "Toallas de línea blanca", "Secador de pelo"],
    cocina: [
      "Cocina-comedor completamente equipada",
      "Heladera, microondas y pava eléctrica",
      "Cafetera, tostadora y extractor de jugo",
      "Todos los utensilios y la vajilla",
      "Desayuno seco incluido",
    ],
    comodidades: [
      "Televisor en cada ambiente",
      "WiFi con fibra óptica y cable",
      "Ropa de cama y toallas incluidas",
      "Espacio de trabajo con buena señal",
    ],
    servicios: ["wifi", "cable", "tv", "cocina", "desayuno", "ropa-blanca", "secador", "calefaccion"],
    precioNoche: 80000,
    puntaje: 4.92,
    opiniones: 26,
    estado: "disponible",
    destacado: true,
    vista: "Interior",
    fotos: [foto.livingAmplio, foto.livingLampara, foto.dormitorioDoble, foto.comedorMadera, foto.estarLeer, foto.smartTv],
  },
];

export const horarios = {
  ingreso: "Desde las 15:00",
  salida: "Hasta las 10:30",
  nota: "Si tu vuelo llega de madrugada, avisanos y coordinamos el ingreso.",
};

export const politicas = [
  "Para reservar se abona el valor de una noche; el resto se paga al llegar.",
  "El precio es de $80.000 por noche, independientemente de la cantidad de huéspedes.",
  "La ropa de cama, las toallas y el desayuno seco están incluidos.",
  "No se permite fumar dentro de los departamentos.",
];

/* ────────────────────────────────────────────────────────────────
   Contenido turístico
   ──────────────────────────────────────────────────────────────── */

/**
 * Qué hacer: excursiones y lugares cercanos en una sola lista.
 * Nueve entradas; desde el panel se pueden agregar todas las que hagan falta.
 */
export const queHacer = [
  {
    id: "qh-1",
    titulo: "Navegación por el Canal Beagle",
    categoria: "Excursión",
    duracion: "3 a 4 horas",
    distancia: "Sale del muelle turístico",
    temporada: "Salidas diarias a las 10 y 15 h",
    descripcion:
      "Isla de los Lobos, Isla de los Pájaros y el faro Les Eclaireurs, con caminata en las Islas Bridges. Desde $120.000 más la tasa de puerto; los menores pagan la mitad.",
    foto: foto.faroEclaireurs,
    mapa: "https://www.google.com/maps/search/?api=1&query=Muelle+Turistico+Ushuaia",
  },
  {
    id: "qh-2",
    titulo: "Parque Nacional Tierra del Fuego",
    categoria: "Naturaleza",
    duracion: "Día completo",
    distancia: "12 km del centro",
    temporada: "Todo el año",
    descripcion:
      "Se entra en auto, con excursión o en las líneas regulares que salen de Maipú y Fadul. Entrada general $40.000 y argentinos $18.000; residentes y menores de 6 años, sin cargo.",
    foto: foto.lagos,
    mapa: "https://www.google.com/maps/search/?api=1&query=Parque+Nacional+Tierra+del+Fuego",
  },
  {
    id: "qh-3",
    titulo: "Tren del Fin del Mundo",
    categoria: "Paseo",
    duracion: "1 h 50",
    distancia: "8 km del centro",
    temporada: "Salidas 9:45, 12:15 y 15 h",
    descripcion:
      "Ida y vuelta desde la Estación del Fin del Mundo. General $70.000 y menores de 4 a 12 años $35.000. Hay que sumar la entrada al Parque Nacional, que es obligatoria.",
    foto: foto.ciudadDesdeElAgua,
    mapa: "https://www.google.com/maps/search/?api=1&query=Estacion+del+Fin+del+Mundo+Ushuaia",
  },
  {
    id: "qh-4",
    titulo: "Cerro Martial y Parque del Fin del Mundo",
    categoria: "Nieve",
    duracion: "Medio día",
    distancia: "7 km del centro",
    temporada: "Actividades de invierno",
    descripcion:
      "Telesilla, escuela de esquí y snowboard, circuitos con raquetas y pista de culipatín. Abre hasta las 17 h y la confitería hasta las 19. Pase de telesilla $70.000; peatón panorámico $35.000.",
    foto: foto.montanaNevada,
    mapa: "https://www.google.com/maps/search/?api=1&query=Cerro+Martial+Ushuaia",
  },
  {
    id: "qh-5",
    titulo: "Circuito de los Grandes Lagos",
    categoria: "Excursión",
    duracion: "Día completo",
    distancia: "Ruta 3 hacia el norte",
    temporada: "Todo el año",
    descripcion:
      "Paso Garibaldi, Lago Escondido y Lago Fagnano. La excursión clásica ronda los $140.000 y la versión off road con canoas, $220.000. También hay salidas nocturnas con avistaje de castores.",
    foto: foto.canalBeagle,
    mapa: "https://www.google.com/maps/search/?api=1&query=Lago+Escondido+Tierra+del+Fuego",
  },
  {
    id: "qh-6",
    titulo: "Pingüinera de la isla Martillo",
    categoria: "Naturaleza",
    duracion: "5 horas",
    distancia: "Vía Puerto Almanza",
    temporada: "Salida diaria a las 14:30",
    descripcion:
      "Traslado terrestre hasta Puerto Almanza y media hora de navegación hasta la isla. $160.000 y menores de 3 a 11 años $112.000, con café y medialunas incluidos.",
    foto: foto.pinguinos,
    mapa: "https://www.google.com/maps/search/?api=1&query=Isla+Martillo+Tierra+del+Fuego",
  },
  {
    id: "qh-7",
    titulo: "Museo Marítimo y ex Presidio",
    categoria: "Ciudad",
    duracion: "2 a 3 horas",
    distancia: "En el centro",
    temporada: "Todos los días de 10 a 20 h",
    descripcion:
      "La entrada de $44.000 vale por dos días e incluye el Museo Antártico, el de Arte Marino y el Naval. Visitas guiadas a las 11:30 y 18:30. Menores de 12 años, gratis.",
    foto: foto.puerto,
    mapa: "https://www.google.com/maps/search/?api=1&query=Museo+Maritimo+y+del+Presidio+de+Ushuaia",
  },
  {
    id: "qh-8",
    titulo: "Reserva Natural Bahía Encerrada",
    categoria: "Ciudad",
    duracion: "1 hora",
    distancia: "En el centro, a pie",
    temporada: "Entrada libre",
    descripcion:
      "Un recorrido costero por zona de nidificación de aves. Se combina bien con el Paseo de la Centolla y el Mirador del Beagle, que se entra desde el shopping.",
    foto: foto.bahia,
    mapa: "https://www.google.com/maps/search/?api=1&query=Reserva+Natural+Urbana+Bahia+Encerrada+Ushuaia",
  },
  {
    id: "qh-9",
    titulo: "Puerto Almanza",
    categoria: "Paseo",
    duracion: "Día completo",
    distancia: "75 km de Ushuaia",
    temporada: "Todo el año",
    descripcion:
      "Pueblo de pescadores con restaurantes sobre el canal, la Granja del Beagle y la chacra Ruka Kellen. Se llega por la ruta de la centolla; conviene reservar mesa antes de salir.",
    foto: foto.barcoFaro,
    mapa: "https://www.google.com/maps/search/?api=1&query=Puerto+Almanza+Tierra+del+Fuego",
  },
];

/** Lo que hay caminando: va como lista, no como tarjetas con foto. */
export const aLaVuelta = [
  { nombre: "Panadería", detalle: "A menos de 100 m" },
  { nombre: "Rotisería", detalle: "A menos de 100 m" },
  { nombre: "Carnicería", detalle: "A menos de 100 m" },
  { nombre: "Verdulería", detalle: "A menos de 100 m" },
  { nombre: "Kioscos y despensas", detalle: "En la misma cuadra" },
  { nombre: "Centro de Ushuaia", detalle: "5 cuadras paralelas, se va caminando" },
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
  { id: "wifi", nombre: "WiFi con fibra óptica", icono: "wifi", descripcion: "Llega bien a todos los ambientes: sirve para trabajar desde acá.", activo: true, destacadoEnHome: true },
  { id: "cable", nombre: "TV por cable", icono: "tv", descripcion: "Con televisor en cada ambiente del departamento.", activo: true, destacadoEnHome: true },
  { id: "cocina", nombre: "Cocina-comedor equipada", icono: "utensilios", descripcion: "Heladera, microondas, pava eléctrica, cafetera, tostadora y extractor de jugo.", activo: true, destacadoEnHome: true },
  { id: "desayuno", nombre: "Desayuno seco", icono: "cafe", descripcion: "Incluido, para que el primer día no tengas que salir a comprar.", activo: true, destacadoEnHome: true },
  { id: "ropa-blanca", nombre: "Ropa de cama y toallas", icono: "cama", descripcion: "De línea blanca, listas al llegar.", activo: true, destacadoEnHome: true },
  { id: "secador", nombre: "Secador de pelo", icono: "secador", descripcion: "En cada departamento, junto al baño.", activo: true, destacadoEnHome: true },
  { id: "calefaccion", nombre: "Calefacción", icono: "llama", descripcion: "Ambientes templados durante todo el año.", activo: true, destacadoEnHome: true },
  { id: "tv", nombre: "TV en cada ambiente", icono: "tv", descripcion: "En el dormitorio y en la cocina-comedor.", activo: true, destacadoEnHome: false },
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
  { id: "r-1046", codigo: "LF-1046", huesped: "Carla Miranda", email: "carla.miranda@correo.com", telefono: "+54 351 233 7788", departamentoId: "dep-104", desde: "2026-08-22", hasta: "2026-08-27", personas: 4, estado: "confirmada", origen: "Web", total: 620000 },
  { id: "r-1047", codigo: "LF-1047", huesped: "Grupo Trekking Sur", email: "contacto@trekkingsur.com", telefono: "+54 11 4477 9900", departamentoId: "dep-202", desde: "2026-09-02", hasta: "2026-09-06", personas: 6, estado: "pendiente", origen: "Teléfono", total: 656000 },
  { id: "r-1048", codigo: "LF-1048", huesped: "Ana y Diego Ruiz", email: "adruiz@correo.com", telefono: "+54 223 500 4411", departamentoId: "dep-101", desde: "2026-07-24", hasta: "2026-07-29", personas: 2, estado: "finalizada", origen: "Web", total: 410000 },
  { id: "r-1049", codigo: "LF-1049", huesped: "Martín Ojeda", email: "mojeda@correo.com", telefono: "+54 388 411 2200", departamentoId: "dep-103", desde: "2026-08-28", hasta: "2026-08-31", personas: 2, estado: "cancelada", origen: "Booking", total: 213000, notas: "Canceló por cambio de vuelo. Reprogramaría para octubre." },
  { id: "r-1050", codigo: "LF-1050", huesped: "Familia Ledesma", email: "ledesma.flia@correo.com", telefono: "+54 264 500 3322", departamentoId: "dep-102", desde: "2026-09-10", hasta: "2026-09-17", personas: 4, estado: "confirmada", origen: "Web", total: 826000 },
  { id: "r-1051", codigo: "LF-1051", huesped: "Paula Sández", email: "psandez@correo.com", telefono: "+54 299 400 1188", departamentoId: "dep-201", desde: "2026-09-04", hasta: "2026-09-08", personas: 3, estado: "confirmada", origen: "WhatsApp", total: 384000 },
  { id: "r-1052", codigo: "LF-1052", huesped: "Familia Sosa", email: "sosa.flia@correo.com", telefono: "+54 376 455 2200", departamentoId: "dep-104", desde: "2026-09-18", hasta: "2026-09-24", personas: 5, estado: "pendiente", origen: "Web", total: 744000 },
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
