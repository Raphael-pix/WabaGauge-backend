const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://127.0.0.1:27017/smartWaterDb")
  .then(() => console.log("connected mongo db"))
  .catch((e) => console.log(e));

