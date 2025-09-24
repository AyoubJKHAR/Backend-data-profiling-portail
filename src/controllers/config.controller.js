import { writeConfigFile } from "../utils/datalake.js";

export async function saveUserSelection(req, res) {
  try {
    const body = req.body;
    // Vérification du format du body envoyé par le frontend
    checkBodyVerification(body, res);

    // ⚙️ Écriture du fichier tel quel
    console.log('reçu depuis frontend', body.selectedTables[0])
    const path = await writeConfigFile(body);
    return res.status(201).json({ ok: true, path });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Erreur serveur" });
  }
}

function checkBodyVerification(body, res) {
  // Vérifier que la clé selectedTables existe et est un tableau
  if (
    !body ||
    !Array.isArray(body.selectedTables) ||
    body.selectedTables.length === 0
  ) {
    return res
      .status(400)
      .json({
        error:
          "Body invalide : 'selectedTables' doit être un tableau non vide.",
      });
  }

  // Validation de chaque élément
  for (const item of body.selectedTables) {
    // clé modifiée ici : lakehouseName
    if (
      !item.lakehouseName || !item.idLakehouse ||
      typeof item.idLakehouse !== "string" ||
      typeof item.lakehouseName !== "string" ||
      !Array.isArray(item.tables)
    ) {
      return res.status(400).json({
        error:
          "Chaque élément de 'selectedTables' doit contenir { idLakehouse: string, lakehouseName: string, tables: [] }",
      });
    }
    for (const t of item.tables) {
      if (!t.name || typeof t.name !== "string") {
        return res.status(400).json({
          error:
            "Chaque table doit avoir au minimum { name: string, projectName?: string }",
        });
      }
    }
  }
}
