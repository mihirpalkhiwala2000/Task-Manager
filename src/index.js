const express = require("express");
require("./db/mongoose");

const app = express();
const port = process.env.PORT || 3000;
const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET requests are disabled");
//   } else {
//     next();
//   }
// });

// app.use((req, res, next) => {
//   if (req) {
//     res.status(503).send("Site is under maintainance");
//   } else {
//     next();
//   }
// });

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

const Task = require("./models/task");
const User = require("./models/user");

const main = async () => {
  // const task = await Task.findById("64993a21a7b3a59710109853");
  // await task.populate("owner");
  // console.log(task.owner);
  const user = await User.findById("649939ec260e6b55b6b89798");

  // await user.populate("tasks");
  // console.log(user.tasks);
};
main();
