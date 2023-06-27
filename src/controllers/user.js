const constants = require("../constant");
const { successMsgs, errorMsgs, statusCodes } = constants;
const { sucess, sucessfulLogout, sucessfulLogoutAll, created, login } =
  successMsgs;
const { badRequest, serverError, unauthorized, notFound } = errorMsgs;
const {
  successC,
  createdC,
  badRequestC,
  unauthorizedC,
  notFoundC,
  serverErrorC,
} = statusCodes;
const generate = require("../utils/generateTokensUtils");

async function postuser(user) {
  const token = await generate(user);

  return token;
}

function userLogin(user) {
  const token = generate(user);

  return token;
}

function updateUser(updates) {
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  return isValidOperation;
}

module.exports = { postuser, userLogin, updateUser };
