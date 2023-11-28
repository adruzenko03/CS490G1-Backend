import mysql from 'mysql';
import "dotenv/config.js";
export default class DatabaseService {
    constructor() {
        this.connection = mysql.createConnection({
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
        this.connection.query(`SELECT * FROM users WHERE email='${username}' and password='${password}'`, (err, res) => {
            callback(res);
        })
    }
    checkUser(email, callback) {
        this.connection.query(`SELECT * FROM users WHERE email='${email}`, (err, res) => {
            callback(res)
        })
    }

    signupUserAuth(email, password, callback) {
        this.connection.query(`INSERT INTO user_auth (email, password) VALUES ('${email}','${password}');
                               SELECT LAST_INSERT_ID();`, (err, res) => {
            callback(err, res)
        })

    }
    signupUser(info, userID, callback) {
        this.connection.query(`INSERT INTO users (user_id, first_name, last_name, phone_number, street_address, city, state, zip, role)
                               VALUES (${userID}, '${info.firstName}', '${info.lastName}', '${info.phoneNumber}', '${info.streetAddress}'
                                       , '${info.city}', '${info.state}', '${info.zip}', '${info.role}');

                               INSERT INTO survey (user_id, fitness_level,diet,weekly_exercise,goal_id) 
                               SELECT ${userID},'${info.currentFitnessLevel}','${info.currentDiet}','${info.currentExerciseSchedule}',goal_id
                               FROM goals
                               WHERE goal=${info.fitnessGoal};

                               INSERT INTO users_audit (user_id, first_name, last_name, phone_number, street_address, role, email, password)
                               SELECT user_id,first_name,last_name,phone_number,street_address,role, '${info.email}', '${info.password}'
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
    signupCoach(info,userID,callback) {
        this.connection.query(`INSERT INTO coach_survey 
        SELCT ${userID},${info.experience},'${info.city}', '${info.state}', ${cost}, goal
        FROM goals
        WHERE goal=${info.goal}`, (err, res) => {
            callback(err)
        })
    }
}