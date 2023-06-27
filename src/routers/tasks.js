const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");
const constants = require("../constant");

router.post("/tasks", auth, (req, res) => {
  //const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });
  task
    .save()
    .then(() => {
      res
        .status(constants.statusCodes.createdcode)
        .send({ task, message: constants.successmsgs.sucesstext });
    })
    .catch((e) => {
      res
        .status(constants.statusCodes.badrequestcode)
        .send(constants.errormsgs.badrequestmsg);
    });
});

router.get("/tasks", auth, async (req, res) => {
  const sort = {};
  const match = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: "tasks",
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    });

    res.send(req.user.tasks);
  } catch (e) {
    res
      .status(constants.statusCodes.servererrorcode)
      .send(constants.errormsgs.servererrormsg);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res
        .status(constants.statusCodes.notfoundcode)
        .send(constants.errormsgs.notfoundmsg);
    }

    res.send(task);
  } catch (e) {}
  res
    .status(constants.statusCodes.servererrorcode)
    .send(constants.errormsgs.servererrormsg);
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res
      .status(constants.statusCodes.badrequestcode)
      .send(constants.errormsgs.badrequestmsg);
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!task) {
      return res
        .status(constants.statusCodes.notfoundcode)
        .send(constants.errormsgs.notfoundmsg);
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res
      .status(constants.statusCodes.badrequestcode)
      .send(constants.errormsgs.badrequestmsg);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) {
      return res
        .status(constants.statusCodes.notfoundcode)
        .send(constants.errormsgs.notfoundmsg);
    }
    res.send(task);
  } catch (e) {
    res
      .status(constants.statusCodes.servererrorcode)
      .send(constants.errormsgs.servererrormsg);
  }
});

module.exports = router;
