const handleLogin = require("./handleLogin");
const { validateEmail, validatePassword } = require("../helpers/javascript");
const { getFileData, appendDataOnFile } = require("../managers/fileManager");

const { encryptionConstants } = require("../constants/encryptionConstants");
const { ddbbConstants } = require("../constants/ddbbConstants");
const { errorConstants } = require("../constants/errorConstants");
const { EMAIL_ALREADY_EXISTS, EMAIL_BADLY_FORMATTED } = errorConstants;

// ****************
// It only manages login requests based on user credentials Email and Hashed Password.
// ****************

const handleCreateUser = async (req, res) => {
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

  //const bufReqPass = Buffer.from(password, "hex"); //eslint-disable-line

  // CHECK MAIL AVAILABILITY
  const fileData = getFileData(ddbbConstants.USERS_FILE);
  const found = fileData.users.find((item) => item.email === email);
  if (found) {
    res.status(EMAIL_ALREADY_EXISTS.code).send(EMAIL_ALREADY_EXISTS.message);
    return;
  }

  // REGISTERS NEW DATA ON FILE
  const newUser = {
    email: email,
    hPass: password,
  };
  appendDataOnFile(ddbbConstants.USERS_FILE, fileData, newUser);

  // SENDS A LOGIN REQUEST
  req.isNewUser = true;
  handleLogin(req, res);
};

module.exports = handleCreateUser;
