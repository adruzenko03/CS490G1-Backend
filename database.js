import mysql from "mysql2";
import "dotenv/config.js";

export default class DatabaseService {
  constructor() {
    this.connection = mysql.createConnection(
      {
        multipleStatements: true,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DB,
        port:process.env.DB_PORT
      }
    );
    
    this.connection.connect((err) => {
      if (err) {
        console.error("Error connecting to the database:", err);
        return;
      }
      console.log("Database connection established");
    });
  }
  
  login(username, password, callback) {
    this.connection.query(
      `SELECT * FROM user_auth WHERE email='${username}' and password='${password}'`,
      (err, res) => {
        if (err) {
          console.error("Database error:", err);
          callback([]);
          return;
        }
        const userData = res[0];
        console.log("Database response!:", userData);
        callback(userData);
      }
    );
  }

  getUserInfo(userId, callback) {
    this.connection.query(
      `SELECT * FROM users WHERE user_id='${userId}'`,
      (err, res) => {
        if (err) {
          console.error("Database error:", err);
          callback(null);
          return;
        }
        const userInfo = res[0];
        console.log("Database response!:", userInfo);
        callback(userInfo);
      }
    );
  }

  checkUser(email, callback) {
    this.connection.query(
      `SELECT * FROM users WHERE email='${email}'`,
      (err, res) => {
        callback(res);
      }
    );
  }
  signupCoach(info, callback) {
    console.log("signupCoach() ", info);
    const query = `INSERT INTO users (first_name, last_name, email, password, phone_number, street_address, city, state, zip, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      info.firstName,
      info.lastName,
      info.email,
      info.password,
      info.phoneNumber,
      info.streetAddress,
      info.city,
      info.state,
      info.zipCode,
      info.role,
    ];
    this.connection.query(query, values, (err, results) => {
      if (err) {
        callback(false, err.message, null);
      } else {
        console.log("Results from database.js, ", results);
        callback(true, "Signup Coach successful", results.insertId);
      }
    });
  }
  signupClient(info, callback) {
    console.log("signupClient()", info);
    const query = `INSERT INTO users (first_name, last_name, email, password, phone_number, street_address, city, state, zip, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      info.firstName,
      info.lastName,
      info.email,
      info.password,
      info.phoneNumber,
      info.streetAddress,
      info.city,
      info.state,
      info.zipCode,
      info.role,
    ];

    this.connection.query(query, values, (err, results) => {
      if (err) {
        callback(false, err.message);
      } else {
        console.log("Results from database.js, ", results);
        callback(true, "Signup Client successful", results.insertId);
      }
    });
  }

  insertCoachSurvey(surveyData, callback) {
    const query = `INSERT INTO coach_survey (user_id, experience, city, state, cost, goals) VALUES (?, ?, ?, ?, ?, ?)`; //change to accept last param too
    console.log("What will be inserted into coach_survey table ", surveyData);
    const values = [
      surveyData.userID,
      surveyData.experience,
      surveyData.city,
      surveyData.state,
      surveyData.cost,
      JSON.stringify(surveyData.goals),
    ];

    this.connection.query(query, values, (err, results) => {
      if (err) {
        callback(false, err.message);
      } else {
        // If the insert is successful, send back a success message.
        callback(true, "Survey data inserted successfully", surveyData);
      }
    });
  }
  insertClientSurvey(surveyData, callback) {
    const query = `INSERT INTO survey (user_id, fitness_level, diet, weekly_exercise, goal_id) VALUES (?, ?, ?, ?, ?)`; //change to accept last param too
    console.log("What will be inserted into survey table ", surveyData);
    const values = [
      surveyData.userID,
      surveyData.currentFitnessLevel,
      surveyData.currentDiet,
      surveyData.currentExerciseSchedule,
      surveyData.fitnessGoal,
    ];

    this.connection.query(query, values, (err, results) => {
      if (err) {
        callback(false, err.message);
      } else {
        // If the insert is successful, send back a success message.
        callback(true, "Survey data inserted successfully", surveyData);
      }
    });
  }

