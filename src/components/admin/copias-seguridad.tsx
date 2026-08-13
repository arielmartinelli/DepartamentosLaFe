"use client";

import { Clock, RotateCcw, ShieldCheck } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Panel, PanelCabecera } from "@/components/admin/tarjeta";
import { Boton } from "@/components/ui/boton";
import { Insignia } from "@/components/ui/insignia";
import { prefijoActual, respaldarAhora } from "@/lib/repositorio";
import {
  instantaneaRespaldos,
  respaldosVacios,
  restaurarRespaldo,
  suscribirRespaldos,
} from "@/lib/respaldos";

/**
 * Copias automáticas de los datos del panel.
 * Se hace una al abrir el panel y otra antes de cualquier migración.
 */
export function CopiasSeguridad() {
  const [restaurada, setRestaurada] = useState<string | null>(null);
  const [reciente, setReciente] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");

  /* Si nada cambió desde la última copia, no se guarda una igual: antes el
     botón parecía roto porque no pasaba nada. Ahora lo dice. */
  const copiar = () => {
    setRestaurada(null);
    const nuevo = respaldarAhora("Manual");
    if (nuevo) {
      setReciente(nuevo.id);
      setAviso("Copia guardada.");
    } else {
      setReciente(null);
      setAviso("No hizo falta: no cambió nada desde la copia anterior.");
    }
  };
  const respaldos = useSyncExternalStore(
    suscribirRespaldos,
    instantaneaRespaldos,
    () => respaldosVacios,
  );

  const cuando = (iso: string) =>
    new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));

  return (
    <Panel>
      <PanelCabecera
        titulo="Copias automáticas"
        detalle="Se guarda una al abrir el panel y otra antes de cualquier cambio de estructura. Se conservan las últimas cuatro."
        accion={
          <Boton variante="contorno" medida="sm" onClick={copiar}>
            <ShieldCheck strokeWidth={1.7} /> Copiar ahora
          </Boton>
        }
      />

      {aviso ? (
        <p
          role="status"
          className="mx-5 mb-4 rounded-sm bg-hueso px-3.5 py-2.5 text-[0.83rem] text-texto-suave sm:mx-6"
        >
          {aviso}
        </p>
      ) : null}

      {respaldos.length === 0 ? (
        <p className="px-5 pb-5 text-[0.85rem] leading-relaxed text-texto-suave sm:px-6 sm:pb-6">
          Todavía no hay copias. Se crea una sola en cuanto cargues o edites algo.
        </p>
      ) : (
        <ul className="divide-y divide-linea-suave">
          {respaldos.map((r, i) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-6">
              <Clock className="size-4 shrink-0 text-texto-tenue" strokeWidth={1.7} aria-hidden />
              <span className="min-w-0 grow">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[0.88rem] font-medium text-ink">{cuando(r.fecha)}</span>
                  {reciente === r.id ? (
                    <Insignia tono="oro">Recién guardada</Insignia>
                  ) : i === 0 ? (
                    <Insignia tono="exito">La más reciente</Insignia>
                  ) : null}
                  <Insignia tono="neutro">{r.motivo}</Insignia>
                  {restaurada === r.id ? <Insignia tono="oro">Restaurada</Insignia> : null}
                </span>
                <span className="mt-1 block text-[0.78rem] text-texto-suave">{r.resumen}</span>
              </span>

              <Boton
                variante={restaurada === r.id ? "fantasma" : "principal"}
                medida="sm"
                onClick={() => {
                  if (restaurarRespaldo(prefijoActual(), r.id)) {
                    setRestaurada(r.id);
                    window.location.reload();
                  }
                }}
              >
                <RotateCcw strokeWidth={1.7} /> Restaurar
              </Boton>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
