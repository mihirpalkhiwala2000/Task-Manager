import express from "express";
import("./db/mongoose.js");
const app = express();
const port = process.env.PORT || 3000;
import userRouter from "./routers/users.js";
import taskRouter from "./routers/tasks.js";

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

import Task from "./models/task.js";
import User from "./models/user.js";

const main = async () => {
  const user = await User.findById("649a65363773927a831e80e9");

  await user.populate("tasks");
};
main();
