"use client";

import Image from "next/image";
import { Check, CreditCard, Download, Mail, MessageSquare, Percent, Upload, Users2 } from "lucide-react";
import { useRef, useState } from "react";
import { EncabezadoPagina } from "@/components/admin/encabezado";
import { Panel, PanelCabecera } from "@/components/admin/tarjeta";
import { CopiasSeguridad } from "@/components/admin/copias-seguridad";
import { EstadoBase } from "@/components/admin/estado-base";
import { RecuperarDatos } from "@/components/admin/recuperar-datos";
import { ZonaSubida } from "@/components/admin/zona-subida";
import { Foto } from "@/components/sitio/foto";
import { useResolverImagen } from "@/lib/usar-imagen";
import { Boton } from "@/components/ui/boton";
import { Entrada, Etiqueta } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { useContenido, type Ajustes } from "@/lib/contenido";
import { borrarTodo, exportarTodo, importarTodo } from "@/lib/repositorio";
import { exportarArchivos, importarArchivos } from "@/lib/archivos";

const integraciones = [
  { icono: CreditCard, titulo: "Pagos online", texto: "Cobrar la seña con Mercado Pago o tarjeta al confirmar." },
  { icono: MessageSquare, titulo: "WhatsApp Business API", texto: "Respuestas automáticas e instrucciones de check-in." },
  { icono: Mail, titulo: "Correos automáticos", texto: "Confirmación, recordatorio y pedido de reseña." },
  { icono: Percent, titulo: "Promociones y cupones", texto: "Descuentos por estadía larga o temporada baja." },
  { icono: Users2, titulo: "Usuarios y permisos", texto: "Acceso separado para recepción y limpieza." },
];

const campos: { clave: keyof Ajustes; etiqueta: string; tipo?: string }[] = [
  { clave: "telefono", etiqueta: "Teléfono" },
  { clave: "whatsapp", etiqueta: "WhatsApp (sólo números, con código de país)" },
  { clave: "email", etiqueta: "Correo electrónico", tipo: "email" },
  { clave: "horarios", etiqueta: "Horarios de atención" },
  { clave: "direccion", etiqueta: "Dirección" },
  { clave: "instagram", etiqueta: "Instagram", tipo: "url" },
  { clave: "facebook", etiqueta: "Facebook", tipo: "url" },
];

