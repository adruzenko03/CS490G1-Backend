import  express from 'express';
import LogicModel from './logic.js';
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3001;
//TODO: Make cors only apply to routes that need it
app.use(cors()); 

app.get('/signup',(req,res)=>{
    console.log("test2")
    res.status(200).send({
        ok: true
     });
})
app.post('/login',(req,res)=>{
    console.log("test1")
    res.status(200).send({
        ok: true
     });
})

app.listen(PORT,()=>{
    console.log("Listening on port "+ PORT)
})