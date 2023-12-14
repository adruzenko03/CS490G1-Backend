import express from "express";
import LogicService from "./logic.js";
import cors from "cors";

let logMod = new LogicService();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

app.post("/signup", (req, res) => {
  logMod.signup(req.body, (status, resp) => {
    if (status) {
      res.status(201).send(resp);
    } else {
      res.status(406).send();
    }
  });
  // res.status(200).send({
  //     ok: true
  //  });
});
app.post("/login", (req, res) => {
  logMod.login(req.body.email, req.body.password, (status, resp) => {
    if (status) {
      res.status(200).send(resp);
    } else {
      res.status(404).send(resp);
    }
  });
});

app.get("/goals", (req, res) => {
  logMod.getGoals((resp) => {
    res.status(200).send(resp);
  });
});
/*
app.post("/coach-survey", async (req, res) => {
  const surveyData = req.body;
  console.log("Coach Survey Data:", surveyData);
  dataMod.insertCoachSurvey(surveyData, (success, message) => {
    if (success) {
      res.status(201).json({ ok: true, message });
    } else {
      res.status(500).json({ ok: false, message });
    }
  });
});

app.post("/client-survey", async (req, res) => {
  const surveyData = req.body;
  console.log("Client Survey Data:", surveyData);
  dataMod.insertClientSurvey(surveyData, (success, message) => {
    if (success) {
      res.status(201).json({ ok: true, message });
    } else {
      res.status(500).json({ ok: false, message });
    }
  });
});

app.get("/surveyfetch/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("Made to Server.js", userId);
  dataMod.getSurveyData(userId, (err, surveyData) => {
    if (err) {
      res.status(500).json({ ok: false, error: err.message });
    } else {
      res.status(200).json({ ok: true, surveyData });
    }
  });
});

app.get("/acceptedClients/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("Made to Server.js via acceptedClients", userId);
  dataMod.getAcceptedClients(userId, (err, acceptedClients) => {
    if (err) {
      res.status(500).json({ ok: false, error: err.message });
    } else {
      res.status(200).json({ ok: true, acceptedClients });
    }
  });
});

app.get("/clientRequestsFetch/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log("Made to Server.js via clientRequestsFetch", userId);
  dataMod.getSurveyData(userId, (err, surveyData) => {
    if (err) {
      res.status(500).json({ ok: false, error: err.message });
    } else {
      res.status(200).json({ ok: true, surveyData });
    }
  });
});
*/
app.get("/exercises", (req, res) => {
  logMod.getExercises((success, result) => {
    if (success) {
      res.status(200).json({ ok: true, exercises: result });
    } else {
      res
        .status(500)
        .json({ ok: false, message: "Error retrieving exercises" });
    }
  });

});

app.get("/workouts", (req, res) => {
  logMod.getWorkouts((success, result) => {
    if (success) {
      res.status(200).json({ ok: true, exercises: result });
    } else {
      res
        .status(500)
        .json({ ok: false, message: "Error retrieving workouts" });
    }
  });
});

app.get('/pendingCoaches', (req, res) => {
  logMod.getPendingCoaches((success, coaches) => {
    if (success) {
      res.json(coaches);
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
});

app.post('/updateCoachStatus/:coach_id/:actionType', (req, res) => {
  const coach_id = req.params.coach_id;
  const actionType = req.params.actionType;

  logMod.updateCoachStatus(coach_id, actionType, (err, result) => {
    if (err) {
      console.error('Error updating coach status:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
});

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});