const path = require("path");
exports.ddbbConstants = {
  //eslint-disable-next-line
  USERS_FILE: path.resolve(__dirname, "../../database/users.json"),
  DOCUMENTS_FILE: path.resolve(
    //eslint-disable-next-line
    __dirname,
    "../../database/documents/documents.json"
  ),
};
