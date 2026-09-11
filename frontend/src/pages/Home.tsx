import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DynamicQuoteCalculator, {
  type QuoteSummary,
} from "../components/DynamicQuoteCalculator";

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function Feature({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="border-l-2 border-cyan-300/70 pl-4">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-400">{detail}</p>
    </div>
  );
}

function InfoCard({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-white/10 bg-slate-950/70 p-6"
    >
      <span className="text-sm font-bold text-cyan-300">{number}</span>
      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
    </motion.article>
  );
}

export default function Home() {
  const [latestQuote, setLatestQuote] = useState<QuoteSummary | null>(null);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3 font-semibold tracking-tight">
            <motion.span
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400 font-black text-slate-950"
            >
              N
            </motion.span>
            <span>Nexo Hogar IA</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/software"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Licencia IA
            </Link>
            <a
              href="#cotizador"
              className="rounded-full border border-cyan-300/40 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-200 hover:bg-cyan-300/10"
            >
              Cotizar ahora
            </a>
          </nav>
        </div>
      </header>

      <section id="inicio" className="relative isolate pt-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:pb-24 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <p className="mb-5 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
              Domótica + IA privada
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Tu hogar no solo responde: aprende a cuidarte.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Automatización premium, voz natural y analítica local diseñada para
              que los datos de tu vivienda permanezcan en tu edificio, no en la nube.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              {["IA sin nube", "Voz en español", "Video local", "Diseño para constructoras"].map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/10"
                  >
                    {label}
                  </span>
                )
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="rounded-3xl border border-cyan-300/20 bg-slate-900/80 p-6 shadow-glow sm:p-8"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
              El diferenciador
            </p>
            <div className="mt-6 space-y-5">
              <Feature
                title="Privacidad por arquitectura"
                detail="VLAN por apartamento, procesamiento en el rack y control de retención."
              />
              <Feature
                title="Personalidad local"
                detail="Un asistente útil que conversa y controla escenarios dentro de reglas seguras."
              />
              <Feature
                title="Bienestar configurable"
                detail="Señales opt-in de tos, fatiga o marcha; no son diagnósticos médicos."
              />
            </div>
          </motion.div>
        </div>
      </section>

      <DynamicQuoteCalculator onRequestQuote={setLatestQuote} />

      {latestQuote && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          className="bg-slate-950 px-5 pb-12 sm:px-8"
        >
          <div className="mx-auto max-w-7xl rounded-2xl border border-emerald-400/25 bg-emerald-400/10 p-5 text-emerald-50">
            <p className="font-semibold">Cotización preparada para asesoría comercial.</p>
            <p className="mt-1 text-sm text-emerald-100/80">
              Total estimado: {currency.format(latestQuote.total)} para{" "}
              {latestQuote.totalItems} unidades y {latestQuote.totalInstallationPoints}{" "}
              puntos. Conecta este callback a tu CRM o API para persistirla.
            </p>
          </div>
        </motion.section>
      )}

      <section id="constructoras" className="border-y border-white/10 bg-slate-900/45 py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
            Constructoras
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Un paquete estándar por tipología; una infraestructura privada para todo el bloque.
          </h2>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            <InfoCard
              number="01"
              title="Tipología y paquete"
              text="Asigna el paquete 3 habitaciones / 2 baños a cada apartamento y conserva el precio por versión."
            />
            <InfoCard
              number="02"
              title="Rack centralizado"
              text="Modela racks, servidores, UPS, red y capacidad de voz/video sin mezclar datos entre apartamentos."
            />
            <InfoCard
              number="03"
              title="Soporte recurrente"
              text="Activa un plan mensual por apartamento para soporte, monitoreo y mantenimiento preventivo."
            />
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-5 py-9 text-sm text-slate-500 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Nexo Hogar IA. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link to="/software" className="transition hover:text-cyan-300">
              Licencia IA
            </Link>
            <Link to="/admin" className="transition hover:text-cyan-300">
              Admin
            </Link>
          </div>
        </div>
        <p className="mt-4 text-xs leading-5 text-slate-600">
          MVP de referencia. Toda cotización está sujeta a validación técnica, precios de proveedor
          y diseño eléctrico/red.
        </p>
      </footer>
    </main>
  );
}
