const crypto = require("crypto");
exports.createTempToken = async () => {
  const dateToday = new Date(Date.now());
  const dateFuture = new Date(Date.now());
  dateFuture.setDate(dateToday.getDate() + 1);
  const newTokenBuf = crypto.randomBytes(256);
  const newToken = newTokenBuf.toString("hex");

  const token = {
    token: newToken,
    dateCreated: dateToday,
  };
  return token;
};
