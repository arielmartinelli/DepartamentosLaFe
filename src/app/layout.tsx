import type { Metadata, Viewport } from "next";
import { imagenAlCompartir, sitio, urlBaseDelPedido } from "@/lib/site";
// Tipografías autoalojadas: sin pedidos a terceros, mejor LCP y sin dependencia de red.
import "@fontsource-variable/fraunces/soft.css";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const base = await urlBaseDelPedido();

  return {
    metadataBase: new URL(base),
    title: {
      default: "Departamentos La Fe — Alquiler temporario en Ushuaia",
      template: "%s · Departamentos La Fe",
    },
    description: sitio.descripcion,
    keywords: [
      "alquiler temporario Ushuaia",
      "departamentos en Ushuaia",
      "alojamiento familiar Ushuaia",
      "turismo en Ushuaia",
      "departamentos Tierra del Fuego",
      "dónde alojarse en Ushuaia",
    ],
    authors: [{ name: sitio.nombre }],
    creator: sitio.nombre,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "es_AR",
      url: base,
      siteName: sitio.nombre,
      title: "Departamentos La Fe — Alquiler temporario en Ushuaia",
      description: sitio.descripcion,
      images: [imagenAlCompartir],
    },
    twitter: {
      card: "summary_large_image",
      title: "Departamentos La Fe — Alquiler temporario en Ushuaia",
      description: sitio.descripcion,
      images: [imagenAlCompartir.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    category: "travel",
  };
}

export const viewport: Viewport = {
  themeColor: "#14161c",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
