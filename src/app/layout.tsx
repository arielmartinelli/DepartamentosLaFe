import type { Metadata, Viewport } from "next";
import { sitio } from "@/lib/site";
// Tipografías autoalojadas: sin pedidos a terceros, mejor LCP y sin dependencia de red.
import "@fontsource-variable/fraunces/soft.css";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  title: {
    default: "La Fe Departamentos — Alquiler temporario en Ushuaia",
    template: "%s · La Fe Departamentos",
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
    url: sitio.url,
    siteName: sitio.nombre,
    title: "La Fe Departamentos — Alquiler temporario en Ushuaia",
    description: sitio.descripcion,
    images: [{ url: sitio.marca.portada, width: 2048, height: 1511, alt: sitio.nombre }],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Fe Departamentos — Alquiler temporario en Ushuaia",
    description: sitio.descripcion,
    images: [sitio.marca.portada],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "travel",
};

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
