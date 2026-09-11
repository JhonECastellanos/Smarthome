import { Router } from "express";
import { z } from "zod";
import { prisma } from "../index.js";

const router = Router();

const quoteItemSchema = z.object({
  productName: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().int().positive(),
  installationPoints: z.number().int().positive(),
});

const submitQuoteSchema = z.object({
  contactName: z.string().min(1, "Nombre requerido"),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, "Debe incluir al menos un producto"),
  equipmentCost: z.number().int().positive(),
  installationCost: z.number().int().min(0),
  total: z.number().int().positive(),
});

router.post("/", async (req, res) => {
  try {
    const data = submitQuoteSchema.parse(req.body);

    const quote = await prisma.quoteRequest.create({
      data: {
        contactName: data.contactName,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        items: data.items,
        equipmentCost: data.equipmentCost,
        installationCost: data.installationCost,
        total: data.total,
      },
    });

    res.status(201).json({ id: quote.id, message: "Cotización recibida, te contactaremos pronto." });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Datos inválidos", details: err.errors });
      return;
    }
    console.error("POST /quotes error:", err);
    res.status(500).json({ error: "Error al guardar cotización" });
  }
});

export default router;
