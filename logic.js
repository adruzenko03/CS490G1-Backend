import DatabaseService from "./database.js";

export default class LogicService {
    constructor() {
        this.dataMod = new DatabaseService()
    }
    login(username, password, callback) {
        this.dataMod.login(username, password, (res) => {
            if (res.length == 0)
                callback(false, "Incorrect username or password")
            else
                callback(true, '')
        })

    }
    signup(info, callback) {
        this.dataMod.checkUser(info.email, (res) => {
            if (res.length == 0) {
                this.dataMod.signupUserAuth(info.email, info.password, (err, ress) => {
                    if (err) {
                        callback(false)
                    }
                    else {
                        let userID = ress
                        console.log("new ID:" + userID)
                        this.dataMod.insertUser(info,userID, (err) => {
                            if(err){
                                console.log(err)
                                this.dataMod.deleteUser(userID,()=>{
                                    callback(false)
                                })
                            }
                            else{
                            if (info.role == "Coach") {
                                this.dataMod.insertCoach(info,(err)=>{
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