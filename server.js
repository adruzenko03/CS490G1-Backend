import  express from 'express';
import LogicService from './logic.js';
import cors from 'cors'
import DatabaseService from './database.js';

let logMod=new LogicService()
let dataMod = new DatabaseService()
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

app.get('/clientRequestsFetch/:coachId', async(req, res)=>{
    const {coachId} = req.params;
    console.log("Made to Server.js", coachId);
    dataMod.getPendingClientRequests(coachId, (err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
        }
    })
})

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

  /*Glen's code */
app.get('/acceptedClients2/:coachId', async(req, res)=>{
    const {coachId} = req.params;
    console.log("Made to Server.js", coachId);
    dataMod.getAcceptedClients2(coachId, (err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
        }
    })
})


app.get('/goalsList', async(req, res)=>{
    console.log("Made to Server.js");
    dataMod.getGoalsList((err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
        }
    })
})
app.get('/experienceList', async(req, res)=>{
    console.log("Made to Server.js");
    dataMod.getExperienceList((err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
        }
    })
})
app.get('/locationList', async(req, res)=>{
    console.log("Made to Server.js");
    dataMod.getLocationList((err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
        }
    })
})
app.get('/costList', async(req, res)=>{
    console.log("Made to Server.js");
    dataMod.getPriceList((err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
        }
    })
})
app.get('/coachList', async(req, res)=>{
    console.log("Made to Server.js");
    dataMod.getCoachList((err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
        }
    })
})
app.get('/acceptedCoach/:clientId', async(req, res)=>{
    const {clientId} = req.params;
    console.log("Made to Server.js", clientId);
    dataMod.getAcceptedCoach(clientId, (err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
            console.log(surveyData);
        }
    })
})
app.get('/pendingCoach/:clientId', async(req, res)=>{
    const {clientId} = req.params;
    console.log("Made to Server.js", clientId);
    dataMod.getPendingCoach(clientId, (err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
            console.log(surveyData);
        }
    })
})

app.get('/clientWorkouts/:clientId', async(req, res)=>{
    const {clientId} = req.params;
    console.log("Made to Server.js", clientId);
    dataMod.getClientWorkouts(clientId, (err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
            console.log(surveyData);
        }
    })
})

app.get('/clientInfo/:clientId', async(req, res)=>{
    const {clientId} = req.params;
    console.log("Made to Server.js", clientId);
    dataMod.getClientInfo(clientId, (err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
            console.log(surveyData);
        }
    })
})


app.get('/cityList', async(req, res)=>{
    console.log("Made to Server.js");
    dataMod.getLocationList((err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
        }
    })
})

app.post('/requestCoach',async (req, res) => {
    const {clientId, items} = req.body;
    dataMod.requestCoach(clientId, items, (success, message) => {
        if (success) {
            res.status(201).json({ ok: true, message: 'Request successfully sent' });
        } else {
            res.status(400).json({ ok: false, message });
        }
    });
});



app.delete('/deleteCoachRequest/:requestId', async (req, res) => {
    const requestId = req.params;

    dataMod.deleteCoachRequest(requestId, (success, message) => {
        if (success) {
            res.status(200).json({ ok: true, message: 'Request successfully deleted' });
        } else {
            res.status(400).json({ ok: false, message });
        }
    });
});

app.put('/acceptClientRequest/:connectionId', async(req, res)=>{
    const connectionId = req.params.connectionId;
    dataMod.acceptClientRequest(connectionId, (success, message)=>{
        if(success){
            res.status(200).json({ ok: true, message: 'Request successfully accepted.' });
        }else{
            res.status(400).json({ ok: false, message });
        }
    })
})
app.put('/declineClientRequest/:connectionId', async(req, res)=>{
    const connectionId = req.params.connectionId;
    dataMod.declineClientRequest(connectionId, (success, message)=>{
        if(success){
            res.status(200).json({ ok: true, message: 'Request successfully declined.' });
        }else{
            res.status(400).json({ ok: false, message });
        }
    })
})

app.delete('/deleteClient/:connectionId', async (req, res) => {
    const connectionId = req.params;

    dataMod.deleteClient(connectionId, (success, message) => {
        if (success) {
            res.status(200).json({ ok: true, message: 'Request successfully deleted' });
        } else {
            res.status(400).json({ ok: false, message });
        }
    });
});

