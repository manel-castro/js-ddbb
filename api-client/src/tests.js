const { login } = require("./index.js");

const loginTest = async (email, password) => {
  const data = { email: email, password: password };
  await login(data, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res);
    }
  });
};
console.log(login);
loginTest("manel1@gmail.com", "11111");
