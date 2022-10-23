const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");
const adminDetails = require("./src/models/adminLogin");
const learnersData = require("./src/models/learnersData");
const placementAuthData = require("./src/models/placementAuth");
const trainerAuthData = require("./src/models/trainerAuth");
const jwt = require("jsonwebtoken");
const path = require('path');

// const PORT = 3000;


const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('./dist/learner-tracker'));

// Tested
app.get("/", (req, res) => {
  res.send("Server is ready GET");
});

// middleware function to verify Token
function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Unauthorized request");
  }
  let token = req.headers.authorization.split(" ")[1];
  if (token === "null") {
    return res.status(401).send("Unauthorized request");
  }
  let payload = jwt.verify(token, "secretKey");
  if (!payload) {
    return res.status(401).send("Unauthorized request");
  }
  req.adminId = payload.subject;
  next();
}

// Admin Login
app.post("/api/login", (req, res) => {
  let adminData = req.body;

  adminDetails.findOne({ email: adminData.email }, (error, admin) => {
    if (error) {
      console.log(error);
    } else {
      if (!admin) {
        res.status(401).send("Invalid email");
      } else {
        if (admin.password !== adminData.password) {
          res.status(401).send("Invalid password");
        } else {
          let payload = { subject: admin._id };
          let token = jwt.sign(payload, "secretKey");
          res.status(200).send({ token });
        }
      }
    }
  });
});

// placement Officer Login
app.post("/api/placementLogin", (req, res) => {
  let placementData = req.body;

  placementAuthData.findOne(
    { email: placementData.email },
    (error, placement) => {
      if (error) {
        console.log(error);
      } else {
        if (!placement) {
          res.status(401).send("Invalid email");
        } else {
          if (placement.password !== placementData.password) {
            res.status(401).send("Invalid password");
          } else {
            let payload = { subject: placement._id };
            let token = jwt.sign(payload, "secretKey");
            res.status(200).send({ token });
          }
        }
      }
    }
  );
});

// TrainerHead Login
app.post("/api/trainerLogin", (req, res) => {
  let trainerData = req.body;

  trainerAuthData.findOne(
    { email: trainerData.email },
    (error, trainer) => {
      if (error) {
        console.log(error);
      } else {
        if (!trainer) {
          res.status(401).send("Invalid email");
        } else {
          if (trainer.password !== trainerData.password) {
            res.status(401).send("Invalid password");
          } else {
            let payload = { subject: trainer._id };
            let token = jwt.sign(payload, "secretKey");
            res.status(200).send({ token });
          }
        }
      }
    }
  );
});

// Insert placement officer
app.post("/api/addPlacementData", verifyToken, (req, res) => {
  var placementAuthDetails = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  };
  var addPlacementAuthData = placementAuthData(placementAuthDetails);
  addPlacementAuthData.save();

  placementAuthData.find().then((addPlacementAuthData) => {
    res.send(addPlacementAuthData);
  });
});

// Insert Trainer head
app.post("/api/addTrainerHeadData", verifyToken, (req, res) => {
  var trainerAuthDetails = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  };
  var addTrainerAuthData = trainerAuthData(trainerAuthDetails);
  addTrainerAuthData.save();

  trainerAuthData.find().then((addTrainerAuthData) => {
    res.send(addTrainerAuthData);
  });
});

// insert Single Learners data POST
app.post("/api/addData", verifyToken, (req, res) => {
  var learnerDetails = {
    learnerId: req.body.learnerId,
    name: req.body.name,
    project: req.body.project,
    batch: req.body.batch,
    courseStatus: req.body.courseStatus,
  };
  var addLearnerData = learnersData(learnerDetails);
  addLearnerData.save();

  learnersData.find().then((addLearnerData) => {
    res.send(addLearnerData);
  });
});

