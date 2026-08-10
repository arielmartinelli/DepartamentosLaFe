import { ProveedorContenido } from "@/lib/contenido";
import { ProveedorSesion } from "@/lib/sesion";

export default function LayoutIngreso({ children }: { children: React.ReactNode }) {
  return (
    <ProveedorContenido>
      <ProveedorSesion>{children}</ProveedorSesion>
    </ProveedorContenido>
  );
}
