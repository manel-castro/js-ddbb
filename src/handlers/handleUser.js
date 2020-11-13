const router = require("express").Router();

const handleLogin = require("./handleLogin");
const handleLogout = require("./handleLogout");
const handleCreateAccount = require("./handleCreateAccount");

router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.post("/createAccount", handleCreateAccount);

module.exports = router;
