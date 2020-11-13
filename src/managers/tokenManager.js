const crypto = require("crypto");

const { getFileData } = require("./fileManager");
const { deepNestFind, validateEmail } = require("../helpers/javascript");

const { encryptionConstants } = require("../constants/encryptionConstants");
const { ddbbConstants } = require("../constants/ddbbConstants");
const { errorConstants } = require("../constants/errorConstants");

// TODO. It seems that this token manager allow certain margin for error on checking slightly different tokens. 

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
  if (header[0] !== "Bearer") throw errorConstants.BAD_CREDENTIALS; // Check that reqToken contains "Bearer "

  const decodedToken = header[1].split(":");

  return decodedToken;
};

exports.authToken = async (token) => {
  console.log("___TOKEN RECEIVED___");
  console.log("Checking...");
  let reqDecodedToken = await decodeToken(token).catch(err => {
    throw err
  });

  const email = reqDecodedToken[0];
  if (!validateEmail(email)) throw errorConstants.BAD_CREDENTIALS // Check email properly formatted

  const fileData = await getFileData(ddbbConstants.USERS_FILE);
  const userData = await deepNestFind("email", email, fileData); // Get local userData by email

  console.log("Authorizing user: ", userData.email);

  // CHECK TOKEN EXPIRATION 
  let dateCreationToken = userData.session.dateCreated;
  let dateExpirationToken = new Date(dateCreationToken);
  dateExpirationToken.setTime(dateExpirationToken.getTime() + encryptionConstants.EXPIRE_TOKEN_TIME * 60 * 60 * 1000)
  let dateNow = new Date(Date.now())

  if (dateNow.getTime() > dateExpirationToken.getTime()) {
    console.log("TOKEN EXPIRED")
    throw errorConstants.TOKEN_EXPIRED;
  }

  // COMPARE REQUESTED AND LOCAL TOKENS
  let localDecodedToken = await decodeToken(userData.session.token);
  // eslint-disable-next-line
  const localBufToken = Buffer.from(localDecodedToken[1], "hex");
  // eslint-disable-next-line
  const reqBufToken = Buffer.from(reqDecodedToken[1], "hex");

  if (localBufToken.byteLength !== reqBufToken.byteLength) { // Prior check of byteLength to avoid breaking timingSafeEqual()
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
