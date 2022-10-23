const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://rajeevc:rajeev321@cluster0.w68gpom.mongodb.net/LearnerTracker"
);

const Schema = mongoose.Schema;
const learnersDataSchema = new Schema({
  learnerId: String,
  name: String,
  project: String,
  batch: String,
  courseStatus: String,
  placementStatus: String,
});

const learnersData = mongoose.model("learnersDetails", learnersDataSchema);

module.exports = learnersData;
