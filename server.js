const express = require("express");
const app = express();
const cors = require("cors");
const { serverConstants } = require("./src/constants/serverConstants");
const handleUser = require("./src/handlers/handleUser");
const handleDocument = require("./src/handlers/handleDocument");
const bodyParser = require("body-parser");

app.use(cors());

app.use(bodyParser({ limit: "50mb" }));
// app.use(express.json());

app.get("/", (req, res) => res.send("Created by Manel Castro."));
app.use("/users", handleUser);
app.use("/documents", handleDocument);

app.listen(serverConstants.SERVER_PORT, () => {
  console.log(`Listening on port ${serverConstants.SERVER_PORT}`);
});
