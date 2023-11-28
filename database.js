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
        this.connection.query(`SELECT * FROM users WHERE email='${email}'`,(err,res)=>{
            callback(res)
        });
    }
    signupCoach(info, callback) {
        console.log(info);
        const query = `INSERT INTO users (first_name, last_name, email, password, phone_number, street_address, city, state, zip, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [info.firstName, info.lastName, info.email, info.password, info.phoneNumber, info.streetAddress, info.city, info.state, info.zipCode, info.role];

        this.connection.query(query, values, (err, results) => {
            if (err) {
                callback(false, err.message, null);
            } else {
                console.log(results.insertId);
                callback(true, 'Signup Coach successful', results.insertId);
            }
        });
    }
    signupClient(info, callback) {
        console.log(info);
        const query = `INSERT INTO users (first_name, last_name, email, password, phone_number, street_address, city, state, zip, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [info.firstName, info.lastName, info.email, info.password, info.phoneNumber, info.streetAddress, info.city, info.state, info.zipCode, info.role];
    
        this.connection.query(query, values, (err, results) => {
            if (err) {
                callback(false, err.message);
            } else {
                callback(true, 'Signup Client successful');
            }
        });
    }
    
    insertCoachSurvey(surveyData, callback) {
        const query = `INSERT INTO coach_survey (user_id, experience, city, state, cost) VALUES (?, ?, ?, ?, ?)`;
        console.log("Query ", surveyData);
        const values = [surveyData.userID, surveyData.experience, surveyData.city, surveyData.state, surveyData.cost];
    
        this.connection.query(query, values, (err, results) => {
            if (err) {
                callback(false, err.message);
            } else {
                // If the insert is successful, send back a success message.
                callback(true, 'Survey data inserted successfully', surveyData);
            }
        });
    }
}