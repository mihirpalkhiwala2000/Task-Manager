const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middleware/auth");
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
const { postuser, userLogin, updateUser } = require("../controllers/user");
const findUser = require("../utils/findUtils");

router.post("/users", async (req, res) => {
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

router.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await userLogin(user);

    res.send({ user: user, token, message: login });
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

router.post("/users/logout", auth, async (req, res) => {
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

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(sucessfulLogoutAll);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
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

router.delete("/users/me", auth, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.user._id,
    });
    res.send(req.user);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

module.exports = router;
