const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://rajeevc:rajeev321@cluster0.w68gpom.mongodb.net/LearnerTracker"
);

const placementAuthSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String

});


const placementAuthData = mongoose.model("placementOfficerAuth", placementAuthSchema);

module.exports = placementAuthData;
