import { Footer } from "@/components/sitio/footer";
import { Nav } from "@/components/sitio/nav";
import { BotonWhatsApp } from "@/components/sitio/boton-whatsapp";
import { ProveedorContenido } from "@/lib/contenido";
import { ProveedorSesion } from "@/lib/sesion";

export default function LayoutSitio({ children }: { children: React.ReactNode }) {
  return (
    <ProveedorContenido>
      <ProveedorSesion>
        <Nav />
        <main id="contenido">{children}</main>
        <Footer />
        <BotonWhatsApp />
      </ProveedorSesion>
    </ProveedorContenido>
  );
}
