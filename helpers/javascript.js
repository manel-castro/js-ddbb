const { errorConstants } = require("../constants/errorConstants");

exports.validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
  return re.test(String(email).toLowerCase());
};

exports.validatePassword = (password, passwordEncryption) => {
  const re = /^[0-9a-zA-Z]+$/;
  if (!re.test(String(password))) {
    throw errorConstants.BAD_CREDENTIALS;
  }

  const cryptLength = ((passwordEncryption) => {
    switch (passwordEncryption) {
      case "SHA1":
        return 20;
      case "SHA256":
        return 256;
      case "SHA512":
        return 512;
    }
  })(passwordEncryption);

  //eslint-disable-next-line
  const passBuf = Buffer.from(password, "hex");
  if (passBuf.byteLength !== cryptLength) {
    throw errorConstants.BAD_CREDENTIALS;
  }

  return true;
};
