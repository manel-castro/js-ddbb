const app = require("express")();
//const crypto = require("crypto");
//const fs = require("fs");
//const clone = require("rfdc")();
const port = 8081;

//const {
//  getFileData,
//  appendDataONFile,
//  updateDataOnFile,
//} = require("./fileManager");
//const { createTempToken } = require("./tokenManager");

const userManager = require("./userManager");

// creating a SHA256 hash from seed.
//const sha256 = crypto.createHash("sha256");
//const hash = sha256.update("Hello world").digest("base64");

app.use("/users", userManager);

//app.get("/", (req, res) => {
//  res.send("Hello mate!");
//});
//
//app.post("/login", async (req, res) => {
//  console.log("Headers");
//
//  // TODO. we should validate the request header, and split actions depending if email/password or token.
//
//  // Create function "loginWithCredentials"
//
//  //If logged with credentials send a token and data requested, if logged with token just send data.
//  res.status(200).send(session.token);
//});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
