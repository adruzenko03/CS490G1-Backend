import mysql from 'mysql2';
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
        this.connection.connect();
        this.connection.query('SELECT 1 + 1 AS solution', (err, res) => {
            console.log("Successful Database Connection")
        })
    }
    login(username, password, callback) {
        this.connection.query(`SELECT * FROM user_auth WHERE email='${username}' and password='${password}'`, (err, res) => {
            callback(res);
        })
    }
    checkUser(email, callback) {
        this.connection.query(`SELECT * FROM user_auth WHERE email='${email}'`, (err, res) => {
            callback(err,res)
        })
    }

    signupUserAuth(email, password, callback) {
        this.connection.query(`INSERT INTO user_auth (email, password) VALUES ('${email}','${password}');
                               SELECT LAST_INSERT_ID() AS userID;`, (err, res) => {
            callback(err, res)
        })

    }
    signupUser(info, userID, callback) {
        this.connection.query(`INSERT INTO users (user_id, first_name, last_name, phone_number, street_address, city, state, zip, role)
                               VALUES (${userID}, '${info.firstName}', '${info.lastName}', '${info.phoneNumber}', '${info.streetAddress}',
                                       '${info.city}', '${info.state}', '${info.zip}', '${info.role}');

                               INSERT INTO survey (user_id, fitness_level,diet,weekly_exercise,goal_id) 
                               SELECT ${userID},'${info.currentFitnessLevel}','${info.currentDiet}','${info.currentExerciseSchedule}',goal_id
                               FROM goals
                               WHERE goal='${info.fitnessGoal}';

                               INSERT INTO users_audit (user_id, first_name, last_name, phone_number, street_address, email, password)
                               SELECT user_id,first_name,last_name,phone_number,street_address, '${info.email}', '${info.password}'
                               FROM users
                               WHERE user_id=${userID}`, (err, res) => {
            callback(err)
        })
    }
    deleteUser(user_id, callback) {
        this.connection.query(`DELETE FROM user_auth WHERE user_id=${user_id}`, (err, res) => {
            callback(err, res)
        })
    }
    signupCoach(info,userID,callback) {//add goal after you make it singular
        this.connection.query(`INSERT INTO coach_survey 
        SELECT ${userID},${info.experience},'${info.city}', '${info.state}', ${info.cost}, CURRENT_TIMESTAMP
        FROM goals
        WHERE goal='${info.fitnessGoal}'`, (err, res) => {
            callback(err)
        })
    }

    getGoals(callback){
        this.connection.query(`SELECT * FROM goals`, (err,res)=>{
            callback(res)
        })
    }
}