import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, MessageCircle, Check } from "lucide-react";

type ProductId =
  | "smartBulb"
  | "smartOutlet"
  | "touchScreen"
  | "aiCamera"
  | "audioZone"
  | "localServer";

type Product = {
  id: ProductId;
  name: string;
  description: string;
  unitPrice: number;
  installationPoints: number;
  max: number;
};

export type QuoteLine = {
  id: ProductId;
  name: string;
  quantity: number;
  unitPrice: number;
  equipmentSubtotal: number;
  installationPoints: number;
};

export type QuoteSummary = {
  currency: "COP";
  generatedAt: string;
  totalItems: number;
  totalInstallationPoints: number;
  equipmentCost: number;
  installationCost: number;
  total: number;
  items: QuoteLine[];
};

type Props = {
  onRequestQuote?: (quote: QuoteSummary) => void;
  whatsappNumber?: string;
};

export const INSTALLATION_COST_PER_POINT = 110_000;

const PRODUCTS: Product[] = [
  {
    id: "smartBulb",
    name: "Bombillo inteligente",
    description: "Iluminación regulable, escenas y automatizaciones.",
    unitPrice: 145_000,
    installationPoints: 1,
    max: 100,
  },
  {
    id: "smartOutlet",
    name: "Toma / enchufe inteligente",
    description: "Control de cargas, consumo y automatizaciones.",
    unitPrice: 180_000,
    installationPoints: 1,
    max: 100,
  },
  {
    id: "touchScreen",
    name: "Pantalla touch",
    description: "Panel mural premium para control local de la vivienda.",
    unitPrice: 1_650_000,
    installationPoints: 1,
    max: 20,
  },
  {
    id: "aiCamera",
    name: "Cámara IA privada",
    description: "Analítica de video local, sin depender de la nube.",
    unitPrice: 1_490_000,
    installationPoints: 1,
    max: 50,
  },
  {
    id: "audioZone",
    name: "Zona de audio IA",
    description: "Micrófono y parlante para interacción natural por voz.",
    unitPrice: 2_450_000,
    installationPoints: 1,
    max: 20,
  },
  {
    id: "localServer",
    name: "Servidor local de IA",
    description: "Base privada para automatización, visión y asistentes locales.",
    unitPrice: 11_900_000,
    installationPoints: 1,
    max: 1,
  },
];

const emptyQuantities: Record<ProductId, number> = {
  smartBulb: 0,
  smartOutlet: 0,
  touchScreen: 0,
  aiCamera: 0,
  audioZone: 0,
  localServer: 0,
};

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function formatCOP(value: number) {
  return currency.format(value);
}

export function buildWhatsAppQuoteMessage(quote: QuoteSummary) {
  const items = quote.items
    .map((item) => `• ${item.quantity} × ${item.name}: ${formatCOP(item.equipmentSubtotal)}`)
    .join("\n");

  return [
    "Hola, quiero recibir asesoría para esta cotización preliminar:",
    "",
    items,
    "",
    `Equipos: ${formatCOP(quote.equipmentCost)}`,
    `Instalación (${quote.totalInstallationPoints} puntos): ${formatCOP(quote.installationCost)}`,
    `Total estimado: ${formatCOP(quote.total)}`,
  ].join("\n");
}

const productVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3 },
  }),
};

const summaryVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function DynamicQuoteCalculator({
  onRequestQuote,
  whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER,
}: Props) {
  const [quantities, setQuantities] = useState<Record<ProductId, number>>(emptyQuantities);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const totals = useMemo(() => {
    const items: QuoteLine[] = PRODUCTS.flatMap((product) => {
      const quantity = quantities[product.id];
      return quantity > 0
        ? [
            {
              id: product.id,
              name: product.name,
              quantity,
              unitPrice: product.unitPrice,
              equipmentSubtotal: quantity * product.unitPrice,
              installationPoints: quantity * product.installationPoints,
            },
          ]
        : [];
    });

    const equipmentCost = items.reduce((sum, item) => sum + item.equipmentSubtotal, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalInstallationPoints = items.reduce((sum, item) => sum + item.installationPoints, 0);
    const installationCost = totalInstallationPoints * INSTALLATION_COST_PER_POINT;

    return {
      items,
      totalItems,
      totalInstallationPoints,
      equipmentCost,
      installationCost,
      total: equipmentCost + installationCost,
    };
  }, [quantities]);

  function updateQuantity(id: ProductId, nextValue: number) {
    const product = PRODUCTS.find((item) => item.id === id);
    if (!product) return;
    const normalizedValue = Number.isFinite(nextValue) ? Math.floor(nextValue) : 0;
    const quantity = Math.max(0, Math.min(product.max, normalizedValue));
    setQuantities((current) => ({ ...current, [id]: quantity }));
  }

  function buildQuote(): QuoteSummary {
    return {
      currency: "COP",
      generatedAt: new Date().toISOString(),
      ...totals,
    };
  }

  function handleWhatsApp() {
    if (totals.totalItems === 0) return;
    const phone = (whatsappNumber || "").replace(/\D/g, "");
    const message = encodeURIComponent(buildWhatsAppQuoteMessage(buildQuote()));
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
  }

  function handleRequestQuote() {
    if (totals.totalItems === 0) return;
    if (onRequestQuote) {
      onRequestQuote(buildQuote());
    }
  }

  function handleSimulatePayment() {
    if (totals.totalItems === 0) return;
    setShowPaymentModal(true);
  }

  const canProceed = totals.totalItems > 0;
  const whatsappNumberOrDefault = whatsappNumber || "";

  return (
    <section id="cotizador" className="scroll-mt-20 bg-slate-950 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="mb-8 max-w-3xl"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Cotización inteligente
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Diseña una vivienda que anticipa lo importante.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Calcula una configuración inicial de domótica, IA local y automatización privada.
            Cada elemento equivale a un punto de instalación.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl shadow-cyan-950/30">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
              <h3 className="text-xl font-semibold">Selecciona tu solución</h3>
              <p className="mt-1 text-sm text-slate-500">
                Precios de referencia en COP; se ajustan según marcas, arquitectura y alcance final.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {PRODUCTS.map((product, i) => {
                const quantity = quantities[product.id];
                const isAtMax = quantity >= product.max;

                return (
                  <motion.div
                    key={product.id}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={productVariants}
                    className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-slate-900">{product.name}</h4>
                        {product.max === 1 && (
                          <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700">
                            Máximo 1 por vivienda
                          </span>
                        )}
                      </div>
                      <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">
                        {product.description}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {formatCOP(product.unitPrice)}
                        <span className="ml-1 font-normal text-slate-400">por unidad</span>
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                      <p className="text-sm text-slate-500">
                        {product.installationPoints} punto{product.installationPoints !== 1 ? "s" : ""}
                      </p>
                      <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          disabled={quantity === 0}
                          aria-label={`Disminuir ${product.name}`}
                          className="grid h-9 w-9 place-items-center rounded-lg text-lg font-medium text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
                        >
                          −
                        </button>
                        <label className="sr-only" htmlFor={`quantity-${product.id}`}>
                          Cantidad de {product.name}
                        </label>
                        <input
                          id={`quantity-${product.id}`}
                          type="number"
                          min="0"
                          max={product.max}
                          value={quantity}
                          onChange={(event) =>
                            updateQuantity(product.id, Number(event.target.value))
                          }
                          className="h-9 w-12 border-0 bg-transparent text-center text-sm font-semibold text-slate-900 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={isAtMax}
                          aria-label={`Aumentar ${product.name}`}
                          className="grid h-9 w-9 place-items-center rounded-lg text-lg font-medium text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:text-slate-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.aside
            key={totals.total}
            initial="hidden"
            animate="visible"
            variants={summaryVariants}
            className="h-fit rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 p-1 shadow-2xl shadow-cyan-950/40 lg:sticky lg:top-24"
          >
            <div aria-live="polite" className="rounded-[22px] bg-slate-950 p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-cyan-300">Resumen de inversión</p>
                  <h3 className="mt-1 text-2xl font-semibold">Tu configuración</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setQuantities(emptyQuantities)}
                  disabled={totals.totalItems === 0}
                  className="text-sm text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Limpiar
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={totals.totalItems}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="my-6 space-y-3 border-y border-white/10 py-5 text-sm"
                >
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-300">Equipos ({totals.totalItems} unidades)</span>
                    <span className="font-semibold">{formatCOP(totals.equipmentCost)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-300">
                      Instalación ({totals.totalInstallationPoints} puntos)
                    </span>
                    <span className="font-semibold">{formatCOP(totals.installationCost)}</span>
                  </div>
                  <p className="text-xs leading-5 text-slate-400">
                    Mano de obra: {formatCOP(INSTALLATION_COST_PER_POINT)} por punto de instalación.
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-end justify-between gap-4">
                <span className="text-base font-medium text-slate-200">Total estimado</span>
                <motion.span
                  key={totals.total}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-3xl font-bold tracking-tight"
                >
                  {formatCOP(totals.total)}
                </motion.span>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={!canProceed}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:from-cyan-300 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CreditCard size={18} />
                  Pagar Anticipo del 60%
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  disabled={!canProceed}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-400/30 bg-green-500/10 px-4 py-3.5 text-sm font-semibold text-green-300 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <MessageCircle size={18} />
                  Asesoría por WhatsApp
                </button>

                {onRequestQuote && (
                  <button
                    type="button"
                    onClick={handleRequestQuote}
                    disabled={!canProceed}
                    className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Preparar cotización (CRM)
                  </button>
                )}
              </div>

              <p className="mt-5 text-xs leading-5 text-slate-400">
                Cotización preliminar. No incluye obras civiles, red eléctrica existente, impuestos
                ni validación técnica en sitio. Al pagar el anticipo, separas tu equipo y agendamos
                la visita técnica.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>

      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-5"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-8 text-center"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <Check size={32} />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-white">
                Pago de anticipo simulado
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Esta es una simulación de pasarela de pago. En producción se integraría con
                PayU, Mercado Pago o Wompi.
              </p>
              <div className="my-6 space-y-3 rounded-2xl bg-slate-950/80 p-5 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total cotización</span>
                  <span className="font-semibold text-white">{formatCOP(totals.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Anticipo (60%)</span>
                  <span className="text-lg font-bold text-cyan-300">
                    {formatCOP(Math.round(totals.total * 0.6))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Saldo restante</span>
                  <span className="text-slate-400">
                    {formatCOP(Math.round(totals.total * 0.4))}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    handleWhatsApp();
                  }}
                  className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  Pagar ahora (simulado)
                </button>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Al hacer clic en "Pagar ahora" serás redirigido a la pasarela de pago.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
