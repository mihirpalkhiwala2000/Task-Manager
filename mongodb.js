// CRUD

// const mongodb = require("mongodb");

// const MongoClient = mongodb.MongoClient;
// const ObjectID=mongodb.ObjectID

const { MongoClient, ObjectID } = require("mongodb");

const databaseName = "task-manager";
const connectionURL = `mongodb://127.0.0.1:27017/${databaseName}`;

const id = new ObjectID();
console.log(id.getTimestamp());

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  async (error, client) => {
    if (error) {
      return console.log("Unable to connect to database!!");
    }

    const db = client.db(databaseName);

    // db.collection("users").findOne(
    //   {
    //     _id: new ObjectID("649025c96c74fa5d8d21df49"),
    //   },
    //   (error, user) => {
    //     if (error) {
    //       return console.log("Unable to fetch");
    //     }
    //     console.log(user);
    //   }
    // );

    // db.collection("users")
    //   .find({
    //     age: 22,
    //   })
    //   .toArray((error, users) => {
    //     console.log(users);
    //   });

    // db.collection("tasks").findOne(
    //   {
    //     _id: new ObjectID("6490274fcd23125f053aa333"),
    //   },
    //   (error, task) => {
    //     if (error) {
    //       console.log("error");
    //     }
    //     console.log(task);
    //   }
    // );

    // db.collection("tasks")
    //   .find({
    //     completed: true,
    //   })
    //   .toArray((error, tasks) => {
    //     console.log(tasks);
    //   });

    // const updatePromise = db
    //   .collection("users")
    //   .updateOne(
    //     {
    //       _id: new ObjectID("6490239eab3ca350b12a8ffe"),
    //     },
    //     {
    //       $inc: {
    //         age: 1,
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    // const updatePromisemany = db
    //   .collection("tasks")
    //   .updateMany(
    //     {
    //       completed: true,
    //     },
    //     {
    //       $set: { completed: false },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .cathc((error) => {
    //     console.log(error);
    //   });

    // db.collection("users")
    //   .deleteMany({
    //     age: 27,
    //   })
    //   .then((result) => {
    //     console.log("Sucessfully Removed");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });

    db.collection("tasks")
      .deleteOne({
        description: "Lunch",
      })
      .then((result) => {
        console.log("Deletd");
      })
      .catch((error) => {
        console.log(error);
      });
  }
);
