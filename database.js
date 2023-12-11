import mysql from 'mysql';
import "dotenv/config.js";
export default class DatabaseService {
    constructor() {
        this.connection = mysql.createConnection({
            multipleStatements: true,
            host: 'localhost',
            user: 'root',
            password: process.env.DB_PASS,
            database: 'fitness'
        })
        this.connection.connect(err => {
            if (err) {
              console.error('Error connecting to the database:', err);
              return;
            }
            console.log('Database connection established');
        });
    }
    login(username, password, callback) {
        this.connection.query(`SELECT * FROM user_auth WHERE email='${username}' and password='${password}'`, (err, res) => {
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

    getUserInfo(userId, callback) {
        this.connection.query(`SELECT * FROM users WHERE user_id='${userId}'`, (err, res) => {
            if (err) {
                console.error("Database error:", err);
                callback(null); 
                return;
            }
            const userInfo = res[0];
            console.log("Database response!:", userInfo);
            callback(userInfo);
        });
    }
    
    checkUser(email,callback){
        this.connection.query(`SELECT * FROM users WHERE email='${email}'`,(err,res)=>{
            callback(res)
        });
    }
    signupCoach(info, callback) {
        console.log("signupCoach() ",info);
        const query = `INSERT INTO users (first_name, last_name, email, password, phone_number, street_address, city, state, zip, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [info.firstName, info.lastName, info.email, info.password, info.phoneNumber, info.streetAddress, info.city, info.state, info.zipCode, info.role];

        this.connection.query(query, values, (err, results) => {
            if (err) {
                callback(false, err.message, null);
            } else {
                console.log("Results from database.js, ", results);
                callback(true, 'Signup Coach successful', results.insertId);
            }
        });
    }
    signupClient(info, callback) {
        console.log("signupClient()", info);
        const query = `INSERT INTO users (first_name, last_name, email, password, phone_number, street_address, city, state, zip, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [info.firstName, info.lastName, info.email, info.password, info.phoneNumber, info.streetAddress, info.city, info.state, info.zipCode, info.role];
    
        this.connection.query(query, values, (err, results) => {
            if (err) {
                callback(false, err.message);
            } else {
                console.log("Results from database.js, ", results);
                callback(true, 'Signup Client successful', results.insertId);
            }
        });
    }
    
    insertCoachSurvey(surveyData, callback) {
        const query = `INSERT INTO coach_survey (user_id, experience, city, state, cost, goals) VALUES (?, ?, ?, ?, ?, ?)`;//change to accept last param too
        console.log("What will be inserted into coach_survey table ", surveyData);
        const values = [surveyData.userID, surveyData.experience, surveyData.city, surveyData.state, surveyData.cost, JSON.stringify(surveyData.goals)];
    
        this.connection.query(query, values, (err, results) => {
            if (err) {
                callback(false, err.message);
            } else {
                // If the insert is successful, send back a success message.
                callback(true, 'Survey data inserted successfully', surveyData);
            }
        });
    }
    insertClientSurvey(surveyData, callback) {
        const query = `INSERT INTO survey (user_id, fitness_level, diet, weekly_exercise, goal_id) VALUES (?, ?, ?, ?, ?)`;//change to accept last param too
        console.log("What will be inserted into survey table ", surveyData);
        const values = [surveyData.userID, surveyData.currentFitnessLevel, surveyData.currentDiet, surveyData.currentExerciseSchedule, surveyData.fitnessGoal];
    
        this.connection.query(query, values, (err, results) => {
            if (err) {
                callback(false, err.message);
            } else {
                // If the insert is successful, send back a success message.
                callback(true, 'Survey data inserted successfully', surveyData);
            }
        });
    }

    getSurveyData(userId, callback){
    const query = 'SELECT * FROM survey WHERE user_id = ?';
    this.connection.query(query, [userId], (err, results) => {
        if (err) {
            // If there's a database error, pass it back to the callback
            callback(err);
        } else {
            // If the query is successful, pass the results back to the callback
            console.log(results);
            callback(null, results);
        }
    });
    }

    getAcceptedClients(userId, callback){
        const query = 'SELECT client_id FROM coach_client_connections WHERE coach_id = ? AND status = "accepted"';
        this.connection.query(query, [userId], (err, results) => {
            if (err) {
                // If there's a database error, pass it back to the callback
                callback(err);
            } else {
                // If the query is successful, pass the results back to the callback
                console.log(results);
                callback(null, results);
            }
        });
    }
}