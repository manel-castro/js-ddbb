const crypto = require("crypto");

const { getFileData, updateDataOnFile } = require("../managers/fileManager");
const { decodeToken, authToken } = require("../managers/tokenManager");

const { encryptionConstants } = require("../constants/encryptionConstants");
const { ddbbConstants } = require("../constants/ddbbConstants");
const { errorConstants } = require("../constants/errorConstants");
const {
  BODY_REQUEST_MISSING,
  BAD_CREDENTIALS,
  UNAUTHORIZED,
  SOMETHING_GONE_WRONG,
} = errorConstants;

const handleModifyDocument = async (req, res) => {
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

  if (reqDocument.body === undefined) {
    res.status(BODY_REQUEST_MISSING.code).send(BODY_REQUEST_MISSING.message);
    return;
  }
  let documentBody = reqDocument.body;

  let documentId = reqDocument.id;
  if (documentId === undefined) {
    res.status(UNAUTHORIZED.code).send(UNAUTHORIZED.message);
    return;
  }

  const fileData = await getFileData(ddbbConstants.DOCUMENTS_FILE);

  let itemToModify = fileData.find((item) => item.id === documentId);

  if (itemToModify.user !== userCreator) {
    res.status(UNAUTHORIZED.code).send(UNAUTHORIZED.message);
    return;
  }

  let modificationDate = new Date(Date.now());

  const newDocument = {
    body: documentBody,
    lastModification: modificationDate,
  };

  console.log("NEW DOCUMENT IS");
  console.log(newDocument);

  console.log("FILEDATA___", fileData);
  await updateDataOnFile(
    ddbbConstants.DOCUMENTS_FILE,
    fileData,
    { property: "id", value: itemToModify.id },
    newDocument
  );

  res.status(200).send(`Document with id ${documentId} modified successfully.`);
};

module.exports = handleModifyDocument;
