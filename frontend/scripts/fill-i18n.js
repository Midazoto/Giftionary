import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const MESSAGES_DIR = path.resolve(process.cwd(), 'messages');
const SOURCE_LANG = 'fr.json';
const FILL_VALUE = 'NO_TRAD';

// Récupération de la langue cible via l'argument (ex: npm run lang:fill en)
const targetLangCode = process.argv[2];

if (!targetLangCode) {
  console.error("Erreur: Veuillez preciser la langue cible (ex: node scripts/fill-i18n.js en)");
  process.exit(1);
}

const targetFile = `${targetLangCode}.json`;
const sourcePath = path.join(MESSAGES_DIR, SOURCE_LANG);
const targetPath = path.join(MESSAGES_DIR, targetFile);

if (!fs.existsSync(sourcePath) || !fs.existsSync(targetPath)) {
  console.error(`Erreur: Fichier source (${SOURCE_LANG}) ou cible (${targetFile}) introuvable.`);
  process.exit(1);
}

// Lecture des fichiers
const sourceContent = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
const targetContent = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));

// Interface pour lire l'entree utilisateur
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function startFilling() {
  let hasChanged = false;
  const keys = Object.keys(targetContent);

  console.log(`--- Traduction de [fr] vers [${targetLangCode}] ---`);
  console.log(`Appuyez sur Entree sans rien ecrire pour passer une cle.`);
  console.log('--------------------------------------------------');

  for (const key of keys) {
    if (targetContent[key] === FILL_VALUE) {
      console.log(`\nCle: ${key}`);
      console.log(`Source [fr]: ${sourceContent[key]}`);
      const answer = await askQuestion(`Traduction [${targetLangCode}]: `);

      if (answer && answer.trim() !== "") {
        targetContent[key] = answer.trim();
        hasChanged = true;
      }
    }
  }

  rl.close();

  if (hasChanged) {
    fs.writeFileSync(targetPath, JSON.stringify(targetContent, null, 2), 'utf-8');
    console.log(`\nSucces: Le fichier ${targetFile} a ete mis a jour.`);
  } else {
    console.log("\nInfo: Aucune nouvelle traduction ajoutee.");
  }
}

startFilling();