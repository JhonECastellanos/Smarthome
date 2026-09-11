import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  Settings,
  ShoppingCart,
  Package,
  DollarSign,
  Wrench,
  Cpu,
  Loader2,
  Check,
} from "lucide-react";
import {
  api,
  type PlatformSettingDTO,
  type ProductDTO,
  type QuoteRequestDTO,
  demoSettings,
  demoProducts,
  demoQuoteRequests,
  loginDemo,
} from "../api";

type Tab = "requests" | "prices";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-300",
  CONTACTED: "bg-blue-500/20 text-blue-300",
  COMPLETED: "bg-emerald-500/20 text-emerald-300",
  CANCELLED: "bg-red-500/20 text-red-300",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pendiente",
  CONTACTED: "Contactado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("requests");
  const [settings, setSettings] = useState<PlatformSettingDTO[]>([]);
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [requests, setRequests] = useState<QuoteRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("admin_token");
    if (!token) {
      const res = loginDemo();
      token = res.token;
      localStorage.setItem("admin_token", res.token);
      localStorage.setItem("admin_user", JSON.stringify(res.user));
    }

    fetch("/api/health", { signal: AbortSignal.timeout(3000) })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(() => {
        loadRealData(token!);
      })
      .catch(() => {
        loadDemoData();
      });
  }, []);

  function loadDemoData() {
    setIsDemo(true);
    setSettings(demoSettings);
    setProducts(demoProducts);
    setRequests(demoQuoteRequests);
    setLoading(false);
  }

  async function loadRealData(token: string) {
    try {
      const [settingsRes, requestsRes] = await Promise.all([
        api.getAdminSettings(token),
        api.getQuoteRequests(token),
      ]);
      setSettings(settingsRes.settings);
      setProducts(settingsRes.products);
      setRequests(requestsRes);
    } catch {
      setBackendError("Error al cargar datos del servidor");
      loadDemoData();
      return;
    }
    setLoading(false);
  }

  async function handleUpdateSetting(key: string, value: string) {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
    if (!isDemo) {
      const token = localStorage.getItem("admin_token");
      setSaving(key);
      try {
        await api.updateSetting(token!, { key, value });
      } catch {
        /* ignore */
      } finally {
        setSaving(null);
      }
    }
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  }

  async function handleUpdateProduct(id: string, basePriceCop: number) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, basePriceCop } : p)));
    if (!isDemo) {
      const token = localStorage.getItem("admin_token");
      setSaving(id);
      try {
        await api.updateProduct(token!, { id, basePriceCop });
      } catch {
        /* ignore */
      } finally {
        setSaving(null);
      }
    }
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  }

  async function handleUpdateStatus(id: string, status: string) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: status as QuoteRequestDTO["status"] } : r))
    );
    if (!isDemo) {
      const token = localStorage.getItem("admin_token");
      try {
        await api.updateQuoteStatus(token!, id, status);
      } catch {
        /* ignore */
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <Loader2 size={32} className="mx-auto animate-spin text-cyan-400" />
          <p className="mt-4 text-sm text-slate-400">Conectando con el servidor...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-400 text-xs font-black text-slate-950">
              N
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Panel Admin</h1>
              <p className="text-xs text-slate-400">Nexo Hogar IA</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isDemo && (
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                MODO DEMO
              </span>
            )}
            <a href="/" className="text-sm text-slate-400 transition hover:text-white">
              Ver sitio
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-white/5"
            >
              <LogOut size={14} />
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {isDemo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-200"
          >
            <span className="font-semibold">Modo Demo activo.</span> No se detectó un backend
            disponible. Los cambios en pantalla se muestran pero no se persisten. Para operación
            real, levanta el proyecto con <code className="text-amber-100">docker compose up</code>
            .
          </motion.div>
        )}

        {backendError && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-200">
            {backendError}
          </div>
        )}

        <div className="mb-8 flex gap-2 rounded-2xl border border-white/10 bg-slate-900/50 p-1.5">
          <button
            onClick={() => setTab("requests")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              tab === "requests"
                ? "bg-cyan-400/10 text-cyan-200"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShoppingCart size={16} />
            Solicitudes ({requests.length})
          </button>
          <button
            onClick={() => setTab("prices")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              tab === "prices"
                ? "bg-cyan-400/10 text-cyan-200"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Settings size={16} />
            Precios y configuración
          </button>
        </div>

        {tab === "requests" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-white">Solicitudes de cotización</h2>
            {requests.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-slate-900/50 p-8 text-center text-sm text-slate-400">
                No hay solicitudes aún.
              </p>
            ) : (
              requests.map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-white/10 bg-slate-900/50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-white">{req.contactName}</h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[req.status]}`}
                        >
                          {statusLabels[req.status]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">
                        {req.contactEmail && `${req.contactEmail} · `}
                        {req.contactPhone || "Sin teléfono"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">
                        ${req.total.toLocaleString("es-CO")}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString("es-CO", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-cyan-300">
                      Ver detalles
                    </summary>
                    <div className="mt-3 space-y-2 rounded-xl bg-slate-950/80 p-4 text-sm">
                      {(
                        req.items as Array<{
                          productName: string;
                          quantity: number;
                          unitPrice: number;
                        }>
                      ).map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>
                            {item.quantity}× {item.productName}
                          </span>
                          <span className="text-slate-300">
                            ${(item.unitPrice * item.quantity).toLocaleString("es-CO")}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-white/10 pt-2">
                        <div className="flex justify-between text-slate-400">
                          <span>Equipos</span>
                          <span>${req.equipmentCost.toLocaleString("es-CO")}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Instalación</span>
                          <span>${req.installationCost.toLocaleString("es-CO")}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-white">
                          <span>Total</span>
                          <span>${req.total.toLocaleString("es-CO")}</span>
                        </div>
                      </div>
                    </div>
                  </details>

                  {req.notes && (
                    <p className="mt-3 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-400">
                      Notas: {req.notes}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {req.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(req.id, "CONTACTED")}
                          className="rounded-lg bg-blue-500/20 px-3 py-1.5 text-sm font-medium text-blue-300 transition hover:bg-blue-500/30"
                        >
                          Marcar contactado
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.id, "CANCELLED")}
                          className="rounded-lg bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-500/30"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                    {req.status === "CONTACTED" && (
                      <button
                        onClick={() => handleUpdateStatus(req.id, "COMPLETED")}
                        className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/30"
                      >
                        Marcar completado
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}

        {tab === "prices" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">
                <Wrench size={18} className="mr-2 inline" />
                Costos globales
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {settings
                  .filter((s) =>
                    ["installation_cost_per_point", "software_license_price", "subscription_monthly_price"].includes(s.key)
                  )
                  .map((setting) => (
                    <SettingCard
                      key={setting.id}
                      setting={setting}
                      saving={saving}
                      saved={saved}
                      onSave={handleUpdateSetting}
                    />
                  ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">
                <Package size={18} className="mr-2 inline" />
                Precios de hardware
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    saving={saving}
                    saved={saved}
                    onSave={handleUpdateProduct}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

function SettingCard({
  setting,
  saving,
  saved,
  onSave,
}: {
  setting: PlatformSettingDTO;
  saving: string | null;
  saved: string | null;
  onSave: (key: string, value: string) => void;
}) {
  const [value, setValue] = useState(setting.value);

  const icons: Record<string, typeof DollarSign> = {
    installation_cost_per_point: Wrench,
    software_license_price: Cpu,
    subscription_monthly_price: DollarSign,
  };

  const Icon = icons[setting.key] || DollarSign;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} className="text-cyan-300" />
        <h3 className="font-medium text-white">{setting.label}</h3>
      </div>
      <p className="mb-3 text-xs text-slate-500">{setting.description}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">$</span>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400/50"
        />
        <button
          onClick={() => onSave(setting.key, value)}
          disabled={saving === setting.key || value === setting.value}
          className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 transition hover:bg-cyan-400/20 disabled:opacity-30"
        >
          {saving === setting.key ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved === setting.key ? (
            <Check size={16} />
          ) : (
            <span className="text-xs font-bold">OK</span>
          )}
        </button>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  saving,
  saved,
  onSave,
}: {
  product: ProductDTO;
  saving: string | null;
  saved: string | null;
  onSave: (id: string, price: number) => void;
}) {
  const [price, setPrice] = useState(product.basePriceCop);

  const categoryIcons: Record<string, string> = {
    LIGHTING: "💡",
    OUTLET: "🔌",
    TOUCH_PANEL: "📱",
    CAMERA: "📷",
    AUDIO_ZONE: "🔊",
    LOCAL_SERVER: "🖥️",
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg">{categoryIcons[product.category] || "📦"}</span>
        <div>
          <h3 className="font-medium text-white">{product.name}</h3>
          <p className="text-xs text-slate-500">{product.sku}</p>
        </div>
      </div>
      {product.description && (
        <p className="mb-3 text-xs text-slate-400">{product.description}</p>
      )}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">$</span>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="flex-1 rounded-xl border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400/50"
        />
        <span className="text-xs text-slate-500">{product.baseInstallationPoints} ptos</span>
        <button
          onClick={() => onSave(product.id, price)}
          disabled={saving === product.id || price === product.basePriceCop}
          className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 transition hover:bg-cyan-400/20 disabled:opacity-30"
        >
          {saving === product.id ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved === product.id ? (
            <Check size={16} />
          ) : (
            <span className="text-xs font-bold">OK</span>
          )}
        </button>
      </div>
    </div>
  );
}
