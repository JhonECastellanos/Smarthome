import { Router } from "express";
import { prisma } from "../index.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const products = await prisma.catalogProduct.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });
    res.json(products);
  } catch (err) {
    console.error("GET /products error:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

export default router;
