const { v4: uuidv4 } = require("uuid");
const { loginTest, createAccountTest, logoutTest } = require("./userTests");
const {
  createDocumentTestWithIdAndBody,
  createDocumentTest,
  modifyDocumentTest,
  deleteDocumentTest,
} = require("./documentTests");
// TESTING
const testing = async () => {
  const rand = uuidv4();
  const newUser = rand + "@email.com";
  await createAccountTest(newUser, rand);
  console.log("----------");
  let token;
  await loginTest(newUser, rand, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      token = res.data.token;
    }
  });

  // ***************
  // TODO. problem with token, it allow certain variability.
  //  token =
  //    "Bearer a5236bce-64d8-4716-923b-2d64ee7df572@email.com:0c5111a4738b24521f1fe609defd27852f5e619def2b9f88492dce86141581be";
  // ***************

  //  await createDocumentTest(token);
  const testId = uuidv4();
  await createDocumentTestWithIdAndBody(token, testId, "thisIsABodyExample");
  await modifyDocumentTest(token, testId, "thisIsAModifiedBody");
  await deleteDocumentTest(token, testId);
  await logoutTest(token);
};

testing();
