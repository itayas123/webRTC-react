const jwt = require("jsonwebtoken");

function getUserIdByToken(token) {
  const { _id = "" } = jwt.decode(token);
  return _id;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = { asyncForEach, getUserIdByToken };