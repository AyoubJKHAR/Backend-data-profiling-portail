import { Router } from "express";
import { runPipelineCtrl, pipelineStatusCtrl } from "../controllers/pipeline.controller.js";

const router = Router();

// POST /run-pipeline
router.post("/run-pipeline", runPipelineCtrl);

// GET /pipeline-status/:id
router.get("/pipeline-status/:id", pipelineStatusCtrl);

export default router;
