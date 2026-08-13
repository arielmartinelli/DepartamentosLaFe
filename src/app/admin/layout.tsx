import type { Metadata } from "next";
import { Cascara } from "@/components/admin/cascara";
import { ProveedorContenido } from "@/lib/contenido";
import { ProveedorSesion } from "@/lib/sesion";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <ProveedorContenido>
      <ProveedorSesion>
        <Cascara>{children}</Cascara>
      </ProveedorSesion>
    </ProveedorContenido>
  );
}
