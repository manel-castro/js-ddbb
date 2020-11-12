const { login } = require("./index.js");

const loginTest = (email, password) => {
  login(email, password)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
};

loginTest("manel1@gmail.com", "11111");
