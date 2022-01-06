const router = require("express").Router();

const handleCreateDocument = require("./handleCreateDocument");
const handleAccessDocument = require("./handleAccessDocument");
const handleModifyDocument = require("./handleModifyDocument");
const handleDeleteDocument = require("./handleDeleteDocument");


router.get("/", handleAccessDocument);
router.put("/", handleCreateDocument);
router.patch("/", handleModifyDocument);
router.delete("/", handleDeleteDocument);


module.exports = router;