// insert multiple Learners data POST
app.post("/api/addMultipleData", verifyToken, (req, res) => {
  learnersData
    .insertMany(req.body)
    .then((learnersDatas) => {
      res.status(201).send(learnersDatas);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

// Read learners Details in Analytics
app.get("/api/learnerAnalytics", verifyToken, (req, res) => {
  learnersData.find().then((addLearnerData) => {
    res.send(addLearnerData);
  });
});

// Read Placement officer Auth
app.get("/api/placementAuthDetails", verifyToken, (req, res) => {
  placementAuthData.find().then((addPlacementAuthData) => {
    res.send(addPlacementAuthData);
  });
});

// Read Trainer head Auth
app.get("/api/trainerAuthDetails", verifyToken, (req, res) => {
  trainerAuthData.find().then((addTrainerAuthData) => {
    res.send(addTrainerAuthData);
  });
});

//get for update to find id
app.get("/api/learnerAnalytics/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  learnersData.findOne({ _id: id }).then((learner) => {
    res.send(learner);
  });
});
// Update learnerAnalytics details
app.put("/api/learnerUpdate", verifyToken, (req, res) => {
  var id = req.params.id;
  var learnerId = req.params.learnerId;
  var name = req.params.name;
  var project = req.params.project;
  var batch = req.params.batch;
  var courseStatus = req.params.courseStatus;
  var placementStatus = req.params.placementStatus;

  console.log(req.body);
  (id = req.body._id),
    (learnerId = req.body.learnerId),
    (name = req.body.name),
    (project = req.body.project),
    (batch = req.body.batch),
    (courseStatus = req.body.courseStatus),
    (placementStatus = req.body.placementStatus),
    learnersData
      .findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            learnerId: req.body.learnerId,
            name: req.body.name,
            project: req.body.project,
            batch: req.body.batch,
            courseStatus: req.body.courseStatus,
            placementStatus: req.body.placementStatus,
          },
        }
      )
      .then(() => {
        res.send();
      });
});

//get for update to find id for trainer
app.get("/api/trainerAuth/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  trainerAuthData.findOne({ _id: id }).then((trainer) => {
    res.send(trainer);
  });
});
// Update trainerAuth details
app.put("/api/trainerAuthUpdate", (req, res) => {
  var id = req.params.id;
  var name = req.params.name;
  var email = req.params.email;
  var password = req.params.password;
  console.log(req.body);
  (id = req.body._id),
    (name = req.body.name),
    (email = req.body.email),
    (password = req.body.password),
    trainerAuthData
      .findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          },
        }
      )
      .then(() => {
        res.send();
      });
});

//get for update to find id for placement officer
app.get("/api/placementOfficerAuth/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  placementAuthData.findOne({ _id: id }).then((placementOfficer) => {
    res.send(placementOfficer);
  });
});
// Update placement officer auth details
app.put("/api/placementAuthUpdate", (req, res) => {
  var id = req.params.id;
  var name = req.params.name;
  var email = req.params.email;
  var password = req.params.password;
  console.log(req.body);
  (id = req.body._id),
    (name = req.body.name),
    (email = req.body.email),
    (password = req.body.password),
    placementAuthData
      .findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          },
        }
      )
      .then(() => {
        res.send();
      });
});

// DELETE learners Details Via ID
app.delete("/api/remove/:id", verifyToken, (req, res) => {
  console.log("Deleting");
  learnersData.findByIdAndRemove(req.params.id, (err, deleteLearner) => {
    if (err) {
      res.send("Error in deleting the Learner");
    } else {
      res.json(deleteLearner);
    }
  });
});

// DELETE Trainer Auth details Via ID
app.delete("/api/trainerRemove/:id", verifyToken, (req, res) => {
  console.log("Deleting");
  trainerAuthData.findByIdAndRemove(req.params.id, (err, deletetrainer) => {
    if (err) {
      res.send("Error in deleting the Trainer");
    } else {
      res.json(deletetrainer);
    }
  });
});

// DELETE placement Officer Via ID
app.delete("/api/placementOfficerRemove/:id", verifyToken, (req, res) => {
  console.log("Deleting");
  placementAuthData.findByIdAndRemove(
    req.params.id,
    (err, deleteplacementOfficer) => {
      if (err) {
        res.send("Error in deleting the placementOfficer");
      } else {
        res.json(deleteplacementOfficer);
      }
    }
  );
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/learner-tracker/index.html'));
 });

// Port where backend Runs
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Ready on 3000");
});