const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const auth = require("../middleware/auth");
const constants = require("../constant");

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    const status = constants.statusCodes.createdcode;

    res.send(status, {
      user,
      token,
      status,
      message: constants.successmsgs.createdtext,
    });
  } catch (e) {
    res.status(constants.statusCodes.badrequestcode).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user: user, token, message: constants.successmsgs.loginmsg });
  } catch (e) {
    resloginmsg
      .status(constants.statusCodes.badrequestcode)
      .send(constants.errormsgs.badrequestmsg);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send(constants.successmsgs.sucessfullogout);
  } catch (e) {
    res
      .status(constants.statusCodes.servererrorcode)
      .send(constants.errormsgs.servererrormsg);
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send(constants.successmsgs.sucessfullogoutall);
  } catch (e) {
    res
      .status(constants.statusCodes.servererrorcode)
      .send(constants.errormsgs.servererrormsg);
  }
});

router.get("/users/me", auth, async (req, res) => {
  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch (e) {
  //   res.status(500).send();
  // }

  res.send(req.user);
});

// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const user = await User.findById(_id);

//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    return res
      .status(constants.statusCodes.badrequestcode)
      .send(constants.errormsgs.badrequestmsg);
  }
  try {
    const user = req.user;

    updates.forEach((update) => (user[update] = req.body[update]));

    await user.save();

    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    res.send(user);
  } catch (e) {
    res
      .status(constants.statusCodes.badrequestcode)
      .send(constants.errormsgs.badrequestmsg);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.user._id,
    });

    // await req.user.findOneAndDelete();
    res.send(req.user);
  } catch (e) {
    res
      .status(constants.statusCodes.servererrorcode)
      .send(constants.errormsgs.servererrormsg);
  }
});

module.exports = router;
