import express from "express";
const taskRouter = new express.Router();
const app = express();
export default taskRouter;
import auth from "../middleware/auth.js";
import Task from "../models/task-models.js";
import constants from "../constant.js";
const { successMsgs, errorMsgs, statusCodes } = constants;
const { success } = successMsgs;
const { badRequest, serverError, notFound } = errorMsgs;
const { createdC, badRequestC, notFoundC, serverErrorC } = statusCodes;
import {
  displayTask,
  validation,
  createTask,
  findingUser,
  displayPartiTask,
  taskUpdate,
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
    res.status(createdC).send({ data: task, message: success });
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

    res.send({ data: reqUser.tasks });
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

    return res.send({ data: task });
  } catch (e) {}

  res.status(serverErrorC).send(serverError);
});

taskRouter.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const isValidOperation = validation(updates);
  if (!isValidOperation) {
    return res.status(badRequestC).send(badRequest);
  }
  try {
    const _id = req.params.id;
    const task = await findingUser(_id, req.user);

    if (!task) {
      return res.status(notFoundC).send(notFound);
    }
    const rettask = await taskUpdate(task, updates, req.body);

    res.send({ data: rettask });
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
    res.send({ data: task });
  } catch (e) {
    res.status(serverErrorC).send(serverError);
  }
});
