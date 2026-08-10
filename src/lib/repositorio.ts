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

/**
 * Versiones anteriores del almacenamiento.
 *
 * Al cambiar de versión, lo guardado por la propietaria quedaba huérfano y el
 * panel volvía a los datos de ejemplo. Ahora se migra: se copia lo viejo a la
 * clave nueva, sin pisar nada de lo que ya exista.
 */
const VERSIONES_ANTERIORES = ["lafe:v3:", "lafe:v2:", "lafe:v1:"];

/** Las galerías cambiaron de forma: esas sí arrancan de cero. */
const SIN_MIGRAR: string[] = ["galerias"];

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

import { crearRespaldo } from "./respaldos";

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

function migrar() {
  if (!hayNavegador()) return;

  /* Antes de mover nada: copia de seguridad de lo que haya en cualquier versión. */
  [PREFIJO, ...VERSIONES_ANTERIORES].forEach((version) =>
    crearRespaldo(version, [...Object.values(CLAVES)], `Automática (${version.replace(/[^v0-9]/g, "")})`),
  );

  const bandera = `${PREFIJO}__migrado`;
  if (window.localStorage.getItem(bandera)) return;

  try {
    Object.values(CLAVES).forEach((clave) => {
      if (SIN_MIGRAR.includes(clave)) return;
      if (window.localStorage.getItem(PREFIJO + clave)) return;

      for (const anterior of VERSIONES_ANTERIORES) {
        const guardado = window.localStorage.getItem(anterior + clave);
        if (guardado) {
          window.localStorage.setItem(PREFIJO + clave, guardado);
          break;
        }
      }
    });
    window.localStorage.setItem(bandera, new Date().toISOString());
  } catch {
    /* Si el navegador no deja escribir, se sigue con los datos de ejemplo. */
  }
}

/* Se ejecuta una sola vez, al cargar el módulo en el navegador. */
migrar();

/** Instantánea de la versión actual: se llama al abrir el panel. */
export function respaldarAhora(motivo = "Automática") {
  return crearRespaldo(PREFIJO, [...Object.values(CLAVES)], motivo);
}

/** Devuelve el prefijo vigente, para las herramientas de recuperación. */
export const prefijoActual = () => PREFIJO;

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

  /* Si hay base de datos, se manda también al servidor. La pantalla ya se
     actualizó con el valor nuevo, así que el envío no la hace esperar. */
  void empujarAlServidor(clave, valor);
}

/* ────────────────────────────────────────────────────────────────
   Sincronización con la base de datos
   ──────────────────────────────────────────────────────────────── */

let estadoRemoto: "sin-base" | "cargando" | "listo" | "error" = "sin-base";

export const estadoDeLaBase = () => estadoRemoto;

async function empujarAlServidor<T>(clave: Clave, valor: T) {
  if (!hayNavegador()) return;
  try {
    const remoto = await import("./supabase/remoto");
    if (!remoto.hayBaseDeDatos) return;
    const ok = await remoto.empujar(clave, valor);
    if (!ok) estadoRemoto = "error";
    avisar();
  } catch {
    estadoRemoto = "error";
  }
}

/**
 * Trae todo lo que hay en la base y lo deja en la caché.
 * Mientras tanto se sigue viendo lo local, así no hay pantalla en blanco.
 */
export async function sincronizarConLaBase() {
  if (!hayNavegador()) return;

  try {
    const remoto = await import("./supabase/remoto");
    if (!remoto.hayBaseDeDatos) return;

    estadoRemoto = "cargando";
    avisar();

    const claves = Object.values(CLAVES).filter((c) => c !== "sesion");
    const resultados = await Promise.all(
      claves.map(async (clave) => [clave, await remoto.traer(clave)] as const),
    );

    let algo = false;
    resultados.forEach(([clave, valor]) => {
      if (valor !== null && valor !== undefined) {
        cache.set(clave, valor);
        algo = true;
      }
    });

    estadoRemoto = algo ? "listo" : "listo";
    avisar();
  } catch {
    estadoRemoto = "error";
    avisar();
  }
}

export function borrarTodo() {
  cache.clear();
  if (hayNavegador()) {
    Object.values(CLAVES).forEach((c) => window.localStorage.removeItem(PREFIJO + c));
    window.localStorage.removeItem(`${PREFIJO}__migrado`);
    /* Las versiones anteriores no se tocan: son la copia de la que se recupera. */
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


/* ────────────────────────────────────────────────────────────────
   Recuperación
   ──────────────────────────────────────────────────────────────── */

export type Hallazgo = {
  version: string;
  clave: string;
  cantidad: number;
  muestra: string;
  esActual: boolean;
};

/** Nombre legible de lo que hay dentro de cada colección. */
function describir(clave: string, valor: unknown): { cantidad: number; muestra: string } {
  if (Array.isArray(valor)) {
    const nombres = valor
      .map((x) => {
        const o = x as Record<string, unknown>;
        return (o?.nombre ?? o?.titulo ?? o?.huesped ?? o?.autor ?? o?.id) as string | undefined;
      })
      .filter(Boolean)
      .slice(0, 4);
    return { cantidad: valor.length, muestra: nombres.join(" · ") };
  }
  if (valor && typeof valor === "object") {
    return { cantidad: Object.keys(valor).length, muestra: "Ajustes del sitio" };
  }
  return { cantidad: 0, muestra: "" };
}

/* Se calcula una vez y se rehace cuando cambia algo. */
let hallazgos: Hallazgo[] | null = null;

/** Fotografía estable de lo guardado, para consumir desde React. */
export function instantaneaHallazgos(): Hallazgo[] {
  if (!hallazgos) hallazgos = inspeccionar();
  return hallazgos;
}

export const hallazgosVacios: Hallazgo[] = [];

/** Todo lo que hay guardado en este navegador, de cualquier versión. */
export function inspeccionar(): Hallazgo[] {
  if (!hayNavegador()) return [];

  const versiones = [PREFIJO, ...VERSIONES_ANTERIORES];
  const salida: Hallazgo[] = [];

  versiones.forEach((version) => {
    Object.values(CLAVES).forEach((clave) => {
      const crudo = window.localStorage.getItem(version + clave);
      if (!crudo) return;
      try {
        const { cantidad, muestra } = describir(clave, JSON.parse(crudo));
        salida.push({
          version: version.replace("lafe:", "").replace(":", ""),
          clave,
          cantidad,
          muestra,
          esActual: version === PREFIJO,
        });
      } catch {
        /* Entrada ilegible: se ignora. */
      }
    });
  });

  return salida;
}

/** Copia una colección de una versión anterior a la actual. */
export function restaurar(version: string, clave: string) {
  if (!hayNavegador()) return false;
  const origen = `lafe:${version}:`;
  const crudo = window.localStorage.getItem(origen + clave);
  if (!crudo) return false;

  window.localStorage.setItem(PREFIJO + clave, crudo);
  cache.delete(clave);
  hallazgos = null;
  avisar();
  return true;
}
