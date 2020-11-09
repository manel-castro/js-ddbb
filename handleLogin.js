const crypto = require("crypto");
const { createTempToken, decodeToken } = require("./tokenManager");
const { getFileData, updateDataOnFile } = require("./fileManager");

const handleLogin = async (req, res) => {
  const utf8 = req.headers.authorization || "";
  try {
		//if there is a token it will decode it. 
    decodeToken(utf8);
  } catch (err) {
    res.status(401).send(err);
    return;
  }
  var email = utf8.split(":");
  var password = email.splice(1, email.length).join(":");
  email = email[0];

  const fileData = getFileData("user.json");

  const found = fileData.users.find((item) => item.email === email);

  console.log("found debugger: ", found);

  const buf = Buffer.from(found.hPass, "hex"); //eslint-disable-line
  const buf2 = Buffer.from(password, "hex"); //eslint-disable-line

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

  res.status(200).send(session.token);
};

module.exports = handleLogin;