export default function PaginaConfiguracion() {
  const { ajustes, guardarAjustes } = useContenido();
  const resolver = useResolverImagen();
  const [borrador, setBorrador] = useState<Ajustes>(ajustes);
  const [guardado, setGuardado] = useState(false);
  const archivo = useRef<HTMLInputElement>(null);

  const editar = (clave: keyof Ajustes, valor: string) => {
    setBorrador({ ...borrador, [clave]: valor });
    setGuardado(false);
  };

  const descargar = async () => {
    const paquete = JSON.stringify(
      { ...JSON.parse(exportarTodo()), imagenes: await exportarArchivos() },
      null,
      2,
    );
    const blob = new Blob([paquete], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `la-fe-datos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <EncabezadoPagina
        titulo="Configuración"
        descripcion="Datos de contacto, marca y copia de seguridad. Lo que cambies acá se refleja en toda la web."
        acciones={
          <Boton
            variante="principal"
            medida="sm"
            onClick={() => {
              guardarAjustes(borrador);
              setGuardado(true);
            }}
          >
            {guardado ? <Check strokeWidth={2} /> : null}
            {guardado ? "Cambios guardados" : "Guardar cambios"}
          </Boton>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          <Panel>
            <PanelCabecera titulo="Contacto y redes" detalle="Aparece en el pie, en la sección de contacto y en los botones de WhatsApp" />
            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              {campos.map((c) => (
                <div key={String(c.clave)} className={c.clave === "direccion" ? "sm:col-span-2" : ""}>
                  <Etiqueta htmlFor={`c-${String(c.clave)}`}>{c.etiqueta}</Etiqueta>
                  <Entrada
                    id={`c-${String(c.clave)}`}
                    type={c.tipo ?? "text"}
                    value={borrador[c.clave]}
                    onChange={(e) => editar(c.clave, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelCabecera titulo="Marca" detalle="El logotipo va en el menú y el pie; la marca cuadrada identifica el panel." />
            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
              <div className="rounded-md border border-linea p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-texto-tenue">
                  Logotipo
                </p>
                <div className="mt-3 grid place-items-center rounded-sm bg-ink p-5">
                  <Image
                    src={resolver(borrador.logo)}
                    alt="Logotipo actual"
                    width={1200}
                    height={465}
                    unoptimized={resolver(borrador.logo).startsWith("data:")}
                    className="h-9 w-auto"
                  />
                </div>
                <ZonaSubida
                  compacta
                  className="mt-3"
                  onListo={([ref]) => editar("logo", ref)}
                  ayuda="Conviene un PNG con fondo transparente."
                />
                <Entrada
                  className="mt-2 h-10 text-[0.8rem]"
                  aria-label="Ruta del logotipo"
                  value={borrador.logo}
                  onChange={(e) => editar("logo", e.target.value)}
                />
              </div>

              <div className="rounded-md border border-linea p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-texto-tenue">
                  Marca del panel
                </p>
                <Foto src={borrador.marca} alt="Marca actual" sizes="200px" className="mt-3 aspect-square w-full rounded-sm" />
                <ZonaSubida
                  compacta
                  className="mt-3"
                  onListo={([ref]) => editar("marca", ref)}
                  ayuda="Cuadrada, se ve al lado del nombre en el panel."
                />
                <Entrada
                  className="mt-2 h-10 text-[0.8rem]"
                  aria-label="Ruta de la marca"
                  value={borrador.marca}
                  onChange={(e) => editar("marca", e.target.value)}
                />
              </div>

              <div className="rounded-md border border-linea p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-texto-tenue">
                  Imagen de portada
                </p>
                <Foto src={borrador.portada} alt="Portada actual" sizes="200px" className="mt-3 aspect-square w-full rounded-sm" />
                <ZonaSubida
                  compacta
                  className="mt-3"
                  onListo={([ref]) => editar("portada", ref)}
                  ayuda="Es la foto grande del inicio y del acceso al panel."
                />
                <Entrada
                  className="mt-2 h-10 text-[0.8rem]"
                  aria-label="Ruta de la portada"
                  value={borrador.portada}
                  onChange={(e) => editar("portada", e.target.value)}
                />
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelCabecera
              titulo="Copia de seguridad"
              detalle="Los datos viven en este navegador. Descargá una copia antes de cambiar de computadora."
            />
            <div className="flex flex-wrap gap-2 p-5 sm:p-6">
              <Boton variante="contorno" medida="sm" onClick={() => void descargar()}>
                <Download strokeWidth={1.7} /> Descargar copia
              </Boton>
              <Boton variante="contorno" medida="sm" onClick={() => archivo.current?.click()}>
                <Upload strokeWidth={1.7} /> Restaurar copia
              </Boton>
              <input
                ref={archivo}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const texto = await f.text();
                  try {
                    const paquete = JSON.parse(texto) as { imagenes?: Record<string, string> };
                    if (paquete.imagenes) await importarArchivos(paquete.imagenes);
                  } catch {
                    /* Copia sin imágenes: se restaura igual el resto. */
                  }
                  if (importarTodo(texto)) window.location.reload();
                }}
              />
              <Boton
                variante="peligro"
                medida="sm"
                onClick={() => {
                  borrarTodo();
                  window.location.reload();
                }}
              >
                Volver a los datos de ejemplo
              </Boton>
            </div>
          </Panel>

          <EstadoBase />

          <CopiasSeguridad />

          <RecuperarDatos />
        </div>

        <aside className="space-y-4">
          <Panel>
            <PanelCabecera titulo="Listo para crecer" detalle="El panel ya está estructurado para sumar estas funciones." />
            <ul className="space-y-4 p-5 sm:p-6">
              {integraciones.map(({ icono: Icono, titulo, texto }) => (
                <li key={titulo} className="flex gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-hueso text-texto-suave">
                    <Icono className="size-4" strokeWidth={1.5} aria-hidden />
                  </span>
                  <span>
                    <span className="flex items-center gap-2">
                      <span className="text-[0.86rem] font-semibold text-ink">{titulo}</span>
                      <Insignia tono="contorno">Próximo</Insignia>
                    </span>
                    <span className="mt-1 block text-[0.8rem] leading-relaxed text-texto-suave">
                      {texto}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="border-ink bg-ink">
            <div className="p-5 sm:p-6">
              <h2 className="font-sans text-[0.95rem] font-semibold text-white">Canales conectados</h2>
              <ul className="mt-4 space-y-3 text-[0.84rem]">
                {[
                  ["Web propia", true],
                  ["WhatsApp", true],
                  ["Booking.com", false],
                  ["Airbnb", false],
                ].map(([nombre, activo]) => (
                  <li key={String(nombre)} className="flex items-center justify-between gap-3">
                    <span className="text-white/70">{nombre}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.68rem] font-semibold ${
                        activo ? "bg-oro text-white" : "bg-white/10 text-white/45"
                      }`}
                    >
                      {activo ? "Activo" : "Sin conectar"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </aside>
      </div>
    </>
  );
}
