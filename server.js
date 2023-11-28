import  express from 'express';
import LogicService from './logic.js';
import cors from 'cors'
import DatabaseService from './database.js';
const databaseService = new DatabaseService();
let logMod=new LogicService()

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
    console.log('Client Survey Data:', surveyData);
    databaseService.insertCoachSurvey(surveyData, (success, message) => {
        if (success) {
            res.status(201).json({ ok: true, message });
        } else {
            res.status(500).json({ ok: false, message });
        }
    });
});

app.listen(PORT,()=>{
    console.log("Listening on port "+ PORT)
});