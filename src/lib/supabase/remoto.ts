"use client";

import { supabase, hayBaseDeDatos } from "./cliente";

/**
 * Traducción entre las colecciones del panel y las tablas de la base.
 *
 * La mayor parte del contenido vive en una sola tabla `contenido`, con la
 * colección entera guardada como JSON. Es deliberado: son seis departamentos y
 * un puñado de textos, así que no hace falta un esquema relacional para eso, y
 * mantiene el código del panel sin cambios.
 *
 * Reservas y consultas sí tienen tabla propia, porque llevan datos personales
 * de los huéspedes y necesitan permisos distintos.
 */

export const EN_TABLA_PROPIA = ["reservas", "consultas"] as const;

type Fila = Record<string, unknown>;

const aReserva = (r: Fila) => ({
  id: r.id as string,
  codigo: r.codigo as string,
  huesped: r.huesped as string,
  email: r.email as string,
  telefono: r.telefono as string,
  departamentoId: r.departamento as string,
  desde: r.desde as string,
  hasta: r.hasta as string,
  personas: r.personas as number,
  estado: r.estado as string,
  origen: r.origen as string,
  total: r.total as number,
  notas: (r.notas as string) ?? undefined,
});

const deReserva = (r: Fila) => ({
  id: r.id,
  codigo: r.codigo,
  huesped: r.huesped,
  email: r.email,
  telefono: r.telefono,
  departamento: r.departamentoId,
  desde: r.desde,
  hasta: r.hasta,
  personas: r.personas,
  estado: r.estado,
  origen: r.origen,
  total: r.total,
  notas: r.notas ?? null,
});

const aConsulta = (c: Fila) => ({
  id: c.id as string,
  nombre: c.nombre as string,
  email: c.email as string,
  telefono: c.telefono as string,
  departamentoId: (c.departamento as string) ?? null,
  desde: (c.desde as string) ?? null,
  hasta: (c.hasta as string) ?? null,
  personas: c.personas as number,
  mensaje: c.mensaje as string,
  fecha: String(c.creado ?? "").slice(0, 10),
  estado: c.estado as string,
  canal: c.canal as string,
  cuentaId: (c.cuenta as string) ?? null,
  conversacion: (c.conversacion as unknown[]) ?? [],
});

const deConsulta = (c: Fila) => ({
  id: c.id,
  nombre: c.nombre,
  email: c.email,
  telefono: c.telefono,
  departamento: c.departamentoId ?? null,
  desde: c.desde ?? null,
  hasta: c.hasta ?? null,
  personas: c.personas,
  mensaje: c.mensaje,
  estado: c.estado,
  canal: c.canal,
  cuenta: c.cuentaId ?? null,
  conversacion: c.conversacion ?? [],
});

/** Trae una colección de la base. Devuelve null si no se pudo. */
export async function traer<T>(clave: string): Promise<T | null> {
  const bd = supabase();
  if (!bd) return null;

  try {
    if (clave === "reservas") {
      const { data, error } = await bd.from("reservas").select("*").order("desde");
      if (error) throw error;
      return (data ?? []).map(aReserva) as T;
    }

    if (clave === "consultas") {
      const { data, error } = await bd.from("consultas").select("*").order("creado", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(aConsulta) as T;
    }

    const { data, error } = await bd.from("contenido").select("valor").eq("clave", clave).maybeSingle();
    if (error) throw error;
    return (data?.valor ?? null) as T | null;
  } catch {
    return null;
  }
}

/**
 * Deja la tabla igual a la lista recibida.
 *
 * Antes sólo se hacía `upsert`, así que lo que la propietaria borraba en el
 * panel seguía en el servidor y volvía a aparecer en la siguiente carga. Ahora
 * se compara con lo que hay y se elimina lo que sobra.
 */
async function sincronizarTabla(tabla: string, filas: Fila[]) {
  const bd = supabase();
  if (!bd) return false;

  const { data: existentes, error: errorLectura } = await bd.from(tabla).select("id");
  if (errorLectura) throw errorLectura;

  const vigentes = new Set(filas.map((f) => String(f.id)));
  const sobrantes = ((existentes ?? []) as Fila[])
    .map((f) => String(f.id))
    .filter((id: string) => !vigentes.has(id));

  if (sobrantes.length) {
    const { error } = await bd.from(tabla).delete().in("id", sobrantes);
    if (error) throw error;
  }

  if (filas.length) {
    const { error } = await bd.from(tabla).upsert(filas);
    if (error) throw error;
  }

  return true;
}

/** Guarda una colección completa. Devuelve false si no se pudo. */
export async function empujar<T>(clave: string, valor: T): Promise<boolean> {
  const bd = supabase();
  if (!bd) return false;

  try {
    if (clave === "reservas") {
      const filas = (valor as unknown as Fila[]).map((r) => deReserva(r) as Fila);
      return sincronizarTabla("reservas", filas);
    }

    if (clave === "consultas") {
      const filas = (valor as unknown as Fila[]).map((c) => deConsulta(c) as Fila);
      return sincronizarTabla("consultas", filas);
    }

    const { error } = await bd
      .from("contenido")
      .upsert({ clave, valor, actualizado: new Date().toISOString() });
    if (error) throw error;
    return true;
  } catch {
    return false;
  }
}

export { hayBaseDeDatos };


/**
 * Avisa cuando cambian las consultas o las reservas en el servidor.
 * Sirve para que los mensajes lleguen sin recargar la página.
 */
export function escucharCambios(alCambiar: () => void) {
  const bd = supabase();
  if (!bd) return () => {};

  const canal = bd
    .channel("cambios-lafe")
    .on("postgres_changes", { event: "*", schema: "public", table: "consultas" }, alCambiar)
    .on("postgres_changes", { event: "*", schema: "public", table: "reservas" }, alCambiar)
    .on("postgres_changes", { event: "*", schema: "public", table: "contenido" }, alCambiar)
    .subscribe();

  return () => {
    void bd.removeChannel(canal);
  };
}
