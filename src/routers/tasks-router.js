import express, { application } from "express";
const taskRouter = new express.Router();
const app = express();
export default taskRouter;
import auth from "../middleware/auth.js";
import Task from "../models/task-models.js";
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
  displayPartiTask,
  taskUpdate3,
  deleteTask,
} from "../controllers/task-controller.js";

app.route("/tasks");

taskRouter.post("", auth, (req, res) => {
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

taskRouter.get("", auth, async (req, res) => {
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

taskRouter.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await displayPartiTask(_id, req.user);

    if (!task) {
      return res.status(notFoundC).send(notFound);
    }

    return res.send(task);
  } catch (e) {}

  res.status(serverErrorC).send(serverError);
});

taskRouter.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const isValidOperation = taskUpdate(updates);
  if (!isValidOperation) {
    return res.status(badRequestC).send(badRequest);
  }
  try {
    const _id = req.params.id;
    const task = await taskUpdate2(_id, req.user);

    if (!task) {
      return res.status(notFoundC).send(notFound);
    }
    const rettask = await taskUpdate3(task, updates, req.body);

    res.send(rettask);
  } catch (e) {
    res.status(badRequestC).send(badRequest);
  }
});

taskRouter.delete("/:id", auth, async (req, res) => {
  try {
    const task = await deleteTask(req.params.id, req.user._id);

    if (!task) {
      return res.status(notFoundC).send(notFound);
    }
    res.send(task);
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});
