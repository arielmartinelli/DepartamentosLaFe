# La Fe Departamentos — sitio web + panel de administración

Alquiler temporario en Ushuaia: dos edificios, seis departamentos. Next.js 16 (App
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
| `/` | Portada: hero, los dos edificios presentados con sus tres departamentos, actividades, la estadía, opiniones, ubicación y preguntas frecuentes |
| `/departamentos/[slug]` | Ficha completa: galería grande con visor, camas, cocina y baño, servicios, calendario propio, horarios y políticas, alrededores y mapa. El panel lateral consulta disponibilidad real y arma la consulta |
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
| `/admin/galerias` | Diez galerías independientes, una por sector |
| `/admin/servicios` · `/admin/actividades` · `/admin/alrededores` · `/admin/comentarios` | Contenido de la web, con alta, edición, borrado y orden |
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

## Cómo funciona una consulta

1. El visitante elige fechas y huéspedes en la ficha del departamento.
2. El panel le dice si esas fechas están libres, cruzando reservas y bloqueos.
3. Al tocar **Consultar** se abre el mensaje ya redactado y **puede editarlo**.
4. Elige mandarlo por WhatsApp o dejarlo en la web.
5. En ambos casos la consulta queda registrada en `/admin/consultas`, con las
   fechas, el departamento y la cantidad de huéspedes.
6. Si tiene cuenta, sigue la conversación desde `/mis-consultas`.

## Qué falta para producción

1. **Autenticación real.** Auth.js en `/ingresar` y `/entrar`, con middleware que
   proteja `/admin`. Las pantallas ya están hechas.
2. **Base de datos.** Reemplazar el cuerpo de `leer` y `guardar` en
   `src/lib/repositorio.ts` por llamadas a la API.
3. **Subida de imágenes.** Hoy los formularios piden la dirección de la imagen;
   el lugar donde iría el cargador de archivos ya está marcado.
4. Pagos online, sincronización con Booking y Airbnb, correos automáticos,
   cupones y usuarios con permisos.
