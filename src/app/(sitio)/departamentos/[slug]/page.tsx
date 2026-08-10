import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FichaDepartamento } from "@/components/sitio/ficha-departamento";
import { buscarEdificio, departamentos } from "@/lib/data";
import { imagenAlCompartir, sitio, urlBaseDelPedido } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

/**
 * Imagen para la vista previa del enlace.
 *
 * Las subidas locales (`local:…`) sólo existen en el navegador de la
 * propietaria, así que ahí se comparte la foto general. Las de Unsplash se
 * piden recortadas a 1200×630: WhatsApp descarta las imágenes pesadas.
 */
function imagenAlCompartirDe(foto: string | undefined, alt: string) {
  if (!foto) return imagenAlCompartir;

  if (foto.includes("images.unsplash.com")) {
    const limpia = foto.split("?")[0];
    return {
      url: `${limpia}?auto=format&fit=crop&q=70&w=1200&h=630`,
      width: 1200,
      height: 630,
      alt,
    };
  }

  if (/^https?:\/\//.test(foto) || foto.startsWith("/")) {
    return { url: foto, alt };
  }

  return imagenAlCompartir;
}

export function generateStaticParams() {
  return departamentos.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dep = departamentos.find((d) => d.slug === slug);
  if (!dep) return {};
  const ed = buscarEdificio(dep.edificioId);

  const base = await urlBaseDelPedido();
  const titulo = `${ed?.nombre} · ${dep.nombre} — alquiler temporario en Ushuaia`;

  return {
    metadataBase: new URL(base),
    title: titulo,
    description: [
      dep.resumen,
      `Hasta ${dep.capacidad} huéspedes`,
      dep.metros > 0 ? `${dep.metros} m²` : null,
      "cocina-comedor equipada, fibra óptica y TV en cada ambiente",
      "a cinco cuadras del centro de Ushuaia.",
    ]
      .filter(Boolean)
      .join(" · "),
    alternates: { canonical: `/departamentos/${dep.slug}` },
    openGraph: {
      title: titulo,
      description: dep.resumen,
      url: `${base}/departamentos/${dep.slug}`,
      images: [imagenAlCompartirDe(dep.fotos[0], `${ed?.nombre} · ${dep.nombre}`)],
    },
  };
}

export default async function PaginaDepartamento({ params }: Props) {
  const { slug } = await params;
  const dep = departamentos.find((d) => d.slug === slug);
  if (!dep) notFound();

  const ed = buscarEdificio(dep.edificioId)!;

  const datos = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: `${ed.nombre} — ${dep.nombre}`,
    description: dep.descripcion,
    image: dep.fotos,
    numberOfRooms: dep.dormitorios,
    occupancy: { "@type": "QuantitativeValue", maxValue: dep.capacidad },
    ...(dep.metros > 0
      ? { floorSize: { "@type": "QuantitativeValue", value: dep.metros, unitCode: "MTK" } }
      : {}),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(dep.puntaje),
      reviewCount: String(dep.opiniones),
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: ed.direccion,
      addressLocality: sitio.ciudad,
      addressRegion: sitio.provincia,
      addressCountry: "AR",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
      />
      <FichaDepartamento slug={slug} />
    </>
  );
}
