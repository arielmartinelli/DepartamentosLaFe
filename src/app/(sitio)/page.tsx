import { Cierre } from "@/components/sitio/cierre";
import { Edificios } from "@/components/sitio/edificios";
import { Estadia } from "@/components/sitio/estadia";
import { QueHacer } from "@/components/sitio/que-hacer";
import { Hero } from "@/components/sitio/hero";
import { Preguntas } from "@/components/sitio/preguntas";
import { Resenas } from "@/components/sitio/resenas";
import { Ubicacion } from "@/components/sitio/ubicacion";
import { departamentos, edificios, preguntas } from "@/lib/data";
import { foto } from "@/lib/imagenes";
import { imagenAlCompartir, sitio, urlBase } from "@/lib/site";

const negocio = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: sitio.nombre,
  description: sitio.descripcion,
  url: urlBase(),
  image: [`${urlBase()}${imagenAlCompartir.url}`, foto.fachada],
  telephone: sitio.contacto.telefono,
  email: sitio.contacto.email,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: sitio.contacto.direccion,
    addressLocality: sitio.ciudad,
    addressRegion: sitio.provincia,
    addressCountry: "AR",
  },
  geo: { "@type": "GeoCoordinates", latitude: -54.8021, longitude: -68.3095 },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.93", reviewCount: "231" },
  amenityFeature: [
    "WiFi con fibra óptica", "TV por cable", "Cocina-comedor equipada",
    "Desayuno seco", "Ropa de cama y toallas", "Secador de pelo", "Calefacción",
  ].map((n) => ({ "@type": "LocationFeatureSpecification", name: n, value: true })),
  containsPlace: departamentos.map((d) => ({
    "@type": "Accommodation",
    name: `${edificios.find((e) => e.id === d.edificioId)?.nombre} — ${d.nombre}`,
    occupancy: { "@type": "QuantitativeValue", maxValue: d.capacidad },
    ...(d.metros > 0
      ? { floorSize: { "@type": "QuantitativeValue", value: d.metros, unitCode: "MTK" } }
      : {}),
  })),
};

const faq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: preguntas.map((p) => ({
    "@type": "Question",
    name: p.pregunta,
    acceptedAnswer: { "@type": "Answer", text: p.respuesta },
  })),
};

export default function PaginaInicio() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([negocio, faq]) }}
      />
      <Hero />
      <Edificios />
      <QueHacer />
      <Estadia />
      <Resenas />
      <Ubicacion />
      <Preguntas />
      <Cierre />
    </>
  );
}
