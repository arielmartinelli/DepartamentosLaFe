import { ExternalLink, MapPin } from "lucide-react";
import { Boton } from "@/components/ui/boton";
import { cn } from "@/lib/utils";

type Props = {
  lat: number;
  lng: number;
  titulo: string;
  direccion: string;
  className?: string;
  alto?: string;
};

/**
 * Mapa embebido de OpenStreetMap: no necesita clave de API ni cookies de
 * terceros. El botón "Cómo llegar" abre la app de mapas del dispositivo.
 */
export function Mapa({ lat, lng, titulo, direccion, className, alto = "h-[22rem] sm:h-[28rem]" }: Props) {
  const d = 0.008;
  const bbox = `${lng - d},${lat - d / 2},${lng + d},${lat + d / 2}`;
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const comoLlegar = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const verMas = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-linea bg-white", className)}>
      <iframe
        title={`Mapa de ${titulo}`}
        src={embed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={cn("w-full border-0 grayscale-[0.18]", alto)}
      />
      <div className="flex flex-col gap-4 border-t border-linea p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2.5 text-[0.9rem] text-texto-suave">
          <MapPin className="mt-0.5 size-4 shrink-0 text-oro" strokeWidth={1.7} aria-hidden />
          <span>
            <span className="block font-semibold text-ink">{titulo}</span>
            {direccion}
          </span>
        </p>
        <div className="flex shrink-0 gap-2">
          <Boton asChild variante="principal" medida="sm">
            <a href={comoLlegar} target="_blank" rel="noopener noreferrer">
              Cómo llegar
            </a>
          </Boton>
          <Boton asChild variante="contorno" medida="sm">
            <a href={verMas} target="_blank" rel="noopener noreferrer">
              Ver mapa
              <ExternalLink strokeWidth={1.7} aria-hidden />
            </a>
          </Boton>
        </div>
      </div>
    </div>
  );
}
