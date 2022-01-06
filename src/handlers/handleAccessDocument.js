const crypto = require("crypto");

const { getFileData, appendDataOnFile } = require("../managers/fileManager");
const { authToken } = require("../managers/tokenManager");

const { encryptionConstants } = require("../constants/encryptionConstants");
const { ddbbConstants } = require("../constants/ddbbConstants");
const { errorConstants } = require("../constants/errorConstants");
const { ID_ALREADY_EXISTS, ID_MISSING_FIELD, BAD_CREDENTIALS } = errorConstants;

const handleAccessDocument = async (req, res) => {
  // AUTHORIZE USER
  const utf8 = req.headers.authorization || "";

  let authorized;

  try {
    authorized = await authToken(utf8);
  } catch (err) {
    res.status(err.code).send(err.message);
    return;
  }

  console.log("Is user authorized? ", authorized);

  if (!authorized) {
    res.status(BAD_CREDENTIALS.code).send(BAD_CREDENTIALS.message);
    return;
  }

  // CREATE NEW DOCUMENT
  const reqDocument = req.body;
  const fileData = await getFileData(ddbbConstants.DOCUMENTS_FILE);


  console.log("RECEIVED DOCUMENT: ");
  console.log(reqDocument);

  const userCreator = authorized.user;

  let documentId = reqDocument.id;


  if (documentId === undefined) {
    res.status(ID_MISSING_FIELD.code).send(ID_MISSING_FIELD.message);
      return;
    // documentId = await crypto
    //   .randomBytes(encryptionConstants.DOCUMENT_DEFAULT_ID_LENGTH)
    //   .toString("hex");
  } 
  
   
  const document = fileData.find((item) => item.id === documentId);


  res.status(200).send(JSON.stringify(document));
};

module.exports = handleAccessDocument;
