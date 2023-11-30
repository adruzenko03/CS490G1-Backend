import DatabaseService from "./database.js";

export default class LogicService {
    constructor() {
        this.dataMod = new DatabaseService()
    }

    login(username, password, callback) {
        this.dataMod.login(username, password, (res) => {
            console.log(res)
            if (res.length == 0)
                callback(false, {message: "Incorrect username or password"})
            else
                callback(true, {user:res})
        })

    }
    signup(info, callback) {
        this.dataMod.checkUser(info.email, (err,res) => {
            if(err){
                console.log(err)
                callback(false)
            }
            else if (res.length == 0) {
                this.dataMod.signupUserAuth(info.email, info.password, (err, ress) => {
                    if (err) {
                        console.log(err)
                        callback(false)
                    }
                    else {
                        let userID = ress[1][0].userID
                        this.dataMod.signupUser(info,userID, (err) => {
                            if(err){
                                console.log(err)
                                this.dataMod.deleteUser(userID,()=>{
                                    callback(false)
                                })
                            }
                            else{
                            if (info.role == "coach") {
                                this.dataMod.signupCoach(info,userID,(err)=>{
                                    if(err){
                                        console.log(err)
                                        this.dataMod.deleteUser(userID,()=>{
                                            callback(false)
                                        })
                                    }
                                    else{
                                        callback(true)
                                    }
                                })
                            }
                            else{
                                callback(true)
                            }
                        }
                        })
                    }
                })
            }
            else
                callback(false)
        })
    }
}