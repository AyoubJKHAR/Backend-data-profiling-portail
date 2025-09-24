import axios from "axios";
import { getFabricToken } from "./fabricToken.service.js";

const BASE = "https://api.fabric.microsoft.com/v1";

export async function listLakehouses(workspaceId) {
  const token = await getFabricToken();
  const { data } = await axios.get(`${BASE}/workspaces/${workspaceId}/lakehouses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function listTables(workspaceId, lakehouseId) {
  const token = await getFabricToken();
  const { data } = await axios.get(
    `${BASE}/workspaces/${workspaceId}/lakehouses/${lakehouseId}/tables`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
    
  return data;
}
