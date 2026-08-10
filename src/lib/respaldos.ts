/**
 * Copias de seguridad automáticas.
 *
 * Se guarda una instantánea de todo lo cargado cada vez que se abre el panel y
 * antes de cualquier migración. Así, si un cambio de estructura deja los datos
 * fuera de alcance, siempre hay de dónde volver.
 *
 * Sólo se copian las colecciones de texto: las imágenes viven en IndexedDB, no
 * llevan versión y nunca se borran.
 */

const CLAVE_RESPALDOS = "lafe:respaldos";
const TOPE = 4;

export type Respaldo = {
  id: string;
  fecha: string;
  motivo: string;
  /** Nombre de la colección → contenido tal cual estaba guardado. */
  datos: Record<string, string>;
  resumen: string;
};

const hayNavegador = () => typeof window !== "undefined";

/* ── Fuente externa para React ──────────────────────────────────────
   La lista se guarda en memoria porque `useSyncExternalStore` compara
   por identidad: si se devolviera un array nuevo en cada lectura, se
   entraría en un ciclo infinito de renders. */

export const respaldosVacios: Respaldo[] = [];

let memoria: Respaldo[] | null = null;
const oyentes = new Set<() => void>();

function invalidar() {
  memoria = null;
  oyentes.forEach((f) => f());
}

export function suscribirRespaldos(fn: () => void) {
  oyentes.add(fn);
  return () => {
    oyentes.delete(fn);
  };
}

/** Lectura estable: siempre la misma referencia mientras no cambie nada. */
export function instantaneaRespaldos(): Respaldo[] {
  if (!memoria) memoria = listarRespaldos();
  return memoria;
}

export function listarRespaldos(): Respaldo[] {
  if (!hayNavegador()) return [];
  try {
    const crudo = window.localStorage.getItem(CLAVE_RESPALDOS);
    return crudo ? (JSON.parse(crudo) as Respaldo[]) : [];
  } catch {
    return [];
  }
}

/** Cuenta lo que hay adentro, para que la lista diga algo útil. */
function resumir(datos: Record<string, string>) {
  const partes: string[] = [];
  const contar = (clave: string, etiqueta: string) => {
    const crudo = datos[clave];
    if (!crudo) return;
    try {
      const valor = JSON.parse(crudo);
      if (Array.isArray(valor) && valor.length) partes.push(`${valor.length} ${etiqueta}`);
    } catch {
      /* Ignorar entradas ilegibles. */
    }
  };
  contar("departamentos", "departamentos");
  contar("reservas", "reservas");
  contar("consultas", "consultas");
  contar("actividades", "actividades");
  return partes.join(" · ") || "Sin contenido";
}

/**
 * Toma una instantánea de todas las claves del prefijo indicado.
 * No hace nada si no hay datos, o si son idénticos al último respaldo.
 */
export function crearRespaldo(prefijo: string, claves: string[], motivo: string) {
  if (!hayNavegador()) return null;

  const datos: Record<string, string> = {};
  claves.forEach((clave) => {
    const valor = window.localStorage.getItem(prefijo + clave);
    if (valor) datos[clave] = valor;
  });

  if (!Object.keys(datos).length) return null;

  const respaldos = listarRespaldos();
  const huella = JSON.stringify(datos);
  if (respaldos[0] && JSON.stringify(respaldos[0].datos) === huella) return null;

  const nuevo: Respaldo = {
    id: `res-${Date.now().toString(36)}`,
    fecha: new Date().toISOString(),
    motivo,
    datos,
    resumen: resumir(datos),
  };

  try {
    window.localStorage.setItem(
      CLAVE_RESPALDOS,
      JSON.stringify([nuevo, ...respaldos].slice(0, TOPE)),
    );
    invalidar();
  } catch {
    /* Si no entra, se conserva lo que ya había. */
  }

  return nuevo;
}

/** Vuelve a escribir un respaldo sobre las claves actuales. */
export function restaurarRespaldo(prefijo: string, id: string) {
  if (!hayNavegador()) return false;
  const respaldo = listarRespaldos().find((r) => r.id === id);
  if (!respaldo) return false;

  Object.entries(respaldo.datos).forEach(([clave, valor]) => {
    window.localStorage.setItem(prefijo + clave, valor);
  });
  invalidar();
  return true;
}

export function borrarRespaldos() {
  if (hayNavegador()) window.localStorage.removeItem(CLAVE_RESPALDOS);
  invalidar();
}
