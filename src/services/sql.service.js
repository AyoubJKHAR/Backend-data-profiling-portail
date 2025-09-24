// // services/sql.service.js
// import sql from "mssql";

// export async function querySqlEndpoint(serverHost, databaseName) {
//   const config = {
//     server: serverHost,              // host pur (sans https)
//     database: databaseName,          // nom du lakehouse
//     options: {
//       encrypt: true,
//       trustServerCertificate: false,
//       connectTimeout: 30000,
//       requestTimeout: 30000
//     },
//     authentication: {
//       type: "azure-active-directory-default" // Azure AD automatique
//     }
//   };

//   const pool = await sql.connect(config);

//   const result = await pool.request().query(`
//     SELECT TABLE_SCHEMA AS schemaName, TABLE_NAME AS tableName
//     FROM INFORMATION_SCHEMA.TABLES
//     WHERE TABLE_TYPE = 'BASE TABLE'
//   `);

//   return result.recordset.map(r => ({
//     schema: r.schemaName,
//     table: r.tableName
//   }));
// }
