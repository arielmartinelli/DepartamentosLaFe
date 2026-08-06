"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowLeftRight,
  Check,
  ExternalLink,
  ImagePlus,
  Lock,
  Plus,
  Star,
  Trash2,
  Unlock,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { EstadoReservaTag } from "@/components/admin/estado";
import { ListaTexto } from "@/components/admin/lista-texto";
import { Panel, PanelCabecera } from "@/components/admin/tarjeta";
import { Foto } from "@/components/sitio/foto";
import { iconos } from "@/components/sitio/iconos-servicio";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Entrada, Etiqueta, Selector } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { Modal } from "@/components/ui/modal";
import { useContenido } from "@/lib/contenido";
import { nuevoId } from "@/lib/repositorio";
import type { Bloqueo, Departamento, EstadoDepto, Reserva } from "@/lib/tipos";
import { cn, formatearFecha, formatearPrecio, noches, slugificar } from "@/lib/utils";

const solapas = [
  { id: "info", etiqueta: "Información" },
  { id: "servicios", etiqueta: "Servicios" },
  { id: "galeria", etiqueta: "Galería" },
  { id: "disponibilidad", etiqueta: "Disponibilidad" },
] as const;

type Solapa = (typeof solapas)[number]["id"];

export default function EditorDepartamento() {
  const { id } = useParams<{ id: string }>();
  const {
    departamentos,
    edificios,
    prestaciones,
    reservas,
    bloqueos,
    guardarDepartamento,
    guardarBloqueo,
    eliminarBloqueo,
    guardarReserva,
    eliminarReserva,
  } = useContenido();

  const original = departamentos.find((d) => d.id === id);
  const [borrador, setBorrador] = useState<Departamento | null>(null);
  const [solapa, setSolapa] = useState<Solapa>("info");
  const [guardado, setGuardado] = useState(false);
  const [nuevaFoto, setNuevaFoto] = useState<string | null>(null);
  const [bloqueo, setBloqueo] = useState<Bloqueo | null>(null);
  const [reserva, setReserva] = useState<Reserva | null>(null);

  const dep = borrador ?? original;

  const misReservas = useMemo(
    () => reservas.filter((r) => r.departamentoId === id).sort((a, b) => a.desde.localeCompare(b.desde)),
    [reservas, id],
  );
  const misBloqueos = useMemo(
    () => bloqueos.filter((b) => b.departamentoId === id).sort((a, b) => a.desde.localeCompare(b.desde)),
    [bloqueos, id],
  );

  if (!dep) {
    return (
      <>
        <EncabezadoPagina titulo="Departamento no encontrado" />
        <Boton asChild variante="contorno" medida="sm">
          <Link href="/admin/departamentos">Volver al listado</Link>
        </Boton>
      </>
    );
  }

  const edificio = edificios.find((e) => e.id === dep.edificioId);
  const editar = (cambios: Partial<Departamento>) => {
    setBorrador({ ...dep, ...cambios });
    setGuardado(false);
  };

  const guardar = () => {
    guardarDepartamento({ ...dep, slug: dep.slug || slugificar(`${edificio?.nombre} ${dep.nombre}`) });
    setBorrador(null);
    setGuardado(true);
  };

  const moverFoto = (i: number, paso: -1 | 1) => {
    const j = i + paso;
    if (j < 0 || j >= dep.fotos.length) return;
    const copia = [...dep.fotos];
    [copia[i], copia[j]] = [copia[j], copia[i]];
    editar({ fotos: copia });
  };

  const hayCambios = borrador !== null;

  return (
    <>
      <Link
        href="/admin/departamentos"
        className="mb-5 inline-flex items-center gap-2 text-[0.82rem] font-medium text-texto-suave transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" strokeWidth={1.7} aria-hidden />
        Todos los departamentos
      </Link>

      <EncabezadoPagina
        titulo={`${edificio?.nombre} · ${dep.nombre}`}
        descripcion="Todo lo que se ve en la web de esta unidad se edita desde acá."
        acciones={
          <>
            <Boton asChild variante="contorno" medida="sm">
              <a href={`/departamentos/${dep.slug}`} target="_blank" rel="noopener noreferrer">
                Ver en la web
                <ExternalLink strokeWidth={1.6} />
              </a>
            </Boton>
            <Boton variante="principal" medida="sm" onClick={guardar} disabled={!hayCambios}>
              {guardado && !hayCambios ? <Check strokeWidth={2} /> : null}
              {guardado && !hayCambios ? "Guardado" : "Guardar cambios"}
            </Boton>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap gap-1.5">
        {solapas.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSolapa(s.id)}
            aria-pressed={solapa === s.id}
            className={cn(
              "rounded-full px-4 py-2 text-[0.85rem] font-medium transition-colors duration-200",
              solapa === s.id
                ? "bg-ink text-white"
                : "bg-white text-texto-suave ring-1 ring-linea hover:bg-hueso",
            )}
          >
            {s.etiqueta}
          </button>
        ))}
      </div>

      {/* ── Información ─────────────────────────────────────────── */}
      {solapa === "info" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <PanelCabecera titulo="Datos generales" detalle="Encabezado y tarjeta de la web" />
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <Etiqueta htmlFor="i-edificio">Edificio</Etiqueta>
                <Selector
                  id="i-edificio"
                  value={dep.edificioId}
                  onChange={(e) => editar({ edificioId: e.target.value })}
                >
                  {edificios.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nombre}
                    </option>
                  ))}
                </Selector>
              </div>
              <div>
                <Etiqueta htmlFor="i-nombre">Nombre</Etiqueta>
                <Entrada id="i-nombre" value={dep.nombre} onChange={(e) => editar({ nombre: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Etiqueta htmlFor="i-piso">Ubicación dentro del edificio</Etiqueta>
                <Entrada id="i-piso" value={dep.piso} onChange={(e) => editar({ piso: e.target.value })} placeholder="Primer piso, frente" />
              </div>
              <div className="sm:col-span-2">
                <Etiqueta htmlFor="i-resumen">Resumen (tarjetas y encabezado)</Etiqueta>
                <Entrada id="i-resumen" value={dep.resumen} onChange={(e) => editar({ resumen: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Etiqueta htmlFor="i-desc">Descripción</Etiqueta>
                <AreaTexto id="i-desc" rows={5} value={dep.descripcion} onChange={(e) => editar({ descripcion: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Etiqueta htmlFor="i-extra">Párrafo adicional</Etiqueta>
                <AreaTexto id="i-extra" rows={3} value={dep.parrafoExtra} onChange={(e) => editar({ parrafoExtra: e.target.value })} />
              </div>
              <div>
                <Etiqueta htmlFor="i-vista">Vista</Etiqueta>
                <Entrada id="i-vista" value={dep.vista} onChange={(e) => editar({ vista: e.target.value })} />
              </div>
              <div>
                <Etiqueta htmlFor="i-estado">Estado</Etiqueta>
                <Selector
                  id="i-estado"
                  value={dep.estado}
                  onChange={(e) => editar({ estado: e.target.value as EstadoDepto })}
                >
                  <option value="disponible">Disponible</option>
                  <option value="reservado">Reservado</option>
                  <option value="ocupado">Ocupado</option>
                  <option value="mantenimiento">En mantenimiento</option>
                </Selector>
              </div>
            </div>
          </Panel>

          <div className="space-y-4">
            <Panel>
              <PanelCabecera titulo="Capacidad y precio" />
              <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                <div>
                  <Etiqueta htmlFor="i-cap">Capacidad</Etiqueta>
                  <Entrada id="i-cap" type="number" min={1} value={dep.capacidad} onChange={(e) => editar({ capacidad: Number(e.target.value) })} />
                </div>
                <div>
                  <Etiqueta htmlFor="i-dorm">Dormitorios</Etiqueta>
                  <Entrada id="i-dorm" type="number" min={0} value={dep.dormitorios} onChange={(e) => editar({ dormitorios: Number(e.target.value) })} />
                </div>
                <div>
                  <Etiqueta htmlFor="i-banos">Baños</Etiqueta>
                  <Entrada id="i-banos" type="number" min={1} value={dep.banos} onChange={(e) => editar({ banos: Number(e.target.value) })} />
                </div>
                <div>
                  <Etiqueta htmlFor="i-metros">Superficie (m²)</Etiqueta>
                  <Entrada id="i-metros" type="number" min={1} value={dep.metros} onChange={(e) => editar({ metros: Number(e.target.value) })} />
                </div>
                <div>
                  <Etiqueta htmlFor="i-precio">Precio por noche</Etiqueta>
                  <Entrada id="i-precio" type="number" min={0} step={1000} value={dep.precioNoche} onChange={(e) => editar({ precioNoche: Number(e.target.value) })} />
                </div>
                <div>
                  <Etiqueta htmlFor="i-puntaje">Puntaje mostrado</Etiqueta>
                  <Entrada id="i-puntaje" type="number" min={0} max={5} step={0.01} value={dep.puntaje} onChange={(e) => editar({ puntaje: Number(e.target.value) })} />
                </div>
              </div>
            </Panel>

            <Panel>
              <PanelCabecera titulo="Camas" detalle="Se muestran en “Dónde vas a dormir”" />
              <div className="space-y-3 p-5 sm:p-6">
                {dep.camas.map((c, i) => (
                  <div key={i} className="grid gap-2 rounded-md bg-hueso p-3 sm:grid-cols-[1fr_1fr_auto]">
                    <Entrada
                      aria-label="Ambiente"
                      value={c.ambiente}
                      placeholder="Dormitorio principal"
                      onChange={(e) => {
                        const copia = [...dep.camas];
                        copia[i] = { ...c, ambiente: e.target.value };
                        editar({ camas: copia });
                      }}
                    />
                    <Entrada
                      aria-label="Tipo de cama"
                      value={c.tipo}
                      placeholder="Cama matrimonial"
                      onChange={(e) => {
                        const copia = [...dep.camas];
                        copia[i] = { ...c, tipo: e.target.value };
                        editar({ camas: copia });
                      }}
                    />
                    <Boton
                      variante="fantasma"
                      medida="icono"
                      aria-label="Quitar cama"
                      className="text-alerta hover:bg-alerta/10"
                      onClick={() => editar({ camas: dep.camas.filter((_, k) => k !== i) })}
                    >
                      <Trash2 strokeWidth={1.6} />
                    </Boton>
                  </div>
                ))}
                <Boton
                  variante="suave"
                  medida="sm"
                  onClick={() => editar({ camas: [...dep.camas, { ambiente: "", tipo: "", cantidad: 1 }] })}
                >
                  <Plus strokeWidth={2} /> Agregar cama
                </Boton>
              </div>
            </Panel>

            <Panel>
              <PanelCabecera titulo="Cocina, baño y comodidades" />
              <div className="space-y-6 p-5 sm:p-6">
                <ListaTexto etiqueta="Cocina" valores={dep.cocina} onCambio={(v) => editar({ cocina: v })} marcador="Agregar a la cocina" />
                <ListaTexto etiqueta="Baño" valores={dep.bano} onCambio={(v) => editar({ bano: v })} marcador="Agregar al baño" />
                <ListaTexto etiqueta="Comodidades" valores={dep.comodidades} onCambio={(v) => editar({ comodidades: v })} marcador="Agregar comodidad" />
              </div>
            </Panel>
          </div>
        </div>
      ) : null}

      {/* ── Servicios ───────────────────────────────────────────── */}
      {solapa === "servicios" ? (
        <Panel>
          <PanelCabecera
            titulo="Servicios de esta unidad"
            detalle="Se listan en “Lo que ofrece este departamento”"
            accion={
              <Boton asChild variante="contorno" medida="sm">
                <Link href="/admin/servicios">Administrar el catálogo</Link>
              </Boton>
            }
          />
          <ul className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
            {prestaciones
              .slice()
              .sort((a, b) => a.orden - b.orden)
              .map((s) => {
                const activo = dep.servicios.includes(s.id);
                const Icono = iconos[s.icono];
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() =>
                        editar({
                          servicios: activo
                            ? dep.servicios.filter((x) => x !== s.id)
                            : [...dep.servicios, s.id],
                        })
                      }
                      aria-pressed={activo}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-md border p-4 text-left transition-colors duration-200",
                        activo ? "border-ink bg-ink text-white" : "border-linea bg-white hover:bg-hueso",
                      )}
                    >
                      {Icono ? (
                        <Icono
                          className={cn("mt-0.5 size-5 shrink-0", activo ? "text-oro-claro" : "text-oro")}
                          strokeWidth={1.4}
                          aria-hidden
                        />
                      ) : null}
                      <span className="min-w-0">
                        <span className={cn("block text-[0.9rem] font-semibold", activo ? "text-white" : "text-ink")}>
                          {s.nombre}
                        </span>
                        <span className={cn("mt-0.5 block text-[0.8rem] leading-snug", activo ? "text-white/55" : "text-texto-suave")}>
                          {s.descripcion}
                        </span>
                      </span>
                      {activo ? <Check className="ml-auto size-4 shrink-0 text-oro-claro" strokeWidth={2.4} aria-hidden /> : null}
                    </button>
                  </li>
                );
              })}
          </ul>
        </Panel>
      ) : null}

      {/* ── Galería ─────────────────────────────────────────────── */}
      {solapa === "galeria" ? (
        <Panel>
          <PanelCabecera
            titulo="Galería del departamento"
            detalle="La primera imagen es la principal: encabeza la ficha y las tarjetas."
            accion={
              <Boton variante="principal" medida="sm" onClick={() => setNuevaFoto("")}>
                <ImagePlus strokeWidth={1.8} /> Agregar imagen
              </Boton>
            }
          />
          {dep.fotos.length === 0 ? (
            <p className="px-6 py-14 text-center text-[0.88rem] text-texto-suave">
              Todavía no hay fotos. Agregá al menos una para que la ficha se vea completa.
            </p>
          ) : (
            <ul className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3 xl:grid-cols-4">
              {dep.fotos.map((src, i) => (
                <li key={src + i} className="overflow-hidden rounded-lg border border-linea bg-white">
                  <div className="relative">
                    <Foto src={src} alt={`Foto ${i + 1}`} sizes="25vw" className="aspect-4/3 w-full" />
                    {i === 0 ? (
                      <span className="absolute left-2.5 top-2.5">
                        <Insignia tono="blanco">
                          <Star className="size-3" fill="currentColor" strokeWidth={0} aria-hidden />
                          Principal
                        </Insignia>
                      </span>
                    ) : null}
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-ink/70 px-2 py-0.5 text-[0.68rem] font-semibold tabular-nums text-white">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 p-2.5">
                    <Boton variante="fantasma" medida="iconoSm" aria-label="Mover antes" disabled={i === 0} onClick={() => moverFoto(i, -1)}>
                      <ArrowLeftRight className="rotate-180" strokeWidth={1.7} />
                    </Boton>
                    <Boton variante="fantasma" medida="iconoSm" aria-label="Mover después" disabled={i === dep.fotos.length - 1} onClick={() => moverFoto(i, 1)}>
                      <ArrowLeftRight strokeWidth={1.7} />
                    </Boton>
                    <Boton
                      variante="fantasma"
                      medida="iconoSm"
                      aria-label="Marcar como principal"
                      className={i === 0 ? "text-oro" : ""}
                      onClick={() => editar({ fotos: [src, ...dep.fotos.filter((_, k) => k !== i)] })}
                    >
                      <Star strokeWidth={1.7} fill={i === 0 ? "currentColor" : "none"} />
                    </Boton>
                    <Boton
                      variante="fantasma"
                      medida="iconoSm"
                      aria-label="Eliminar imagen"
                      className="ml-auto text-alerta hover:bg-alerta/10"
                      onClick={() => editar({ fotos: dep.fotos.filter((_, k) => k !== i) })}
                    >
                      <Trash2 strokeWidth={1.6} />
                    </Boton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}

      {/* ── Disponibilidad ──────────────────────────────────────── */}
      {solapa === "disponibilidad" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <PanelCabecera
              titulo="Reservas"
              detalle="Ocupan fechas en el calendario público"
              accion={
                <Boton
                  variante="principal"
                  medida="sm"
                  onClick={() =>
                    setReserva({
                      id: nuevoId("res"),
                      codigo: `LF-${1000 + reservas.length + 1}`,
                      huesped: "",
                      email: "",
                      telefono: "",
                      departamentoId: dep.id,
                      desde: new Date().toISOString().slice(0, 10),
                      hasta: new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10),
                      personas: 2,
                      estado: "pendiente",
                      origen: "Web",
                      total: 0,
                    })
                  }
                >
                  <Plus strokeWidth={2} /> Nueva reserva
                </Boton>
              }
            />
            {misReservas.length === 0 ? (
              <p className="px-6 py-12 text-center text-[0.88rem] text-texto-suave">Sin reservas.</p>
            ) : (
              <ul className="divide-y divide-linea-suave">
                {misReservas.map((r) => (
                  <li key={r.id} className="flex items-start gap-3 px-5 py-4 sm:px-6">
                    <span className="min-w-0 grow">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-[0.88rem] font-medium text-ink">{r.huesped || "Sin nombre"}</span>
                        <EstadoReservaTag estado={r.estado} />
                      </span>
                      <span className="mt-1 block text-[0.78rem] tabular-nums text-texto-suave">
                        {formatearFecha(r.desde)} → {formatearFecha(r.hasta)} · {noches(r.desde, r.hasta)} noches ·{" "}
                        {formatearPrecio(r.total)}
                      </span>
                    </span>
                    <Boton variante="fantasma" medida="iconoSm" aria-label="Editar reserva" onClick={() => setReserva(r)}>
                      <Plus className="rotate-45" strokeWidth={1.7} />
                    </Boton>
                    <Boton
                      variante="fantasma"
                      medida="iconoSm"
                      aria-label="Eliminar reserva"
                      className="text-alerta hover:bg-alerta/10"
                      onClick={() => eliminarReserva(r.id)}
                    >
                      <Trash2 strokeWidth={1.6} />
                    </Boton>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <PanelCabecera
              titulo="Fechas cerradas"
              detalle="Bloqueos sin reserva detrás"
              accion={
                <Boton
                  variante="contorno"
                  medida="sm"
                  onClick={() =>
                    setBloqueo({
                      id: nuevoId("blq"),
                      departamentoId: dep.id,
                      desde: new Date().toISOString().slice(0, 10),
                      hasta: new Date(Date.now() + 86_400_000).toISOString().slice(0, 10),
                      motivo: "",
                    })
                  }
                >
                  <Lock strokeWidth={1.7} /> Cerrar fechas
                </Boton>
              }
            />
            {misBloqueos.length === 0 ? (
              <p className="px-6 py-12 text-center text-[0.88rem] text-texto-suave">
                No hay fechas cerradas a mano.
              </p>
            ) : (
              <ul className="divide-y divide-linea-suave">
                {misBloqueos.map((b) => (
                  <li key={b.id} className="flex items-start gap-3 px-5 py-4 sm:px-6">
                    <Lock className="mt-0.5 size-4 shrink-0 text-texto-tenue" strokeWidth={1.7} aria-hidden />
                    <span className="min-w-0 grow">
                      <span className="block text-[0.88rem] font-medium tabular-nums text-ink">
                        {formatearFecha(b.desde)} → {formatearFecha(b.hasta)}
                      </span>
                      <span className="block text-[0.78rem] text-texto-suave">
                        {noches(b.desde, b.hasta)} noches · {b.motivo || "Sin motivo"}
                      </span>
                    </span>
                    <Boton
                      variante="fantasma"
                      medida="iconoSm"
                      aria-label="Abrir estas fechas"
                      className="text-alerta hover:bg-alerta/10"
                      onClick={() => eliminarBloqueo(b.id)}
                    >
                      <Unlock strokeWidth={1.7} />
                    </Boton>
                  </li>
                ))}
              </ul>
            )}
            <p className="border-t border-linea px-5 py-4 text-[0.8rem] leading-relaxed text-texto-suave sm:px-6">
              También podés cerrar fechas haciendo clic en cualquier día libre del{" "}
              <Link href="/admin/calendario" className="font-medium text-ink underline underline-offset-4">
                calendario
              </Link>
              .
            </p>
          </Panel>
        </div>
      ) : null}

      {/* Modales */}
      <Modal
        abierto={nuevaFoto !== null}
        onCerrar={() => setNuevaFoto(null)}
        titulo="Agregar imagen"
        descripcion="Pegá la dirección de la imagen. Cuando conectemos el almacenamiento, este campo se reemplaza por la subida de archivos."
        pie={
          <>
            <Boton variante="fantasma" medida="sm" onClick={() => setNuevaFoto(null)}>
              Cancelar
            </Boton>
            <Boton
              variante="principal"
              medida="sm"
              onClick={() => {
                if (nuevaFoto?.trim()) editar({ fotos: [...dep.fotos, nuevaFoto.trim()] });
                setNuevaFoto(null);
              }}
            >
              Agregar
            </Boton>
          </>
        }
      >
        <Etiqueta htmlFor="f-url">Dirección de la imagen</Etiqueta>
        <Entrada
          id="f-url"
          value={nuevaFoto ?? ""}
          onChange={(e) => setNuevaFoto(e.target.value)}
          placeholder="/media/living-1.jpg"
        />
        <p className="mt-2 text-[0.8rem] text-texto-suave">
          Puede ser una ruta local (copiando el archivo a <code>public/media/</code>) o una
          dirección completa.
        </p>
      </Modal>

      <Modal
        abierto={Boolean(bloqueo)}
        onCerrar={() => setBloqueo(null)}
        titulo="Cerrar fechas"
        pie={
          <>
            <Boton variante="fantasma" medida="sm" onClick={() => setBloqueo(null)}>
              Cancelar
            </Boton>
            <Boton
              variante="principal"
              medida="sm"
              onClick={() => {
                if (bloqueo && noches(bloqueo.desde, bloqueo.hasta) > 0) guardarBloqueo(bloqueo);
                setBloqueo(null);
              }}
            >
              Cerrar fechas
            </Boton>
          </>
        }
      >
        {bloqueo ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Etiqueta htmlFor="bl-desde">Desde</Etiqueta>
              <Entrada id="bl-desde" type="date" value={bloqueo.desde} onChange={(e) => setBloqueo({ ...bloqueo, desde: e.target.value })} />
            </div>
            <div>
              <Etiqueta htmlFor="bl-hasta">Hasta (sin incluir)</Etiqueta>
              <Entrada id="bl-hasta" type="date" min={bloqueo.desde} value={bloqueo.hasta} onChange={(e) => setBloqueo({ ...bloqueo, hasta: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="bl-motivo">Motivo</Etiqueta>
              <Entrada id="bl-motivo" value={bloqueo.motivo} onChange={(e) => setBloqueo({ ...bloqueo, motivo: e.target.value })} placeholder="Mantenimiento, uso familiar…" />
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        abierto={Boolean(reserva)}
        onCerrar={() => setReserva(null)}
        titulo={reserva && reservas.some((r) => r.id === reserva.id) ? "Editar reserva" : "Nueva reserva"}
        pie={
          <>
            <Boton variante="fantasma" medida="sm" onClick={() => setReserva(null)}>
              Cancelar
            </Boton>
            <Boton
              variante="principal"
              medida="sm"
              onClick={() => {
                if (reserva) guardarReserva(reserva);
                setReserva(null);
              }}
            >
              Guardar
            </Boton>
          </>
        }
      >
        {reserva ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="rr-huesped">Huésped</Etiqueta>
              <Entrada id="rr-huesped" value={reserva.huesped} onChange={(e) => setReserva({ ...reserva, huesped: e.target.value })} />
            </div>
            <div>
              <Etiqueta htmlFor="rr-desde">Ingreso</Etiqueta>
              <Entrada id="rr-desde" type="date" value={reserva.desde} onChange={(e) => setReserva({ ...reserva, desde: e.target.value })} />
            </div>
            <div>
              <Etiqueta htmlFor="rr-hasta">Salida</Etiqueta>
              <Entrada id="rr-hasta" type="date" min={reserva.desde} value={reserva.hasta} onChange={(e) => setReserva({ ...reserva, hasta: e.target.value })} />
            </div>
            <div>
              <Etiqueta htmlFor="rr-personas">Huéspedes</Etiqueta>
              <Entrada id="rr-personas" type="number" min={1} value={reserva.personas} onChange={(e) => setReserva({ ...reserva, personas: Number(e.target.value) })} />
            </div>
            <div>
              <Etiqueta htmlFor="rr-total">Total</Etiqueta>
              <Entrada id="rr-total" type="number" min={0} step={1000} value={reserva.total} onChange={(e) => setReserva({ ...reserva, total: Number(e.target.value) })} />
            </div>
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="rr-estado">Estado</Etiqueta>
              <Selector
                id="rr-estado"
                value={reserva.estado}
                onChange={(e) => setReserva({ ...reserva, estado: e.target.value as Reserva["estado"] })}
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
                <option value="finalizada">Finalizada</option>
              </Selector>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
