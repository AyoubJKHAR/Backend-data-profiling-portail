import { Router } from "express";
import { saveUserSelection } from "../controllers/config.controller.js";

const router = Router();
// POST /add_selected_lakehouses_tables_to_config
router.post("/add_selected_lakehouses_tables_to_config", saveUserSelection);

export default router;
