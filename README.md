# La Fe Departamentos — sitio web + panel de administración

Alquiler temporario en Ushuaia: **La Fe I con cuatro departamentos y La Fe II con
dos**, a cinco cuadras del centro. Next.js 16 (App
Router), React 19, TypeScript, Tailwind CSS 4 y Motion. Los datos son simulados y viven
en memoria; la estructura está preparada para conectar un backend sin rehacer la
interfaz.

## Poner en marcha

```bash
npm install
npm run dev      # http://localhost:3000
```

Otros comandos: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`.

## Rutas

### Web pública

| Ruta | Qué es |
|---|---|
| `/` | Portada: hero, los dos edificios presentados con sus tres departamentos, qué hacer, la estadía, opiniones, ubicación y preguntas frecuentes |
| `/departamentos/[slug]` | Ficha completa: galería grande con visor, camas, cocina y baño, servicios, calendario propio con el tramo elegido marcado, horarios y políticas, qué hacer cerca y mapa |
| `/entrar` · `/crear-cuenta` · `/recuperar` | Cuentas de visitante |
| `/mis-consultas` | Conversación con la propietaria |

### Panel de la propietaria

| Ruta | Qué es |
|---|---|
| `/ingresar` | Acceso al panel (demostración: cualquier envío entra) |
| `/admin` | Métricas de operación y últimas consultas |
| `/admin/reservas` | Tabla con filtros y acciones |
| `/admin/calendario` | Un departamento por vez, con selector, filtro de mes y bloqueo manual de fechas |
| `/admin/consultas` | Bandeja completa con fechas, departamento, huéspedes y conversación |
| `/admin/departamentos` | Listado; cada unidad abre su editor con cuatro solapas |
| `/admin/departamentos/[id]` | Editor: información, servicios, galería y disponibilidad |
| `/admin/galerias` | Sólo fotos de la portada: los dos títulos de edificio, las actividades y la sección de servicios. Cada bloque con su botón Guardar |
| `/admin/servicios` · `/admin/actividades` · `/admin/comentarios` | Contenido de la web, con alta, edición, borrado y orden |
| `/admin/configuracion` | Contacto, marca y copia de seguridad |

## Todo se edita desde el panel

No hace falta tocar código para cambiar el contenido: departamentos, servicios,
galerías, actividades, alrededores, comentarios, datos de contacto y marca se
administran desde `/admin`. Los cambios se guardan en el navegador y la web los
muestra al instante.

Sólo se tocan archivos para cambiar el diseño o los datos iniciales:

| Quiero cambiar… | Archivo |
|---|---|
| Colores, tipografías, radios, sombras, curvas | `src/app/globals.css` (bloque `@theme`) |
| Datos de arranque (antes de la primera edición) | `src/lib/data.ts` y `src/lib/semillas.ts` |
| Fotografías de arranque | `src/lib/imagenes.ts` |
| Logotipo y marca | `public/brand/` |

### Vista previa al compartir el enlace

`public/og.jpg` (1200×630) es la imagen que aparece cuando alguien pega el
enlace en WhatsApp, Instagram o Facebook. Está armada con la fachada y el
logotipo, y pesa 155 KB: WhatsApp descarta las imágenes pesadas y ahí se pierde
la vista previa.

Para que funcione, la dirección tiene que ser absoluta y del dominio real. Si
queda apuntando a un dominio que no existe, el enlace se comparte sin foto.

`urlBaseDelPedido()` en `src/lib/site.ts` la resuelve así:

1. `NEXT_PUBLIC_SITIO_URL`, si está definida.
2. La cabecera `host` del propio pedido.

La segunda opción es la que hace que funcione siempre, sin configurar nada: el
sitio se entera de su dominio al servir la página. La contra es que las páginas
pasan a renderizarse por pedido en lugar de quedar estáticas.

**Si definís `NEXT_PUBLIC_SITIO_URL` vuelven a ser estáticas**, porque ya no hace
falta leer las cabeceras. Conviene hacerlo cuando el dominio esté firme: copiá
`.env.example` a `.env.local` para tu máquina, y cargá la variable en Vercel para
producción.

Después de publicar, pasá el enlace por
[developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)
y tocá *Scrape Again*. WhatsApp guarda en caché el primer intento: si falló una
vez, sigue mostrando el enlace sin foto aunque ya esté arreglado.

### Subir fotos desde la computadora

En el panel se puede **arrastrar y soltar** imágenes —o elegirlas con el botón—
en la galería de cada departamento, en Galerías, en las actividades, en los
servicios y en la marca. Las galerías aceptan **varias a la vez**.

En **Galerías** están sólo las fotos de la portada, en cuatro bloques:

- **Título La Fe I** y **Título La Fe II** — dos fotos cada uno: la principal es
  la grande del bloque y la otra va al costado.
- **Qué hacer mientras estás acá** — una foto por actividad; los textos y el
  orden se editan en Qué hacer.
- **Contamos con todo lo que necesitas** — la foto vertical de los servicios.

Cada bloque tiene su propio botón **Guardar**: los cambios se acumulan y se
marcan como “Sin guardar” hasta que se confirman.

Las fotos de los departamentos **no están acá**: se editan en
`Departamentos → Editar → Galería`, junto al resto de sus datos.

Antes de guardarse, cada imagen se reescala a 1800 px de ancho y se comprime en
WebP: una foto de 6 MB queda en unos 300 KB.

Se guardan en **IndexedDB**, no en `localStorage`: la cuota de `localStorage`
(unos 5 MB) se llenaría con media docena de fotos. En los datos queda una
referencia `local:<id>` que `src/lib/usar-imagen.ts` traduce al mostrarla. Los
campos de ruta o enlace siguen funcionando como antes, por si la foto vive en
otro lado.

Al conectar el backend, `guardarArchivo` en `src/lib/archivos.ts` sube el archivo
al servidor y devuelve su URL: ningún componente cambia.

La copia de seguridad de Configuración incluye las imágenes subidas.

### Cómo se guardan los datos

`src/lib/repositorio.ts` es la única capa que habla con el almacenamiento. Hoy
usa `localStorage`; para conectar el backend alcanza con reemplazar el cuerpo de
`leer` y `guardar` por llamadas `fetch`, sin tocar ningún componente:

```
leer("reservas", semilla)   →  GET  /api/reservas
guardar("reservas", valor)  →  PUT  /api/reservas
```

Los proveedores (`src/lib/contenido.tsx` y `src/lib/sesion.tsx`) consumen esa
fuente con `useSyncExternalStore`, así el HTML del servidor y el del navegador
coinciden y no hay parpadeo.

Desde **Configuración** se puede descargar toda la base en JSON, restaurarla en
otra computadora o volver a los datos de ejemplo.

#### Al cambiar la versión del almacenamiento

`PREFIJO` en `src/lib/repositorio.ts` lleva la versión (`lafe:v4:`). Si se
cambia, lo que la propietaria había cargado queda bajo la clave vieja y el panel
aparece con los datos de ejemplo.

Por eso hay una **migración**: al arrancar, copia las claves de las versiones
anteriores a la actual, sin pisar nada de lo que ya exista en la nueva. Las
galerías quedan fuera a propósito, porque cambiaron de forma.

Al subir la versión, agregá la anterior a `VERSIONES_ANTERIORES` y sumá a
`SIN_MIGRAR` sólo las colecciones cuya estructura cambió. Las imágenes subidas
viven en IndexedDB y no llevan versión, así que nunca se pierden.

La migración es conservadora: **no pisa lo que ya exista** en la versión nueva.
Si entre el cambio de versión y la migración se guardó algo, esa colección queda
con lo nuevo y lo viejo sin traer.

Para esos casos está **Configuración → Recuperar datos anteriores**: lista todo
lo que quedó guardado de cualquier versión, con cuántos elementos tiene y una
muestra de los nombres, y permite traer una colección o una versión entera. Las
versiones anteriores nunca se borran, ni siquiera al volver a los datos de
ejemplo.

## Fotografías

`src/lib/imagenes.ts` es el único lugar donde hay rutas de imagen. La fachada es la foto
real de la propiedad (`public/media/fachada.jpg`); el resto son fotos de Unsplash que
sirven para la demostración.

Para publicar las fotos definitivas:

1. Copiar los archivos a `public/media/`.
2. En `src/lib/imagenes.ts`, reemplazar el valor de cada clave por su ruta local, por
   ejemplo `livingEstufa: "/media/living-lafe1-2.jpg"`.

Ningún componente tiene rutas de imagen escritas adentro.

## Identidad visual

- **Carbón `#131417`** — el azul casi negro de la casa del logotipo. Texto, pie y panel.
- **Oro `#B07D2B` / `#E4BE7C`** — el dorado del logotipo. Acentos, nunca fondos grandes.
- **Blanco y hueso `#F7F5F1`** — la fotografía manda; el color se usa con cuentagotas.
- **Fraunces** (eje SOFT, para redondear los remates) en títulos y **Plus Jakarta Sans**
  en texto e interfaz. Ambas autoalojadas: cero pedidos a Google Fonts.

