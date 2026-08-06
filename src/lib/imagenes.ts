/**
 * Banco de fotografías de la demostración.
 *
 * Todas las imágenes externas viven acá. Cuando lleguen las fotos reales,
 * se reemplaza el valor de cada clave por una ruta local ("/media/…") y
 * no hay que tocar ningún componente.
 *
 * Las fotos de Unsplash se sirven con parámetros de recorte y calidad para
 * que el navegador reciba el tamaño justo.
 */

const U = "https://images.unsplash.com/photo-";
const cortar = (id: string, ancho = 1600, alto?: number) =>
  `${U}${id}?auto=format&fit=crop&q=72&w=${ancho}${alto ? `&h=${alto}` : ""}`;

export const foto = {
  /* Fachada real de la propiedad. */
  fachada: "/media/fachada.jpg",

  /* Interiores */
  livingEstufa: cortar("1698933787134-af2d451985c7"),
  livingVentanal: cortar("1670914120781-4b7c8512fc41"),
  livingChimenea: cortar("1680703486830-1b5af60635d7"),
  livingAmplio: cortar("1712669869857-c9c0c098d024"),
  livingSalamandra: cortar("1631941150945-837cb81fc7e2"),
  livingSillon: cortar("1664369058082-ee8e36028106"),
  livingLampara: cortar("1680962884378-b69a04b9969c"),
  estarLeer: cortar("1631941392209-70cad44ecfb7"),
  dormitorioVentana: cortar("1551927411-95e412943b58"),
  dormitorioDoble: cortar("1727706572437-4fcda0cbd66f"),
  comedorMadera: cortar("1697807713040-b5fb60d6f012"),
  cocinaLena: cortar("1631630259742-c0f0b17c6c10"),
  calefaccion: cortar("1698933787104-3f91cf25909c"),
  smartTv: cortar("1622066737704-c5d990e137fb"),
  detallePuerta: cortar("1592990379716-aec6e89a6a69"),

  /* Ushuaia y alrededores */
  faroEclaireurs: cortar("1615656637621-5aa19f1ef847"),
  canalBeagle: cortar("1652743920679-e48cddffadff"),
  navegacion: cortar("1652743920822-faaabb728dea"),
  puerto: cortar("1615656543085-130a54570311"),
  ciudadDesdeElAgua: cortar("1709344930989-c6e3144bdb20"),
  bahia: cortar("1585232946945-795e753b3b63"),
  montanaNevada: cortar("1652743920719-307f6333be00"),
  lagos: cortar("1651489000754-1bc96a562520"),
  faroIsla: cortar("1517017752111-e7ee4ab1ce6c"),
  faroRoca: cortar("1652744304507-553c18e3696d"),
  faroAgua: cortar("1559061156-4a46ec29107d"),
  pinguinos: cortar("1620145236362-e9cdd819bf6f"),
  pinguinoCosta: cortar("1520637438573-ee1ba80b2a7f"),
  lobosMarinos: cortar("1691247876426-7de15d45701b"),
  barcoFaro: cortar("1696551245041-f4879efc95bd"),
} as const;

export const retrato = {
  marina: cortar("1534528741775-53994a69daeb", 200, 200),
  gonzalo: cortar("1507003211169-0a1dd7228f2d", 200, 200),
  sofia: cortar("1500648767791-00dcc994a43e", 200, 200),
} as const;

export type ClaveFoto = keyof typeof foto;
