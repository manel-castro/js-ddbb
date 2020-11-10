const crypto = require("crypto");
const { encryptionConstants } = require("./constants/encryptionConstants");

//eslint-disable-next-line
process.argv.splice(2).forEach((val, index, array) => {
  console.log(`Password ${val} has a sha value of:`);
  console.log(shaGenerator(val));
});

function shaGenerator(password) {
  //const password = "123336";
  const hashedPass = crypto
    .createHash(encryptionConstants.PASSWORD_ENCRYPTION)
    .update(password, "utf8")
    .digest()
    .toString("hex");

  //encrypt token with user password. Only send and recive encrypted token.

  return hashedPass;
}
