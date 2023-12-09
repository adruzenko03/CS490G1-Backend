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

app.post('/signup',async (req, res) => {
    logMod.signup(req.body, (success, message, userId) => {
        if (success) {
            res.status(201).json({ ok: true, message: 'Signup successful',userId });
        } else {
            res.status(400).json({ ok: false, message: message });
        }
    });
});
app.post('/login',async (req,res)=>{
    logMod.login(req.body.email,req.body.password,(isSuccess,message, userData )=>{
        const responseObject = { ok: isSuccess,message: message, user: userData};
        console.log("Server is sending:", responseObject);
        res.json(responseObject);
    });
});

app.post('/coach-survey', async (req, res) => {
    const surveyData = req.body;
    console.log('Coach Survey Data:', surveyData);
    dataMod.insertCoachSurvey(surveyData, (success, message) => {
        if (success) {
            res.status(201).json({ ok: true, message });
        } else {
            res.status(500).json({ ok: false, message });
        }
    });
});

app.post('/client-survey', async (req, res) => {
    const surveyData = req.body;
    console.log('Client Survey Data:', surveyData);
    dataMod.insertClientSurvey(surveyData, (success, message) => {
        if (success) {
            res.status(201).json({ ok: true, message });
        } else {
            res.status(500).json({ ok: false, message });
        }
    });
});

app.get('/surveyfetch/:userId', async (req, res) => {
    const {userId} = req.params;
    console.log("Made to Server.js", userId);
    dataMod.getSurveyData(userId, (err, surveyData) => {
        if(err){
            res.status(500).json({ok:false, error: err.message});
        } else {
            res.status(200).json({ok:true, surveyData});
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

app.get('/acceptedClients/:coachId', async(req, res)=>{
    const {coachId} = req.params;
    console.log("Made to Server.js", coachId);
    dataMod.getAcceptedClients(coachId, (err, surveyData)=>{
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

app.listen(PORT,()=>{
    console.log("Listening on port "+ PORT)
});