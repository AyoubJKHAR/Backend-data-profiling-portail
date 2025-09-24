// import sql from "mssql";
// import { getSqlToken } from "../services/sqlToken.service.js";

// /**
//  * Exécute une requête sur le SQL endpoint d’un Lakehouse pour lister les tables.
//  * @param {string} serverHost - ex: "dx4...datawarehouse.fabric.microsoft.com"
//  * @returns {Promise<string[]>}  ["dbo.table1","dbo.table2",...]
//  */
// export async function listTablesViaSqlEndpoint(serverHost) {
//   const accessToken = await getSqlToken();
//   const pool = await sql.connect({
//   server: "dx4yivxgueruxodb3ep45tpvqa-tl2ocpc2texurdq2hlttgylnwm.datawarehouse.fabric.microsoft.com",
//   database: "default",
//   authentication: {
//     type: "azure-active-directory-access-token",
//     options: { token: accessToken }
//   },
//   options: { encrypt: true }
// });


//   const result = await pool.request().query(`
//     SELECT table_schema, table_name
//     FROM INFORMATION_SCHEMA.TABLES
//     WHERE table_type = 'BASE TABLE'
//   `);

//   return result.recordset.map(r => `${r.table_schema}.${r.table_name}`);
// }
 