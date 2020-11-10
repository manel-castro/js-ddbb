const crypto = require("crypto");
const { createTempToken } = require("./tokenManager");
const { getFileData, updateDataOnFile } = require("./fileManager");
const { encryptionConstants } = require("./constants/encryptionConstants");
const { ddbbConstants } = require("./constants/ddbbConstants");
const { errorConstants } = require("./constants/errorConstants");
const {
  SOMETHING_GONE_WRONG,
  BAD_CREDENTIALS,
  EMAIL_BADLY_FORMATTED,
} = errorConstants;
const { validateEmail, validatePassword } = require("./helpers/javascript");

// It only manages login requests based on user credentials Email and Password
const handleLogin = async (req, res) => {
  const utf8 = req.headers.authorization || "";

  //const isToken = utf8.split(" ")[0] === "Bearer" ? true : false;

  // we'll only decode tokens when accessing to our database
  // if (isToken) {
  //   //handleToken(utf8)
  //   try {
  //     //if there is a token it will decode it.
  //     decodeToken(utf8);
  //   } catch (err) {
  //     res.status(401).send(err);
  //     return;
  //   }
  // }
  var email = utf8.split(":");
  var password = email.splice(1, email.length).join(":");
  email = email[0];

  //validate email
  // Email should come in base64
  if (!validateEmail(email)) {
    res.status(EMAIL_BADLY_FORMATTED.code).send(EMAIL_BADLY_FORMATTED.message);
  }

  // Validates if the password is properly formated as some kind of SHA.
  try {
    validatePassword(password, encryptionConstants.PASSWORD_ENCRYPTION);
  } catch (err) {
    res.status(err.code).send(err.message);
    return;
  }

  const fileData = getFileData(ddbbConstants.USERS_FILE);
  const found = fileData.users.find((item) => item.email === email);
  if (!found) {
    res.status(SOMETHING_GONE_WRONG.code).send(SOMETHING_GONE_WRONG.message);
    return;
  }

  const bufLocalPass = Buffer.from(found.hPass, "hex"); //eslint-disable-line
  const bufReqPass = Buffer.from(password, "hex"); //eslint-disable-line

  //the next comparison should consider time attacks.
  if (bufLocalPass.byteLength !== bufReqPass.byteLength) {
    res.status(SOMETHING_GONE_WRONG.code).send(SOMETHING_GONE_WRONG.message);
    return;
  }

  const authorized = crypto.timingSafeEqual(bufReqPass, bufLocalPass);
  if (!authorized) {
    res.status(BAD_CREDENTIALS.code).send(BAD_CREDENTIALS.message);
    return;
  }

  //create and assign token
  const session = await createTempToken();
  updateDataOnFile(
    ddbbConstants.USERS_FILE,
    fileData,
    { property: "email", value: email },
    { session }
  );

  // trying to encrypt token. Should use AES or any kind of public key of the user. There are some kinds of handshakes too.
  // crypto
  //   .createHash(encryptionConstants.PASSWORD_ENCRYPTION)
  //   .update(password, "utf8")
  //   .digest()
  //   .toString("hex");

  // control for new users comming from CreateAccount
  if (req.isNewUser) {
    res.status(200).send({ message: "Account Created.", token: session.token });
  }

  res
    .status(200)
    .send({ message: "Logged in successfully.", token: session.token });
};

module.exports = handleLogin;
