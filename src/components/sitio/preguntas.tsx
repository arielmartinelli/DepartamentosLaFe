import { Plus } from "lucide-react";
import { Revelar } from "./revelar";
import { preguntas } from "@/lib/data";

export function Preguntas() {
  return (
    <section
      id="preguntas"
      aria-labelledby="preguntas-titulo"
      className="scroll-mt-24 py-20 sm:py-28 lg:py-32"
    >
      <div className="contenedor grid gap-10 lg:grid-cols-12 lg:gap-16">
        <Revelar className="lg:col-span-4">
          <h2 id="preguntas-titulo" className="titulo-seccion">
            Preguntas que nos suelen hacer
          </h2>
          <p className="mt-5 text-[1rem] leading-relaxed text-texto-suave">
            Si lo tuyo no está acá, escribinos por WhatsApp. Contestamos nosotros, no un
            centro de atención.
          </p>
        </Revelar>

        <div className="lg:col-span-8">
          <ul>
            {preguntas.map((p, i) => (
              <Revelar as="li" key={p.pregunta} retraso={i * 0.04}>
                <details className="group border-b border-linea">
                  <summary className="flex list-none items-start justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
                    <h3 className="font-sans text-[1rem] font-semibold leading-snug text-ink">
                      {p.pregunta}
                    </h3>
                    <Plus
                      className="mt-0.5 size-5 shrink-0 text-texto-suave transition-transform duration-200 ease-salida group-open:rotate-45"
                      strokeWidth={1.6}
                      aria-hidden
                    />
                  </summary>
                  <p className="max-w-2xl pb-7 pr-10 text-[0.95rem] leading-relaxed text-texto-suave">
                    {p.respuesta}
                  </p>
                </details>
              </Revelar>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
