const mongoose = require("mongoose");
const validator = require("validator");

mongoose
  .connect("mongodb://127.0.0.1:27017/task-manager-api", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected!"));

const User = mongoose.model("User", {
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be positive number");
      }
    },
  },
  email: {
    type: String,
    require: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
});

const me = new User({
  name: "Mihirr",
  age: 22,
  email: "Mihir@",
});

me.save()
  .then((me) => {
    console.log("🚀 ~ file: mongoose.js:21 ~ .then ~ me:", me);
  })
  .catch((error) => {
    console.log("🚀 ~ file: mongoose.js:24 ~ error:", error);
  });

// const Tasks = new mongoose.model("Tasks", {
//   description: {
//     type: String,
//   },
//   completed: {
//     type: Boolean,
//   },
// });

// const task = new Tasks({
//   description: "Lunch",
//   completed: false,
// });

// task
//   .save()
//   .then((task) => {
//     console.log("🚀 ~ file: mongoose.js:50 ~ .then ~ task:", task);
//   })
//   .catch((error) => {
//     console.log("🚀 ~ file: mongoose.js:53 ~ error:", error);
//   });
