import { ClientSecretCredential } from "@azure/identity";
import { DataLakeServiceClient } from "@azure/storage-file-datalake";

const credential = new ClientSecretCredential(
  process.env.TENANT_ID,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

function getFsClient() {
  const serviceClient = new DataLakeServiceClient(
    "https://onelake.dfs.fabric.microsoft.com",
    credential
  );
  return serviceClient.getFileSystemClient(process.env.DATA_PROFILING_WORKSPACE_ID);
}

// écrire Files/config/selected_lakehouses_and_tables.json
// export async function writeConfigFile(data) {
//   const fsClient = getFsClient();
//   const dir = fsClient.getDirectoryClient(`${process.env.DATA_PROFILING_LAKEHOUSE_ID}/Files/config`);
//   await dir.createIfNotExists();
//   const content = JSON.stringify({ ...data, ts: data.ts || new Date().toISOString() }, null, 2);
//   const file = dir.getFileClient("selected_tables_by_lakehouse.json");
//   await file.create();
//   await file.append(content, 0, Buffer.byteLength(content));
//   await file.flush(Buffer.byteLength(content));
//   return "Files/config/selected_tables_by_lakehouse.json";
// }

export async function writeConfigFile(data) {
  const fsClient = getFsClient();
  const dirPath = `${process.env.DATA_PROFILING_LAKEHOUSE_ID}/Files/config`;
  const fileName = "selected_tables_by_lakehouse.json";
  const content = JSON.stringify(
    { ...data, ts: data.ts || new Date().toISOString() },
    null,
    2
  );

  try {
    const dir = fsClient.getDirectoryClient(dirPath);

    // Créer le dossier s'il n'existe pas
    await dir.createIfNotExists();

    // Créer et écrire le fichier
    const file = dir.getFileClient(fileName);
    await file.create();
    await file.append(content, 0, Buffer.byteLength(content));
    await file.flush(Buffer.byteLength(content));

    return `${dirPath}/${fileName}`;
  } catch (err) {
    // Affiche l'erreur complète dans la console
    console.error("Erreur lors de l’écriture du fichier de configuration :", err);

    // Relance une erreur explicite pour le code appelant
    throw new Error(
      `Impossible d’écrire le fichier de configuration (${fileName}) : ${err.message || err}`
    );
  }
}


