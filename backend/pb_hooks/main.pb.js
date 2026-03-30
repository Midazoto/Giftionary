// pb_hooks/main.pb.js
onAfterBootstrap((e) => {
    try {
        const collection = $app.dao().findCollectionByNameOrId("app_settings");
        console.log("✔️ Collection trouvée :", collection.id);

        // On utilise findRecordsByFilter, c'est plus stable en JS PB que findRecordsByExpr
        const records = $app.dao().findRecordsByFilter(collection.id, "1=1", "-created", 1);

        if (records.length === 0) {
            // ATTENTION : En JS PocketBase, on crée le record via la classe Record
            const record = new Record(collection, {
                "allow_register": true,
                "app_name": "Giftionary",
            });

            $app.dao().saveRecord(record);
            console.log("🚀 Settings initialisés avec succès !");
        } else {
            console.log("ℹ️ Settings déjà présents (" + records.length + " ligne)");
        }
    } catch (err) {
        // Affiche la vraie erreur pour arrêter de deviner
        console.log("❌ Erreur lors de l'init :");
        console.log("Détail :", err.message || err);
    }
})