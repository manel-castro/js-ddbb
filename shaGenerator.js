const crypto = require("crypto");

process.argv.splice(2).forEach((val, index, array) => {
  console.log(`Password ${val} has a sha value of:`);
  console.log(shaGenerator(val));
});

function shaGenerator(password) {
  //const password = "123336";

  return (hashedValue = crypto
    .createHash("sha256")
    .update(password, "utf8")
    .digest()
    .toString("hex"));
}
