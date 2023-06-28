import express from "express";
import("./db/mongoose.js");
const app = express();
const port = process.env.PORT || 3000;
import userRouter from "./routers/users-router.js";
import taskRouter from "./routers/tasks-router.js";

app.use(express.json());
app.use("/users", userRouter);
app.use("/tasks", taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

import Task from "./models/task-models.js";
import User from "./models/user-models.js";

const main = async () => {
  const user = await User.findById("649a65363773927a831e80e9");

  await user.populate("tasks");
};
main();
