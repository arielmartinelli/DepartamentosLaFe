"use client";

import { History, RotateCcw, TriangleAlert } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { Panel, PanelCabecera } from "@/components/admin/tarjeta";
import { Boton } from "@/components/ui/boton";
import { Insignia } from "@/components/ui/insignia";
import {
  hallazgosVacios,
  instantaneaHallazgos,
  restaurar,
  suscribir,
  type Hallazgo,
} from "@/lib/repositorio";
import { cn } from "@/lib/utils";

const nombres: Record<string, string> = {
  edificios: "Edificios",
  departamentos: "Departamentos",
  reservas: "Reservas",
  bloqueos: "Fechas bloqueadas",
  consultas: "Consultas",
  actividades: "Qué hacer",
  comentarios: "Comentarios",
  prestaciones: "Servicios",
  galerias: "Galerías",
  ajustes: "Configuración",
  cuentas: "Cuentas de visitantes",
  sesion: "Sesión",
};

/**
 * Muestra todo lo que hay guardado en el navegador, de cualquier versión, y
 * permite traerlo a la versión actual. Es la red de seguridad cuando un cambio
 * de estructura deja los datos anteriores fuera de alcance.
 */
export function RecuperarDatos() {
  const [restaurados, setRestaurados] = useState<string[]>([]);

  /* Se lee del navegador, así que se consume como fuente externa. */
  const hallazgos = useSyncExternalStore(suscribir, instantaneaHallazgos, () => hallazgosVacios);

  const anteriores = hallazgos.filter((h) => !h.esActual);
  const versiones = [...new Set(anteriores.map((h) => h.version))];

  const traer = (h: Hallazgo) => {
    if (restaurar(h.version, h.clave)) {
      setRestaurados((v) => [...v, `${h.version}:${h.clave}`]);
    }
  };

  const traerVersion = (version: string) => {
    anteriores.filter((h) => h.version === version).forEach(traer);
  };

  if (!anteriores.length) {
    return (
      <Panel>
        <PanelCabecera
          titulo="Recuperar datos anteriores"
          detalle="No hay copias de versiones anteriores en este navegador."
        />
        <p className="px-5 pb-5 text-[0.85rem] leading-relaxed text-texto-suave sm:px-6 sm:pb-6">
          Cuando cambia la estructura de los datos, lo guardado antes queda acá para poder
          traerlo de vuelta. Por ahora no hay nada que recuperar.
        </p>
      </Panel>
    );
  }

  return (
    <Panel className="border-aviso/40">
      <PanelCabecera
        titulo="Recuperar datos anteriores"
        detalle="Esto es lo que quedó guardado de versiones previas. Traer una colección pisa la actual."
      />

      <div className="space-y-5 p-5 sm:p-6">
        <p className="flex items-start gap-2.5 rounded-md bg-aviso/8 px-4 py-3 text-[0.83rem] leading-relaxed text-aviso">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} aria-hidden />
          Antes de recuperar, descargá una copia de seguridad con el botón de arriba: así
          podés volver atrás si te equivocás.
        </p>

        {versiones.map((version) => (
          <div key={version} className="rounded-md border border-linea">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linea px-4 py-3">
              <p className="flex items-center gap-2 text-[0.88rem] font-semibold text-ink">
                <History className="size-4 text-texto-tenue" strokeWidth={1.7} aria-hidden />
                Versión {version}
              </p>
              <Boton variante="contorno" medida="sm" onClick={() => traerVersion(version)}>
                <RotateCcw strokeWidth={1.7} /> Traer todo
              </Boton>
            </div>

            <ul className="divide-y divide-linea-suave">
              {anteriores
                .filter((h) => h.version === version)
                .map((h) => {
                  const hecho = restaurados.includes(`${h.version}:${h.clave}`);
                  return (
                    <li key={h.clave} className="flex flex-wrap items-center gap-3 px-4 py-3">
                      <span className="min-w-0 grow">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-[0.88rem] font-medium text-ink">
                            {nombres[h.clave] ?? h.clave}
                          </span>
                          <Insignia tono="neutro">
                            {h.cantidad} {h.cantidad === 1 ? "elemento" : "elementos"}
                          </Insignia>
                          {hecho ? <Insignia tono="exito">Recuperado</Insignia> : null}
                        </span>
                        {h.muestra ? (
                          <span className="mt-1 block truncate text-[0.78rem] text-texto-suave">
                            {h.muestra}
                          </span>
                        ) : null}
                      </span>

                      <Boton
                        variante={hecho ? "fantasma" : "principal"}
                        medida="sm"
                        onClick={() => traer(h)}
                      >
                        {hecho ? "Traer de nuevo" : "Traer"}
                      </Boton>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}

        {restaurados.length ? (
          <p className={cn("rounded-md bg-exito/8 px-4 py-3 text-[0.85rem] text-exito")}>
            Listo. Recargá la página para ver los datos recuperados en todo el panel.
          </p>
        ) : null}
      </div>
    </Panel>
  );
}