El logotipo está dibujado en blanco y oro, así que sobre fondo claro se monta en una
placa oscura. Es la misma pieza, no una segunda versión.

### Decisiones de movimiento

Duraciones de 150–250 ms en interfaz y hasta 600 ms en apariciones al hacer scroll.
Nunca `ease-in`: arranca lento y se percibe pesado. Se anima sólo `transform` y
`opacity`, el `backdrop-blur` queda en elementos fijos, el zoom de las fotos está detrás
de `@media (hover: hover)` y todo se apaga con `prefers-reduced-motion`.

## Decisiones técnicas

- **Sin backend.** `src/lib/store.tsx` es un contexto de React con acciones aisladas
  (`cambiarEstadoReserva`, `guardarDepartamento`, …). Para conectar el servidor sólo hay
  que reemplazar el cuerpo de cada función por un `fetch`.
- **Mapas sin clave de API.** Se embeben desde OpenStreetMap; el botón "Cómo llegar"
  abre la aplicación de mapas del dispositivo.
- **Rendimiento.** Las 23 páginas se prerenderizan. Las imágenes pasan por `next/image`
  con AVIF y WebP y tamaños declarados, así no hay salto de maquetado.
- **SEO.** Metadatos por página, Open Graph, `sitemap.xml`, `robots.txt` (con `/admin`
  excluido) y datos estructurados `LodgingBusiness`, `Accommodation` y `FAQPage`.
