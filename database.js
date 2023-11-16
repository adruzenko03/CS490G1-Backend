import mysql from 'mysql';
import "dotenv/config.js";
export default class DatabaseService {
    constructor(){
        this.connection=mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : process.env.DB_PASS,
            database : 'fitness'
          })
          this.connection.connect();
          this.connection.query('SELECT 1 + 1 AS solution', (err,res)=>{
            console.log("Successful Database Connection")
          })
    }
    login(username,password,callback){
        this.connection.query(`SELECT * FROM users WHERE email='${username}' and password='${password}'`,(err,res)=>{
                callback(res);
        })
    }
    checkUser(email,callback){
        this.connection.query(`SELECT * FROM users WHERE 'email='${email}`,(err,res)=>{
            callback(res)
        })
    }
    signupCoach(){
        this.connection.query(``,(err,res)=>{
            callback()
        })
    }
    signupClient(){
        this.connection.query(``,(err,res)=>{
            callback()
        })
    }
}