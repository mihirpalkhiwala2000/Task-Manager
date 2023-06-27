const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");
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
const { displayTask, taskUpdate } = require("../controllers/task");

router.post("/tasks", auth, (req, res) => {
  //const task = new Task(req.body);

  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  task
    .save()
    .then(() => {
      res.status(createdC).send({ task, message: sucess });
    })
    .catch((e) => {
      res.status(badRequestC).send(badRequest);
    });
});

router.get("/tasks", auth, async (req, res) => {
  const reqQuery = req.query;
  const reqUser = req.user;
  const { match, sort, limit, skip } = displayTask(reqQuery);
  console.log(match);
  try {
    await reqUser.populate({
      path: "tasks",
      match,
      options: {
        limit: limit,
        skip: skip,
        sort,
      },
    });

    res.send(reqUser.tasks);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(notFoundC).send(notFound);
    }

    res.send(task);
  } catch (e) {}
  res.status(serverErrorC).send(serverError);
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const isValidOperation = taskUpdate(updates);
  if (!isValidOperation) {
    return res.status(badRequestC).send(badRequest);
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(notFoundC).send(notFound);
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res.status(notFoundC).send(notFound);
    }
    res.send(task);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});

module.exports = router;
