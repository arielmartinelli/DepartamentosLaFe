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
 * Mapa embebido de Google Maps. Los botones "Cómo llegar" y "Ver en Google Maps"
 * abren Google Maps apuntando exactamente a la dirección cargada en la página.
 */
export function Mapa({ lat, lng, titulo, direccion, className, alto = "h-[22rem] sm:h-[28rem]" }: Props) {
  const consulta = encodeURIComponent(direccion || `${lat},${lng}`);
  const embed = `https://maps.google.com/maps?q=${consulta}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  const comoLlegar = `https://www.google.com/maps/dir/?api=1&destination=${consulta}`;
  const verEnGoogleMaps = `https://www.google.com/maps/search/?api=1&query=${consulta}`;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-linea bg-white shadow-carta", className)}>
      <iframe
        title={`Mapa de Google Maps para ${titulo}`}
        src={embed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={cn("w-full border-0", alto)}
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
            <a href={verEnGoogleMaps} target="_blank" rel="noopener noreferrer">
              Ver en Google Maps
              <ExternalLink strokeWidth={1.7} aria-hidden />
            </a>
          </Boton>
        </div>
      </div>
    </div>
  );
}
