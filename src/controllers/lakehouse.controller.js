import { listLakehouses, listTables } from "../services/lakehouse.service.js";

export async function getLakehouses(_req, res) {
  try {
    const response = await listLakehouses(process.env.WORKSPACE_ID);
    res.json(response);
  } catch (e) {
    console.error("getLakehouses:", e.message);
    res.status(500).json({ error: e.message });
  }
}

export async function getLakehouseTables(req, res) {
  try {
    const lakehouseId = req.query.lakehouseId

    // l'API renvoie { data: [...], ..... }
    const apiResponse = await listTables(process.env.WORKSPACE_ID, lakehouseId);
    // on extrait uniquement les noms
    const tableNames = formatListeTables(apiResponse)
    res.json(tableNames);
  } catch (e) {
    console.error("getLakehouseTables:", e.message);
    res.status(500).json({ error: e.message });
  }
}

function formatListeTables(response){
    const tableNames = (response.data || []).map(t => t.name);
    return tableNames;
}

export async function getLakehousesWithTables(_req, res) {
  try {
    const { value: lakehouses } = await listLakehouses(process.env.WORKSPACE_ID);

    const result = await Promise.all(
      lakehouses.map(async (lh) => {
        try {
          // ✅ on tente la récupération des tables via l’API REST
          const rest = await listTables(lh.workspaceId, lh.id);

          return {
            idLakehouse: lh.id,
            lakehouseDisplayName: lh.displayName,
            schemaEnabled: false,
            tables: formatListeTables(rest)
          };
        } catch (err) {
          // 🚫 si schemas enabled, on ignore ce lakehouse
          if (err.response?.data?.errorCode ===
              "UnsupportedOperationForSchemasEnabledLakehouse") {
            console.warn(
              `Lakehouse ignoré (schemas enabled) : ${lh.displayName}`
            );
            return null; // on retourne null pour le filtrer plus tard
          }
          // autre erreur : on la propage
          throw err;
        }
      })
    );

    // on retire les null (lakehouses ignorés)
    res.json(result.filter(Boolean));

  } catch (e) {
    console.error("getLakehousesWithTables:", e.message);
    res.status(500).json({ error: e.message });
  }
}

// à voir quand on veut formater le format de réponse de lakehouse 
// function formatListeLakehouseInfo(resp) {
//   return (resp.value || []).map(lh => ({
//     idLakehouse: lh.id,
//     DisplayName: lh.displayName,
//     type: lh.type,
//     workspaceId: lh.workspaceId,
//     description: lh.description
//   }));
// }

// à voir quand on veut accès au lakehouse avec schéma activé 

// export async function getLakehousesWithTables(_req, res) {
//   try {
//     const { value: lakehouses } = await listLakehouses(process.env.WORKSPACE_ID);

//     const result = await Promise.all(
//       lakehouses.map(async (lh) => {
//         try {
//           // 1️⃣ Tentative REST classique
//           const rest = await listTables(lh.workspaceId, lh.id);
//           return {
//             idLakehouse: lh.id,
//             displayName: lh.displayName,
//             schemaEnabled: false,
//             tables: formatListeTables(rest)
//           };
//         } catch (err) {
//           // 2️⃣ Fallback SQL pour schemas enabled
//           if (err.response?.data?.errorCode ===
//               "UnsupportedOperationForSchemasEnabledLakehouse") {

//             // host pur extrait de la chaîne de connexion
//             const host = new URL(`sqlserver://${lh.properties.sqlEndpointProperties.connectionString}`).host
//               || lh.properties.sqlEndpointProperties.connectionString;

//             const tables = await querySqlEndpoint(host, lh.displayName);
//             return {
//               idLakehouse: lh.id,
//               displayName: lh.displayName,
//               schemaEnabled: true,
//               tables
//             };
//           }
//           throw err;
//         }
//       })
//     );
//     res.json(result);
//   } catch (e) {
//     console.error("getLakehousesWithTables:", e.message);
//     res.status(500).json({ error: e.message });
//   }
// }

// VERSION LAKEHOUSE SANS SCHEMA ACTIVE 
// input : WORKSPACE_ID >>>> liste de lakeHouse with their tables
// export async function getLakehousesWithTables(_req, res) {
//   try {
//     const { value: lakehouses } = await listLakehouses(process.env.WORKSPACE_ID);
//     const listLakeHousesWithTables = await Promise.all(
//       lakehouses.map(async (currentLakehouse) => {
//         // 🔑 utiliser le workspaceId propre à ce lakehouse
//         const listeLakehouseTables = await listTables(currentLakehouse.workspaceId,  currentLakehouse.id);
//         const formatListTable =formatListeTables(listeLakehouseTables);

//         const lakehouseWithTables =  {
//           idLakehouse: currentLakehouse.id,
//           lakehouseDisplayName: currentLakehouse.displayName,
//           tables: formatListTable
//         };
//         return lakehouseWithTables;
//       })
//     );

//     res.json(listLakeHousesWithTables);
//   } catch (e) {
//     console.error("getLakehousesWithTables:", e.response?.data || e.message);
//     res.status(e.response?.status || 500).json(e.response?.data || { error: e.message });
//   }
// }