  getSurveyData(userId, callback) {
    const query = "SELECT * FROM survey WHERE user_id = ?";
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

  getAcceptedClients(userId, callback) {
    const query =
      'SELECT client_id FROM coach_client_connections WHERE coach_id = ? AND status = "accepted"';
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

  getExercises(callback) {
    const query =
      "SELECT exercises.exercise_name, equipment.equipment_name, exercises.steps FROM exercises INNER JOIN exercise_equipment ON exercises.exercise_id = exercise_equipment.exercise_id INNER JOIN equipment ON exercise_equipment.equipment_id = equipment.equipment_id";

    this.connection.query(query, (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    });
  }
  getWorkouts(callback) {
    const query =
      "SELECT workouts.workout_id, workouts.workout_name, goals.goal, GROUP_CONCAT(DISTINCT exercises.exercise_name SEPARATOR ', ') AS exercises, workouts.difficulty, GROUP_CONCAT(DISTINCT CONCAT(UCASE(LEFT(muscle_groups.muscle, 1)), SUBSTRING(muscle_groups.muscle, 2)) SEPARATOR ', ') AS muscle_groups, GROUP_CONCAT(DISTINCT equipment.equipment_name SEPARATOR ', ') AS equipment_list FROM workouts JOIN goals ON workouts.goal_id = goals.goal_id JOIN workout_exercises ON workouts.workout_id = workout_exercises.workout_id JOIN exercises ON workout_exercises.exercise_id = exercises.exercise_id JOIN workout_muscle_groups ON workouts.workout_id = workout_muscle_groups.workout_id JOIN muscle_groups ON workout_muscle_groups.muscle_id = muscle_groups.muscle_id JOIN exercise_equipment ON exercises.exercise_id = exercise_equipment.exercise_id JOIN equipment ON exercise_equipment.equipment_id = equipment.equipment_id GROUP BY workouts.workout_id, workouts.workout_name, goals.goal, workouts.difficulty;";
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    });
  }
  
  getUserWorkouts(userId, callback) {
    const query = `
    SELECT workouts.workout_id, workouts.workout_name, goals.goal, GROUP_CONCAT(DISTINCT exercises.exercise_name SEPARATOR ', ') AS exercises, workouts.difficulty, GROUP_CONCAT(DISTINCT CONCAT(UCASE(LEFT(muscle_groups.muscle, 1)), SUBSTRING(muscle_groups.muscle, 2)) SEPARATOR ', ') AS muscle_groups, GROUP_CONCAT(DISTINCT equipment.equipment_name SEPARATOR ', ') AS equipment_list, user_workouts.user_id FROM workouts JOIN goals ON workouts.goal_id = goals.goal_id JOIN workout_exercises ON workouts.workout_id = workout_exercises.workout_id JOIN exercises ON workout_exercises.exercise_id = exercises.exercise_id JOIN workout_muscle_groups ON workouts.workout_id = workout_muscle_groups.workout_id JOIN muscle_groups ON workout_muscle_groups.muscle_id = muscle_groups.muscle_id JOIN exercise_equipment ON exercises.exercise_id = exercise_equipment.exercise_id JOIN equipment ON exercise_equipment.equipment_id = equipment.equipment_id JOIN user_workouts ON workouts.workout_id = user_workouts.workout_id WHERE user_workouts.user_id = ? GROUP BY workouts.workout_id, workouts.workout_name, goals.goal, workouts.difficulty, user_workouts.user_id;
  `;

    this.connection.query(query, [userId], (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    });
  }

  deleteUserWorkout(userId, workoutId, callback) {
    const deleteQuery =
      "DELETE FROM user_workouts WHERE user_id = ? AND workout_id = ?";

    this.connection.query(deleteQuery, [userId, workoutId], (err, results) => {
      if (err) {
        console.error("Error deleting user workout:", err);
        callback(false, err.message);
      } else {
        console.log("User workout deleted successfully");
        callback(true, "User workout deleted successfully");
      }
    });
  }

  insertUserWorkout(userId, workoutId, callback) {
    const insertQuery =
      "INSERT INTO user_workouts (user_id, workout_id) VALUES (?, ?)";

    this.connection.query(insertQuery, [userId, workoutId], (err, results) => {
      if (err) {
        console.error("Error inserting user workout:", err);
        callback(false, err.message);
      } else {
        console.log("User workout inserted successfully");
        callback(true, "User workout inserted successfully", results.insertId);
      }
    });
  }

  getActivity(userId, callback) {
    const query = `SELECT * FROM daily_activity WHERE user_id = ?;`;
    this.connection.query(query, [userId], (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    });
  }

  insertUserDailyActivity(
    userId,
    entryDate,
    calorieIntake,
    bodyWeight,
    callback
  ) {
    const insertQuery =
      "INSERT INTO daily_activity (user_id, entry_date, calorie_intake, body_weight) VALUES (?, ?, ?, ?)";
    this.connection.query(
      insertQuery,
      [userId, entryDate, calorieIntake, bodyWeight],
      (err, results) => {
        if (err) {
          console.error("Error inserting daily activity:", err);
          callback(false, err.message);
        } else {
          console.log("Daily activity inserted successfully");
          callback(
            true,
            "Daily activity inserted successfully",
            results.insertId
          );
        }
      }
    );
  }

