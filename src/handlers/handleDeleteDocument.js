const crypto = require("crypto");

const { getFileData, deleteDataOnFile, appendDataOnFile } = require("../managers/fileManager");
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

const handleDeleteDocument = async (req, res) => {
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
    res.status(UNAUTHORIZED.code).send(UNAUTHORIZED.message);
    return;
  }

  const fileData = await getFileData(ddbbConstants.DOCUMENTS_FILE);


  let itemToDelete = fileData.find((item) => item.id === documentId);
  if (!itemToDelete) {
    res.status(UNAUTHORIZED.code).send(UNAUTHORIZED.message)
    return

  }

  if (itemToDelete.user !== userCreator) {
    res.status(UNAUTHORIZED.code).send(UNAUTHORIZED.message);
    return;
  }

  let deletionDate = new Date(Date.now());

  const deletedFilesData = await getFileData(ddbbConstants.DELETED_DOCUMENTS_FILE);
  let idAlreadyExists = deletedFilesData.filter(item => item.id === itemToDelete.id)
  let deletedItemsCount = 0
  if (idAlreadyExists) {
    deletedItemsCount = idAlreadyExists.length

  }

  const newDocument = {
    ...itemToDelete,
    deletionId: "deleted:" + deletedItemsCount + ":" + itemToDelete.id,
    deletionDate: deletionDate,
  };


  appendDataOnFile(ddbbConstants.DELETED_DOCUMENTS_FILE, deletedFilesData, newDocument);

  deleteDataOnFile(
    ddbbConstants.DOCUMENTS_FILE,
    fileData,
    { property: "id", value: documentId }
  );

  res.status(200).send(`Document with id ${documentId} has been successfully deleted.`);
};

module.exports = handleDeleteDocument;
