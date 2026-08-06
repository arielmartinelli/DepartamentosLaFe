import Link from "next/link";
import { Boton } from "@/components/ui/boton";

export default function NoEncontrada() {
  return (
    <section className="contenedor flex min-h-[70svh] flex-col justify-center py-32">
      <div className="max-w-xl">
        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-oro-oscuro">
          Error 404
        </p>
        <h1 className="mt-5 text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.03]">
          Esta página se perdió camino al fin del mundo
        </h1>
        <p className="mt-5 text-[1.05rem] leading-relaxed text-texto-suave">
          El enlace que seguiste no existe o cambió de dirección. Volvé al inicio o mirá
          los seis departamentos.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Boton asChild variante="principal" medida="lg" pastilla>
            <Link href="/">Volver al inicio</Link>
          </Boton>
          <Boton asChild variante="contorno" medida="lg" pastilla>
            <Link href="/#departamentos">Ver departamentos</Link>
          </Boton>
        </div>
      </div>
    </section>
  );
}
