const router = require("express").Router();

const handleCreateDocument = require("./handleCreateDocument");
const handleModifyDocument = require("./handleModifyDocument");
const handleDeleteDocument = require("./handleDeleteDocument");

router.put("/", handleCreateDocument);
router.patch("/", handleModifyDocument);
router.delete("/", handleDeleteDocument);


module.exports = router;
