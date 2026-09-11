const API_BASE = "/api";

export type ProductDTO = {
  id: string;
  sku: string;
  name: string;
  category: string;
  basePriceCop: number;
  baseInstallationPoints: number;
  description: string | null;
  isActive: boolean;
};

export type PlatformSettingDTO = {
  id: string;
  key: string;
  value: string;
  label: string;
  description: string | null;
};

export type QuoteRequestDTO = {
  id: string;
  contactName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  items: unknown;
  equipmentCost: number;
  installationCost: number;
  total: number;
  status: "PENDING" | "CONTACTED" | "COMPLETED" | "CANCELLED";
  notes: string | null;
  createdAt: string;
};

export type AdminUserDTO = {
  id: string;
  email: string;
  name: string;
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let res;
  try {
    res = await fetch(`${API_BASE}${url}`, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });
  } catch {
    throw new Error("No se puede conectar con el servidor. ¿El backend está corriendo?");
  }

  let body: Record<string, unknown>;
  try {
    body = await res.json();
  } catch {
    throw new Error("Error de conexión con el servidor. Verifica que el backend esté activo.");
  }

  if (!res.ok) throw new Error((body.error as string) || "Error de red");
  return body as T;
}

export const api = {
  getProducts: () => request<ProductDTO[]>("/products"),

  submitQuote: (data: {
    contactName: string;
    contactEmail?: string;
    contactPhone?: string;
    items: { productName: string; quantity: number; unitPrice: number; installationPoints: number }[];
    equipmentCost: number;
    installationCost: number;
    total: number;
  }) => request<{ id: string; message: string }>("/quotes", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  login: (email: string, password: string) =>
    request<{ token: string; user: AdminUserDTO }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getAdminSettings: (token: string) =>
    request<{ settings: PlatformSettingDTO[]; products: ProductDTO[] }>("/admin/settings", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateSetting: (token: string, data: { key: string; value: string; label?: string }) =>
    request<PlatformSettingDTO>("/admin/settings", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  updateProduct: (token: string, data: { id: string; basePriceCop: number }) =>
    request<ProductDTO>("/admin/products", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  getQuoteRequests: (token: string) =>
    request<QuoteRequestDTO[]>("/admin/quote-requests", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateQuoteStatus: (token: string, id: string, status: string, notes?: string) =>
    request<QuoteRequestDTO>(`/admin/quote-requests/${id}/status`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status, notes }),
    }),
};

// ─── Demo mode ──────────────────────────────────────────

const DEMO_TOKEN = "demo-token-nexohogar-2024";

export const demoUser: AdminUserDTO = {
  id: "demo-1",
  email: "admin@nexohogar.ai",
  name: "Admin Demo",
};

export const demoSettings: PlatformSettingDTO[] = [
  { id: "s1", key: "installation_cost_per_point", value: "110000", label: "Costo de instalación por punto", description: "COP" },
  { id: "s2", key: "software_license_price", value: "2490000", label: "Licencia del Cerebro IA", description: "COP - Pago único anticipado" },
  { id: "s3", key: "subscription_monthly_price", value: "89000", label: "Suscripción mensual IA", description: "COP - Mantenimiento y actualizaciones" },
];

export const demoProducts: ProductDTO[] = [
  { id: "p1", sku: "BOM-001", name: "Bombillo inteligente", category: "LIGHTING", basePriceCop: 145000, baseInstallationPoints: 1, description: "Iluminación regulable, escenas y automatizaciones.", isActive: true },
  { id: "p2", sku: "TOM-001", name: "Toma / enchufe inteligente", category: "OUTLET", basePriceCop: 180000, baseInstallationPoints: 1, description: "Control de cargas, consumo y automatizaciones.", isActive: true },
  { id: "p3", sku: "PAN-001", name: "Pantalla touch", category: "TOUCH_PANEL", basePriceCop: 1650000, baseInstallationPoints: 1, description: "Panel mural premium para control local.", isActive: true },
  { id: "p4", sku: "CAM-001", name: "Cámara IA privada", category: "CAMERA", basePriceCop: 1490000, baseInstallationPoints: 1, description: "Analítica de video local, sin depender de la nube.", isActive: true },
  { id: "p5", sku: "AUD-001", name: "Zona de audio IA", category: "AUDIO_ZONE", basePriceCop: 2450000, baseInstallationPoints: 1, description: "Micrófono y parlante para interacción natural por voz.", isActive: true },
  { id: "p6", sku: "SRV-001", name: "Servidor local de IA", category: "LOCAL_SERVER", basePriceCop: 11900000, baseInstallationPoints: 1, description: "Base privada para automatización, visión y asistentes.", isActive: true },
];

export const demoQuoteRequests: QuoteRequestDTO[] = [
  {
    id: "q1", contactName: "Carlos Martínez", contactEmail: "carlos@ejemplo.com", contactPhone: "3001234567",
    items: [{ productName: "Bombillo inteligente", quantity: 12, unitPrice: 145000, installationPoints: 12 }],
    equipmentCost: 1740000, installationCost: 1320000, total: 3060000,
    status: "PENDING", notes: null, createdAt: "2025-07-10T14:30:00Z",
  },
  {
    id: "q2", contactName: "María Gómez", contactEmail: "maria@constructora.com", contactPhone: "3107654321",
    items: [
      { productName: "Bombillo inteligente", quantity: 8, unitPrice: 145000, installationPoints: 8 },
      { productName: "Pantalla touch", quantity: 1, unitPrice: 1650000, installationPoints: 1 },
      { productName: "Cámara IA privada", quantity: 2, unitPrice: 1490000, installationPoints: 2 },
    ],
    equipmentCost: 5790000, installationCost: 1210000, total: 7000000,
    status: "CONTACTED", notes: "Cliente interesado en visita técnica", createdAt: "2025-07-09T10:15:00Z",
  },
  {
    id: "q3", contactName: "Proyectos del Valle SAS", contactEmail: null, contactPhone: "3159876543",
    items: [
      { productName: "Servidor local de IA", quantity: 1, unitPrice: 11900000, installationPoints: 1 },
      { productName: "Zona de audio IA", quantity: 3, unitPrice: 2450000, installationPoints: 3 },
    ],
    equipmentCost: 19250000, installationCost: 440000, total: 19690000,
    status: "COMPLETED", notes: "Proyecto entregado y suscripción activa", createdAt: "2025-07-05T08:00:00Z",
  },
];

export function loginDemo(): { token: string; user: AdminUserDTO } {
  return { token: DEMO_TOKEN, user: demoUser };
}

export function isDemoToken(token: string): boolean {
  return token === DEMO_TOKEN;
}