- **Accesibilidad.** Enlace de salto al contenido, foco visible, jerarquía de encabezados
  correcta, migas de pan, visor de fotos manejable con teclado y contraste AA.
- **Seguridad.** `next.config.ts` envía `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy` y HSTS. El panel está fuera del índice.

## Datos del alojamiento

Los que pasó la dueña, ya cargados como punto de partida:

- **La Fe I — 4 departamentos.** Dormitorio con cama matrimonial y cama simple
  (3 personas). El Departamento 2 suma una segunda cama simple (4 personas).
- **La Fe II — 2 departamentos.** Dormitorio con cama king y sofá hotelero en el
  living, que se arma como matrimonial más simple o como tres individuales
  (5 personas).
- Todos con cocina-comedor equipada, heladera, microondas, pava eléctrica,
  cafetera, tostadora, extractor de jugo, vajilla completa y desayuno seco.
- Fibra óptica, cable y televisor en cada ambiente. Secador de pelo, ropa de cama
  y toallas de línea blanca.
- A cinco cuadras paralelas del centro; panadería, rotisería, carnicería,
  verdulería, kioscos y despensas a menos de 100 m.
- **$80.000 la noche.** Para reservar se abona una noche y el resto al llegar.

### Falta confirmar con la dueña

1. **Dirección de La Fe II.** Hoy figura sólo "Ushuaia, Tierra del Fuego" y el
   mapa apunta cerca de La Fe I.
2. **Precio de La Fe II.** Está cargado a $80.000 como el resto, pero son
   unidades más grandes: confirmar si vale lo mismo.
