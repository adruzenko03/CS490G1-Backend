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
      res.status(406).send({message:resp});
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


/* Ja's Code */
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


  // ------------------_----------------–---------------------------------------


app.get('/clientRequestsFetch/:coachId', (req, res)=>{
    const {coachId} = req.params;
    // console.log("Made to Server.js", coachId);
    logMod.getPendingClientRequests(coachId, (success, result)=>{
        if(success){
            res.status(200).json({ ok: true, surveyData: result});
        }else{
            res.status(500).json({ ok: false, message: "Error fetching reuqests" });
        }
    })
})
  
  
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

/* GLENS CODE ************************************ */



app.get('/goalsList', (req, res)=>{
    // console.log("Made to Server.js");
    logMod.getGoalsList((success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res
                .status(500)
                .json({ok: false, message: "Error retrieving exercises."})
        }
    })
})
//  -------------------------------------------------------------------------

app.get('/experienceList', (req, res)=>{
    // console.log("Made to Server.js");
    logMod.getExperienceList((success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res
                .status(500)
                .json({ok: false, message: "Error retrieving experience list."})
        }
    })
})

//  -------------------------------------------------------------------------

app.get('/locationList', (req, res)=>{
    // console.log("Made to Server.js");
    logMod.getLocationList((success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res
                .status(500)
                .json({ok: false, message: "Error retrieving Location list."})
        }
    })
})

//  -------------------------------------------------------------------------


app.get('/costList', (req, res)=>{
    // console.log("Made to Server.js");
    logMod.getPriceList((success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            
            res
                .status(500)
                .json({ok: false, message:"Error retrieving CostList."})
        }
    })
})

//  -------------------------------------------------------------------------

app.get('/coachList', (req, res)=>{
    // console.log("Made to Server.js");
    logMod.getCoachList((success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res
                .status(500)
                .json({ok: false, message:"Error retrieving coach list."})
        }
    })
})

// ------------------_----------------–---------------------------------------

app.get('/acceptedCoach/:clientId', (req, res)=>{
    const {clientId} = req.params;
    // console.log("Made to Server.js", clientId);
    logMod.getAcceptedCoach(clientId, (success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res.status(500).json({ok:false, message: "Error retrieving accepted coaches."});
        }
    })
})

// ------------------_----------------–---------------------------------------
app.get('/clientInfo/:clientId', (req, res)=>{
    const {clientId} = req.params;
    // console.log("Made to Server.js", clientId);
    logMod.getClientInfo(clientId, (success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res.status(500).json({ok:false, message: "Error retrieving client info."});
        }
    })
})

// ------------------_----------------–---------------------------------------

app.get('/pendingCoach/:clientId', (req, res)=>{
    const {clientId} = req.params;
    // console.log("Made to Server.js", clientId);
    logMod.getPendingCoach(clientId, (success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res.status(500).json({ok:false, message: "Error retrieving pending coaches."});
        }
    })
})

// ------------------_----------------–---------------------------------------

app.get('/clientWorkouts/:clientId', (req, res)=>{
    const {clientId} = req.params;
    // console.log("Made to Server.js", clientId);
    logMod.getClientWorkouts(clientId, (success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res.status(500).json({ok:false, message: "Error retrieving client workouts."});
        }
    })
})

// ------------------_----------------–---------------------------------------



// app.get('/cityList', async(req, res)=>{
//     console.log("Made to Server.js");
//     dataMod.getLocationList((err, surveyData)=>{
//         if(err){
//             res.status(500).json({ok:false, error:err.message});
//         }else{
//             res.status(200).json({ok:true, surveyData});
//         }
//     })
// })

app.post('/requestCoach', (req, res) => {
    const {clientId, items} = req.body;
    logMod.requestCoach(clientId, items, (err, result) => {
        if(err){
            res.status(500).send('Error requesting coach');
        }else{
            res.status(200).json({ok:true, surveyData: result});
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
            res.status(500).json({ ok: false, message });
          }
          });
      });
// ------------------_----------------–---------------------------------------

app.get('/exerciseCount/:workoutId', (req, res)=>{
    const {workoutId} = req.params;
    // console.log("Made to Server.js", workoutId);
    logMod.getExerciseCount(workoutId, (success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res.status(500).json({ok:false, message: "Error requesting exercise count."});
        }
    })
})


// ------------------_----------------–---------------------------------------