app.put('/sendWorkoutData/:workoutId', async(req, res)=>{
    const workoutId = req.params.workoutId;
    const data = req.body;
    dataMod.sendWorkoutData(workoutId, data, (success, message)=>{
        if(success){
            res.status(200).json({ ok: true, message: 'Request successfully declined.' });
        }else{
            res.status(400).json({ ok: false, message });
        }
    })
})


app.get('/exerciseCount/:workoutId', async(req, res)=>{
    const {workoutId} = req.params;
    console.log("Made to Server.js", workoutId);
    dataMod.getExerciseCount(workoutId, (err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
            console.log(surveyData);
        }
    })
})

app.get('/allExercises/:workoutId', async(req, res)=>{
    const {workoutId} = req.params;
    console.log("Made to Server.js", workoutId);
    dataMod.getAllExercises(workoutId, (err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
            console.log(surveyData);
        }
    })
})

app.get('/exercisesList', async(req, res)=>{
    console.log("Made to Server.js");
    dataMod.getExercisesList((err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
            console.log(surveyData);
        }
    })
})


app.put('/updateExercise/:workoutId', async(req, res)=>{
    const workoutId = req.params.workoutId;
    const data = req.body;
    dataMod.updateExercise(workoutId, data, (success, message)=>{
        if(success){
            res.status(200).json({ ok: true, message: 'Exercise successfully updated.' });
        }else{
            res.status(400).json({ ok: false, message });
        }
    })
})

app.delete('/deleteExercise/:workoutId', async (req, res) => {
    const workoutId = req.params.workoutId;
    const data = req.body;
    dataMod.deleteExercise(workoutId, data, (success, message) => {
        if (success) {
            res.status(200).json({ ok: true, message: 'Exercise successfully deleted' });
        } else {
            res.status(400).json({ ok: false, message });
        }
    });
});

app.post('/addNewExercise/:workoutId',async (req, res) => {
    const workoutId = req.params.workoutId;
    const data = req.body;
    dataMod.addNewExercise(workoutId, data, (success, message) => {
        if (success) {
            res.status(201).json({ ok: true, message: 'Exercise successfully added' });
        } else {
            res.status(400).json({ ok: false, message });
        }
    });
});

app.post('/sendNewWorkoutData', async (req, res) => {
    const workoutData = req.body;
    console.log('Coach Survey Data:', workoutData);
    dataMod.sendNewWorkoutData(workoutData, (success, message) => {
        if (success) {
            res.status(201).json({ ok: true, message });
        } else {
            res.status(500).json({ ok: false, message });
        }
    });
});

app.delete('/deleteOneWorkout/:workoutId', async (req, res) => {
    const workoutId = req.params.workoutId;

    dataMod.deleteOneWorkout(workoutId, (success, message) => {
        if (success) {
            res.status(200).json({ ok: true, message: 'Request successfully deleted' });
        } else {
            res.status(400).json({ ok: false, message });
        }
    });
});

app.get('/messages/chat/:coachId', async(req, res)=>{
    const coachId = req.params.coachId;
    dataMod.getMessages(coachId, (err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
            console.log(surveyData);
        }
    })
})

app.get('/messages/coach/:coachId', async(req, res)=>{
    const coachId = req.params.coachId;
    dataMod.getAllChats(coachId, (err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
            console.log(surveyData);
        }
    })
})

app.get('/users1/:chatId/:coachId', async(req, res)=>{
    const chatId = req.params.chatId;
    const coachId = req.params.coachId;
    dataMod.getSideNames(chatId, coachId, (err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
            console.log(surveyData);
        }
    })
})


app.get('/messages1/chat/:chatId', async(req, res)=>{
    const chatId = req.params.chatId;
    dataMod.getOneSpecificChat(chatId, (err, surveyData)=>{
        if(err){
            res.status(500).json({ok:false, error:err.message});
        }else{
            res.status(200).json({ok:true, surveyData});
            console.log(surveyData);
        }
    })
})

app.post('/newMessage',async (req, res) => {
    const data = req.body;
    dataMod.sendNewMessage(data, (success, message) => {
        if (success) {
            res.status(201).json({ ok: true, message: 'Message successfully sent' });
        } else {
            res.status(400).json({ ok: false, message });
        }
    });
});

app.listen(PORT,()=>{
    console.log("Listening on port "+ PORT)
});