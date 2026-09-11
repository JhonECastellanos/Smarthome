import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) throw new Error("ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidos");

  const hashed = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Administrador",
      password: hashed,
    },
  });

  const settings = [
    { key: "installation_cost_per_point", value: "110000", label: "Costo de instalación por punto", description: "COP" },
    { key: "software_license_price", value: "2490000", label: "Licencia del Cerebro IA", description: "COP - Pago único anticipado" },
    { key: "subscription_monthly_price", value: "89000", label: "Suscripción mensual IA", description: "COP - Mantenimiento y actualizaciones" },
  ];

  for (const s of settings) {
    await prisma.platformSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, label: s.label, description: s.description },
      create: s,
    });
  }

  const products = [
    { sku: "BOM-001", name: "Bombillo inteligente", category: "LIGHTING" as const, basePriceCop: 145000, baseInstallationPoints: 1, description: "Iluminación regulable, escenas y automatizaciones." },
    { sku: "TOM-001", name: "Toma / enchufe inteligente", category: "OUTLET" as const, basePriceCop: 180000, baseInstallationPoints: 1, description: "Control de cargas, consumo y automatizaciones." },
    { sku: "PAN-001", name: "Pantalla touch", category: "TOUCH_PANEL" as const, basePriceCop: 1650000, baseInstallationPoints: 1, description: "Panel mural premium para control local." },
    { sku: "CAM-001", name: "Cámara IA privada", category: "CAMERA" as const, basePriceCop: 1490000, baseInstallationPoints: 1, description: "Analítica de video local, sin depender de la nube." },
    { sku: "AUD-001", name: "Zona de audio IA", category: "AUDIO_ZONE" as const, basePriceCop: 2450000, baseInstallationPoints: 1, description: "Micrófono y parlante para interacción por voz." },
    { sku: "SRV-001", name: "Servidor local de IA", category: "LOCAL_SERVER" as const, basePriceCop: 11900000, baseInstallationPoints: 1, description: "Base privada para automatización, visión y asistentes." },
  ];

  for (const p of products) {
    await prisma.catalogProduct.upsert({
      where: { sku: p.sku },
      update: p,
      create: p,
    });
  }

  console.log("Seed completado: admin, settings y productos creados.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
