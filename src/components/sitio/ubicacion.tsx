import { Mapa } from "./mapa";
import { Revelar } from "./revelar";
import { edificios } from "@/lib/data";

export function Ubicacion() {
  return (
    <section id="ubicacion" className="scroll-mt-24 py-20 sm:py-28 lg:py-32">
      <div className="contenedor">
        <Revelar className="max-w-2xl">
          <h2 className="titulo-seccion">A doce cuadras del centro</h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-texto-suave">
            Los dos edificios están en el mismo barrio, a tres cuadras uno del otro. Zona
            tranquila, con vereda ancha y colectivo al Parque Nacional a dos cuadras.
          </p>
        </Revelar>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {edificios.map((ed, i) => (
            <Revelar key={ed.id} retraso={i * 0.08}>
              <Mapa
                lat={ed.coordenadas.lat}
                lng={ed.coordenadas.lng}
                titulo={ed.nombre}
                direccion={ed.direccion}
                alto="h-[19rem]"
                className="bg-white"
              />
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  );
}
