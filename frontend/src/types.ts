export type ProductId =
  | "smartBulb"
  | "smartOutlet"
  | "touchScreen"
  | "aiCamera"
  | "audioZone"
  | "localServer";

export type Product = {
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
