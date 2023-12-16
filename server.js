import express from "express";
import LogicService from "./logic.js";
import cors from "cors";
import DatabaseService from "./database.js";

let logMod = new LogicService();
let dataMod= new DatabaseService()
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

//ALL CLIENTS BELOW ARE NOT DOCUMENTED
app.delete('/removeClient/:userId', (req, res) => {
    const { userId } = req.params;
    logMod.removeClient(userId, (err, result) => {
        if (err) {
            res.status(500).send('Error removing client');
        } else {
            res.status(200).send('Client removed successfully');
        }
    });
});

app.post('/acceptClient/:userId', (req, res) => {
    const {userId} = req.params;
    console.log("Client id", userId);
    logMod.acceptClient(userId, (err, result) => {
        if (err) {
            res.status(500).send('Error accepting client');
        } else {
            res.status(200).send('Client accepted successfully');
        }
    });
});

app.post('/declineClient/:userId', (req, res) => {
    const {userId} = req.params;
    console.log("Client id", userId);
    logMod.declineClient(userId, (err, result) => {
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

app.get("/myworkouts/:userId", (req, res) => {
  const userId = req.params.userId;
  logMod.getUserWorkouts(userId, (success, result) => {
    if (success) {
      res.status(200).json({ ok: true, exercises: result });
    } else {
      res.status(500).json({ ok: false, message: "Error retrieving workouts" });
    }
  });
});


app.delete("/workoutsremoved", (req, res) => {
  const { userId, workoutId } = req.body;

  logMod.deleteUserWorkout(userId, workoutId, (success, message, insertId) => {
    if (success) {
      res.status(200).json({ ok: true, message });
    } else {
      res.status(500).json({ ok: false, message });
    }
  });
});

app.post("/workoutsadded", (req, res) => {
  const { userId, workoutId } = req.body;
  logMod.insertUserWorkout(userId, workoutId, (success, message, insertId) => {
    if (success) {
      res.status(201).json({ ok: true, message, insertId });
    } else {
      res.status(500).json({ ok: false, message });
    }
  });
});

app.get("/activities/:userId", (req, res) => {
  const userId = req.params.userId;

  logMod.getActivity(userId,(success, activities) => {
    if (success) {
      res.status(200).json({ ok: true, activities });
    } else {
      res
        .status(500)
        .json({ ok: false, message: "Error retrieving activities" });
    }
  });
});
 

app.post("/activitySurvey", (req, res) => {
  const { userId, entryDate, calorieIntake, bodyWeight } = req.body;

  logMod.insertUserDailyActivity(
    userId,
    entryDate,
    calorieIntake,
    bodyWeight,
    (success, message, insertId) => {
      if (success) {
        res.status(201).json({ ok: true, message, insertId });
      } else {
        res.status(500).json({ ok: false, message });
      }
    }
  );
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

app.get('/exerciseList', (req, res) => {
  logMod.getExerciseList((success, exercises) => {
    if (success) {
      res.json(exercises);
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
});

app.post('/addExercise', (req, res) => {
  const { exercise_name, steps, equipmentList } = req.body;
  if (exercise_name === undefined || steps === undefined || equipmentList === undefined) {
    res.status(400).json({ error: 'undefined values in request body' });
  }
  logMod.addExercise(exercise_name, steps, equipmentList, (success, result) => {
    if (success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  });
});

app.post('/updateExercise/:exercise_id/:actionType', (req, res) => {
  const exercise_id = req.params.exercise_id;
  const actionType = req.params.actionType;

  logMod.updateExerciseStatus(exercise_id, actionType, (err, result) => {
    if (err) {
      console.error('Error updating exercise status:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
});

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})
