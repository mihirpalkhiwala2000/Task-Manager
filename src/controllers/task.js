function displayTask(reqQuery) {
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

function taskUpdate(updates) {
  console.log("new place");
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  return isValidOperation;
}

module.exports = {
  displayTask,
  taskUpdate,
};
