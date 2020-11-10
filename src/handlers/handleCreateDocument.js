const crypto = require("crypto");

const { getFileData, appendDataOnFile } = require("../managers/fileManager");
const { decodeToken } = require("../managers/tokenManager");

const { encryptionConstants } = require("../constants/encryptionConstants");
const { ddbbConstants } = require("../constants/ddbbConstants");
const { errorConstants } = require("../constants/errorConstants");

const handleCreateDocument = async (req, res) => {
  const utf8 = req.headers.authorization || "";

  let decodedToken = [];
  try {
    decodeToken(utf8);
  } catch (err) {
    console.log(err);
    res.status(err.code).send(err.message);
    return;
  }
  console.log("decodedTOken is: ", decodedToken);

  res.status(200).send("Creating document");
};

module.exports = handleCreateDocument;
