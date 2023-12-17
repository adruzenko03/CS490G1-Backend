import mysql from "mysql2";
import "dotenv/config.js";

export default class DatabaseService {
  constructor() {
    this.connection = mysql.createConnection(
      {
        multipleStatements: true,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.PASS,
        database: process.env.DB_DB,
        port: process.env.DB_PORT
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
    const query = `
          SELECT u.*, cs.status as coach_status
          FROM users u
          LEFT JOIN coach_status cs ON u.user_id = cs.coach_id
          WHERE u.user_id = ?
      `;
    //`SELECT * FROM users WHERE user_id='${userId}'`,
    this.connection.query(query, userId, (err, res) => {
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
    const query = `
    SELECT s.*, g.goal 
    FROM survey s
    LEFT JOIN goals g ON s.goal_id = g.goal_id
    WHERE s.user_id = ?
    `;
    //const query = "SELECT * FROM survey WHERE user_id = ?";
    this.connection.query(query, [userId], (err, results) => {
      if (err) {
        callback(err);
      } else {
        console.log(results);
        callback(null, results);
      }
    });
  }

  getAcceptedClientsID(userId, callback) {
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

    this.connection.query(query, [coach_id, coach_id], (error, result) => {
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
      callback(null, result)
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

  /******************************* GLENS CODE  */


  //  -------------------------------------------------------------------------


  removeClient(clientId, coachId, callback) {
    const query = 'DELETE FROM coach_client_connections WHERE client_id = ? AND coach_id = ?';
    this.connection.query(query, [clientId, coachId], (err, result) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, result);
      }
    });
  }

  //  -------------------------------------------------------------------------




  //  -------------------------------------------------------------------------
  getGoalsList(callback) {
    const query = `SELECT DISTINCT goal FROM coach_survey;`
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        return callback(error);
      } else {
        callback(null, results);
      }
    })
  }

  //  -------------------------------------------------------------------------

  getExperienceList(callback) {
    const query = `SELECT DISTINCT experience FROM coach_survey
                        ORDER BY experience`
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        return callback(error);
      } else {
        callback(null, results)
      }
    })
  }

  //  -------------------------------------------------------------------------

  getLocationList(callback) {
    const query = `SELECT DISTINCT state FROM users WHERE role='coach'
                        ORDER BY state;`
    this.connection.query(query, (error, results, fields) => {
      if (error) {
        return callback(error);
      } else {
        callback(null, results)
      }
    })
  }

  //  -------------------------------------------------------------------------

  // getCityList(callback){
  //     const query = `SELECT DISTINCT city FROM users WHERE role='coach'
  //                     ORDER BY city;`
  //     this.connection.query(query, (err,results)=>{
  //         if(err){
  //             callback(err);
  //         }else{
  //             console.log(results);
  //             callback(null, results)
  //         }
  //     })
  // }

  //  -------------------------------------------------------------------------

  getPriceList(callback) {
    const query = `SELECT DISTINCT cost FROM coach_survey
                        ORDER BY cost;`
    this.connection.query(query, (error, results) => {
      if (error) {
        return callback(error);
      } else {
        callback(null, results)
      }
    })
  }

  //  -------------------------------------------------------------------------

  getCoachList(callback) {
    const query = `SELECT * FROM fitness.coach_survey JOIN users ON coach_survey.user_id = users.user_id;`
    this.connection.query(query, (error, results) => {
      if (error) {
        return callback(error);
      } else {
        callback(null, results)
      }
    })
  }


  //  -------------------------------------------------------------------------

  getAcceptedCoach(clientId, callback) {
    const query = `SELECT * 
        FROM fitness.coach_client_connections 
        JOIN coach_survey ON coach_survey.user_id = coach_client_connections.coach_id
        JOIN users on users.user_id = coach_client_connections.coach_id
        WHERE coach_client_connections.client_id = ? AND coach_client_connections.status = 'accepted'`
    this.connection.query(query, [clientId], (error, results) => {
      if (error) {
        return callback(error);
      } else {
        // console.log(results);
        callback(null, results)
      }
    })
  }

  //  -------------------------------------------------------------------------

  getClientInfo(clientId, callback) {
    const query = `SELECT * FROM fitness.users 
        JOIN survey on survey.user_id = users.user_id
        JOIN goals on goals.goal_id = survey.goal_id
        WHERE users.role = 'client' and users.user_id= ?;`
    this.connection.query(query, [clientId], (error, results) => {
      if (error) {
        callback(error);
      } else {
        // console.log(results);
        callback(null, results)
      }
    })
  }


  //  -------------------------------------------------------------------------

  getPendingCoach(clientId, callback) {
    const query = `SELECT *
                        FROM fitness.coach_client_connections
                        JOIN coach_survey ON coach_survey.user_id = coach_client_connections.coach_id
                        JOIN users on users.user_id = coach_client_connections.coach_id
                        WHERE coach_client_connections.client_id = ? AND coach_client_connections.status = 'pending';
                        `
    this.connection.query(query, [clientId], (error, results) => {
      if (error) {
        callback(error);
      } else {
        // console.log(results);
        callback(null, results)
      }
    })
  }

  //  -------------------------------------------------------------------------

  getClientWorkouts(clientId, callback) {
    const query = `
        SELECT 
        MAX(workouts.workout_id) AS workout_id,
        MAX(workouts.goal_id) AS goal_id,
        MAX(workout_name) AS workout_name,
        MAX(goal) AS goal,
        MAX(difficulty) AS difficulty,
        MAX(equipment_name) AS equipment_name,
        MAX(muscle) AS muscle,
        MAX(workout_muscle_groups.muscle_id) AS muscle_id,
        MAX(steps) AS steps,
        MAX(workouts.last_update) AS last_update
        FROM 
            fitness.user_workouts 
        JOIN 
            workouts ON user_workouts.workout_id = workouts.workout_id
        JOIN 
            workout_muscle_groups ON workouts.workout_id = workout_muscle_groups.workout_id
        JOIN 
            muscle_groups ON muscle_groups.muscle_id = workout_muscle_groups.muscle_id
        JOIN 
            goals ON goals.goal_id = workouts.goal_id
        LEFT JOIN 
            workout_exercises ON workout_exercises.workout_id = workouts.workout_id 
        LEFT JOIN 
            exercises ON exercises.exercise_id = workout_exercises.exercise_id
        LEFT JOIN 
            exercise_equipment ON exercises.exercise_id = exercise_equipment.exercise_id
        LEFT JOIN 
            equipment ON equipment.equipment_id = exercise_equipment.equipment_id
        LEFT JOIN 
            reps ON exercises.exercise_id = reps.exercise_id
        WHERE 
            user_workouts.user_id = ?
        GROUP BY 
            workouts.workout_id;
    
        `
    this.connection.query(query, [clientId], (error, results) => {
      if (error) {
        callback(error);
      } else {
        // console.log(results);
        callback(null, results)
      }
    })
  }

  //  -------------------------------------------------------------------------


  requestCoach(clientId, items, callback) {
    // console.log("requestCoach() ", clientInfo);
    // console.log("requestCoach() ", items.user_id, "end of ittttt");
    const query = `INSERT INTO coach_client_connections (client_id, coach_id, status) VALUES (?, ?, 'pending');`;
    const values = [clientId, items.user_id];
    // console.log(values);

    this.connection.query(query, values, (error, results) => {
      if (error) {
        console.error("Error inserting into database: ", error);
        callback(false, error.message, null);
      } else {
        console.log("Results from database.js: ", results);
        callback(true, 'Signup Coach successful');
      }
    });
  }

  //  -------------------------------------------------------------------------


  getExerciseCount(workoutId, callback) {
    const query = `SELECT COUNT(*) AS exercise_count FROM fitness.workout_exercises WHERE workout_id = ${workoutId};`
    this.connection.query(query, (err, results) => {
      if (err) {
        callback(err);
      } else {
        // console.log(results);
        callback(null, results)
      }
    })
  }

  //  -------------------------------------------------------------------------


  deleteCoachRequest(requestId, callback) {
    const query = `DELETE FROM fitness.coach_client_connections WHERE coach_client_id = (?);`

    this.connection.query(query, [requestId.requestId], (err, results) => {
      if (err) {
        console.error("Error deleting from database: ", err);
        callback(false, err.message, null);
      } else {
        console.log("Results from database.js: ", results);
        callback(true, 'Delete was successful');
      }
    })
  }

  //  -------------------------------------------------------------------------


  acceptClientRequest(connectionId, callback) {
    const query = `UPDATE fitness.coach_client_connections
                        SET status = 'accepted' 
                        WHERE coach_client_id = ?;`

    this.connection.query(query, [connectionId], (err, results) => {
      console.log(connectionId);
      if (err) {
        console.error("Error updating database: ", err);
        callback(false, err.message, null);
      } else {
        console.log("Results from database.js: ", results);
        callback(true, 'Request acceptance was successful.');
      }
    })
  }

  //  -------------------------------------------------------------------------

  deleteCurrentCoach(connectionId, callback) {
    this.connection.query(
      `DELETE FROM fitness.coach_client_connections WHERE status='accepted' AND coach_client_id = ${connectionId};`,
      (err1) => {
        if (err1) {
          callback(err1);
        } else {
          console.log("Deletion was successful");
          // callback(true, 'Delete was successful');
        }
      }
    );
  }

  //  -------------------------------------------------------------------------

  getPendingClientRequests(coachId, callback) {
    const query = `SELECT * 
        FROM fitness.coach_client_connections AS ccc
        JOIN users ON users.user_id = ccc.client_id 
        JOIN survey ON survey.user_id = users.user_id
        JOIN goals ON goals.goal_id = survey.goal_id
        WHERE ccc.coach_id = ? AND ccc.status = 'pending';`;
    this.connection.query(query, [coachId], (err, results) => {
      if (err) {
        callback(err);
      } else {
        console.log(results);
        callback(null, results);
      }
    })
  }

  //  -------------------------------------------------------------------------


  /*Glen's Code*/
  getAcceptedClients2(coachId, callback) {
    const query = `SELECT * 
        FROM fitness.coach_client_connections AS ccc
        JOIN users ON users.user_id = ccc.client_id 
        JOIN survey ON survey.user_id = users.user_id
        JOIN goals ON goals.goal_id = survey.goal_id
        WHERE ccc.coach_id = ? AND ccc.status = 'accepted';`;
    this.connection.query(query, [coachId], (err, results) => {
      if (err) {
        callback(err);
      } else {
        console.log(results);
        callback(null, results);
      }
    })
  }

  //  -------------------------------------------------------------------------

  declineClientRequest(connectionId, callback) {
    const query = `UPDATE fitness.coach_client_connections
                        SET status = 'declined' 
                        WHERE coach_client_id = ?;`

    this.connection.query(query, [connectionId], (err, results) => {
      console.log(connectionId);
      if (err) {
        console.error("Error updating database: ", err);
        callback(false, err.message, null);
      } else {
        console.log("Results from database.js: ", results);
        callback(true, 'Request acceptance was successful.');
      }
    })
  }

  //  -------------------------------------------------------------------------


  deleteClient(connectionId, callback) {
    const query = `DELETE FROM fitness.coach_client_connections WHERE coach_client_id = (?);`

    this.connection.query(query, [connectionId.connectionId], (err, results) => {
      if (err) {
        console.error("Error deleting from database: ", err);
        callback(false, err.message, null);
      } else {
        console.log("Results from database.js: ", results);
        callback(true, 'Delete was successful');
      }
    })
  }

  // ------------------_----------------–---------------------------------------



  sendWorkoutData(workoutId, data, callback) {

    const query1 = `UPDATE fitness.workouts 
                        SET workout_name = ?, goal_id = ?, difficulty = ? 
                        WHERE workout_id = ?`;

    const { workout_name, difficulty, goal_id } = data.editedItems;

    this.connection.query(query1, [workout_name, goal_id, difficulty, workoutId], (err1, results1) => {
      if (err1) {
        console.error("Error updating workout details: ", err1);
        callback(false, err1.message, null);
      } else {
        console.log("Workout details updated: ", results1);
        const new_muscle_id = data.editedItems.muscle_id;
        const old_muscle_id = data.oldMuscleId;
        // Second query for updating workout_muscle_groups
        const query2 = `UPDATE fitness.workout_muscle_groups 
                                SET muscle_id = ?
                                WHERE workout_id = ? AND muscle_id = ?`;

        this.connection.query(query2, [new_muscle_id, workoutId, old_muscle_id], (err2, results2) => {
          if (err2) {
            console.error("Error updating muscle groups: ", err2);
            callback(false, err2.message, null);
          } else {
            console.log("Muscle groups updated: ", results2);
            callback(true, 'Request acceptance was successful.');
          }
        });
      }
    });
  }

  // ------------------_----------------–---------------------------------------


  sendNewWorkoutData(workoutData, callback) {
    const query = `START TRANSACTION;
                        INSERT INTO workouts (workout_name, goal_id, difficulty) VALUES (?, ?, ?);
                        SET @last_workout_id = LAST_INSERT_ID();
                        INSERT INTO user_workouts (user_id, workout_id) VALUES (?, @last_workout_id);
                        INSERT INTO workout_muscle_groups (workout_id, muscle_id) VALUES (@last_workout_id, ?);
                        COMMIT;`;
    // INSERT INTO workout_exercises (workout_id, exercise_id) VALUES (@last_workout_id, 10);

    this.connection.query(query, [workoutData.workout_name, workoutData.goal_id, workoutData.difficulty, workoutData.client_id, workoutData.muscle_id], (err, results) => {
      if (err) {
        console.error("Error inserting into database: ", err);
        callback(false, err.message, null);
      } else {
        console.log("Results from database.js: ", results);
        callback(true, 'Successful addition of exercise');
      }
    });
  }

  // ------------------_----------------–---------------------------------------



  getAllExercises(workoutId, callback) {
    const query = `SELECT * FROM fitness.workout_exercises 
                        JOIN exercises on exercises.exercise_id = workout_exercises.exercise_id
                        WHERE workout_id = ${workoutId};`
    this.connection.query(query, (err, results, fields) => {
      if (err) {
        // callback(err);
      } else {
        // console.log(results);
        callback(null, results)
      }
    })
  }


  // ------------------_----------------–---------------------------------------


  getExercisesList(callback) {
    const query =
      "SELECT * FROM fitness.exercises";

    this.connection.query(query, (error, results, fields) => {
      if (error) {
        return callback(error);
      }
      callback(null, results);
    });
  }

  // -----------------------------------–---------------------------------------


  changeExercise(workoutId, data, callback) {
    const query = `UPDATE fitness.workout_exercises
                        SET exercise_id = ?
                        WHERE workout_id = ? and exercise_id = ?;`

    this.connection.query(query, [data.selectedId, workoutId, data.oldExerciseId], (err, results) => {
      // console.log(connectionId);
      if (err) {
        console.error("Error updating database: ", err);
        callback(false, err.message, null);
      } else {
        console.log("Results from database.js: ", results);
        callback(true, 'Request acceptance was successful.');
      }
    })
  }

  acceptClient(clientId, coachId, callback) {
    const query = 'UPDATE coach_client_connections SET status = "accepted" WHERE client_id = ? AND coach_id = ?';
    const declineothers = 'UPDATE coach_client_connections SET status = "declined" WHERE client_id = ? AND coach_id != ?';

    this.connection.beginTransaction(err => {
      if (err) {
        callback(err);
        return;
      }

      this.connection.query(query, [clientId, coachId], (err, acceptresult) => {
        if (err) {
          return this.connection.rollback(() => {
            callback(err);
          });
        }

        this.connection.query(declineothers, [clientId, coachId], (err, declineresult) => {
          if (err) {
            return this.connection.rollback(() => {
              callback(err);
            });
          }

          this.connection.commit(err => {
            if (err) {
              return this.connection.rollback(() => {
                callback(err);
              });
            }
            callback(null, { acceptresult, declineresult });
          });
        });
      });
    });
  }

  declineClient(clientId, coachId, callback) {
    const query = 'UPDATE coach_client_connections SET status = "declined" WHERE client_id = ? AND coach_id = ?';
    this.connection.query(query, [clientId, coachId], (err, result) => {
      if (err) {
        console.error("Error inserting into database: ", err);
        callback(false, err.message);
      } else {
        console.log("Results from database.js: ", results);
        callback(true, 'Successful addition of exercise');
      }
    });
  }
  // -----------------------------------–---------------------------------------


  deleteExercise(workoutId, data, callback) {
    const query = `DELETE FROM fitness.workout_exercises WHERE workout_id = ? and exercise_id = ?;`

    this.connection.query(query, [workoutId, data.oldExerciseId], (err, results) => {
      if (err) {
        console.error("Error deleting from database: ", err);
        callback(false, err.message, null);
      } else {
        console.log("Results from database.js: ", results);
        callback(true, 'Delete was successful');
      }
    })
  }

  // -----------------------------------–---------------------------------------


  addNewExercise(workoutId, data, callback) {
    const query = `INSERT INTO workout_exercises (workout_id, exercise_id) VALUES (?, ?);`;

    this.connection.query(query, [workoutId, data.selectedId], (err, results) => {
      if (err) {
        console.error("Error inserting into database: ", err);
        callback(false, err.message);
      } else {
        console.log("Results from database.js: ", results);
        callback(true, 'Successful addition of exercise');
      }
    });
  }
  fetchClientWorkoutLog(clientId, callback) {
    const query = 'SELECT * FROM reps WHERE user_id = ?';
    this.connection.query(query, [clientId], (err, results) => {
      if (err) {
        console.error("Error inserting into database: ", err);
        callback(false, err.message, null);
      } else {
        console.log("Results from database.js: ", results);
        callback(true, 'Successful addition of exercise');
      }
    });
  }

  // -----------------------------------–---------------------------------------


  deleteOneWorkout(workoutId, callback) {
    const query = `DELETE FROM user_workouts WHERE workout_id = ?;
                        DELETE FROM workout_exercises WHERE workout_id = ?;
                        DELETE FROM workout_muscle_groups WHERE workout_id = ?;
                        DELETE FROM workouts WHERE workout_id = ?;
        `

    this.connection.query(query, [workoutId, workoutId, workoutId, workoutId], (err, results) => {
      if (err) {
        console.error("Error deleting from database: ", err);
        callback(false, err.message, null);
      } else {
        console.log("Results from database.js: ", results);
        callback(true, 'Delete was successful');
      }
    })
  }

  // -----------------------------------–---------------------------------------


  getMessages(coachId, callback) {
    const query = `SELECT * FROM coach_client_message WHERE sender_id = ? OR receiver_id = ?`
    this.connection.query(query, [coachId, coachId], (err, results) => {
      if (err) {
        callback(err);
      } else {
        // console.log(results);
        callback(null, results)
      }
    })
  }

  // -----------------------------------–---------------------------------------


  getAllChats(coachId, callback) {
    const query = `WITH RankedMessages AS (
                            SELECT coach_client_id, receiver_id, sender_id,
                                ROW_NUMBER() OVER (PARTITION BY coach_client_id ORDER BY (SELECT NULL)) AS rn
                            FROM coach_client_message
                            WHERE sender_id = ? OR receiver_id = ?
                        )
                        SELECT coach_client_id, receiver_id, sender_id
                        FROM RankedMessages
                        WHERE rn = 1;
                        `
    this.connection.query(query, [coachId, coachId], (err, results) => {
      if (err) {
        callback(err);
      } else {
        // console.log(results);
        callback(null, results)
      }
    })
  }

  // -----------------------------------–---------------------------------------


  getSideNames(chatId, coachId, callback) {
    const query = `SELECT DISTINCT users.first_name, users.last_name, users.role
                        FROM users 
                        JOIN coach_client_message ON users.user_id = coach_client_message.receiver_id OR users.user_id = coach_client_message.sender_id
                        WHERE coach_client_message.coach_client_id = ?
                        AND users.user_id != ?;`
    this.connection.query(query, [chatId, coachId], (err, results) => {
      if (err) {
        callback(err);
      } else {
        // console.log(results);
        callback(null, results)
      }
    })
  }

  // -----------------------------------–---------------------------------------


  getOneSpecificChat(chatId, callback) {
    const query = `SELECT * FROM coach_client_message WHERE coach_client_id = ?;`
    this.connection.query(query, [chatId], (err, results) => {
      if (err) {
        callback(err);
      } else {
        // console.log(results);
        callback(null, results)
      }
    })
  }
  // -----------------------------------–---------------------------------------


  sendNewMessage(data, callback) {
    const query = "INSERT INTO coach_client_message (`message`, `coach_client_id`, `sender_id`, `receiver_id`, `last_update`) VALUES (?)";
    const values = [
      data.message,
      data.chatId,
      data.sender_id,
      data.receiver_id,
      data.last_update
    ];

    this.connection.query(query, [values], (err, results) => {
      if (err) {
        console.error("Error inserting into database: ", err);
        callback(false, err.message, null);
      } else {
        console.log("Results from database.js: ", results);
        callback(true, 'Successful addition of exercise');
      }
    });
  }

  fetchClientDailySurvey(clientId, callback) {
    const query = 'SELECT * FROM daily_activity WHERE user_id = ?';
    this.connection.query(query, [clientId], (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  }


}
