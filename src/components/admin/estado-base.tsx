"use client";

import { CloudCheck, CloudOff, CloudUpload, Loader2, TriangleAlert } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Panel, PanelCabecera } from "@/components/admin/tarjeta";
import { Boton } from "@/components/ui/boton";
import { Insignia } from "@/components/ui/insignia";
import { CLAVES, estadoDeLaBase, leer, suscribir } from "@/lib/repositorio";
import { hayBaseDeDatos } from "@/lib/supabase/cliente";

/**
 * Estado de la conexión con la base y subida de lo que quedó en el navegador.
 * Es el puente entre la demostración local y el sitio compartido.
 */
export function EstadoBase() {
  const estado = useSyncExternalStore(suscribir, estadoDeLaBase, () => "sin-base" as const);
  const [subiendo, setSubiendo] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);
  const [paso, setPaso] = useState<string | null>(null);

  /** Reemplaza las referencias locales por las direcciones del servidor. */
  const reescribir = <T,>(valor: T, mapa: Record<string, string>): T => {
    if (typeof valor === "string") return (mapa[valor] ?? valor) as T;
    if (Array.isArray(valor)) return valor.map((x) => reescribir(x, mapa)) as T;
    if (valor && typeof valor === "object") {
      const salida: Record<string, unknown> = {};
      Object.entries(valor as Record<string, unknown>).forEach(([k, v]) => {
        salida[k] = reescribir(v, mapa);
      });
      return salida as T;
    }
    return valor;
  };

  const subir = async () => {
    setSubiendo(true);
    setResultado(null);
    setPaso("Subiendo las fotos…");

    try {
      const archivos = await import("@/lib/archivos");
      const remoto = await import("@/lib/supabase/remoto");

      /* Primero las imágenes: si no, las referencias locales quedan rotas. */
      const mapa = await archivos.subirLocalesAlServidor((hechas, total) =>
        setPaso(`Subiendo fotos… ${hechas} de ${total}`),
      );

      setPaso("Subiendo los datos…");
      const claves = Object.values(CLAVES).filter((c) => c !== "sesion");

      let subidas = 0;
      let fallos = 0;

      for (const clave of claves) {
        const valor = leer(clave, null);
        if (valor === null) continue;
        const ok = await remoto.empujar(clave, reescribir(valor, mapa));
        if (ok) subidas += 1;
        else fallos += 1;
      }

      const fotos = Object.keys(mapa).length;
      setResultado(
        fallos
          ? `Se subieron ${subidas} colecciones y ${fotos} fotos, pero fallaron ${fallos}. Revisá que hayas entrado con la cuenta de la propietaria.`
          : `Listo: ${subidas} colecciones y ${fotos} ${fotos === 1 ? "foto" : "fotos"} en la base. Recargá para verlo.`,
      );
    } catch {
      setResultado("No se pudo conectar con la base.");
    }

    setPaso(null);
    setSubiendo(false);
  };

  if (!hayBaseDeDatos) {
    return (
      <Panel>
        <PanelCabecera
          titulo="Base de datos"
          detalle="Todavía no hay ninguna conectada."
          accion={<Insignia tono="aviso">Sin conectar</Insignia>}
        />
        <div className="flex items-start gap-3 px-5 pb-5 sm:px-6 sm:pb-6">
          <CloudOff className="mt-0.5 size-5 shrink-0 text-texto-tenue" strokeWidth={1.5} aria-hidden />
          <p className="text-[0.85rem] leading-relaxed text-texto-suave">
            Los datos y las fotos viven sólo en este navegador: lo que cargues acá no se ve
            desde otra computadora ni desde el celular. Para compartirlo, seguí los pasos
            de Supabase en el archivo <code className="rounded-xs bg-hueso px-1.5 py-0.5">README.md</code>.
          </p>
        </div>
      </Panel>
    );
  }

  return (
    <Panel>
      <PanelCabecera
        titulo="Base de datos"
        detalle="Los cambios se guardan en el servidor y se ven desde cualquier dispositivo."
        accion={
          estado === "error" ? (
            <Insignia tono="alerta">Con problemas</Insignia>
          ) : estado === "cargando" ? (
            <Insignia tono="neutro">Sincronizando…</Insignia>
          ) : (
            <Insignia tono="exito">Conectada</Insignia>
          )
        }
      />

      <div className="space-y-4 px-5 pb-5 sm:px-6 sm:pb-6">
        <p className="flex items-start gap-3 text-[0.85rem] leading-relaxed text-texto-suave">
          {estado === "error" ? (
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-alerta" strokeWidth={1.6} aria-hidden />
          ) : estado === "cargando" ? (
            <Loader2 className="mt-0.5 size-5 shrink-0 animate-spin text-texto-tenue" strokeWidth={1.6} aria-hidden />
          ) : (
            <CloudCheck className="mt-0.5 size-5 shrink-0 text-exito" strokeWidth={1.6} aria-hidden />
          )}
          {estado === "error"
            ? "Algo falló al guardar en el servidor. Puede ser que la sesión haya caducado: cerrá y volvé a entrar."
            : "Todo lo que edites se guarda en la base y queda disponible en cualquier dispositivo."}
        </p>

        <div className="rounded-md border border-linea bg-hueso/60 p-4">
          <p className="text-[0.85rem] font-medium text-ink">
            ¿Tenías datos cargados en este navegador?
          </p>
          <p className="mt-1 text-[0.82rem] leading-relaxed text-texto-suave">
            Se suben primero las fotos y después los textos, con las referencias ya
            corregidas. Se sobrescribe lo que haya en el servidor con lo que tengas acá.
          </p>
          <Boton
            variante="principal"
            medida="sm"
            className="mt-3"
            disabled={subiendo}
            onClick={() => void subir()}
          >
            <CloudUpload strokeWidth={1.7} />
            {subiendo ? (paso ?? "Subiendo…") : "Subir mis datos y mis fotos a la base"}
          </Boton>

          {resultado ? (
            <p className="mt-3 rounded-sm bg-white px-3.5 py-2.5 text-[0.82rem] text-texto">
              {resultado}
            </p>
          ) : null}
        </div>
      </div>
    </Panel>
  );
}
