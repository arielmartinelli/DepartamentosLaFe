"use client";

import { ImageUp, Loader2, TriangleAlert, X } from "lucide-react";
import { useId, useRef, useState, type DragEvent } from "react";
import { Boton } from "@/components/ui/boton";
import { guardarArchivo } from "@/lib/archivos";
import { cn } from "@/lib/utils";

type Props = {
  /** Devuelve las referencias `local:<id>` de lo que se subió. */
  onListo: (referencias: string[]) => void;
  multiple?: boolean;
  etiqueta?: string;
  ayuda?: string;
  className?: string;
  compacta?: boolean;
};

/**
 * Arrastrar y soltar, o hacer clic para elegir.
 * Las imágenes se reescalan y comprimen antes de guardarse.
 */
export function ZonaSubida({
  onListo,
  multiple = false,
  etiqueta,
  ayuda,
  className,
  compacta = false,
}: Props) {
  const id = useId();
  const entrada = useRef<HTMLInputElement>(null);
  const [encima, setEncima] = useState(false);
  const [trabajando, setTrabajando] = useState(0);
  const [errores, setErrores] = useState<string[]>([]);
  const [avisos, setAvisos] = useState<string[]>([]);

  const procesar = async (archivos: FileList | null) => {
    if (!archivos?.length) return;
    const lista = Array.from(archivos).slice(0, multiple ? 20 : 1);

    setErrores([]);
    setAvisos([]);
    setTrabajando(lista.length);

    const referencias: string[] = [];
    const fallos: string[] = [];
    const alertas: string[] = [];

    for (const archivo of lista) {
      const r = await guardarArchivo(archivo);
      if (r.ok) {
        referencias.push(r.referencia);
        if (r.aviso) alertas.push(r.aviso);
      } else {
        fallos.push(r.error);
      }
      setTrabajando((n) => n - 1);
    }

    setTrabajando(0);
    setErrores(fallos);
    setAvisos(alertas);
    if (referencias.length) onListo(referencias);
    if (entrada.current) entrada.current.value = "";
  };

  const soltar = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setEncima(false);
    void procesar(e.dataTransfer.files);
  };

  const ocupado = trabajando > 0;

  return (
    <div className={className}>
      {etiqueta ? (
        <p className="mb-2 text-[0.78rem] font-semibold text-ink">{etiqueta}</p>
      ) : null}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setEncima(true);
        }}
        onDragLeave={() => setEncima(false)}
        onDrop={soltar}
        className={cn(
          "relative rounded-md border border-dashed text-center transition-colors duration-200",
          compacta ? "px-4 py-5" : "px-6 py-9",
          encima ? "border-oro bg-oro-vidrio/60" : "border-linea bg-hueso/60",
          ocupado && "opacity-70",
        )}
      >
        <input
          ref={entrada}
          id={id}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="sr-only"
          onChange={(e) => void procesar(e.target.files)}
        />

        {ocupado ? (
          <p className="flex items-center justify-center gap-2.5 text-[0.88rem] font-medium text-ink">
            <Loader2 className="size-4 animate-spin" strokeWidth={2} aria-hidden />
            Procesando {trabajando} {trabajando === 1 ? "imagen" : "imágenes"}…
          </p>
        ) : (
          <>
            <ImageUp
              className={cn("mx-auto size-6", encima ? "text-oro-oscuro" : "text-texto-tenue")}
              strokeWidth={1.4}
              aria-hidden
            />
            <p className={cn("font-medium text-ink", compacta ? "mt-2 text-[0.85rem]" : "mt-3 text-[0.9rem]")}>
              Arrastrá {multiple ? "una o más imágenes" : "una imagen"} acá
            </p>
            <Boton
              variante="contorno"
              medida="sm"
              className="mt-3"
              onClick={() => entrada.current?.click()}
            >
              Elegir {multiple ? "archivos" : "archivo"}
            </Boton>
            <p className="mt-3 text-[0.78rem] leading-relaxed text-texto-suave">
              {ayuda ??
                "JPG, PNG o WebP. Se reescalan a 1800 px de ancho y se guardan comprimidas."}
            </p>
          </>
        )}
      </div>

      {errores.length ? (
        <ul className="mt-3 space-y-1.5">
          {errores.map((e) => (
            <li
              key={e}
              className="flex items-start gap-2 rounded-sm bg-alerta/8 px-3 py-2 text-[0.8rem] text-alerta"
            >
              <X className="mt-0.5 size-3.5 shrink-0" strokeWidth={2.2} aria-hidden />
              {e}
            </li>
          ))}
        </ul>
      ) : null}

      {avisos.length ? (
        <ul className="mt-3 space-y-1.5">
          {avisos.map((a) => (
            <li
              key={a}
              className="flex items-start gap-2 rounded-sm bg-oro/10 px-3 py-2 text-[0.8rem] leading-relaxed text-oro-oscuro"
            >
              <TriangleAlert className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} aria-hidden />
              {a}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
