import mongoose from "mongoose";
import dotenv from "dotenv";
mongoose
  .connect(process.env.DB_PORT, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected!"));
