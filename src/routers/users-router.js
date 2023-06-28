import express from "express";
const userRouter = new express.Router();
export default userRouter;
import auth from "../middleware/auth.js";
import constants from "../constant.js";
const { successMsgs, errorMsgs, statusCodes } = constants;
const { successfulLogout, created, login } = successMsgs;
const { badRequest, serverError } = errorMsgs;
const { createdC, badRequestC, serverErrorC } = statusCodes;
import {
  postuser,
  validateUser,
  loginUser,
  updateUser,
  deleteUser,
} from "../controllers/user-controller.js";

userRouter.post("", async (req, res) => {
  try {
    const { user, token } = await postuser(req.body);

    res.status(createdC).send({
      data: user,
      token: token,
      message: created,
    });
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);

    res.send({ user: user, token, message: login });
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

userRouter.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send(successfulLogout);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

userRouter.get("/me", auth, async (req, res) => {
  res.send({ data: req.user });
});

userRouter.patch("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const isValidOperation = validateUser(updates);
  if (!isValidOperation) {
    return res.status(badRequestC).send(badRequest);
  }
  try {
    const user = req.user;
    const retuser = await updateUser(updates, user, req.body);
    res.send({ data: retuser });
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

userRouter.delete("/me", auth, async (req, res) => {
  try {
    deleteUser(req.user._id);
    res.send({ data: req.user });
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});
