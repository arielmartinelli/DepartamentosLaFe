import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FichaDepartamento } from "@/components/sitio/ficha-departamento";
import { buscarEdificio, departamentos } from "@/lib/data";
import { sitio } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return departamentos.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dep = departamentos.find((d) => d.slug === slug);
  if (!dep) return {};
  const ed = buscarEdificio(dep.edificioId);

  const titulo = `${ed?.nombre} · ${dep.nombre} — alquiler temporario en Ushuaia`;
  return {
    title: titulo,
    description: `${dep.resumen} Hasta ${dep.capacidad} huéspedes, ${dep.metros} m², cocina equipada y calefacción. Alojamiento familiar en Ushuaia.`,
    alternates: { canonical: `/departamentos/${dep.slug}` },
    openGraph: {
      title: titulo,
      description: dep.resumen,
      url: `${sitio.url}/departamentos/${dep.slug}`,
      images: [{ url: dep.fotos[0] }],
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
    floorSize: { "@type": "QuantitativeValue", value: dep.metros, unitCode: "MTK" },
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
