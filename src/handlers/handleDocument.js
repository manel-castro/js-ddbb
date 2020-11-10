const router = require("express").Router();

const handleCreateDocument = require("./handleCreateDocument");

router.post("/createDocument", handleCreateDocument);

module.exports = router;
