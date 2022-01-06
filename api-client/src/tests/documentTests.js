const {
  deleteDocument,
  modifyDocument,
  createDocument,
  accessDocument,
} = require("../index.js");
const { appendReport } = require("../helpers/fileSystem");

exports.createDocumentTest = async (token) => {
  console.log("------------------------------");
  console.log("CREATE DOCUMENT");
  const nameTest = "createDocumentTest";

  await createDocument({ token }, function (err, res) {
    if (err) {
      console.log(`An error happened on ${nameTest}: `);
      console.log(err.data);
      appendReport(err, { type: "test", name: nameTest });
      console.log("A full report can be found on test-reports folder");
    } else {
      console.log(res.data);
    }
  });
};

exports.createDocumentTestWithIdAndBody = async (token, id, body) => {
  console.log("------------------------------");
  console.log("CREATE DOCUMENT WITH ID AND BODY");
  const nameTest = "createDocumentTestWithIdAndBody";
  await createDocument({ token, id, body }, function (err, res) {
    if (err) {
      console.log(`An error happened on ${nameTest}: `);
      console.log(err.data);
      appendReport(err, { type: "test", name: nameTest });
      console.log("A full report can be found on test-reports folder");
    } else {
      console.log(res.data);
    }
  });
};

exports.accessDocumentWithId = async (token, id) => {
  console.log("------------------------------");
  console.log("ACCESS DOCUMENT WITH ID");
  const nameTest = "accessDocumentWithId";
  await accessDocument({ token, id }, function (err, res) {
    if (err) {
      console.log(`An error happened on ${nameTest}: `);
      console.log(err.data);
      appendReport(err, { type: "test", name: nameTest });
      console.log("A full report can be found on test-reports folder");
    } else {
      console.log(res.data);
    }
  });
};

exports.modifyDocumentTest = async (token, id, body) => {
  console.log("------------------------------");
  console.log("MODIFY DOCUMENT");
  const nameTest = "modifyDocumentTest";
  await modifyDocument({ token, id, body }, async (err, res) => {
    if (err) {
      console.log(`An error happened on ${nameTest}: `);
      console.log(err.data);
      appendReport(err, { type: "test", name: nameTest });
      console.log("A full report can be found on test-reports folder");
    } else {
      console.log(res.data);
    }
  });
};

exports.deleteDocumentTest = async (token, id) => {
  console.log("------------------------------");
  console.log("DELETE DOCUMENT");
  const nameTest = "deleteDocumentTest";
  await deleteDocument({ token, id }, function (err, res) {
    if (err) {
      console.log(`An error happened on ${nameTest}: `);
      console.log(err.data);
      appendReport(err, { type: "test", name: nameTest });
      console.log("A full report can be found on test-reports folder");
    } else {
      console.log(res.data);
    }
  });
};