3. **Horarios de ingreso y salida.** Están puestos 15:00 y 10:30 como referencia.
4. **Calefacción.** Figura como servicio; conviene confirmar el tipo.
5. **Superficie en m².** Queda oculta en la web hasta que se cargue desde el panel.
6. **Fotos reales.** Las actuales son de referencia.

## Qué hacer: una sola sección

Las excursiones y los lugares cercanos viven en la misma lista
(`/admin/actividades`). Cada entrada puede llevar duración, distancia,
temporada y enlace a Google Maps: con eso alcanza tanto para una navegación por
el canal como para el supermercado de la esquina.

En la web se muestran como **carrusel horizontal, con un tope de nueve**. Se
pueden cargar más desde el panel: el orden de la lista define cuáles entran y el
panel avisa cuando hay más de nueve visibles.

Las nueve cargadas salen de la guía oficial *¿Qué hacer en Ushuaia?* del
04.08.26, con horarios y precios de referencia.

### La guía en PDF

El botón **Descargar guía completa** de la sección entrega
`public/guias/que-hacer-en-ushuaia.pdf`. Para publicar una versión nueva:

1. Copiar el PDF a `public/guias/`.
2. En `/admin/actividades`, escribir el nombre del archivo y la fecha de
   actualización.

También acepta un enlace completo, por si la guía vive en Drive. Los precios de
la guía cambian seguido: por eso el texto invita a descargarla recién al llegar
a Ushuaia.

## Cómo funciona una consulta

1. El visitante elige fechas y huéspedes en la ficha del departamento.
2. El panel le dice si esas fechas están libres, cruzando reservas y bloqueos.
3. Al tocar **Consultar** se abre el mensaje ya redactado y **puede editarlo**.
4. **Nombre, teléfono y correo son obligatorios**: sin ellos no hay forma de
   responder. Se valida antes de enviar, con el aviso junto a cada campo.
5. Elige mandarlo por WhatsApp o dejarlo en la web.
6. En ambos casos la consulta queda registrada en `/admin/consultas`, con las
   fechas, el departamento y la cantidad de huéspedes.
7. Si tiene cuenta, sigue la conversación desde `/mis-consultas`.

### Cómo responde la propietaria

Desde `/admin/consultas`, con el mismo texto escrito una sola vez:

- **Responder en la web** deja el mensaje en la conversación; el visitante lo ve
  en “Mis consultas”.
- **Responder por WhatsApp** hace lo mismo y además abre el chat **con el
  teléfono del huésped**, con el texto ya cargado.
- **Abrir WhatsApp** contacta al huésped sin escribir nada acá.

En los tres casos hay también accesos directos a llamar y a escribir por correo.
El número se normaliza a lo que espera `wa.me` (sólo dígitos, sin el 0 inicial);
no se inventa código de país, se usa el que cargó el huésped.

### Elegir fechas

El calendario de la ficha y el panel de consulta comparten el mismo estado: se
puede elegir desde cualquiera de los dos y el otro se actualiza solo.

En el calendario la selección es en dos pasos —primero la entrada, después la
salida— con vista previa del tramo al pasar el mouse. La entrada y la salida se
marcan en dorado lleno y los días del medio en dorado suave. Si el tramo choca
con fechas reservadas o bloqueadas, la salida se corta automáticamente en el
primer día ocupado. En el panel, mover una fecha corrige la otra para que el
tramo nunca quede invertido.

## Qué falta para producción

1. **Autenticación real.** Auth.js en `/ingresar` y `/entrar`, con middleware que
   proteja `/admin`. Las pantallas ya están hechas.
2. **Base de datos.** Reemplazar el cuerpo de `leer` y `guardar` en
   `src/lib/repositorio.ts` por llamadas a la API.
3. **Subida de imágenes.** Hoy los formularios piden la dirección de la imagen;
   el lugar donde iría el cargador de archivos ya está marcado.
4. Pagos online, sincronización con Booking y Airbnb, correos automáticos,
   cupones y usuarios con permisos.
