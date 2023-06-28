import User from "../models/user-models.js";
import generate from "../utils/generateTokensUtils.js";

export const postuser = async (reqBody) => {
  const user = new User(reqBody);
  await user.save();
  const token = await generate(user);

  return { user, token };
};

export function userLogin(user) {
  const token = generate(user);

  return token;
}

export function validateUser(updates) {
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  return isValidOperation;
}

export async function updateUser(updates, user, reqBody) {
  updates.forEach((update) => (user[update] = reqBody[update]));

  await user.save();

  return user;
}

export async function loginUser(email, password) {
  const user = await User.findByCredentials(email, password);
  const token = await userLogin(user);

  return { user, token };
}

export async function deleteUser(requser_id) {
  await User.findOneAndDelete({
    _id: requser_id,
  });
}
