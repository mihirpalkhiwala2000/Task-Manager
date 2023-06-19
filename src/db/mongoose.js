import mongoose from "mongoose";

mongoose
  .connect("mongodb://127.0.0.1:27017/task-manager-api", {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected!"));

const User = mongoose.model("User", {
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
});

const me = new User({
  name: "Mihir",
  age: 22,
});

await me
  .save()
  .then((me) => {
    console.log("🚀 ~ file: mongoose.js:21 ~ .then ~ me:", me);
  })
  .catch((error) => {
    console.log("🚀 ~ file: mongoose.js:24 ~ error:", error);
  });
