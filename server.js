import  express from 'express';
import LogicService from './logic.js';
import cors from 'cors'


let logMod=new LogicService()

const app = express();
const PORT = process.env.PORT || 3001;
//TODO: Make cors only apply to routes that need it
app.use(cors()); 
app.use(express.json())

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
    logMod.requestCoach(clientId, items, (success, result) => {
        if(success){
            res.status(200).json({ok:true, surveyData: result});
        }else{
            res.status(500).json({ok:false, message: "Error requesting coach."});
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


// ------------------_----------------–---------------------------------------

app.put('/acceptClientRequest/:connectionId', (req, res)=>{
    const connectionId = req.params.connectionId;
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
    logMod.sendWorkoutData(workoutId, data, (success, message)=>{
        if(success){
            res.status(200).json({ ok: true, message: 'Workout data successfully sent.' });
        }else{
            res.status(400).json({ ok: false, message });
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

app.listen(PORT,()=>{
    console.log("Listening on port "+ PORT)
});