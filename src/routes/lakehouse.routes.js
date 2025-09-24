import { Router } from "express";
import { getLakehouses, getLakehouseTables, getLakehousesWithTables } from "../controllers/lakehouse.controller.js";

const router = Router();

// GET /lakehouses
router.get("/lakehouses", getLakehouses);

// GET /lakehouse-tables?lakehouseId=...
router.get("/lakehouse-tables", getLakehouseTables);

// ➕ nouvelle route combinée
router.get("/lakehouses-with-tables", getLakehousesWithTables);

export default router;

