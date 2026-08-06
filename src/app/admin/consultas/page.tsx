"use client";

import {
  Archive,
  ArchiveRestore,
  CalendarRange,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { Panel } from "@/components/admin/tarjeta";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Entrada, Etiqueta, Selector } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { Modal } from "@/components/ui/modal";
import { useContenido } from "@/lib/contenido";
import { urlWhatsApp } from "@/lib/site";
import type { ConsultaCompleta, EstadoConsulta } from "@/lib/tipos";
import { cn, formatearFecha, iniciales, noches } from "@/lib/utils";

const tono = { nueva: "oro", respondida: "exito", archivada: "neutro" } as const;
const rotulo = { nueva: "Nueva", respondida: "Respondida", archivada: "Archivada" };

const pestanas: { clave: "todas" | EstadoConsulta; etiqueta: string }[] = [
  { clave: "todas", etiqueta: "Todas" },
  { clave: "nueva", etiqueta: "Nuevas" },
  { clave: "respondida", etiqueta: "Respondidas" },
  { clave: "archivada", etiqueta: "Archivadas" },
];

export default function PaginaConsultas() {
  const {
    consultas,
    departamentos,
    edificios,
    cambiarEstadoConsulta,
    eliminarConsulta,
    responderConsulta,
  } = useContenido();

  const [pestana, setPestana] = useState<"todas" | EstadoConsulta>("todas");
  const [texto, setTexto] = useState("");
  const [depto, setDepto] = useState("todos");
  const [abierta, setAbierta] = useState<ConsultaCompleta | null>(null);
  const [respuesta, setRespuesta] = useState("");

  const nombreDepto = (id: string | null) => {
    if (!id) return "Consulta general";
    const d = departamentos.find((x) => x.id === id);
    if (!d) return "Departamento eliminado";
    return `${edificios.find((e) => e.id === d.edificioId)?.nombre} · ${d.nombre}`;
  };

  const lista = useMemo(
    () =>
      consultas
        .filter((c) => (pestana === "todas" ? true : c.estado === pestana))
        .filter((c) => (depto === "todos" ? true : c.departamentoId === depto))
        .filter((c) => {
          if (!texto.trim()) return true;
          const q = texto.toLowerCase();
          return (
            c.nombre.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.telefono.includes(q) ||
            c.mensaje.toLowerCase().includes(q)
          );
        })
        .sort((a, b) => b.fecha.localeCompare(a.fecha)),
    [consultas, pestana, depto, texto],
  );

  const contar = (clave: "todas" | EstadoConsulta) =>
    clave === "todas" ? consultas.length : consultas.filter((c) => c.estado === clave).length;

  const abrir = (c: ConsultaCompleta) => {
    setAbierta(c);
    setRespuesta("");
  };

  const actual = abierta ? consultas.find((c) => c.id === abierta.id) ?? abierta : null;

  return (
    <>
      <EncabezadoPagina
        titulo="Consultas"
        descripcion="Todo lo que llega del formulario de la web y de WhatsApp, con las fechas y el departamento que consultaron."
      />

      <Panel className="mb-4">
        <div className="grid gap-3 p-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <Etiqueta htmlFor="q-buscar">Buscar</Etiqueta>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-texto-tenue"
                strokeWidth={1.6}
                aria-hidden
              />
              <Entrada
                id="q-buscar"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Nombre, correo, teléfono o texto del mensaje"
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Etiqueta htmlFor="q-depto">Departamento</Etiqueta>
            <Selector id="q-depto" value={depto} onChange={(e) => setDepto(e.target.value)}>
              <option value="todos">Todos</option>
              {edificios.map((ed) => (
                <optgroup key={ed.id} label={ed.nombre}>
                  {departamentos
                    .filter((d) => d.edificioId === ed.id)
                    .map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nombre}
                      </option>
                    ))}
                </optgroup>
              ))}
            </Selector>
          </div>
        </div>
      </Panel>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {pestanas.map((p) => (
          <button
            key={p.clave}
            type="button"
            onClick={() => setPestana(p.clave)}
            aria-pressed={pestana === p.clave}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[0.82rem] font-medium transition-colors duration-200",
              pestana === p.clave
                ? "bg-ink text-white"
                : "bg-white text-texto-suave ring-1 ring-linea hover:bg-hueso",
            )}
          >
            {p.etiqueta}
            <span className="ml-1.5 tabular-nums opacity-55">{contar(p.clave)}</span>
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <Panel className="px-6 py-20 text-center">
          <p className="font-display text-lg text-ink">Bandeja vacía</p>
          <p className="mx-auto mt-2 max-w-sm text-[0.85rem] leading-relaxed text-texto-suave">
            No hay consultas con esos filtros. Las nuevas aparecen acá apenas alguien usa el
            botón Consultar de la web.
          </p>
        </Panel>
      ) : (
        <ul className="space-y-3">
          {lista.map((c) => (
            <li key={c.id}>
              <Panel
                className={cn(
                  "transition-shadow duration-200 ease-salida hover:shadow-carta",
                  c.estado === "nueva" && "border-oro/40",
                  c.estado === "archivada" && "opacity-70",
                )}
              >
                <div className="flex flex-wrap items-start gap-4 p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-hueso text-[0.78rem] font-bold text-ink">
                    {iniciales(c.nombre)}
                  </span>

                  <div className="min-w-0 grow">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <h2 className="font-sans text-[0.95rem] font-semibold text-ink">{c.nombre}</h2>
                      <Insignia tono={tono[c.estado]}>{rotulo[c.estado]}</Insignia>
                      <Insignia tono="contorno">{c.canal}</Insignia>
                      <span className="text-[0.76rem] text-texto-tenue">
                        {formatearFecha(c.fecha, "larga")}
                      </span>
                    </div>

                    <p className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.8rem] text-texto-suave">
                      <span className="font-medium text-ink">{nombreDepto(c.departamentoId)}</span>
                      {c.desde && c.hasta ? (
                        <span className="flex items-center gap-1.5">
                          <CalendarRange className="size-3.5 text-oro" strokeWidth={1.7} aria-hidden />
                          {formatearFecha(c.desde)} → {formatearFecha(c.hasta)} ·{" "}
                          {noches(c.desde, c.hasta)} noches
                        </span>
                      ) : null}
                      <span className="flex items-center gap-1.5">
                        <Users className="size-3.5 text-oro" strokeWidth={1.7} aria-hidden />
                        {c.personas} {c.personas === 1 ? "huésped" : "huéspedes"}
                      </span>
                    </p>

                    <p className="mt-3 line-clamp-2 max-w-3xl text-[0.9rem] leading-relaxed text-texto-suave">
                      {c.mensaje}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.8rem] text-texto-suave">
                      {c.email ? (
                        <a href={`mailto:${c.email}`} className="hover:text-ink">
                          {c.email}
                        </a>
                      ) : null}
                      {c.telefono ? (
                        <a href={`tel:${c.telefono}`} className="hover:text-ink">
                          {c.telefono}
                        </a>
                      ) : null}
                      {c.conversacion.length > 1 ? (
                        <span className="text-texto-tenue">
                          {c.conversacion.length} mensajes en la conversación
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    <Boton variante="principal" medida="sm" onClick={() => abrir(c)}>
                      Abrir
                    </Boton>
                    {c.estado !== "archivada" ? (
                      <Boton
                        variante="fantasma"
                        medida="icono"
                        aria-label={`Archivar consulta de ${c.nombre}`}
                        onClick={() => cambiarEstadoConsulta(c.id, "archivada")}
                      >
                        <Archive strokeWidth={1.6} />
                      </Boton>
                    ) : (
                      <Boton
                        variante="fantasma"
                        medida="icono"
                        aria-label={`Desarchivar consulta de ${c.nombre}`}
                        onClick={() => cambiarEstadoConsulta(c.id, "nueva")}
                      >
                        <ArchiveRestore strokeWidth={1.6} />
                      </Boton>
                    )}
                    <Boton
                      variante="fantasma"
                      medida="icono"
                      aria-label={`Eliminar consulta de ${c.nombre}`}
                      className="text-alerta hover:bg-alerta/10"
                      onClick={() => eliminarConsulta(c.id)}
                    >
                      <Trash2 strokeWidth={1.6} />
                    </Boton>
                  </div>
                </div>
              </Panel>
            </li>
          ))}
        </ul>
      )}

      <Modal
        abierto={Boolean(actual)}
        onCerrar={() => setAbierta(null)}
        ancho="lg"
        titulo={actual ? `Consulta de ${actual.nombre}` : ""}
        descripcion={
          actual
            ? `${nombreDepto(actual.departamentoId)} · ${formatearFecha(actual.fecha, "larga")}`
            : ""
        }
        pie={
          actual ? (
            <>
              {actual.telefono ? (
                <Boton asChild variante="contorno" medida="sm">
                  <a href={`tel:${actual.telefono}`}>
                    <Phone strokeWidth={1.6} /> Llamar
                  </a>
                </Boton>
              ) : null}
              {actual.telefono ? (
                <Boton asChild variante="contorno" medida="sm">
                  <a
                    href={urlWhatsApp(`Hola ${actual.nombre.split(" ")[0]}, te escribimos de La Fe Departamentos.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle strokeWidth={1.7} /> WhatsApp
                  </a>
                </Boton>
              ) : null}
              {actual.email ? (
                <Boton asChild variante="contorno" medida="sm">
                  <a href={`mailto:${actual.email}`}>
                    <Mail strokeWidth={1.6} /> Correo
                  </a>
                </Boton>
              ) : null}
              <Boton
                variante="principal"
                medida="sm"
                disabled={!respuesta.trim()}
                onClick={() => {
                  if (actual && respuesta.trim()) {
                    responderConsulta(actual.id, respuesta.trim());
                    setRespuesta("");
                  }
                }}
              >
                <Send strokeWidth={1.7} /> Responder
              </Boton>
            </>
          ) : null
        }
      >
        {actual ? (
          <div className="space-y-5">
            <dl className="grid gap-x-6 gap-y-4 rounded-md bg-hueso p-4 sm:grid-cols-3">
              {[
                ["Fechas", actual.desde && actual.hasta ? `${formatearFecha(actual.desde)} → ${formatearFecha(actual.hasta)}` : "Sin especificar"],
                ["Huéspedes", `${actual.personas}`],
                ["Canal", actual.canal],
                ["Correo", actual.email || "—"],
                ["Teléfono", actual.telefono || "—"],
                ["Estado", rotulo[actual.estado]],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-texto-tenue">
                    {k}
                  </dt>
                  <dd className="mt-1 text-[0.86rem] text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <div>
              <h3 className="mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-texto-tenue">
                Conversación
              </h3>
              <ul className="space-y-3">
                {actual.conversacion.map((m) => (
                  <li
                    key={m.id}
                    className={
                      m.autor === "propietaria"
                        ? "ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-ink px-4 py-3 text-[0.88rem] leading-relaxed text-white"
                        : "mr-auto max-w-[85%] rounded-lg rounded-bl-sm bg-hueso px-4 py-3 text-[0.88rem] leading-relaxed text-texto"
                    }
                  >
                    <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.1em] opacity-55">
                      {m.autor === "propietaria" ? "Vos" : actual.nombre.split(" ")[0]} ·{" "}
                      {formatearFecha(m.fecha)}
                    </span>
                    <span className="whitespace-pre-line">{m.texto}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Etiqueta htmlFor="q-respuesta">Tu respuesta</Etiqueta>
              <AreaTexto
                id="q-respuesta"
                rows={5}
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder={`Hola ${actual.nombre.split(" ")[0]}, gracias por escribirnos…`}
              />
              <p className="mt-2 text-[0.78rem] text-texto-tenue">
                Al responder, la consulta pasa a “Respondida” y el visitante la ve en “Mis
                consultas” si tiene cuenta.
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
