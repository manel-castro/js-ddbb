const crypto = require("crypto");

const { getFileData } = require("./fileManager");
const { deepNestFind } = require("../helpers/javascript");

const { errorConstants } = require("../constants/errorConstants");
const { encryptionConstants } = require("../constants/encryptionConstants");
const { ddbbConstants } = require("../constants/ddbbConstants");

exports.createTempToken = async (email) => {
  // TOKEN DATA CREATION
  const dateToday = new Date(Date.now());
  const dateFuture = new Date(Date.now());
  dateFuture.setDate(dateToday.getDate() + 1);

  // GENERATE RANDOM TOKEN
  const newTokenBuf = await crypto.randomBytes(encryptionConstants.TOKEN_BYTES);
  let newToken = newTokenBuf.toString("hex");

  // APPEND EMAIL TO TOKEN
  newToken = "Bearer " + email + ":" + newToken;

  // TODO. Put relevant client-side variables into an object and encrypt full object

  const token = {
    token: newToken,
    dateCreated: dateToday,
  };
  return token;
};

const decodeToken = async (utf8) => {
  const header = utf8.split(" ");
  //  if (header[0] !== "Bearer") throw errorConstants.BAD_CREDENTIALS;
}
  //  console.log("HEader 1", Buffer.from(header[1], "hex").byteLength); //eslint-disable-line

  const decodedToken = header[1].split(":");
  //const email = decodedToken[0];
  //const token = decodedToken[1];

  //eslint-disable-next-line
  // const passBuf = await Buffer.from(token, "hex");
  // if (passBuf.byteLength !== encryptionConstants.TOKEN_BYTES) {
  //   throw errorConstants.BAD_CREDENTIALS;
  // }
  return decodedToken;
};

exports.authToken = async (token) => {
  console.log("___TOKEN RECEIVED___");
  console.log("Checking...");
  let reqDecodedToken = await decodeToken(token);

  const email = reqDecodedToken[0];

  const fileData = await getFileData(ddbbConstants.USERS_FILE);

  const userData = await deepNestFind("email", email, fileData.users);
  console.log("Authorizing user: ", userData.email);
  let localDecodedToken = await decodeToken(userData.session.token);

  // await decodeToken(userData.session.token)
  //   .then((token) => {
  //     localDecodedToken = token;
  //   })
  //   .catch((err) => {
  //     throw err;
  //   });

  // eslint-disable-next-line
  const localBufToken = Buffer.from(localDecodedToken[1], "hex");
  // eslint-disable-next-line
  const reqBufToken = Buffer.from(reqDecodedToken[1], "hex");

  if (localBufToken.byteLength !== reqBufToken.byteLength) {
    console.log(
      "ByteLength doesn't correspond. Request token: ",
      reqBufToken.byteLength,
      "Local token: ",
      localBufToken.byteLength
    );
    throw errorConstants.SOMETHING_GONE_WRONG;
  }

  const tse = await crypto.timingSafeEqual(localBufToken, reqBufToken);
  if (tse) {
    return { authorized: tse, user: email };
  } else {
    console.log("____AUTHENTICATION FAILED____");
    console.log("TOKEN SENT => ", reqDecodedToken);
    console.log("DATABASE INFORMATION => ", localDecodedToken);
    return { authorized: tse, user: null };
  }
};
