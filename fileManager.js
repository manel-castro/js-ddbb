const fs = require("fs");
const clone = require("rfdc")();

exports.getFileData = (fileName) => {
  const fileData = fs.readFileSync(fileName, (err, data) => {
    if (err) {
      throw err;
    }
    return JSON.parse(data);
  });

  const parsedData = JSON.parse(fileData);
  return parsedData;
};

exports.appendDataOnFile = (fileName, fileData, dataToWrite) => {
  // dataToWrite must be an object
  //  console.log(parsedData);
  const data = clone(fileData);

  data.users.push(dataToWrite);

  fs.writeFileSync(fileName, JSON.stringify(data), (err) => {
    if (err) throw err;
  });
};

exports.updateDataOnFile = (
  fileName,
  fileData,
  propertyToMatch,
  dataToWrite
) => {
  // dataToWrite must be an object
  const data = clone(fileData);

  data.users = fileData.users.map((item) => {
    return item[propertyToMatch.property] !== propertyToMatch.value
      ? item
      : { ...item, ...dataToWrite };
  });

  fs.writeFileSync(fileName, JSON.stringify(data), (err) => {
    if (err) throw err;
  });
};
