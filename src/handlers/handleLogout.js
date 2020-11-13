const crypto = require("crypto");

const { authToken } = require("../managers/tokenManager");
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

const handleLogout = async (req, res) => {
  const utf8 = req.headers.authorization || "";

  let authorized;

  try {
    authorized = await authToken(utf8);
  } catch (err) {
    res.status(err.code).send(err.message);
    return;
  }
  const email = authorized.user;

  console.log("Is user authorized? ", authorized);

  if (!authorized) {
    res.status(BAD_CREDENTIALS.code).send(BAD_CREDENTIALS.message);
    return;
  }

  // FIND USER EMAIL
  const fileData = await getFileData(ddbbConstants.USERS_FILE);
  const found = fileData.find((item) => item.email === email);
  if (!found) {
    res.status(SOMETHING_GONE_WRONG.code).send(SOMETHING_GONE_WRONG.message);
    return;
  }

  // DELETE TOKEN IN USER DDBB
  // TODO. Should have encrypt the token.
  //
  const session = {};

  updateDataOnFile(
    ddbbConstants.USERS_FILE,
    fileData,
    { property: "email", value: email },
    { session }
  );

  res.status(200).send({ message: "User logout." });
};

module.exports = handleLogout;
