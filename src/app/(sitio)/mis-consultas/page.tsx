"use client";

import Link from "next/link";
import { LogOut, Send } from "lucide-react";
import { useState } from "react";
import { Boton } from "@/components/ui/boton";
import { AreaTexto } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { useContenido } from "@/lib/contenido";
import { esperaRespuestaDe, mensajesPendientes } from "@/lib/consultas";
import { useSesion } from "@/lib/sesion";
import { formatearFecha } from "@/lib/utils";

const tono = { nueva: "oro", respondida: "exito", archivada: "neutro" } as const;
const rotulo = { nueva: "Esperando respuesta", respondida: "Respondida", archivada: "Archivada" };

export default function PaginaMisConsultas() {
  const { cuenta, listo, salir } = useSesion();
  const { consultas, departamentos, edificios, responderConsulta } = useContenido();
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});

  if (!listo) {
    return <div className="contenedor min-h-[60svh] pt-40 text-texto-suave">Cargando…</div>;
  }

  if (!cuenta) {
    return (
      <div className="contenedor flex min-h-[70svh] flex-col items-center justify-center py-32 text-center">
        <h1 className="text-[clamp(1.9rem,4vw,2.6rem)] leading-tight">Entrá para ver tus consultas</h1>
        <p className="mt-4 max-w-md text-[1rem] leading-relaxed text-texto-suave">
          Necesitás una cuenta para seguir la conversación desde la web. Si preferís,
          escribinos por WhatsApp sin registrarte.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Boton asChild variante="principal" medida="lg" pastilla>
            <Link href="/entrar">Entrar</Link>
          </Boton>
          <Boton asChild variante="contorno" medida="lg" pastilla>
            <Link href="/crear-cuenta">Crear cuenta</Link>
          </Boton>
        </div>
      </div>
    );
  }

  const mias = consultas
    .filter((c) => c.cuentaId === cuenta.id || c.email.toLowerCase() === cuenta.email.toLowerCase())
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  const nombreDepto = (id: string | null) => {
    if (!id) return "Consulta general";
    const d = departamentos.find((x) => x.id === id);
    if (!d) return "Consulta general";
    return `${edificios.find((e) => e.id === d.edificioId)?.nombre} · ${d.nombre}`;
  };

  return (
    <div className="contenedor min-h-[70svh] pb-24 pt-28 sm:pt-32">
      <header className="flex flex-col gap-4 border-b border-linea pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[clamp(1.9rem,4vw,2.6rem)] leading-tight">Mis consultas</h1>
          <p className="mt-2 text-[0.95rem] text-texto-suave">
            {cuenta.nombre} · {cuenta.email}
          </p>
        </div>
        <Boton variante="contorno" medida="sm" onClick={() => void salir()}>
          <LogOut strokeWidth={1.7} aria-hidden />
          Cerrar sesión
        </Boton>
      </header>

      {mias.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="font-display text-2xl text-ink">Todavía no hiciste consultas</p>
          <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-texto-suave">
            Entrá a cualquier departamento y usá el botón Consultar. Acá vas a ver las
            respuestas y vas a poder seguir escribiendo.
          </p>
          <Boton asChild variante="principal" medida="lg" pastilla className="mt-8">
            <Link href="/#departamentos">Ver los departamentos</Link>
          </Boton>
        </div>
      ) : (
        <ul className="mt-10 space-y-6">
          {mias.map((c) => (
            <li
              key={c.id}
              className={
                esperaRespuestaDe(c) === "visitante"
                  ? "rounded-xl border border-oro/45 bg-white"
                  : "rounded-xl border border-linea bg-white"
              }
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linea px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-sans text-[0.95rem] font-semibold text-ink">
                    {nombreDepto(c.departamentoId)}
                  </h2>
                  <p className="mt-1 text-[0.8rem] text-texto-tenue">
                    Enviada el {formatearFecha(c.fecha, "larga")}
                    {c.desde && c.hasta
                      ? ` · ${formatearFecha(c.desde)} → ${formatearFecha(c.hasta)} · ${c.personas} ${c.personas === 1 ? "huésped" : "huéspedes"}`
                      : ""}
                  </p>
                </div>
                {esperaRespuestaDe(c) === "visitante" ? (
                  <Insignia tono="oro">
                    {mensajesPendientes(c) === 1
                      ? "1 mensaje nuevo"
                      : `${mensajesPendientes(c)} mensajes nuevos`}
                  </Insignia>
                ) : (
                  <Insignia tono={tono[c.estado]}>{rotulo[c.estado]}</Insignia>
                )}
              </div>

              <ul className="space-y-3 px-5 py-5 sm:px-6">
                {c.conversacion.map((m) => (
                  <li
                    key={m.id}
                    className={
                      m.autor === "visitante"
                        ? "ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-ink px-4 py-3 text-[0.9rem] leading-relaxed text-white"
                        : "mr-auto max-w-[85%] rounded-lg rounded-bl-sm bg-hueso px-4 py-3 text-[0.9rem] leading-relaxed text-texto"
                    }
                  >
                    <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] opacity-55">
                      {m.autor === "visitante" ? "Vos" : "La Fe"}
                    </span>
                    <span className="whitespace-pre-line">{m.texto}</span>
                  </li>
                ))}
              </ul>

              {c.estado !== "archivada" ? (
                <div className="border-t border-linea px-5 py-4 sm:px-6">
                  <AreaTexto
                    rows={3}
                    placeholder="Escribí tu respuesta…"
                    value={respuestas[c.id] ?? ""}
                    onChange={(e) => setRespuestas((r) => ({ ...r, [c.id]: e.target.value }))}
                  />
                  <Boton
                    variante="principal"
                    medida="sm"
                    className="mt-3"
                    disabled={!(respuestas[c.id] ?? "").trim()}
                    onClick={() => {
                      responderConsulta(c.id, respuestas[c.id].trim(), "visitante");
                      setRespuestas((r) => ({ ...r, [c.id]: "" }));
                    }}
                  >
                    <Send strokeWidth={1.7} aria-hidden />
                    Enviar
                  </Boton>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
