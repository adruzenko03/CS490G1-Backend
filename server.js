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
    logMod.signup(req.body,(success)=>{
        res.send({ok: success})
    })
    res.status(200).send({
        ok: true
     });
});
app.post('/login',async (req,res)=>{
    logMod.login(req.body.email,req.body.password,(isSuccess,message, userData )=>{
        const responseObject = { ok: isSuccess,message: message, user: userData};
        console.log("Server is sending:", responseObject);
        res.json(responseObject);
    });
});

app.listen(PORT,()=>{
    console.log("Listening on port "+ PORT)
});