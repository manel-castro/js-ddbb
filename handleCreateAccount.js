const handleLogin = require("./handleLogin");
const { validateEmail, validatePassword } = require("./helpers/javascript");
const { getFileData, appendDataOnFile } = require("./fileManager");
const { errorConstants } = require("./constants/errorConstants");
const { EMAIL_ALREADY_EXISTS, EMAIL_BADLY_FORMATTED } = errorConstants;
const { encryptionConstants } = require("./constants/encryptionConstants");
const { ddbbConstants } = require("./constants/ddbbConstants");

// It only manages login requests based on user credentials Email and Password
const handleCreateUser = async (req, res) => {
  const utf8 = req.headers.authorization || "";

  var email = utf8.split(":");
  var password = email.splice(1, email.length).join(":");
  email = email[0];

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
  const bufReqPass = Buffer.from(password, "hex"); //eslint-disable-line
  console.log("PASS LENGTH: ", bufReqPass.byteLength);

  const fileData = getFileData(ddbbConstants.USERS_FILE);
  const found = fileData.users.find((item) => item.email === email);
  if (found) {
    res.status(EMAIL_ALREADY_EXISTS.code).send(EMAIL_ALREADY_EXISTS.message);
    return;
  }

  const newUser = {
    email: email,
    hPass: password,
  };

  //Write data on file.
  appendDataOnFile(ddbbConstants.USERS_FILE, fileData, newUser);

  //Handle Login
  req.isNewUser = true;
  handleLogin(req, res);

  //res.status(200).send("Account created.");
};

module.exports = handleCreateUser;
