import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  prioridad?: boolean;
  sizes?: string;
  zoom?: boolean;
};

/**
 * Envoltorio de imagen. Reserva el espacio con `aspect-*` desde afuera,
 * así no hay salto de maquetado mientras carga.
 */
export function Foto({
  src,
  alt,
  className,
  imgClassName,
  prioridad = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  zoom = false,
}: Props) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={`${alt} — sin fotografía cargada`}
        className={cn(
          "grid place-items-center bg-hueso text-[0.72rem] text-texto-tenue",
          className,
        )}
      >
        Sin foto
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-hueso",
        zoom && "zoom-foto",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={prioridad}
        className={cn("object-cover", imgClassName)}
      />
    </div>
  );
}
