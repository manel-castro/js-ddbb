const crypto = require("crypto");

const { getFileData, appendDataOnFile } = require("../managers/fileManager");
const { decodeToken, authToken } = require("../managers/tokenManager");

const { encryptionConstants } = require("../constants/encryptionConstants");
const { ddbbConstants } = require("../constants/ddbbConstants");
const { errorConstants } = require("../constants/errorConstants");
const { BAD_CREDENTIALS } = errorConstants;

const handleCreateDocument = async (req, res) => {
  // AUTHORIZE USER
  const utf8 = req.headers.authorization || "";

  let authorized;

  await authToken(utf8)
    .then((auth) => {
      authorized = auth;
    })
    .catch((err) => {
      res.status(err.code).send(err.message);
      throw err;
    });

  console.log("Is user authorized? ", authorized);

  if (!authorized) {
    res.status(BAD_CREDENTIALS.code).send(BAD_CREDENTIALS.message);
    return;
  }

  // CREATE NEW DOCUMENT
  const reqDocument = req.body;
  console.log("RECEIVED DOCUMENT: ");
  console.log(reqDocument);

  const userCreator = authorized.user;

  let documentId = reqDocument.id;
  if (documentId === undefined) {
    documentId = await crypto
      .randomBytes(encryptionConstants.DOCUMENT_DEFAULT_ID_LENGTH)
      .toString("hex");
  }

  let documentBody = "";
  if (reqDocument.body) {
    documentBody = reqDocument.body;
  }

  let documentDate = new Date(Date.now());

  const newDocument = {
    user: userCreator,
    id: documentId,
    body: documentBody,
    timestamp: documentDate,
  };

  console.log("NEW DOCUMENT IS");
  console.log(newDocument);

  const fileData = await getFileData(ddbbConstants.DOCUMENTS_FILE);
  console.log("FILEDATA___", fileData);
  await appendDataOnFile(ddbbConstants.DOCUMENTS_FILE, fileData, newDocument);

  res.status(200).send("Document created with id", documentId);
};

module.exports = handleCreateDocument;
