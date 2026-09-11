import { Router } from "express";
import { z } from "zod";
import { prisma } from "../index.js";
import { authenticateToken } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/settings", async (_req, res) => {
  try {
    const settings = await prisma.platformSetting.findMany();
    const products = await prisma.catalogProduct.findMany({ where: { isActive: true } });
    res.json({ settings, products });
  } catch (err) {
    console.error("GET /admin/settings error:", err);
    res.status(500).json({ error: "Error al obtener configuración" });
  }
});

const updateSettingSchema = z.object({
  key: z.string(),
  value: z.string(),
  label: z.string().optional(),
  description: z.string().nullable().optional(),
});

router.put("/settings", async (req: AuthRequest, res) => {
  try {
    const data = updateSettingSchema.parse(req.body);

    const updated = await prisma.platformSetting.upsert({
      where: { key: data.key },
      update: { value: data.value, label: data.label, description: data.description },
      create: { key: data.key, value: data.value, label: data.label || data.key, description: data.description },
    });

    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Datos inválidos", details: err.errors });
      return;
    }
    console.error("PUT /admin/settings error:", err);
    res.status(500).json({ error: "Error al actualizar configuración" });
  }
});

const updateProductSchema = z.object({
  id: z.string(),
  basePriceCop: z.number().int().positive(),
  baseInstallationPoints: z.number().int().positive().optional(),
  name: z.string().optional(),
  description: z.string().nullable().optional(),
});

router.put("/products", async (req: AuthRequest, res) => {
  try {
    const data = updateProductSchema.parse(req.body);

    const updated = await prisma.catalogProduct.update({
      where: { id: data.id },
      data: {
        basePriceCop: data.basePriceCop,
        ...(data.baseInstallationPoints !== undefined && { baseInstallationPoints: data.baseInstallationPoints }),
        ...(data.name && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });

    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Datos inválidos", details: err.errors });
      return;
    }
    console.error("PUT /admin/products error:", err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

router.get("/quote-requests", async (_req, res) => {
  try {
    const requests = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(requests);
  } catch (err) {
    console.error("GET /admin/quote-requests error:", err);
    res.status(500).json({ error: "Error al obtener solicitudes" });
  }
});

const updateQuoteStatusSchema = z.object({
  status: z.enum(["PENDING", "CONTACTED", "COMPLETED", "CANCELLED"]),
  notes: z.string().nullable().optional(),
});

router.patch("/quote-requests/:id/status", async (req: AuthRequest, res) => {
  try {
    const { id } = req.params as { id: string };
    const { status, notes } = updateQuoteStatusSchema.parse(req.body);

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: { status, ...(notes !== undefined && { notes }) },
    });

    res.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Datos inválidos", details: err.errors });
      return;
    }
    console.error("PATCH /admin/quote-requests error:", err);
    res.status(500).json({ error: "Error al actualizar solicitud" });
  }
});

export default router;
