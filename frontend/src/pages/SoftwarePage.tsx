import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Shield, RefreshCw, Wrench, CreditCard, ArrowLeft } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Privacidad total",
    text: 'Tu "Cerebro IA" procesa todo en un rack dentro del edificio. Audio, video y automatizaciones nunca salen a la nube.',
  },
  {
    icon: Cpu,
    title: "Licencia perpetua del software",
    text: 'Pagas una vez por la licencia del "Cerebro IA". Incluye el asistente de voz local, automatizaciones y panel de control.',
  },
  {
    icon: RefreshCw,
    title: "Actualizaciones mensuales",
    text: "Cada mes recibes mejoras de seguridad, nuevos modelos de IA, parches y optimizaciones sin costo adicional.",
  },
  {
    icon: Wrench,
    title: "Soporte y monitoreo",
    text: "Monitoreo 24/7 del rack, diagnóstico remoto y atención prioritaria para Incidencias técnicas.",
  },
  {
    icon: CreditCard,
    title: "Sin sorpresas",
    text: "Un solo pago mensual por apartamento. Sin cargos ocultos ni costos por actualización.",
  },
];

const pricingTiers = [
  {
    name: "Licencia del Cerebro IA",
    price: "$2.490.000",
    label: "Pago único por vivienda",
    features: [
      "Asistente de voz local en español",
      "Automatizaciones ilimitadas",
      "Panel táctil y app móvil",
      "Integración con dispositivos Matter/Zigbee",
    ],
    highlight: true,
  },
  {
    name: "Suscripción mensual",
    price: "$89.000",
    label: "Por apartamento / mes",
    features: [
      "Actualizaciones de IA mensuales",
      "Monitoreo 24/7 del rack central",
      "Soporte técnico prioritario",
      "Mantenimiento preventivo remoto",
    ],
    highlight: false,
  },
];

export default function SoftwarePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">
            <ArrowLeft size={18} />
            Volver al inicio
          </Link>
          <p className="text-sm text-slate-400">Nexo Hogar IA</p>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.12),transparent_50%)]" />
        <div className="mx-auto max-w-4xl px-5 pb-24 pt-16 text-center sm:px-8 sm:pt-20">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200"
          >
            Modelo de licenciamiento
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl"
          >
            Hardware básico + Cerebro IA ={" "}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              Hogar inteligente privado
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300"
          >
            No vendemos suscripciones de hardware. Vendemos la inteligencia que lo gobierna.
            Pagas una vez por los equipos y una cuota mensual por mantener tu cerebro IA
            actualizado, seguro y monitoreado.
          </motion.p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {pricingTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className={`relative rounded-3xl border p-8 ${
                tier.highlight
                  ? "border-cyan-300/40 bg-gradient-to-br from-slate-900 to-slate-950 shadow-lg shadow-cyan-950/40"
                  : "border-white/10 bg-slate-900/50"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-slate-950">
                  RECOMENDADO
                </span>
              )}
              <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{tier.label}</p>
              <p className="mt-4 text-4xl font-bold tracking-tight text-white">
                {tier.price}
              </p>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="mt-0.5 h-2 w-2 rounded-full bg-cyan-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/45 py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Beneficios del modelo
            </h2>
            <p className="mt-3 text-slate-400">
              Por qué cobramos por el software y no por el hardware
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-6"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <item.icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            ¿Listo para dar el salto?
          </h2>
          <p className="mt-4 text-slate-400">
            Cotiza tu proyecto hoy y descubre cuánto puedes ahorrar con IA privada.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/#cotizador"
              className="rounded-xl bg-cyan-400 px-8 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Cotizar ahora
            </Link>
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || ""}?text=Quiero%20recibir%20asesor%C3%ADa%20sobre%20la%20licencia%20del%20Cerebro%20IA`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5"
            >
              Hablar con asesor
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-5 py-9 text-sm text-slate-500 sm:px-8">
        <Link to="/" className="transition hover:text-cyan-300">
          &larr; Volver al inicio
        </Link>
      </footer>
    </main>
  );
}
