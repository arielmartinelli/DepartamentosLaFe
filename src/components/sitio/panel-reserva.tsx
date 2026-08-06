"use client";

import { CalendarCheck, CircleAlert, MessageCircle, Send, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Entrada, Etiqueta } from "@/components/ui/campo";
import { Modal } from "@/components/ui/modal";
import { useContenido } from "@/lib/contenido";
import { useSesion } from "@/lib/sesion";
import { tramoLibre } from "@/lib/disponibilidad";
import { sitio } from "@/lib/site";
import type { Departamento } from "@/lib/tipos";
import { cn, formatearFecha, formatearPrecio, noches } from "@/lib/utils";

export type Estadia = { desde: string; hasta: string; personas: number };

export function PanelReserva({
  dep,
  edificio,
  estadia,
  onCambio,
}: {
  dep: Departamento;
  edificio: string;
  estadia: Estadia;
  onCambio: (e: Estadia) => void;
}) {
  const { reservas, bloqueos, crearConsulta, ajustes } = useContenido();
  const { cuenta } = useSesion();

  const { desde, hasta, personas } = estadia;

  const sumarDia = (iso: string) =>
    new Date(new Date(`${iso}T12:00:00`).getTime() + 86_400_000).toISOString().slice(0, 10);

  /* Si la entrada pasa a la salida, la salida se corre un día: nunca queda inválido. */
  const setDesde = (v: string) =>
    onCambio({ ...estadia, desde: v, hasta: v >= hasta ? sumarDia(v) : hasta });
  const setHasta = (v: string) =>
    onCambio({ ...estadia, hasta: v <= desde ? sumarDia(desde) : v });
  const setPersonas = (v: number) => onCambio({ ...estadia, personas: v });

  const [abierto, setAbierto] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [texto, setTexto] = useState("");

  const cantidad = noches(desde, hasta);
  const total = cantidad * dep.precioNoche;

  const propias = useMemo(
    () => reservas.filter((r) => r.departamentoId === dep.id),
    [reservas, dep.id],
  );
  const bloqueosPropios = useMemo(
    () => bloqueos.filter((b) => b.departamentoId === dep.id),
    [bloqueos, dep.id],
  );

  const estado = useMemo(() => {
    if (cantidad <= 0) return { tipo: "invalido" as const };
    const r = tramoLibre(desde, hasta, propias, bloqueosPropios);
    return r.libre
      ? { tipo: "libre" as const }
      : { tipo: "ocupado" as const, dia: r.primerOcupado! };
  }, [desde, hasta, cantidad, propias, bloqueosPropios]);

  const mensajeBase = useMemo(
    () =>
      `Hola, escribo desde la web de ${sitio.nombre}.\n\nMe interesa ${edificio} — ${dep.nombre} del ${formatearFecha(desde, "larga")} al ${formatearFecha(hasta, "larga")}, para ${personas} ${personas === 1 ? "persona" : "personas"} (${cantidad} ${cantidad === 1 ? "noche" : "noches"}).\n\n¿Está disponible? Gracias.`,
    [edificio, dep.nombre, desde, hasta, personas, cantidad],
  );

  const abrirConsulta = () => {
    setTexto(mensajeBase);
    setNombre(cuenta?.nombre ?? "");
    setEmail(cuenta?.email ?? "");
    setTelefono(cuenta?.telefono ?? "");
    setEnviado(false);
    setAbierto(true);
  };

  const registrar = (canal: "Web" | "WhatsApp") =>
    crearConsulta({
      nombre: nombre.trim() || cuenta?.nombre || "Visitante sin identificar",
      email: email.trim(),
      telefono: telefono.trim(),
      departamentoId: dep.id,
      desde,
      hasta,
      personas,
      mensaje: texto.trim() || mensajeBase,
      canal,
      cuentaId: cuenta?.id ?? null,
    });

  const porWhatsApp = () => {
    registrar("WhatsApp");
    window.open(
      `https://wa.me/${ajustes.whatsapp}?text=${encodeURIComponent(texto.trim() || mensajeBase)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setEnviado(true);
  };

  const porLaWeb = () => {
    registrar("Web");
    setEnviado(true);
  };

  const celda = "flex flex-col gap-0.5 px-4 py-3 text-left";
  const rotulo = "text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-texto-tenue";
  const valor = "w-full bg-transparent text-[0.875rem] font-medium text-ink outline-none";

  return (
    <>
      <div className="rounded-xl border border-linea bg-white p-5 shadow-carta sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[0.95rem] text-texto-suave">
            <span className="font-display text-[1.75rem] text-ink">
              {formatearPrecio(dep.precioNoche)}
            </span>{" "}
            la noche
          </p>
          <span className="flex shrink-0 items-center gap-1 text-[0.85rem] text-ink">
            <Star className="size-3.5 fill-ink text-ink" strokeWidth={0} aria-hidden />
            <span className="tabular-nums">{dep.puntaje.toFixed(2)}</span>
          </span>
        </div>

        <div className="mt-5 overflow-hidden rounded-md border border-linea">
          <div className="grid grid-cols-2 divide-x divide-linea border-b border-linea">
            <label className={celda}>
              <span className={rotulo}>Llegada</span>
              <input
                type="date"
                value={desde}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDesde(e.target.value)}
                className={valor}
              />
            </label>
            <label className={celda}>
              <span className={rotulo}>Salida</span>
              <input
                type="date"
                value={hasta}
                min={desde}
                onChange={(e) => setHasta(e.target.value)}
                className={valor}
              />
            </label>
          </div>
          <label className={celda}>
            <span className={rotulo}>Huéspedes</span>
            <select
              value={personas}
              onChange={(e) => setPersonas(Number(e.target.value))}
              className={`${valor} flecha-selector !bg-[position:right_0_center] !pr-5`}
            >
              {Array.from({ length: dep.capacidad }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "huésped" : "huéspedes"}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Disponibilidad real contra reservas y bloqueos */}
        <div
          aria-live="polite"
          className={cn(
            "mt-4 flex items-start gap-2.5 rounded-md px-3.5 py-3 text-[0.82rem] leading-snug",
            estado.tipo === "libre" && "bg-exito/8 text-exito",
            estado.tipo === "ocupado" && "bg-aviso/10 text-aviso",
            estado.tipo === "invalido" && "bg-hueso text-texto-suave",
          )}
        >
          {estado.tipo === "libre" ? (
            <>
              <CalendarCheck className="mt-px size-4 shrink-0" strokeWidth={1.8} aria-hidden />
              <span>
                Disponible para esas fechas. {cantidad}{" "}
                {cantidad === 1 ? "noche" : "noches"} en {dep.nombre}.
              </span>
            </>
          ) : estado.tipo === "ocupado" ? (
            <>
              <CircleAlert className="mt-px size-4 shrink-0" strokeWidth={1.8} aria-hidden />
              <span>
                Ocupado desde el {formatearFecha(estado.dia)}. Consultanos igual: solemos
                tener liberaciones.
              </span>
            </>
          ) : (
            <span>Elegí una fecha de salida posterior a la de llegada.</span>
          )}
        </div>

        <Boton
          variante="oro"
          medida="lg"
          className="mt-4 w-full gap-2"
          onClick={abrirConsulta}
          disabled={cantidad <= 0}
        >
          <MessageCircle strokeWidth={1.8} aria-hidden />
          Consultar
        </Boton>

        <p className="mt-3 text-center text-[0.78rem] text-texto-tenue">
          No se cobra nada por consultar. También podés elegir las fechas en el{" "}
          <a href="#disponibilidad" className="underline underline-offset-2 hover:text-ink">
            calendario
          </a>
          .
        </p>

        {cantidad > 0 ? (
          <dl className="mt-6 space-y-3 border-t border-linea pt-5 text-[0.875rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-texto-suave">
                {formatearPrecio(dep.precioNoche)} × {cantidad}{" "}
                {cantidad === 1 ? "noche" : "noches"}
              </dt>
              <dd className="tabular-nums text-ink">{formatearPrecio(total)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-texto-suave">Limpieza final</dt>
              <dd className="text-exito">Incluida</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-linea pt-3 font-semibold">
              <dt className="text-ink">Total estimado</dt>
              <dd className="tabular-nums text-ink">{formatearPrecio(total)}</dd>
            </div>
            <p className="text-[0.76rem] leading-relaxed text-texto-tenue">
              El precio final puede variar según la temporada. Te lo confirmamos al
              responder.
            </p>
          </dl>
        ) : null}
      </div>

      <Modal
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        titulo={enviado ? "Consulta registrada" : "Revisá el mensaje antes de enviarlo"}
        descripcion={
          enviado
            ? undefined
            : "Podés editar el texto. Queda registrado para que podamos responderte aunque cierres WhatsApp."
        }
        pie={
          enviado ? (
            <Boton variante="principal" medida="sm" onClick={() => setAbierto(false)}>
              Cerrar
            </Boton>
          ) : (
            <>
              <Boton variante="fantasma" medida="sm" onClick={() => setAbierto(false)}>
                Cancelar
              </Boton>
              <Boton variante="contorno" medida="sm" onClick={porLaWeb}>
                <Send strokeWidth={1.7} aria-hidden />
                Enviar sin WhatsApp
              </Boton>
              <Boton variante="oro" medida="sm" onClick={porWhatsApp}>
                <MessageCircle strokeWidth={1.8} aria-hidden />
                Abrir WhatsApp
              </Boton>
            </>
          )
        }
      >
        {enviado ? (
          <div className="py-6 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-exito/10 text-exito">
              <Send className="size-5" strokeWidth={1.7} aria-hidden />
            </span>
            <p className="mt-5 font-display text-xl text-ink">Ya la tenemos</p>
            <p className="mx-auto mt-2 max-w-sm text-[0.9rem] leading-relaxed text-texto-suave">
              Tu consulta quedó registrada. Respondemos todos los días de 9 a 21 h.
              {cuenta
                ? " Podés seguir la conversación desde “Mis consultas”."
                : " Si creás una cuenta vas a poder seguir la conversación desde la web."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md bg-hueso p-4 text-[0.85rem] text-texto-suave">
              <span className="font-semibold text-ink">{edificio} · {dep.nombre}</span>
              <br />
              {formatearFecha(desde, "larga")} → {formatearFecha(hasta, "larga")} ·{" "}
              {personas} {personas === 1 ? "huésped" : "huéspedes"} · {cantidad}{" "}
              {cantidad === 1 ? "noche" : "noches"}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Etiqueta htmlFor="c-nombre">Tu nombre</Etiqueta>
                <Entrada
                  id="c-nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ana Gutiérrez"
                  autoComplete="name"
                />
              </div>
              <div>
                <Etiqueta htmlFor="c-tel">Teléfono</Etiqueta>
                <Entrada
                  id="c-tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+54 9 11 5555 5555"
                  autoComplete="tel"
                />
              </div>
              <div className="sm:col-span-2">
                <Etiqueta htmlFor="c-mail">Correo (opcional)</Etiqueta>
                <Entrada
                  id="c-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ana@correo.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <Etiqueta htmlFor="c-texto">Mensaje</Etiqueta>
              <AreaTexto
                id="c-texto"
                rows={7}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
