import mysql from 'mysql2';
import "dotenv/config.js";
export default class DatabaseService {
    constructor(){
        this.connection=mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'password',
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

    getPendingClientRequests(coachId, callback){
        const query = `SELECT * 
        FROM fitness.coach_client_connections AS ccc
        JOIN users ON users.user_id = ccc.client_id 
        JOIN survey ON survey.user_id = users.user_id
        JOIN goals ON goals.goal_id = survey.goal_id
        WHERE ccc.coach_id = 2 AND ccc.status = 'pending';`;
        this.connection.query(query, [coachId], (err, results)=>{
            if(err){
                callback(err);
            }else{
                console.log(results);
                callback(null, results);
            }
        })
    }

    getAcceptedClients(coachId, callback){
        const query = `SELECT * 
        FROM fitness.coach_client_connections AS ccc
        JOIN users ON users.user_id = ccc.client_id 
        JOIN survey ON survey.user_id = users.user_id
        JOIN goals ON goals.goal_id = survey.goal_id
        WHERE ccc.coach_id = 2 AND ccc.status = 'accepted';`;
        this.connection.query(query, [coachId], (err, results)=>{
            if(err){
                callback(err);
            }else{
                console.log(results);
                callback(null, results);
            }
        })
    }

    getGoalsList(callback){
        const query = `SELECT DISTINCT goal
        FROM coach_survey;`
        this.connection.query(query, (err,results)=>{
            if(err){
                callback(err);
            }else{
                console.log(results);
                callback(null, results)
            }
        })
    }
    getExperienceList(callback){
        const query = `SELECT DISTINCT experience FROM coach_survey;`
        this.connection.query(query, (err,results)=>{
            if(err){
                callback(err);
            }else{
                console.log(results);
                callback(null, results)
            }
        })
    }
    getLocationList(callback){
        const query = `SELECT DISTINCT state FROM users WHERE role='coach';`
        this.connection.query(query, (err,results)=>{
            if(err){
                callback(err);
            }else{
                console.log(results);
                callback(null, results)
            }
        })
    }
    getPriceList(callback){
        const query = `SELECT DISTINCT cost FROM coach_survey;`
        this.connection.query(query, (err,results)=>{
            if(err){
                callback(err);
            }else{
                console.log(results);
                callback(null, results)
            }
        })
    }

    getCoachList(callback){
        const query = `SELECT * FROM fitness.coach_survey JOIN users ON coach_survey.user_id = users.user_id;`
        this.connection.query(query, (err,results)=>{
            if(err){
                callback(err);
            }else{
                console.log(results);
                callback(null, results)
            }
        })
    }


}