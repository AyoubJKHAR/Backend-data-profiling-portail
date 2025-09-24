// import axios from "axios";
// import { getFabricToken } from "./fabricToken.service.js";

// const BASE = "https://api.fabric.microsoft.com/v1";

// export async function runPipeline(workspaceId, pipelineItemId) {
//   const token = await getFabricToken();
//   const url = `${BASE}/workspaces/${workspaceId}/items/${pipelineItemId}/jobs/instances?jobType=Pipeline`;
//   const { data, headers, status } = await axios.post(url, {}, {
//     headers: { Authorization: `Bearer ${token}` }
//   });

//   // récup id depuis header Location ou data
//   const location = headers?.location || headers?.Location;
//   const jobInstanceId = location ? location.split("/").pop() : (data?.id || data?.jobInstanceId);
//   return { status, jobInstanceId, raw: data };
// }

// export async function getPipelineStatus(workspaceId, jobInstanceId) {
//   const token = await getFabricToken();
//   const { data } = await axios.get(
//     `${BASE}/workspaces/${workspaceId}/jobs/instances/${jobInstanceId}`,
//     { headers: { Authorization: `Bearer ${token}` } }
//   );
//   return data; // contient status, start/end, etc.
// }

import axios from "axios";
import { getFabricToken } from "./fabricToken.service.js";

const BASE = "https://api.fabric.microsoft.com/v1";

/**
 * Lance la pipeline et retourne l'identifiant du job.
 */
export async function runPipeline(workspaceId, pipelineItemId) {
  const token = await getFabricToken();
  const url = `${BASE}/workspaces/${workspaceId}/items/${pipelineItemId}/jobs/instances?jobType=Pipeline`;

  const { headers, data, status } = await axios.post(
    url,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const location = headers.location || headers.Location;
  const jobInstanceId = location
    ? location.split("/").pop()
    : (data?.id || data?.jobInstanceId);

  if (!jobInstanceId) {
    throw new Error("Impossible de récupérer jobInstanceId");
  }

  // ✅ On renvoie aussi le pipelineItemId pour l'utiliser dans le GET
  return { jobInstanceId, pipelineItemId };
}

/**
 * Récupère le statut d'un job d'une pipeline donnée.
 */
export async function getPipelineStatus(workspaceId, pipelineItemId, jobInstanceId) {
  const token = await getFabricToken();
  const url = `${BASE}/workspaces/${workspaceId}/items/${pipelineItemId}/jobs/instances/${encodeURIComponent(jobInstanceId)}`;
  const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
  return data;
}

