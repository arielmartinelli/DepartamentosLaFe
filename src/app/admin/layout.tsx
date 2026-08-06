import type { Metadata } from "next";
import { Cascara } from "@/components/admin/cascara";
import { ProveedorContenido } from "@/lib/contenido";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: { index: false, follow: false },
};

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <ProveedorContenido>
      <Cascara>{children}</Cascara>
    </ProveedorContenido>
  );
}
