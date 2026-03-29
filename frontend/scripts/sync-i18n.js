import fs from 'node:fs';
import path from 'node:path';

// --- CONFIGURATION ---
const MESSAGES_DIR = path.resolve(process.cwd(), 'messages'); 
const SOURCE_LANG = 'fr.json';
const FILL_VALUE = 'NO_TRAD';
// ---------------------

const sourcePath = path.join(MESSAGES_DIR, SOURCE_LANG);

if (!fs.existsSync(sourcePath)) {
  console.error(`Erreur: Fichier source introuvable : ${sourcePath}`);
  process.exit(1);
}

try {
  // 1. Lire le fichier de référence
  const sourceRaw = fs.readFileSync(sourcePath, 'utf-8');
  const sourceContent = JSON.parse(sourceRaw);
  const sourceKeys = Object.keys(sourceContent);

  // 2. Filtrer les autres fichiers JSON
  const files = fs.readdirSync(MESSAGES_DIR)
    .filter(f => f.endsWith('.json') && f !== SOURCE_LANG);

  if (files.length === 0) {
    console.log("Info: Aucun autre fichier de langue trouve.");
  }

  files.forEach(file => {
    const filePath = path.join(MESSAGES_DIR, file);
    const targetRaw = fs.readFileSync(filePath, 'utf-8');
    const targetContent = JSON.parse(targetRaw);

    let hasChanged = false;
    const newContent = {};

    // 3. Synchronisation stricte sur l'ordre des cles de la source
    sourceKeys.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(targetContent, key)) {
        newContent[key] = targetContent[key];
      } else {
        newContent[key] = FILL_VALUE;
        hasChanged = true;
        console.log(`[${file}] Ajout de la cle manquante : "${key}"`);
      }
    });

    // 4. Ecriture si modification detectee
    if (hasChanged) {
      fs.writeFileSync(filePath, JSON.stringify(newContent, null, 2), 'utf-8');
      console.log(`Succes: ${file} mis a jour.`);
    } else {
      console.log(`Statut: ${file} est deja a jour.`);
    }
  });

} catch (error) {
  console.error("Erreur critique lors de la synchronisation :", error.message);
}