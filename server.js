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

app.listen(PORT,()=>{
    console.log("Listening on port "+ PORT)
})