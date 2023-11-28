import mysql from 'mysql';
import "dotenv/config.js";
export default class DatabaseService {
    constructor(){
        this.connection=mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : process.env.DB_PASS,
            database : 'fitness'
        });
        this.connection.connect(err => {
            if (err) {
              console.error('Error connecting to the database:', err);
              return;
            }
            console.log('Database connection established');
        });
    }
    login(username, password, callback) {
        this.connection.query(`SELECT * FROM users WHERE email='${username}' and password='${password}'`, (err, res) => {
            if (err) {
                console.error("Database error:", err);
                callback([]); 
                return;
            }
            const userData = res[0];
            console.log("Database response!:", userData);
            callback(userData);
        });
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