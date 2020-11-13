const fs = require("fs");

exports.appendReport = (data, origin) => {
  const time = new Date(Date.now());

  let filePath;

  // TODO. Implementing a failure report handling.
  if (origin.type === "user") {
    filePath = `../../../${origin.name}.json`;
  } else if (origin.type === "test") {
    filePath = `./src/test-reports/${origin.name}.json`;
  } else {
    console.error("Something went wrong, report this error. CODE: 1");
    return;
  }

  const newReport = {
    fromTest: origin,
    date: time,
    report: data,
  };

  const stringifyCircular = (obj) => {
    let cache = [];
    let newObj = JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (cache.includes(value)) return;
        cache.push(value);
      }
      return value;
    });
    cache = null;
    return newObj;
  };

  fs.appendFileSync(filePath, stringifyCircular(newReport), (err) => {
    if (err) throw err;
  });

  console.log(typeof report);
};
