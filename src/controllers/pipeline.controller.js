import { runPipeline, getPipelineStatus } from "../services/pipeline.service.js";

/**
 * Lance la pipeline et retourne l'id du job
 */
export async function runPipelineCtrl(_req, res) {
  try {
    const { jobInstanceId, pipelineItemId } = await runPipeline(
      process.env.WORKSPACE_ID,
      process.env.PIPELINE_ID      // ⚡ votre id de pipeline (ex-PROFILING_PIPELINE_ID)
    );

    res.status(202).json({
      message: "Pipeline lancé",
      jobInstanceId,
      pipelineItemId
    });
  } catch (e) {
    console.error("runPipeline:", e.response?.data || e.message);
    res
      .status(e.response?.status || 500)
      .json(e.response?.data || { error: e.message });
  }
}

/**
 * Vérifie le statut du job via son ID
 * On passe maintenant : /pipeline-status/:jobId
 */
export async function pipelineStatusCtrl(req, res) {
  try {
    const jobId = req.params.id;
    const pipelineItemId = process.env.PIPELINE_ID; // idem que dans runPipeline
    const data = await getPipelineStatus(process.env.WORKSPACE_ID, pipelineItemId, jobId);
    res.json(data);
  } catch (e) {
    console.error("pipelineStatus:", e.response?.data || e.message);
    res
      .status(e.response?.status || 500)
      .json(e.response?.data || { error: e.message });
  }
}


