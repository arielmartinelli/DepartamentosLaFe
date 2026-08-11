"use client";

import { Check, Pencil, Search, Trash2, X as Equis } from "lucide-react";
import { useMemo, useState } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { EstadoReservaTag } from "@/components/admin/estado";
import { Fila, SinResultados, Tabla, Td, Th } from "@/components/admin/tabla";
import { EsqueletoFilas } from "@/components/admin/esqueleto";
import { Panel } from "@/components/admin/tarjeta";
import { Boton } from "@/components/ui/boton";
import { Entrada, Etiqueta, Selector } from "@/components/ui/campo";
import { Modal } from "@/components/ui/modal";
import { useContenido } from "@/lib/contenido";
import { useCargandoInicial } from "@/lib/usar-carga";
import { nuevoId } from "@/lib/repositorio";
import type { EstadoReserva, Reserva } from "@/lib/tipos";
import { formatearFecha, formatearPrecio, iniciales, noches } from "@/lib/utils";

export default function PaginaReservas() {
  const {
    reservas,
    departamentos,
    edificios,
    guardarReserva,
    cambiarEstadoReserva,
    eliminarReserva,
  } = useContenido();

  const cargando = useCargandoInicial();
  const [texto, setTexto] = useState("");
  const [estado, setEstado] = useState<"todas" | EstadoReserva>("todas");
  const [depto, setDepto] = useState("todos");
  const [desde, setDesde] = useState("");
  const [editando, setEditando] = useState<Reserva | null>(null);
  const [borrando, setBorrando] = useState<Reserva | null>(null);

  const nombreDepto = (id: string) => {
    const d = departamentos.find((x) => x.id === id);
    if (!d) return "—";
    return `${edificios.find((e) => e.id === d.edificioId)?.nombre} · ${d.nombre}`;
  };

  const filtradas = useMemo(
    () =>
      reservas
        .filter((r) => (estado === "todas" ? true : r.estado === estado))
        .filter((r) => (depto === "todos" ? true : r.departamentoId === depto))
        .filter((r) => (desde ? r.hasta >= desde : true))
        .filter((r) => {
          if (!texto.trim()) return true;
          const q = texto.toLowerCase();
          return (
            r.huesped.toLowerCase().includes(q) ||
            r.email.toLowerCase().includes(q) ||
            r.codigo.toLowerCase().includes(q)
          );
        })
        .sort((a, b) => a.desde.localeCompare(b.desde)),
    [reservas, estado, depto, desde, texto],
  );

  const nueva = (): Reserva => ({
    id: nuevoId("res"),
    codigo: `LF-${1000 + reservas.length + 1}`,
    huesped: "",
    email: "",
    telefono: "",
    departamentoId: departamentos[0]?.id ?? "",
    desde: new Date().toISOString().slice(0, 10),
    hasta: new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10),
    personas: 2,
    estado: "pendiente",
    origen: "Web",
    total: 0,
  });

  return (
    <>
      <EncabezadoPagina
        titulo="Reservas"
        descripcion="Confirmá, editá o cancelá. Los cambios se reflejan en el calendario y en la disponibilidad de la web."
        acciones={
          <Boton variante="principal" medida="sm" onClick={() => setEditando(nueva())}>
            Cargar reserva
          </Boton>
        }
      />

      <Panel>
        <div className="grid gap-3 border-b border-linea p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Etiqueta htmlFor="r-buscar">Buscar</Etiqueta>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-texto-tenue"
                strokeWidth={1.6}
                aria-hidden
              />
              <Entrada
                id="r-buscar"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Huésped, correo o código"
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Etiqueta htmlFor="r-estado">Estado</Etiqueta>
            <Selector id="r-estado" value={estado} onChange={(e) => setEstado(e.target.value as typeof estado)}>
              <option value="todas">Todos</option>
              <option value="pendiente">Pendientes</option>
              <option value="confirmada">Confirmadas</option>
              <option value="cancelada">Canceladas</option>
              <option value="finalizada">Finalizadas</option>
            </Selector>
          </div>
          <div>
            <Etiqueta htmlFor="r-depto">Departamento</Etiqueta>
            <Selector id="r-depto" value={depto} onChange={(e) => setDepto(e.target.value)}>
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
          <div>
            <Etiqueta htmlFor="r-desde">Desde</Etiqueta>
            <Entrada id="r-desde" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </div>
        </div>

        {cargando ? (
          <EsqueletoFilas cantidad={5} />
        ) : filtradas.length === 0 ? (
          <SinResultados mensaje="No hay reservas que coincidan con los filtros aplicados." />
        ) : (
          <Tabla>
            <thead>
              <tr>
                <Th>Huésped</Th>
                <Th>Departamento</Th>
                <Th>Ingreso</Th>
                <Th>Salida</Th>
                <Th className="text-center">Pers.</Th>
                <Th>Estado</Th>
                <Th className="text-right">Total</Th>
                <Th className="text-right">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((r) => (
                <Fila key={r.id}>
                  <Td>
                    <span className="flex items-center gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-hueso text-[0.68rem] font-bold text-ink">
                        {iniciales(r.huesped)}
                      </span>
                      <span>
                        <span className="block font-medium text-ink">{r.huesped}</span>
                        <span className="block text-[0.75rem] text-texto-tenue">
                          {r.codigo} · {r.origen}
                        </span>
                      </span>
                    </span>
                  </Td>
                  <Td>{nombreDepto(r.departamentoId)}</Td>
                  <Td className="tabular-nums">{formatearFecha(r.desde)}</Td>
                  <Td className="tabular-nums">
                    {formatearFecha(r.hasta)}
                    <span className="block text-[0.72rem] text-texto-tenue">
                      {noches(r.desde, r.hasta)} noches
                    </span>
                  </Td>
                  <Td className="text-center tabular-nums">{r.personas}</Td>
                  <Td>
                    <EstadoReservaTag estado={r.estado} />
                  </Td>
                  <Td className="text-right font-medium tabular-nums text-ink">
                    {formatearPrecio(r.total)}
                  </Td>
                  <Td>
                    <span className="flex items-center justify-end gap-0.5">
                      <Boton
                        variante="fantasma"
                        medida="icono"
                        aria-label={`Editar reserva de ${r.huesped}`}
                        onClick={() => setEditando(r)}
                      >
                        <Pencil strokeWidth={1.6} />
                      </Boton>
                      {r.estado !== "confirmada" ? (
                        <Boton
                          variante="fantasma"
                          medida="icono"
                          aria-label={`Confirmar reserva de ${r.huesped}`}
                          className="text-exito hover:bg-exito/10"
                          onClick={() => cambiarEstadoReserva(r.id, "confirmada")}
                        >
                          <Check strokeWidth={1.9} />
                        </Boton>
                      ) : (
                        <Boton
                          variante="fantasma"
                          medida="icono"
                          aria-label={`Cancelar reserva de ${r.huesped}`}
                          className="text-aviso hover:bg-aviso/10"
                          onClick={() => cambiarEstadoReserva(r.id, "cancelada")}
                        >
                          <Equis strokeWidth={1.9} />
                        </Boton>
                      )}
                      <Boton
                        variante="fantasma"
                        medida="icono"
                        aria-label={`Eliminar reserva de ${r.huesped}`}
                        className="text-alerta hover:bg-alerta/10"
                        onClick={() => setBorrando(r)}
                      >
                        <Trash2 strokeWidth={1.6} />
                      </Boton>
                    </span>
                  </Td>
                </Fila>
              ))}
            </tbody>
          </Tabla>
        )}

        <div className="flex items-center justify-between gap-4 px-4 py-3 text-[0.8rem] text-texto-suave">
          <p>
            {filtradas.length} de {reservas.length} reservas
          </p>
          <p className="tabular-nums">
            Total filtrado:{" "}
            <span className="font-semibold text-ink">
              {formatearPrecio(filtradas.reduce((t, r) => t + r.total, 0))}
            </span>
          </p>
        </div>
      </Panel>

      <Modal
        abierto={Boolean(editando)}
        onCerrar={() => setEditando(null)}
        titulo={editando && reservas.some((r) => r.id === editando.id) ? "Editar reserva" : "Nueva reserva"}
        pie={
          <>
            <Boton variante="fantasma" medida="sm" onClick={() => setEditando(null)}>
              Cancelar
            </Boton>
            <Boton
              variante="principal"
              medida="sm"
              onClick={() => {
                if (editando) guardarReserva(editando);
                setEditando(null);
              }}
            >
              Guardar
            </Boton>
          </>
        }
      >
        {editando ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Etiqueta htmlFor="e-huesped">Huésped</Etiqueta>
              <Entrada
                id="e-huesped"
                value={editando.huesped}
                onChange={(e) => setEditando({ ...editando, huesped: e.target.value })}
              />
            </div>
            <div>
              <Etiqueta htmlFor="e-mail">Correo</Etiqueta>
              <Entrada
                id="e-mail"
                type="email"
                value={editando.email}
                onChange={(e) => setEditando({ ...editando, email: e.target.value })}
              />
            </div>
            <div>
              <Etiqueta htmlFor="e-tel">Teléfono</Etiqueta>
              <Entrada
                id="e-tel"
                value={editando.telefono}
                onChange={(e) => setEditando({ ...editando, telefono: e.target.value })}
              />
            </div>
            <div>
              <Etiqueta htmlFor="e-depto">Departamento</Etiqueta>
              <Selector
                id="e-depto"
                value={editando.departamentoId}
                onChange={(e) => setEditando({ ...editando, departamentoId: e.target.value })}
              >
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
            <div>
              <Etiqueta htmlFor="e-estado">Estado</Etiqueta>
              <Selector
                id="e-estado"
                value={editando.estado}
                onChange={(e) => setEditando({ ...editando, estado: e.target.value as EstadoReserva })}
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
                <option value="finalizada">Finalizada</option>
              </Selector>
            </div>
            <div>
              <Etiqueta htmlFor="e-desde">Ingreso</Etiqueta>
              <Entrada
                id="e-desde"
                type="date"
                value={editando.desde}
                onChange={(e) => setEditando({ ...editando, desde: e.target.value })}
              />
            </div>
            <div>
              <Etiqueta htmlFor="e-hasta">Salida</Etiqueta>
              <Entrada
                id="e-hasta"
                type="date"
                min={editando.desde}
                value={editando.hasta}
                onChange={(e) => setEditando({ ...editando, hasta: e.target.value })}
              />
            </div>
            <div>
              <Etiqueta htmlFor="e-personas">Huéspedes</Etiqueta>
              <Entrada
                id="e-personas"
                type="number"
                min={1}
                value={editando.personas}
                onChange={(e) => setEditando({ ...editando, personas: Number(e.target.value) })}
              />
            </div>
            <div>
              <Etiqueta htmlFor="e-total">Total</Etiqueta>
              <Entrada
                id="e-total"
                type="number"
                min={0}
                step={1000}
                value={editando.total}
                onChange={(e) => setEditando({ ...editando, total: Number(e.target.value) })}
              />
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        abierto={Boolean(borrando)}
        onCerrar={() => setBorrando(null)}
        ancho="sm"
        titulo="Eliminar reserva"
        descripcion={borrando ? `Se elimina ${borrando.codigo} de ${borrando.huesped}.` : ""}
        pie={
          <>
            <Boton variante="fantasma" medida="sm" onClick={() => setBorrando(null)}>
              Conservar
            </Boton>
            <Boton
              variante="peligro"
              medida="sm"
              onClick={() => {
                if (borrando) eliminarReserva(borrando.id);
                setBorrando(null);
              }}
            >
              Eliminar
            </Boton>
          </>
        }
      >
        <p className="text-[0.9rem] leading-relaxed text-texto-suave">
          Las fechas quedan liberadas en el calendario y en la web.
        </p>
      </Modal>
    </>
  );
}
