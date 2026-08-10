/**
 * Imágenes subidas desde la computadora.
 *
 * Se guardan en IndexedDB y no en localStorage: una foto comprimida pesa
 * cientos de kilobytes y la cuota de localStorage (5 MB) se llenaría con
 * media docena. IndexedDB admite bastante más.
 *
 * Cada archivo queda referenciado como `local:<id>` en los datos del panel.
 * Cuando exista backend, `guardarArchivo` sube el archivo al servidor y
 * devuelve su URL definitiva: el resto del código no se entera.
 */

const BASE = "lafe-archivos";
const ALMACEN = "imagenes";
const VERSION = 1;

/** Ancho máximo al que se reescala antes de guardar. */
const ANCHO_MAXIMO = 1800;
const CALIDAD = 0.82;

const hayNavegador = () => typeof window !== "undefined" && "indexedDB" in window;

function abrir(): Promise<IDBDatabase> {
  return new Promise((resolver, rechazar) => {
    const pedido = indexedDB.open(BASE, VERSION);
    pedido.onupgradeneeded = () => {
      if (!pedido.result.objectStoreNames.contains(ALMACEN)) {
        pedido.result.createObjectStore(ALMACEN);
      }
    };
    pedido.onsuccess = () => resolver(pedido.result);
    pedido.onerror = () => rechazar(pedido.error);
  });
}

function transaccion(db: IDBDatabase, modo: IDBTransactionMode) {
  return db.transaction(ALMACEN, modo).objectStore(ALMACEN);
}

/* ── Caché en memoria + suscriptores, igual que el repositorio ─────── */

let cache: Record<string, string> = {};
const oyentes = new Set<() => void>();
let cargando: Promise<void> | null = null;

const VACIO: Record<string, string> = {};

function avisar() {
  cache = { ...cache };
  oyentes.forEach((f) => f());
}

export function suscribirArchivos(fn: () => void) {
  oyentes.add(fn);
  void cargarTodo();
  return () => {
    oyentes.delete(fn);
  };
}

export function instantaneaArchivos() {
  return cache;
}

export function instantaneaServidor() {
  return VACIO;
}

/** Trae todo lo guardado una sola vez por sesión. */
export function cargarTodo() {
  if (!hayNavegador()) return Promise.resolve();
  if (cargando) return cargando;

  cargando = (async () => {
    try {
      const db = await abrir();
      const tienda = transaccion(db, "readonly");
      const claves = await promesa<IDBValidKey[]>(tienda.getAllKeys());
      const valores = await promesa<string[]>(tienda.getAll());
      const siguiente: Record<string, string> = {};
      claves.forEach((c, i) => {
        siguiente[String(c)] = valores[i];
      });
      cache = siguiente;
      avisar();
    } catch {
      /* Sin IndexedDB disponible se sigue con las imágenes por enlace. */
    }
  })();

  return cargando;
}

function promesa<T>(pedido: IDBRequest): Promise<T> {
  return new Promise((resolver, rechazar) => {
    pedido.onsuccess = () => resolver(pedido.result as T);
    pedido.onerror = () => rechazar(pedido.error);
  });
}

/* ── Compresión ───────────────────────────────────────────────────── */

async function comprimir(archivo: File): Promise<string> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, ANCHO_MAXIMO / bitmap.width);
  const ancho = Math.round(bitmap.width * escala);
  const alto = Math.round(bitmap.height * escala);

  const lienzo = document.createElement("canvas");
  lienzo.width = ancho;
  lienzo.height = alto;
  const ctx = lienzo.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen.");
  ctx.drawImage(bitmap, 0, 0, ancho, alto);
  bitmap.close?.();

  /* WebP pesa bastante menos; si el navegador no lo soporta, cae en JPEG. */
  const webp = lienzo.toDataURL("image/webp", CALIDAD);
  return webp.startsWith("data:image/webp") ? webp : lienzo.toDataURL("image/jpeg", CALIDAD);
}

/* ── API pública ──────────────────────────────────────────────────── */

export type ResultadoSubida = { ok: true; referencia: string } | { ok: false; error: string };

export async function guardarArchivo(archivo: File): Promise<ResultadoSubida> {
  if (!archivo.type.startsWith("image/")) {
    return { ok: false, error: `“${archivo.name}” no es una imagen.` };
  }
  if (!hayNavegador()) {
    return { ok: false, error: "Este navegador no permite guardar archivos." };
  }

  try {
    const datos = await comprimir(archivo);
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
    const db = await abrir();
    transaccion(db, "readwrite").put(datos, id);
    cache[id] = datos;
    avisar();
    return { ok: true, referencia: `local:${id}` };
  } catch {
    return { ok: false, error: `No se pudo procesar “${archivo.name}”.` };
  }
}

export async function borrarArchivo(referencia: string) {
  if (!esLocal(referencia) || !hayNavegador()) return;
  const id = referencia.slice(6);
  try {
    const db = await abrir();
    transaccion(db, "readwrite").delete(id);
    delete cache[id];
    avisar();
  } catch {
    /* Si falla el borrado, la referencia deja de usarse igual. */
  }
}

export const esLocal = (src?: string | null) => Boolean(src?.startsWith("local:"));

/** Convierte `local:<id>` en la imagen guardada; el resto pasa sin tocar. */
export function resolverArchivo(src: string | null | undefined, mapa: Record<string, string>) {
  if (!src) return src ?? "";
  if (!esLocal(src)) return src;
  return mapa[src.slice(6)] ?? "";
}

/** Todo lo subido, para incluirlo en la copia de seguridad. */
export async function exportarArchivos() {
  await cargarTodo();
  return cache;
}

/** Restaura las imágenes de una copia de seguridad. */
export async function importarArchivos(datos: Record<string, string>) {
  if (!hayNavegador()) return;
  try {
    const db = await abrir();
    const tienda = transaccion(db, "readwrite");
    Object.entries(datos).forEach(([id, valor]) => tienda.put(valor, id));
    cache = { ...cache, ...datos };
    avisar();
  } catch {
    /* Si falla, quedan las referencias por enlace. */
  }
}
