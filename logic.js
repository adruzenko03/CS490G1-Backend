import DatabaseService from "./database.js";

export default class LogicService {
    constructor(){
        this.dataMod=new DatabaseService()
    }
    login(username,password,callback){
        this.dataMod.login(username,password,(res)=>{
            if(res.length==0)
                callback(false,"Incorrect username or password")
            else{
                callback(true, '', res);
            }
        });

    }
    signup(info,callback){
        this.dataMod.checkUser(info.email,(res)=>{
            if(res.length==0){
                if(info.role==='client')
                    this.dataMod.signupClient(info,()=>{
                        callback(true)
                })
                else if (info.role==='coach')
                    this.dataMod.signupCoach(info, ()=>{
                        callback(true)
                })
            }
            else
                callback(false)
        });
    }
}