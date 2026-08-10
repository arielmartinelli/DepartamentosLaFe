/**
 * Capa de persistencia.
 *
 * Hoy guarda en el navegador (localStorage). Cuando exista backend, sólo hay
 * que reemplazar el cuerpo de `leer` y `guardar` por llamadas `fetch` a la API:
 * ningún componente conoce el mecanismo de almacenamiento.
 *
 *   leer("reservas", semilla)   →  GET  /api/reservas
 *   guardar("reservas", valor)  →  PUT  /api/reservas
 */

const PREFIJO = "lafe:v4:";

export const CLAVES = {
  edificios: "edificios",
  departamentos: "departamentos",
  reservas: "reservas",
  bloqueos: "bloqueos",
  consultas: "consultas",
  actividades: "actividades",
  comentarios: "comentarios",
  prestaciones: "prestaciones",
  galerias: "galerias",
  ajustes: "ajustes",
  cuentas: "cuentas",
  sesion: "sesion",
} as const;

export type Clave = (typeof CLAVES)[keyof typeof CLAVES];

const hayNavegador = () => typeof window !== "undefined";

/* Caché en memoria + suscriptores: la fuente externa que consume React. */
const cache = new Map<string, unknown>();
const oyentes = new Set<() => void>();

function avisar() {
  oyentes.forEach((f) => f());
}

export function suscribir(fn: () => void) {
  oyentes.add(fn);
  return () => {
    oyentes.delete(fn);
  };
}

export function leer<T>(clave: Clave, semilla: T): T {
  if (!hayNavegador()) return semilla;
  if (cache.has(clave)) return cache.get(clave) as T;
  try {
    const crudo = window.localStorage.getItem(PREFIJO + clave);
    const valor = crudo ? (JSON.parse(crudo) as T) : semilla;
    cache.set(clave, valor);
    return valor;
  } catch {
    cache.set(clave, semilla);
    return semilla;
  }
}

export function guardar<T>(clave: Clave, valor: T) {
  cache.set(clave, valor);
  if (hayNavegador()) {
    try {
      window.localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
    } catch {
      /* Cuota llena o modo privado: el contenido sigue en memoria. */
    }
  }
  avisar();
}

export function borrarTodo() {
  cache.clear();
  if (hayNavegador()) {
    Object.values(CLAVES).forEach((c) => window.localStorage.removeItem(PREFIJO + c));
  }
  avisar();
}

/** Copia de seguridad completa, para llevarse los datos o restaurarlos. */
export function exportarTodo() {
  if (!hayNavegador()) return "{}";
  const salida: Record<string, unknown> = {};
  Object.values(CLAVES).forEach((c) => {
    const v = window.localStorage.getItem(PREFIJO + c);
    if (v) salida[c] = JSON.parse(v);
  });
  return JSON.stringify({ version: 1, fecha: new Date().toISOString(), datos: salida }, null, 2);
}

export function importarTodo(json: string) {
  if (!hayNavegador()) return false;
  try {
    const parseado = JSON.parse(json) as { datos?: Record<string, unknown> };
    const datos = parseado.datos ?? (parseado as Record<string, unknown>);
    Object.entries(datos).forEach(([c, v]) => {
      window.localStorage.setItem(PREFIJO + c, JSON.stringify(v));
    });
    return true;
  } catch {
    return false;
  }
}

/** Identificadores cortos y legibles para datos creados desde el panel. */
export function nuevoId(prefijo: string) {
  return `${prefijo}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}
