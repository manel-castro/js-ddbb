const { login, createAccount } = require("../index.js");

console.log("____TESTS____");

exports.loginTest = async (email, password, callback) => {
  console.log("LOG IN TESTS");
  // SET EXPECTED RESULT
  const resMessage = (message) => {
    if (message === "Logged in successfully.") {
      console.log("Message set up correctly: PASSED");
    } else {
      console.log("Message set up correctly: FAILED");
    }
  };
  const resToken = (token) => {
    const subToken = token.split(" ");
    const tokenEmail = subToken[1].split(":")[0];
    if (subToken[0] === "Bearer") {
      console.log("Token starts with 'Bearer ': PASSED");
    } else {
      console.log("Token starts with 'Bearer ': FAILED");
    }
    if (tokenEmail === email) {
      console.log(
        "Token identifier corresponds with the user who logged in: PASSED"
      );
    } else {
      console.log(
        "Token identifier corresponds with the user who logged in: FAILED"
      );
    }
  };
  const error = "Request has failed.";

  // PERFORM THE TEST
  const data = { email: email, password: password };
  await login(data, function (err, res) {
    if (err) {
      error;
      callback(err);
    } else {
      resMessage(res.data.message);
      resToken(res.data.token);
      callback(null, res);
    }
  });
};

exports.createAccountTest = async (email, password) => {
  console.log("CREATE ACCOUNT TESTS");
  // SET EXPECTED RESULT
  const resMessage = (message) => {
    if (message === "Account Created.") {
      console.log("Message set up correctly: PASSED");
    } else {
      console.log("Message set up correctly: FAILED");
    }
  };
  const resToken = (token) => {
    const subToken = token.split(" ");
    const tokenEmail = subToken[1].split(":")[0];
    if (subToken[0] === "Bearer") {
      console.log("Token starts with 'Bearer ': PASSED");
    } else {
      console.log("Token starts with 'Bearer ': FAILED");
    }
    if (tokenEmail === email) {
      console.log(
        "Token identifier corresponds with the user who logged in: PASSED"
      );
    } else {
      console.log(
        "Token identifier corresponds with the user who logged in: FAILED"
      );
    }
  };
  const error = "Request has failed.";

  // PERFORM THE TEST
  const data = { email: email, password: password };
  await createAccount(data, function (err, res) {
    if (err) {
      error;
    } else {
      resMessage(res.data.message);

      resToken(res.data.token);
    }
  });
};
