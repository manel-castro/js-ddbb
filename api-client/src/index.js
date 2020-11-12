const axios = require("axios");
const crypto = require("crypto");

const constants = {
  apiConstants: {
    apiKey: "http://localhost:8081/",
  },
  proxy: {
    host: "127.0.0.1",
    port: 8081,
  },
};

module.exports = {
  login: async (data, callback) => {
    const email = data.email;
    const password = data.password;
    const api = constants.apiConstants.apiKey + "users/login";

    // SET UP CREDENTIALS HEADER
    const hashedPass = await crypto
      .createHash("SHA1")
      .update(password, "utf8")
      .digest()
      .toString("hex");
    const credentials = email + ":" + hashedPass;

    const axiosRequest = {
      method: "post",
      url: "http://localhost:8081/users/login",
      data: {},
      headers: {"Authorization": credentials }, //prettier-ignore
    };

    await axios(axiosRequest)
      .then((res) => {
        console.log("RES: ", res);
        callback(null, res);
      })
      .catch((err) => {
        console.log("ERR: ", err);
        callback(err.response);
      });
  },

  createAccount: async (email, password) => {
    const api = constants.apiConstants.apiKey + "users/login";

    // SET UP CREDENTIALS HEADER
    const hashedPass = await crypto
      .createHash("SHA1")
      .update(password, "utf8")
      .digest()
      .toString("hex");
    const credentials = email + ":" + hashedPass;

    const axiosRequest = {
      method: "post",
      url: api,
      data: {},
      headers: {"Authorization": credentials }, //prettier-ignore
    };

    axios(axiosRequest)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  },
};