  getAcceptedClients(userId, callback) {
    const query = "SELECT u.*, s.*, g.goal as goal_description FROM coach_client_connections ccc JOIN users u ON ccc.client_id = u.user_id LEFT JOIN survey s ON u.user_id = s.user_id LEFT JOIN goals g ON s.goal_id = g.goal_id WHERE ccc.coach_id = ? AND ccc.status = 'accepted'";
    //'SELECT u.*, s.* FROM coach_client_connections ccc JOIN users u ON ccc.client_id = u.user_id LEFT JOIN survey s ON u.user_id = s.user_id WHERE ccc.coach_id = ? AND ccc.status = "accepted"'; with goal_id(int)
    //'SELECT u.* FROM coach_client_connections ccc JOIN users u ON ccc.client_id = u.user_id WHERE ccc.coach_id = ? AND ccc.status = "accepted"';   without goal_id

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
  removeClient(userId, callback) {
    const query = 'DELETE FROM coach_client_connections WHERE client_id = ?';
    this.connection.query(query, [userId], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }
  getRequestedClients(userId, callback) {
    const query = "SELECT u.*, s.*, g.goal as goal_description FROM coach_client_connections ccc JOIN users u ON ccc.client_id = u.user_id LEFT JOIN survey s ON u.user_id = s.user_id LEFT JOIN goals g ON s.goal_id = g.goal_id WHERE ccc.coach_id = ? AND ccc.status = 'pending'";
    this.connection.query(query, [userId], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  acceptClient(userId, callback) {
    const query = 'UPDATE coach_client_connections SET status = "accepted" WHERE client_id = ?';
    this.connection.query(query, [userId], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  declineClient(userId, callback) {
    const query = 'UPDATE coach_client_connections SET status = "declined" WHERE client_id = ?';
    this.connection.query(query, [userId], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  getPendingCoaches(callback) {
    const query =
      "SELECT users.user_id, users.first_name, users.last_name, coach_survey.experience, coach_survey.goal, coach_survey.cost FROM users JOIN coach_survey ON users.user_id = coach_survey.user_id JOIN coach_status ON coach_status.coach_id = users.user_id WHERE coach_status.status='pending'";
  
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    });
  }

  acceptCoach(coach_id, callback) {
    const query = 'UPDATE coach_status SET status = "accepted" WHERE coach_id = ?';
  
    this.connection.query(query, [coach_id], (error, result) => {
      if (error) {
        console.error('Error updating coach status:', error);
        return callback(error, null);
      }
      callback(null, result);
    });
  }
  
  declineCoach(coach_id, callback) {
    const query = 'UPDATE coach_status SET status = "declined" WHERE coach_id = ?; UPDATE users SET role = "client" WHERE user_id = ?;';
    
    this.connection.query(query, [coach_id,coach_id], (error, result) => {
      if (error) {
        console.error('Error updating coach status:', error);
        return callback(error, null);
      }
      callback(null, result);
    });
  }

  getExerciseList(callback) {
    const query = 'SELECT exercises.muscle, exercises.status, exercises.exercise_id, exercises.exercise_name, GROUP_CONCAT(DISTINCT equipment.equipment_name) AS equipment_list, exercises.steps FROM exercises JOIN exercise_equipment ON exercises.exercise_id = exercise_equipment.exercise_id JOIN equipment ON exercise_equipment.equipment_id = equipment.equipment_id GROUP BY exercises.exercise_id, exercises.exercise_name, exercises.steps ORDER BY exercises.last_update DESC';
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        
        return callback(error);
      }
      callback(null, results);
    });
  }
  
  addExercise(exercise_name, muscle, steps, equipmentList, callback) {
    const query = `INSERT INTO exercises (exercise_name, muscle, steps, status) VALUES (?, ?, ?, 'activated'); SET @lastExerciseId = LAST_INSERT_ID(); INSERT INTO exercise_equipment (exercise_id, equipment_id) VALUES ${equipmentList.map(equipment_id => `(@lastExerciseId, ${equipment_id})`).join(', ')};`;
    this.connection.query(query, [exercise_name, muscle, steps], (error, result) => {
      if (error) {
        console.error('Error adding exercise and equipment:', error);
        console.log('DB Error');
        return callback(error);
      }
      callback(null,result)
    });
  }

  activateExercise(exercise_id, callback) {
    const query = 'UPDATE exercises SET status = "activated" WHERE exercise_id = ?';
  
    this.connection.query(query, [exercise_id], (error, result) => {
      if (error) {
        console.error('Error activating exercise:', error);
        return callback(error, null);
      }
      callback(null, result);
    });
  }
  
  deactivateExercise(exercise_id, callback) {
    const query = 'UPDATE exercises SET status = "deactivated" WHERE exercise_id = ?';
  
    this.connection.query(query, [exercise_id], (error, result) => {
      if (error) {
        console.error('Error deactivating exercise:', error);
        return callback(error, null);
      }
      callback(null, result);
    });
  }
}