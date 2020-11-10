const router = require("express").Router();

const handleLogin = require("./handleLogin");
const handleCreateAccount = require("./handleCreateAccount");

router.post("/login", handleLogin);
router.post("/createAccount", handleCreateAccount);

module.exports = router;
