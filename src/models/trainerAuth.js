const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://rajeevc:rajeev321@cluster0.w68gpom.mongodb.net/LearnerTracker"
);

const trainerAuthSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
});

const trainerAuthData = mongoose.model("trainerHeadAuth", trainerAuthSchema);

module.exports = trainerAuthData;
