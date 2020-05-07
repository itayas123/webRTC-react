const jwt = require("jsonwebtoken");

function getUserIdByToken(token) {
  const decoded = (token && jwt.decode(token)) || {};
  return decoded._id || "";
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = { asyncForEach, getUserIdByToken };
