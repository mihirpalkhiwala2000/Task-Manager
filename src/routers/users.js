import express from "express";
import User from "../models/user.js";
const userRouter = new express.Router();
export default userRouter;
import auth from "../middleware/auth.js";
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
import { postuser, userLogin, updateUser } from "../controllers/user.js";

userRouter.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = postuser(user);

    res.status(createdC).send({
      user,
      token,
      message: created,
    });
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

userRouter.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await userLogin(user);

    res.send({ user: user, token, message: login });
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

userRouter.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send(sucessfulLogout);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

userRouter.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(sucessfulLogoutAll);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

userRouter.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

userRouter.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const isValidOperation = updateUser(updates);
  if (!isValidOperation) {
    return res.status(badRequestC).send(badRequest);
  }
  try {
    const user = req.user;

    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    res.send(user);
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

userRouter.delete("/users/me", auth, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.user._id,
    });
    res.send(req.user);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});
