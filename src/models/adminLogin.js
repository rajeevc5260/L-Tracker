const mongoose = require("mongoose");
const db =
  "mongodb+srv://rajeevc:rajeev321@cluster0.w68gpom.mongodb.net/LearnerTracker";

mongoose.connect(db, (err) => {
  if (err) {
    console.error("Error!" + err);
  } else {
    console.log("Connected to Database");
  }
});

const Schema = mongoose.Schema;
const adminLoginSchema = new Schema({
  email: String,
  password: String,
  role: String
});

const adminDetails = mongoose.model("admin", adminLoginSchema);
module.exports = adminDetails;
