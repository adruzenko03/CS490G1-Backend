import  express from 'express';
import LogicService from './logic.js';
import cors from 'cors'
let logMod=new LogicService()

const app = express();
const PORT = process.env.PORT || 3001;
//TODO: Make cors only apply to routes that need it

app.use(cors()); 
app.use(express.json())

app.post('/signup',(req,res)=>{
    logMod.signup(req.body,(status,resp)=>{
        if(status){
            res.status(201).send(resp);
        }
        else{
            res.status(406).send();
        }
    })
    // res.status(200).send({
    //     ok: true
    //  });
})
app.post('/login',(req,res)=>{
    logMod.login(req.body.email,req.body.password,(status,resp)=>{
        if(status){
            res.status(200).send(resp);
        }
        else{
            res.status(404).send(resp);
        }
    })
})

app.get('/goals',(req,res)=>{
    logMod.getGoals((resp)=>{
        res.status(200).send(resp)
    })
})

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
