import type { ReactNode } from "react";

export function EncabezadoPagina({
  titulo,
  descripcion,
  acciones,
}: {
  titulo: string;
  descripcion?: string;
  acciones?: ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-[clamp(1.6rem,3vw,2.1rem)] leading-tight text-ink">
          {titulo}
        </h1>
        {descripcion ? (
          <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-texto-suave">
            {descripcion}
          </p>
        ) : null}
      </div>
      {acciones ? <div className="flex shrink-0 flex-wrap gap-2">{acciones}</div> : null}
    </header>
  );
}
