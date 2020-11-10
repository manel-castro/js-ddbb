const crypto = require("crypto");
const { errorConstants } = require("../constants/errorConstants");
const { encryptionConstants } = require("../constants/encryptionConstants");

exports.createTempToken = async (email) => {
  // TOKEN DATA CREATION
  const dateToday = new Date(Date.now());
  const dateFuture = new Date(Date.now());
  dateFuture.setDate(dateToday.getDate() + 1);

  // GENERATE RANDOM TOKEN
  const newTokenBuf = await crypto.randomBytes(encryptionConstants.TOKEN_BYTES);
  let newToken = newTokenBuf.toString("hex");

  // APPEND EMAIL TO TOKEN
  newToken = email + ":" + newToken;

  // TODO. Put relevant client-side variables into an object and encrypt full object

  const token = {
    token: newToken,
    dateCreated: dateToday,
  };
  return token;
};

exports.decodeToken = async (utf8) => {
  console.log("_______is Token_________");
  console.log("UTF8 is: ", utf8);
  const header = utf8.split(" ");
  if (header[0] !== "Bearer") throw errorConstants.BAD_CREDENTIALS;
  //  console.log("HEader 1", Buffer.from(header[1], "hex").byteLength); //eslint-disable-line
  console.log("HEADER: ", header);
  console.log("HEADER: ", header[1]);

  const decodedToken = header[1].split(":");
  console.log("DECODED", decodedToken);
  const email = decodedToken[0];
  const token = decodedToken[1];
  console.log("-----", Buffer.from(token).byteLength); //eslint-disable-line

  let passBuf;
  try {
    //eslint-disable-next-line
    passBuf = Buffer.from(token, "hex");
  } catch (err) {
    console.log("------", err);
  }
  if (passBuf.byteLength !== encryptionConstants.TOKEN_BYTES) {
    throw errorConstants.BAD_CREDENTIALS;
  }
  console.log(email);
  console.log(token);
  console.log(Buffer.from(token, "hex").byteLength); //eslint-disable-line
  return decodedToken;
};
