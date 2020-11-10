const crypto = require("crypto");

const { createTempToken } = require("../managers/tokenManager");
const { getFileData, updateDataOnFile } = require("../managers/fileManager");
const { validateEmail, validatePassword } = require("../helpers/javascript");

const { encryptionConstants } = require("../constants/encryptionConstants");
const { ddbbConstants } = require("../constants/ddbbConstants");
const { errorConstants } = require("../constants/errorConstants");
const {
  SOMETHING_GONE_WRONG,
  BAD_CREDENTIALS,
  EMAIL_BADLY_FORMATTED,
} = errorConstants;

// *************
// It only manages login requests based on user credentials Email and Password
// *************

const handleLogin = async (req, res) => {
  const utf8 = req.headers.authorization || "";
  var email = utf8.split(":");
  var password = email.splice(1, email.length).join(":");
  email = email[0];

  // INPUT VALIDATION
  // TODO. Email should come in base64
  if (!validateEmail(email)) {
    res.status(EMAIL_BADLY_FORMATTED.code).send(EMAIL_BADLY_FORMATTED.message);
  }
  try {
    validatePassword(password, encryptionConstants.PASSWORD_ENCRYPTION);
  } catch (err) {
    res.status(err.code).send(err.message);
    return;
  }

  // FIND USER EMAIL
  const fileData = getFileData(ddbbConstants.USERS_FILE);
  const found = fileData.users.find((item) => item.email === email);
  if (!found) {
    res.status(SOMETHING_GONE_WRONG.code).send(SOMETHING_GONE_WRONG.message);
    return;
  }

  // CHECK PASSWORD CORRECTNESS
  const bufLocalPass = Buffer.from(found.hPass, "hex"); //eslint-disable-line
  const bufReqPass = Buffer.from(password, "hex"); //eslint-disable-line
  if (bufLocalPass.byteLength !== bufReqPass.byteLength) {
    res.status(SOMETHING_GONE_WRONG.code).send(SOMETHING_GONE_WRONG.message);
    return;
  }

  // The next comparison should consider time attacks,
  // but the code overall does not.
  const authorized = crypto.timingSafeEqual(bufReqPass, bufLocalPass);
  if (!authorized) {
    res.status(BAD_CREDENTIALS.code).send(BAD_CREDENTIALS.message);
    return;
  }

  // ASSIGN NEW TOKEN TO USER
  // TODO. Should have encrypt the token.
  const session = await createTempToken(email);
  updateDataOnFile(
    ddbbConstants.USERS_FILE,
    fileData,
    { property: "email", value: email },
    { session }
  );

  // MANAGE NEW USERS
  if (req.isNewUser) {
    res.status(200).send({ message: "Account Created.", token: session.token });
    return;
  }

  // MANAGE RETURNING USERS
  res
    .status(200)
    .send({ message: "Logged in successfully.", token: session.token });
};

module.exports = handleLogin;
