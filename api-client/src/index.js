const axios = require("axios");
const crypto = require("crypto");

//---------------------
// TODO. LOGOUT AND ISUSERAUTH
//---------------------

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
      url: api,
      data: {},
      headers: {"Authorization": credentials }, //prettier-ignore
    };

    await axios(axiosRequest)
      .then((res) => {
        //    console.log("RES: ", res);
        callback(null, res);
      })
      .catch((err) => {
        //  console.log("ERR: ", err);
        callback(err.response);
      });
  },

  createAccount: async (data, callback) => {
    const email = data.email;
    const password = data.password;
    const api = constants.apiConstants.apiKey + "users/createAccount";

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

    await axios(axiosRequest)
      .then((res) => {
        //        console.log("RES: ", res);
        callback(null, res);
      })
      .catch((err) => {
        //      console.log("ERR: ", err);
        callback(err.response);
      });
  },

  logout: async (data, callback) => {
    const api = constants.apiConstants.apiKey + "users/logout";
    const token = data.token;

    const axiosRequest = {
      method: "post",
      url: api,
      data: {},
      headers:{"Authorization": token}, //prettier-ignore
    };

    await axios(axiosRequest)
      .then((res) => {
        //    console.log("RES: ", res);
        callback(null, res);
      })
      .catch((err) => {
        //  console.log("ERR: ", err);
        callback(err.response);
      });
  },

  createDocument: async (data, callback) => {
    const token = data.token;
    const id = data.id || undefined;
    const body = data.body || "";
    const api = constants.apiConstants.apiKey + "documents";

    const axiosRequest = {
      method: "put",
      url: api,
      data: {
        "id": id, //prettier-ignore
        "body": body, //prettier-ignore
      },
      headers:{"Authorization": token}, //prettier-ignore
    };

    await axios(axiosRequest)
      .then((res) => {
        callback(null, res);
      })
      .catch((err) => {
        callback(err.response);
      });
  },

  accessDocument: async (data, callback) => {
    const token = data.token;
    const id = data.id;
    const api = constants.apiConstants.apiKey + "documents";

    const axiosRequest = {
      method: "get",
      url: api,
      data: {
        "id": id, //prettier-ignore
      },
      headers:{"Authorization": token}, //prettier-ignore
    };

    await axios(axiosRequest)
      .then((res) => {
        callback(null, res);
      })
      .catch((err) => {
        callback(err.response);
      });
  },

  modifyDocument: async (data, callback) => {
    const token = data.token;
    const id = data.id || undefined;
    if (id === undefined) {
      callback({ code: 401, message: "Specify a document Id" });
      return;
    }
    const body = data.body || "";
    const api = constants.apiConstants.apiKey + "documents";

    const axiosRequest = {
      method: "patch",
      url: api,
      data: {
        "id": id, //prettier-ignore
        "body": body, //prettier-ignore
      },
      headers:{"Authorization": token}, //prettier-ignore
    };

    await axios(axiosRequest)
      .then((res) => {
        callback(null, res);
      })
      .catch((err) => {
        callback(err.response);
      });
  },
  deleteDocument: async (data, callback) => {
    const token = data.token;
    const id = data.id || undefined;
    if (id === undefined) {
      callback({ code: 401, message: "Specify a document Id" });
      return;
    }
    const api = constants.apiConstants.apiKey + "documents";

    const axiosRequest = {
      method: "delete",
      url: api,
      data: {
        "id": id, //prettier-ignore
      },
      headers:{"Authorization": token}, //prettier-ignore
    };

    await axios(axiosRequest)
      .then((res) => {
        callback(null, res);
      })
      .catch((err) => {
        callback(err.response);
      });
  },
};
