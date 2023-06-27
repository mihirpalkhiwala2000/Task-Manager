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
  const user = await User.findById("649a65363773927a831e80e9");

  await user.populate("tasks");
};
main();
