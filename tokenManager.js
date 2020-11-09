const crypto = require("crypto");
const { errorConstants } = require("./constants/errorConstants");

exports.createTempToken = async () => {
  const dateToday = new Date(Date.now());
  const dateFuture = new Date(Date.now());
  dateFuture.setDate(dateToday.getDate() + 1);
  const newTokenBuf = await crypto.randomBytes(256);
  let newToken = newTokenBuf.toString("hex");

  // TODO need to include email adress somehow in the token

  const token = {
    token: newToken,
    dateCreated: dateToday,
  };
  return token;
};

exports.decodeToken = (utf8) => {
  console.log("_______is Token_________");
  console.log("UTF8 is: ", utf8);
  const header = utf8.split(" ");
  if (header[0] !== "Bearer") throw errorConstants.BAD_CREDENTIALS;
  console.log("HEader 1", Buffer.from(header[1], "hex").byteLength); //eslint-disable-line
  //eslint-disable-next-line
  if (Buffer.from(header[1], "hex").byteLength !== 256)
    //eslint-disable-line
    throw errorConstants.BAD_CREDENTIALS;
  console.log(header[0]);
  console.log(header[1]);
};
