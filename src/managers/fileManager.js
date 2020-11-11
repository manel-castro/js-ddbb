const fs = require("fs");
const clone = require("rfdc")();

exports.getFileData = async (fileName) => {
  const fileData = await fs.readFileSync(fileName, (err, data) => {
    if (err) {
      console.log(err);
      throw err;
    }
    return JSON.parse(data);
  });

  const parsedData = clone(JSON.parse(fileData));
  return parsedData;
};

exports.appendDataOnFile = (fileName, fileData, dataToWrite) => {
  // dataToWrite must be an object
  const data = clone(fileData);

  data.push(dataToWrite);

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
  const clonedData = clone(fileData);

  const result = clonedData.map((item) => {
    return item[propertyToMatch.property] !== propertyToMatch.value
      ? item
      : { ...item, ...dataToWrite };
  });

  fs.writeFileSync(fileName, JSON.stringify(result), (err) => {
    if (err) throw err;
  });
};


exports.deleteDataOnFile = (
  fileName,
  fileData,
  propertyToMatch,
) => {
  // dataToWrite must be an object
  const clonedData = clone(fileData);

  const result = clonedData.filter((item) => item[propertyToMatch.property] !== propertyToMatch.value);

  fs.writeFileSync(fileName, JSON.stringify(result), (err) => {
    if (err) throw err;
  });
};
