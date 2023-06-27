import constants from "../constant.js";
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
import generate from "../utils/generateTokensUtils.js";

export const postuser = async (user) => {
  const token = await generate(user);

  return token;
};

export function userLogin(user) {
  const token = generate(user);

  return token;
}

export function updateUser(updates) {
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  return isValidOperation;
}
