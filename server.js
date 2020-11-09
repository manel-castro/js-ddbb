const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const clone = require("rfdc")();
const app = express();
const port = 8081;

const {
  getFileData,
  appendDataONFile,
  updateDataOnFile,
} = require("./fileManager");
const { createTempToken } = require("./tokenManager");

// creating a SHA256 hash from seed.
//const sha256 = crypto.createHash("sha256");
//const hash = sha256.update("Hello world").digest("base64");

app.get("/", (req, res) => {
  res.send("Hello mate!");
});

app.post("/login", async (req, res) => {
  console.log("Headers");
  const utf8 = req.headers.authorization || "";

  // TODO. we should validate the request header, and split actions depending if email/password or token.

  // Create function "loginWithCredentials"
  var email = utf8.split(":");
  var password = email.splice(1, email.length).join(":");
  email = email[0];

  const fileData = getFileData("user.json");

  const found = fileData.users.find((item) => item.email === email);

  console.log("found debugger: ", found);

  const buf = Buffer.from(found.hPass, "hex");
  const buf2 = Buffer.from(password, "hex");

  //the next comparison should consider time attacks.
  console.log("Password byteLength: ", buf.byteLength);
  if (buf.byteLength !== buf2.byteLength) {
    res.status(400).send("Something gone wrong");
    return;
  }

  console.log("BUF: ", buf);
  console.log("BUF2: ", buf2);
  const authorized = crypto.timingSafeEqual(buf, buf2);
  if (!authorized) {
    res.status(401).send("Bad credentials");
    return;
  }

  //create and assign token
  const session = await createTempToken();
  console.log("SESSION");
  console.log(session);
  updateDataOnFile(
    "user.json",
    fileData,
    { property: "email", value: email },
    { session }
  );

  //If logged with credentials send a token and data requested, if logged with token just send data.
  res.status(200).send(session.token);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
