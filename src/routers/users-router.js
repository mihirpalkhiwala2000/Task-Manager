import express from "express";
import User from "../models/user-models.js";
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
import {
  postuser,
  userLogin,
  updateUser,
  loginUser,
  updateUser2,
  deleteUser,
} from "../controllers/user-controller.js";

userRouter.post("", async (req, res) => {
  try {
    const { user, token } = await postuser(req.body);

    res.status(createdC).send({
      user,
      token,
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
    res.send(sucessfulLogout);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

userRouter.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(sucessfulLogoutAll);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

userRouter.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

userRouter.patch("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const isValidOperation = updateUser(updates);
  if (!isValidOperation) {
    return res.status(badRequestC).send(badRequest);
  }
  try {
    const user = req.user;
    const retuser = updateUser2(updates, user, req.body);

    res.send(user);
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

userRouter.delete("/me", auth, async (req, res) => {
  try {
    deleteUser(req.user._id);
    res.send(req.user);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});