app.delete('/deleteCoachRequest/:requestId', (req, res) => {
    const requestId = req.params;

    logMod.deleteCoachRequest(requestId, (success, message) => {
        if (success) {
            res.status(200).json({ ok: true, message: 'Request successfully deleted' });
          
        } else {
          res.status(500).json({ ok: false, message });
        }
        });
    });

// ------------------_----------------–---------------------------------------

app.delete('/deleteCurrentCoach/:connectionId', (req, res) => {
    const { connectionId } = req.params;
    logMod.deleteCurrentCoach(connectionId, (success, message) => {
        if (success) {
            res.status(200).json({ ok: true, message: 'Coach successfully deleted' });
        } else {
            res.status(500).json({ ok: false, message });
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


// ------------------_----------------–---------------------------------------

app.put('/acceptClientRequest', (req, res)=>{
  // const {clientId, coachId} = req.body;
  const {connectionId} = req.body;
  logMod.acceptClientRequest(connectionId, (success, message)=>{
      if(success){
          res.status(200).json({ ok: true, message: 'Request successfully accepted.' });
      }else{
          res.status(400).json({ ok: false, message });
      }
  })
})


// ------------------_----------------–---------------------------------------


app.get('/acceptedClients2/:coachId', (req, res)=>{
    const {coachId} = req.params;
    // console.log("Made to Server.js", coachId);
    logMod.getAcceptedClients2(coachId, (success, result)=>{
        if(success){
            res.status(200).json({ ok: true, surveyData: result });
        }else{
            res.status(400).json({ ok: false, message: "Error fetching accepted clients" });
        }
    })
})

// ------------------_----------------–---------------------------------------

app.put('/declineClientRequest/:connectionId', async(req, res)=>{
    const connectionId = req.params.connectionId;
    logMod.declineClientRequest(connectionId, (success, message)=>{
        if(success){
            res.status(200).json({ ok: true, message: 'Request successfully declined.' });
        }else{
            res.status(400).json({ ok: false, message });
        }
    })
})


// ------------------_----------------–---------------------------------------

app.delete('/deleteClient/:connectionId', async (req, res) => {
    const connectionId = req.params;

    logMod.deleteClient(connectionId, (success, message) => {
        if (success) {
            res.status(200).json({ ok: true, message: 'Client successfully deleted' });
        } else {
            res.status(400).json({ ok: false, message });
        }
    });
});

// ------------------_----------------–---------------------------------------



app.put('/sendWorkoutData/:workoutId', async(req, res)=>{
    const workoutId = req.params.workoutId;
    const data = req.body;
    logMod.sendWorkoutData(workoutId, data, (success, responseData)=>{
        if(success){
            res.status(200).json({ ok: true, message: 'Workout data successfully sent.', data: responseData });
        }else{
            res.status(400).json({ ok: false, message: 'Error sending workout data.', data: responseData });
        }
    })
})


// ------------------_----------------–---------------------------------------


app.post('/sendNewWorkoutData', async (req, res) => {
    const workoutData = req.body;
    // console.log('Coach Survey Data:', workoutData);
    logMod.sendNewWorkoutData(workoutData, (success, message) => {
        if (success) {
            res.status(201).json({ ok: true, message });
        } else {
            res.status(500).json({ ok: false, message });
        }
    });
});

// ------------------_----------------–---------------------------------------


app.get('/allExercises/:workoutId', async(req, res)=>{
    const {workoutId} = req.params;
    // console.log('*************************', workoutId);
    // console.log("Made to Server.js", workoutId);
    logMod.getAllExercises(workoutId, (success, result)=>{
        if(success){
            res.status(200).json({ ok: true, surveyData: result });
        }else{
            res.status(400).json({ ok: false, message: "Error fetching exercises" });
        }
    })
})

// ------------------_----------------–---------------------------------------

app.get("/exercisesList", async (req, res) => {
    logMod.getExercisesList((success, result) => {
      if (success) {
        res.status(200).json({ ok: true, surveyData: result });
      } else {
        res
          .status(500)
          .json({ ok: false, message: "Error retrieving exercises" });
      }
    });
  
  }); 


// -----------------------------------–---------------------------------------


app.put('/updateExercise/:workoutId', async(req, res)=>{
    const workoutId = req.params.workoutId;
    const data = req.body;
    logMod.changeExercise(workoutId, data, (err, result)=>{
        if (err) {
            res.status(500).send('Error declining client');
        } else {
            res.status(200).send('Client declined successfully');
        }
    })
})


// -----------------------------------–---------------------------------------


app.delete('/deleteExercise/:workoutId', async (req, res) => {
    const workoutId = req.params.workoutId;
    const data = req.body;
    logMod.deleteExercise(workoutId, data, (success, message) => {
        if (success) {
            res.status(200).json({ ok: true, message: 'Exercise successfully deleted' });
        } else {
            res.status(400).json({ ok: false, message });
        }
    });
});

// -----------------------------------–---------------------------------------


app.post('/addNewExercise/:workoutId', async (req, res) => {
    const workoutId = req.params.workoutId;
    const data = req.body;
    console.log('-------------------------------', workoutId);
    logMod.addNewExercise(workoutId, data, (err, result) => {
        if (err) {
            res.status(500).send('Error adding exercise client');
        } else {
            res.status(200).send('Exercise added successfully');
        }
    });
});


// -----------------------------------–---------------------------------------


app.delete('/deleteOneWorkout/:workoutId', async (req, res) => {
    const workoutId = req.params.workoutId;

    logMod.deleteOneWorkout(workoutId, (success, message) => {
        if (success) {
            res.status(200).json({ ok: true, message: 'Request successfully deleted' });
        } else {
            res.status(400).json({ ok: false, message });
        }
    });
});

// -----------------------------------–---------------------------------------


app.get('/messages/chat/:coachId', async(req, res)=>{
    const coachId = req.params.coachId;
    logMod.getMessages(coachId, (success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res
                .status(500)
                .json({ok:false, message:"Error retrieving messages"});
        }
    })
})

// -----------------------------------–---------------------------------------



app.get('/messages/coach/:coachId', async(req, res)=>{
    const coachId = req.params.coachId;
    logMod.getAllChats(coachId, (success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res
                .status(500)
                .json({ok:false, message:"Error retrieving chats"});
        }
    })
})

// -----------------------------------–---------------------------------------


app.get('/users1/:chatId/:coachId', async(req, res)=>{
    const chatId = req.params.chatId;
    const coachId = req.params.coachId;
    logMod.getSideNames(chatId, coachId, (success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res
                .status(500)
                .json({ok:false, message:"Error retrieving names"});
        }
    })
})

// -----------------------------------–---------------------------------------


app.get('/messages1/chat/:chatId', async(req, res)=>{
    const chatId = req.params.chatId;
    logMod.getOneSpecificChat(chatId, (success, result)=>{
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res
                .status(500)
                .json({ok:false, message:"Error messages for chat"});
        }
    })
})

// -----------------------------------–---------------------------------------


app.post('/newMessage',async (req, res) => {
    const data = req.body;
    logMod.sendNewMessage(data, (success, message) => {
        if (success) {
            res.status(201).json({ ok: true, message: 'Exercise successfully added' });
        } else {
            res.status(400).json({ ok: false, message });
        }
    });
});


/* GLENS FUNCTIONS ********************************************************* */

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


app.post("/activitySurvey", (req, res) => {
  const { userId, entryDate, calorieIntake, bodyWeight, mood } = req.body;

  logMod.insertUserDailyActivity(
    userId,
    entryDate,
    calorieIntake,
    bodyWeight,
    mood,
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
  const { exercise_name, muscle, steps, equipmentList } = req.body;
  if (exercise_name === undefined || muscle === undefined || steps === undefined || equipmentList === undefined) {
    res.status(400).json({ error: 'undefined values in request body' });
  }
  logMod.addExercise(exercise_name, muscle, steps, equipmentList, (success, result) => {
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

app.get('/getlast5Workouts/:clientId', (req, res) => {
    const { clientId } = req.params;
    logMod.getlast5(clientId, (err, top5workouts) => {
        if (err) {
          console.error("Server error:", err);  
          res.status(500).send('Error fetching workout log');
        } else {
            res.status(200).json(top5workouts);
            console.log("Server.js", top5workouts);
        }
    });
});

app.put('/updateSurvey/:userID', (req, res) =>{
  const userId = req.params.userID;
  const updatedSurveyData = req.body;
  logMod.updateSurvey(userId, updatedSurveyData, (err, result) => {
    if (err) {
        res.status(500).send('Error updating survey data');
    } else {
        res.status(200).send('Survey data updated successfully');
    }
  });
});

app.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})