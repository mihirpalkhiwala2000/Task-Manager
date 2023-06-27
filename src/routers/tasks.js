import express from "express";
const taskRouter = new express.Router();
export default taskRouter;
import auth from "../middleware/auth.js";
import Task from "../models/task.js";
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
  displayTask,
  taskUpdate,
  createTask,
  findTask,
  taskUpdate2,
} from "../controllers/task.js";

taskRouter.post("/tasks", auth, (req, res) => {
  //const task = new Task(req.body);

  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    createTask(task);
    res.status(createdC).send({ task, message: sucess });
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

taskRouter.get("/tasks", auth, async (req, res) => {
  const reqQuery = req.query;
  const reqUser = req.user;
  const { match, sort, limit, skip } = displayTask(reqQuery);

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

taskRouter.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await findTask(_id, req.user);
    if (!task) {
      return res.status(notFoundC).send(notFound);
    }

    res.send(task);
  } catch (e) {}
  res.status(serverErrorC).send(serverError);
});

taskRouter.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const isValidOperation = taskUpdate(updates);
  if (!isValidOperation) {
    return res.status(badRequestC).send(badRequest);
  }
  try {
    const _id = req.params.id;
    const task = await taskUpdate2(_id, req.user);

    if (!task) {
      console.log("🚀 ~ file: tasks.js:89 ~ taskRouter.patch ~ task:", task);

      return res.status(notFoundC).send(notFound);
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

taskRouter.delete("/tasks/:id", auth, async (req, res) => {
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
