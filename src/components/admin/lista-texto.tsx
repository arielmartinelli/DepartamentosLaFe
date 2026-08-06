"use client";

import { Plus, Trash2 } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import { Entrada } from "@/components/ui/campo";

/** Editor de listas simples de texto (cocina, baño, comodidades). */
export function ListaTexto({
  etiqueta,
  valores,
  onCambio,
  marcador = "Agregar…",
}: {
  etiqueta: string;
  valores: string[];
  onCambio: (v: string[]) => void;
  marcador?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-[0.78rem] font-semibold text-ink">{etiqueta}</legend>
      <ul className="space-y-2">
        {valores.map((v, i) => (
          <li key={i} className="flex gap-2">
            <Entrada
              value={v}
              onChange={(e) => {
                const copia = [...valores];
                copia[i] = e.target.value;
                onCambio(copia);
              }}
              aria-label={`${etiqueta} ${i + 1}`}
            />
            <Boton
              variante="fantasma"
              medida="icono"
              aria-label={`Quitar ${v || "elemento"}`}
              className="shrink-0 text-alerta hover:bg-alerta/10"
              onClick={() => onCambio(valores.filter((_, k) => k !== i))}
            >
              <Trash2 strokeWidth={1.6} />
            </Boton>
          </li>
        ))}
      </ul>
      <Boton
        variante="suave"
        medida="sm"
        className="mt-2.5"
        onClick={() => onCambio([...valores, ""])}
      >
        <Plus strokeWidth={2} /> {marcador}
      </Boton>
    </fieldset>
  );
}
