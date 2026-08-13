"use client";

import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Panel, PanelCabecera } from "@/components/admin/tarjeta";
import { Boton } from "@/components/ui/boton";
import { Entrada, Etiqueta } from "@/components/ui/campo";
import { useSesion } from "@/lib/sesion";

type Aviso = { ok: boolean; mensaje: string } | null;

/** Mostrar u ocultar lo que se escribe, para no equivocarse a ciegas. */
function ClaveConOjo({
  id,
  etiqueta,
  valor,
  alCambiar,
  autoComplete,
}: {
  id: string;
  etiqueta: string;
  valor: string;
  alCambiar: (v: string) => void;
  autoComplete: string;
}) {
  const [ver, setVer] = useState(false);

  return (
    <div>
      <Etiqueta htmlFor={id}>{etiqueta}</Etiqueta>
      <div className="relative">
        <Entrada
          id={id}
          type={ver ? "text" : "password"}
          autoComplete={autoComplete}
          required
          value={valor}
          onChange={(e) => alCambiar(e.target.value)}
          className="pr-12"
        />
        <button
          type="button"
          onClick={() => setVer((v) => !v)}
          aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-texto-tenue transition-colors hover:bg-hueso hover:text-ink"
        >
          {ver ? (
            <EyeOff className="size-4" strokeWidth={1.6} />
          ) : (
            <Eye className="size-4" strokeWidth={1.6} />
          )}
        </button>
      </div>
    </div>
  );
}

function Resultado({ aviso }: { aviso: Aviso }) {
  if (!aviso) return null;
  return (
    <p
      role="status"
      className={
        aviso.ok
          ? "rounded-sm bg-exito/10 px-3.5 py-2.5 text-[0.85rem] leading-relaxed text-exito"
          : "rounded-sm bg-alerta/8 px-3.5 py-2.5 text-[0.85rem] leading-relaxed text-alerta"
      }
    >
      {aviso.mensaje}
    </p>
  );
}

/**
 * Datos de acceso al panel.
 *
 * Los dos cambios piden la contraseña actual: si alguien se queda con la
 * sesión abierta en una computadora prestada, no puede apropiarse de la cuenta.
 */
export function Accesos() {
  const { cuenta, conBase, cambiarCorreoDeAcceso, cambiarClaveDeAcceso } = useSesion();

  const [correoNuevo, setCorreoNuevo] = useState("");
  const [claveDelCorreo, setClaveDelCorreo] = useState("");
  const [avisoCorreo, setAvisoCorreo] = useState<Aviso>(null);
  const [enviandoCorreo, setEnviandoCorreo] = useState(false);

  const [claveActual, setClaveActual] = useState("");
  const [claveNueva, setClaveNueva] = useState("");
  const [claveRepetida, setClaveRepetida] = useState("");
  const [avisoClave, setAvisoClave] = useState<Aviso>(null);
  const [enviandoClave, setEnviandoClave] = useState(false);

  if (!conBase) {
    return (
      <Panel>
        <PanelCabecera titulo="Datos de acceso" detalle="Tu correo y tu contraseña del panel." />
        <p className="p-5 text-[0.88rem] leading-relaxed text-texto-suave sm:p-6">
          Para cambiar el correo o la contraseña hace falta la base de datos conectada. Sin ella el
          panel funciona en modo demostración y no hay una cuenta real que modificar.
        </p>
      </Panel>
    );
  }

  const enviarCorreo = async (e: FormEvent) => {
    e.preventDefault();
    setAvisoCorreo(null);
    setEnviandoCorreo(true);
    const r = await cambiarCorreoDeAcceso(claveDelCorreo, correoNuevo);
    setEnviandoCorreo(false);
    setAvisoCorreo(r);
    if (r.ok) {
      setCorreoNuevo("");
      setClaveDelCorreo("");
    }
  };

  const enviarClave = async (e: FormEvent) => {
    e.preventDefault();
    setAvisoClave(null);

    if (claveNueva !== claveRepetida) {
      setAvisoClave({ ok: false, mensaje: "Las dos contraseñas nuevas no coinciden." });
      return;
    }

    setEnviandoClave(true);
    const r = await cambiarClaveDeAcceso(claveActual, claveNueva);
    setEnviandoClave(false);
    setAvisoClave(r);
    if (r.ok) {
      setClaveActual("");
      setClaveNueva("");
      setClaveRepetida("");
    }
  };

  return (
    <Panel>
      <PanelCabecera
        titulo="Datos de acceso"
        detalle={
          cuenta?.email
            ? `Hoy entrás con ${cuenta.email}. Para cambiar cualquiera de los dos te pedimos la contraseña actual.`
            : "Tu correo y tu contraseña del panel."
        }
      />

      <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-2 lg:gap-10">
        <form onSubmit={(e) => void enviarCorreo(e)} className="space-y-4">
          <h3 className="flex items-center gap-2 font-sans text-[0.9rem] font-semibold text-ink">
            <Mail className="size-4 text-oro" strokeWidth={1.8} aria-hidden />
            Correo de acceso
          </h3>

          <div>
            <Etiqueta htmlFor="correo-nuevo">Correo nuevo</Etiqueta>
            <Entrada
              id="correo-nuevo"
              type="email"
              autoComplete="email"
              required
              value={correoNuevo}
              onChange={(e) => setCorreoNuevo(e.target.value)}
              placeholder="maria@correo.com"
            />
          </div>

          <ClaveConOjo
            id="clave-para-correo"
            etiqueta="Tu contraseña actual"
            valor={claveDelCorreo}
            alCambiar={setClaveDelCorreo}
            autoComplete="current-password"
          />

          <Resultado aviso={avisoCorreo} />

          <Boton type="submit" variante="principal" medida="sm" disabled={enviandoCorreo}>
            {enviandoCorreo ? "Enviando…" : "Cambiar el correo"}
          </Boton>

          <p className="text-[0.78rem] leading-relaxed text-texto-tenue">
            El cambio no es inmediato: llega un correo a la dirección nueva y recién al abrir ese
            enlace queda activa. Mientras tanto seguís entrando con la de siempre.
          </p>
        </form>

        <form
          onSubmit={(e) => void enviarClave(e)}
          className="space-y-4 border-t border-linea pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
        >
          <h3 className="flex items-center gap-2 font-sans text-[0.9rem] font-semibold text-ink">
            <KeyRound className="size-4 text-oro" strokeWidth={1.8} aria-hidden />
            Contraseña
          </h3>

          <ClaveConOjo
            id="clave-actual"
            etiqueta="Contraseña actual"
            valor={claveActual}
            alCambiar={setClaveActual}
            autoComplete="current-password"
          />
          <ClaveConOjo
            id="clave-nueva"
            etiqueta="Contraseña nueva"
            valor={claveNueva}
            alCambiar={setClaveNueva}
            autoComplete="new-password"
          />
          <ClaveConOjo
            id="clave-repetida"
            etiqueta="Repetila"
            valor={claveRepetida}
            alCambiar={setClaveRepetida}
            autoComplete="new-password"
          />

          <Resultado aviso={avisoClave} />

          <Boton type="submit" variante="principal" medida="sm" disabled={enviandoClave}>
            {enviandoClave ? "Guardando…" : "Cambiar la contraseña"}
          </Boton>

          <p className="text-[0.78rem] leading-relaxed text-texto-tenue">
            Al menos 8 caracteres. Conviene que no la uses en ningún otro sitio.
          </p>
        </form>
      </div>
    </Panel>
  );
}
