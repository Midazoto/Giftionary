/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "5ggox84ihfqnwd5",
    "created": "2026-03-30 15:43:36.437Z",
    "updated": "2026-03-30 15:43:36.437Z",
    "name": "app_settings",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fqt3hnhr",
        "name": "app_name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "54hgb7jp",
        "name": "allow_register",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": "",
    "createRule": null,
    "updateRule": "  @request.auth.isAdmin = true",
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("5ggox84ihfqnwd5");

  return dao.deleteCollection(collection);
})
