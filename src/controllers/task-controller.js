import Task from "../models/task-models.js";
export function displayTask(reqQuery) {
  const sort = {};
  const match = {};
  if (reqQuery.completed) {
    match.completed = reqQuery.completed === "true";
  }

  if (reqQuery.sortBy) {
    const parts = reqQuery.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  const limit = parseInt(reqQuery.limit);
  const skip = parseInt(reqQuery.skip);
  return { match, sort, limit, skip };
}

export function taskUpdate(updates) {
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  return isValidOperation;
}
export function createTask(task) {
  task.save();
}

export async function findTask(_id, reqUser) {
  const task = await Task.findOne({ _id, owner: reqUser._id });
  return task;
}
export async function taskUpdate2(_id, reqUser) {
  const task = Task.findOne({
    _id: _id,
    owner: reqUser._id,
  });
  return task;
}
export async function taskUpdate3(task, updates, reqBody) {
  updates.forEach((update) => (task[update] = reqBody[update]));
  await task.save();

  return task;
}

export function displayPartiTask(_id, reqUser) {
  return findTask(_id, reqUser);
}

export async function deleteTask(id, user_id) {
  const task = await Task.findOneAndDelete({
    _id: id,
    owner: user_id,
  });

  return task;
}
