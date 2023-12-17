import express from "express";
import LogicService from "./logic.js";
import cors from "cors";
import DatabaseService from "./database.js";

let logMod = new LogicService();
let dataMod = new DatabaseService();
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
  logMod.getClientRequests(userId, (err, Data) => {
    if (err) {
      res.status(500).json({ ok: false, error: err.message });
    } else {
      res.status(200).json({ ok: true, Data });
    }
  });
});

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

app.get('/clientRequestsFetch/:userId', async (req, res) => {
    const {userId} = req.params;
    console.log("Made to Server.js via clientRequestsFetch", userId);
    logMod.getClientRequests(userId, (err, Data) => {
        if(err){
            res.status(500).json({ok:false, error: err.message});
        } else {
            res.status(200).json({ok:true, Data});
        }
    });
});

app.delete('/removeClient/:clientId/:coachId', (req, res) => {
    const {clientId, coachId} = req.params;
    console.log("from remove client",clientId, coachId);
    logMod.removeClient(clientId, coachId, (err, result) => {
        if (err) {
            res.status(500).send('Error removing client');
        } else {
            res.status(200).send('Client removed successfully');
        }
    });
});

app.post('/acceptClient', (req, res) => {
    const {clientId, coachId} = req.body;
    console.log("Client id", clientId);
    logMod.acceptClient(clientId, coachId, (err, result) => {
        if (err) {
            res.status(500).send('Error accepting client');
        } else {
            res.status(200).send('Client accepted successfully');
        }
    });
});

app.post('/declineClient', (req, res) => {
    const {clientId, coachId} = req.body;
    console.log("Client id", clientId);
    logMod.declineClient(clientId, coachId, (err, result) => {
        if (err) {
            res.status(500).send('Error declining client');
        } else {
            res.status(200).send('Client declined successfully');
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

app.get('/clientWorkoutLog/:clientId', (req, res) => {
    const { clientId } = req.params;
    logMod.getClientWorkoutLog(clientId, (err, workoutLog) => {
        if (err) {
            res.status(500).send('Error fetching workout log');
        } else {
            res.status(200).json(workoutLog);
        }
    });
});

app.get('/clientDailySurvey/:clientId', (req, res) => {
    const { clientId } = req.params;
    logMod.getClientDailySurvey(clientId, (err, dailySurvey) => {
        if (err) {
            res.status(500).send('Error fetching daily survey results');
        } else {
            res.status(200).json(dailySurvey);
        }
    });
});


app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
