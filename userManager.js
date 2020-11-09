const router = require("express").Router();
const handleLogin = require("./handleLogin");

router.get("/", (req, res) => res.send("hello"));
router.post("/login", handleLogin);

module.exports = router;
