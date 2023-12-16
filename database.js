import mysql from 'mysql2';
import "dotenv/config.js";
export default class DatabaseService {
    constructor(){
        this.connection=mysql.createConnection({
            multipleStatements: true,
            host: "localhost",
            user: "root",
            password: 'Nike2001.',
            database: "fitness",
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


    /* JA's code */
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



//  -------------------------------------------------------------------------


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

//  -------------------------------------------------------------------------




//  -------------------------------------------------------------------------
    getGoalsList(callback){
        const query = `SELECT DISTINCT goal FROM coach_survey;`
        this.connection.query(query, (error,results, fields)=>{
            if(error){
                return callback(error);
            }else{
                callback(null, results);
            }
        })
    }

//  -------------------------------------------------------------------------

    getExperienceList(callback){
        const query = `SELECT DISTINCT experience FROM coach_survey
                        ORDER BY experience`
        this.connection.query(query, (error,results, fields)=>{
            if(error){
                return callback(error);
            }else{
                callback(null, results)
            }
        })
    }

//  -------------------------------------------------------------------------

    getLocationList(callback){
        const query = `SELECT DISTINCT state FROM users WHERE role='coach'
                        ORDER BY state;`
        this.connection.query(query, (error,results, fields)=>{
            if(error){
               return callback(error);
            }else{
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

    getPriceList(callback){
        const query = `SELECT DISTINCT cost FROM coach_survey
                        ORDER BY cost;`
        this.connection.query(query, (error,results)=>{
            if(error){
                return callback(error);
             }else{
                 callback(null, results)
             }
        })
    }

//  -------------------------------------------------------------------------

    getCoachList(callback){
        const query = `SELECT * FROM fitness.coach_survey JOIN users ON coach_survey.user_id = users.user_id;`
        this.connection.query(query, (error,results)=>{
            if(error){
                return callback(error);
             }else{
                 callback(null, results)
             }
        })
    }


//  -------------------------------------------------------------------------

    getAcceptedCoach(clientId, callback){
        const query = `SELECT * 
        FROM fitness.coach_client_connections 
        JOIN coach_survey ON coach_survey.user_id = coach_client_connections.coach_id
        JOIN users on users.user_id = coach_client_connections.coach_id
        WHERE coach_client_connections.client_id = ? AND coach_client_connections.status = 'accepted'`
        this.connection.query(query, [clientId], (error,results)=>{
            if(error){
                return callback(error);
            }else{
                // console.log(results);
                callback(null, results)
            }
        })
    }

//  -------------------------------------------------------------------------

    getClientInfo(clientId, callback){
        const query = `SELECT * FROM fitness.users 
        JOIN survey on survey.user_id = users.user_id
        JOIN goals on goals.goal_id = survey.goal_id
        WHERE users.role = 'client' and users.user_id= ?;`
        this.connection.query(query,[clientId], (error,results)=>{
            if(error){
                callback(error);
            }else{
                // console.log(results);
                callback(null, results)
            }
        })
    }


//  -------------------------------------------------------------------------

    getPendingCoach(clientId, callback){
        const query = `SELECT *
                        FROM fitness.coach_client_connections
                        JOIN coach_survey ON coach_survey.user_id = coach_client_connections.coach_id
                        JOIN users on users.user_id = coach_client_connections.coach_id
                        WHERE coach_client_connections.client_id = ? AND coach_client_connections.status = 'pending';
                        `
        this.connection.query(query,[clientId], (error,results)=>{
            if(error){
                callback(error);
            }else{
                // console.log(results);
                callback(null, results)
            }
        })
    }

//  -------------------------------------------------------------------------

    getClientWorkouts(clientId, callback){
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
        this.connection.query(query,[clientId], (error,results)=>{
            if(error){
                callback(error);
            }else{
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
    
        this.connection.query(query, values,  (error, results) => {
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


 getExerciseCount(workoutId, callback){
    const query = `SELECT COUNT(*) AS exercise_count FROM fitness.workout_exercises WHERE workout_id = ${workoutId};`
    this.connection.query(query, (err,results)=>{
        if(err){
            callback(err);
        }else{
            // console.log(results);
            callback(null, results)
        }
    })
}

 //  -------------------------------------------------------------------------


    deleteCoachRequest(requestId, callback){
        const query = `DELETE FROM fitness.coach_client_connections WHERE coach_client_id = (?);`

        this.connection.query(query, [requestId.requestId], (err, results)=>{
            if(err){
                console.error("Error deleting from database: ", err);
                callback(false, err.message, null);
            }else{
                console.log("Results from database.js: ", results);
                callback(true, 'Delete was successful');
            }
        })
    }

 //  -------------------------------------------------------------------------


    acceptClientRequest(connectionId, callback){
        const query = `UPDATE fitness.coach_client_connections
                        SET status = 'accepted' 
                        WHERE coach_client_id = ?;`

        this.connection.query(query, [connectionId], (err, results)=>{
            console.log(connectionId);
            if(err){
                console.error("Error updating database: ", err);
                callback(false, err.message, null);
            }else{
                console.log("Results from database.js: ", results);
                callback(true, 'Request acceptance was successful.');
            }
        })
    }

 //  -------------------------------------------------------------------------

    deleteCurrentCoach(connectionId, callback){
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

    getPendingClientRequests(coachId, callback){
        const query = `SELECT * 
        FROM fitness.coach_client_connections AS ccc
        JOIN users ON users.user_id = ccc.client_id 
        JOIN survey ON survey.user_id = users.user_id
        JOIN goals ON goals.goal_id = survey.goal_id
        WHERE ccc.coach_id = ? AND ccc.status = 'pending';`;
        this.connection.query(query, [coachId], (err, results)=>{
            if(err){
                callback(err);
            }else{
                console.log(results);
                callback(null, results);
            }
        })
    }

//  -------------------------------------------------------------------------

    
      /*Glen's Code*/
      getAcceptedClients2(coachId, callback){
        const query = `SELECT * 
        FROM fitness.coach_client_connections AS ccc
        JOIN users ON users.user_id = ccc.client_id 
        JOIN survey ON survey.user_id = users.user_id
        JOIN goals ON goals.goal_id = survey.goal_id
        WHERE ccc.coach_id = ? AND ccc.status = 'accepted';`;
        this.connection.query(query, [coachId], (err, results)=>{
            if(err){
                callback(err);
            }else{
                console.log(results);
                callback(null, results);
            }
        })
    }

//  -------------------------------------------------------------------------

    declineClientRequest(connectionId, callback){
        const query = `UPDATE fitness.coach_client_connections
                        SET status = 'declined' 
                        WHERE coach_client_id = ?;`

        this.connection.query(query, [connectionId], (err, results)=>{
            console.log(connectionId);
            if(err){
                console.error("Error updating database: ", err);
                callback(false, err.message, null);
            }else{
                console.log("Results from database.js: ", results);
                callback(true, 'Request acceptance was successful.');
            }
        })
    }

//  -------------------------------------------------------------------------


    deleteClient(connectionId, callback){
        const query = `DELETE FROM fitness.coach_client_connections WHERE coach_client_id = (?);`

        this.connection.query(query, [connectionId.connectionId], (err, results)=>{
            if(err){
                console.error("Error deleting from database: ", err);
                callback(false, err.message, null);
            }else{
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
        
        const { workout_name, difficulty, goal_id} = data.editedItems;

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
                        
        this.connection.query(query, [workoutData.workout_name, workoutData.goal_id, workoutData.difficulty, workoutData.client_id, workoutData.muscle_id],  (err, results) => {
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


   
    getAllExercises(workoutId, callback){
        const query = `SELECT * FROM fitness.workout_exercises 
                        JOIN exercises on exercises.exercise_id = workout_exercises.exercise_id
                        WHERE workout_id = ${workoutId};`
        this.connection.query(query, (err,results,fields)=>{
            if(err){
                // callback(err);
            }else{
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


    changeExercise(workoutId, data, callback){
        const query = `UPDATE fitness.workout_exercises
                        SET exercise_id = ?
                        WHERE workout_id = ? and exercise_id = ?;`

        this.connection.query(query, [data.selectedId, workoutId, data.oldExerciseId], (err, results)=>{
            // console.log(connectionId);
            if(err){
                console.error("Error updating database: ", err);
                callback(false, err.message, null);
            }else{
                console.log("Results from database.js: ", results);
                callback(true, 'Request acceptance was successful.');
            }
        })
    }

// -----------------------------------–---------------------------------------

    
    deleteExercise(workoutId, data, callback){
        const query = `DELETE FROM fitness.workout_exercises WHERE workout_id = ? and exercise_id = ?;`

        this.connection.query(query, [workoutId, data.oldExerciseId], (err, results)=>{
            if(err){
                console.error("Error deleting from database: ", err);
                callback(false, err.message, null);
            }else{
                console.log("Results from database.js: ", results);
                callback(true, 'Delete was successful');
            }
        })
    }

// -----------------------------------–---------------------------------------


    addNewExercise(workoutId, data, callback) {
        const query = `INSERT INTO workout_exercises (workout_id, exercise_id) VALUES (?, ?);`;

        this.connection.query(query, [workoutId, data.selectedId],  (err, results) => {
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

   
    deleteOneWorkout(workoutId, callback){
        const query = `DELETE FROM user_workouts WHERE workout_id = ?;
                        DELETE FROM workout_exercises WHERE workout_id = ?;
                        DELETE FROM workout_muscle_groups WHERE workout_id = ?;
                        DELETE FROM workouts WHERE workout_id = ?;
        `

        this.connection.query(query, [workoutId, workoutId, workoutId, workoutId], (err, results)=>{
            if(err){
                console.error("Error deleting from database: ", err);
                callback(false, err.message, null);
            }else{
                console.log("Results from database.js: ", results);
                callback(true, 'Delete was successful');
            }
        })
    }

// -----------------------------------–---------------------------------------


    getMessages(coachId, callback){
        const query = `SELECT * FROM coach_client_message WHERE sender_id = ? OR receiver_id = ?`
        this.connection.query(query,[coachId, coachId], (err,results)=>{
            if(err){
                callback(err);
            }else{
                // console.log(results);
                callback(null, results)
            }
        })
    }

// -----------------------------------–---------------------------------------


    getAllChats(coachId, callback){
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
        this.connection.query(query,[coachId, coachId], (err,results)=>{
            if(err){
                callback(err);
            }else{
                // console.log(results);
                callback(null, results)
            }
        })
    }

// -----------------------------------–---------------------------------------


    getSideNames(chatId, coachId, callback){
        const query = `SELECT DISTINCT users.first_name, users.last_name, users.role
                        FROM users 
                        JOIN coach_client_message ON users.user_id = coach_client_message.receiver_id OR users.user_id = coach_client_message.sender_id
                        WHERE coach_client_message.coach_client_id = ?
                        AND users.user_id != ?;`
        this.connection.query(query,[chatId, coachId], (err,results)=>{
            if(err){
                callback(err);
            }else{
                // console.log(results);
                callback(null, results)
            }
        })
    }

// -----------------------------------–---------------------------------------


    getOneSpecificChat(chatId, callback){
        const query = `SELECT * FROM coach_client_message WHERE coach_client_id = ?;`
        this.connection.query(query,[chatId], (err,results)=>{
            if(err){
                callback(err);
            }else{
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

        this.connection.query(query, [values],  (err, results) => {
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

   

}

/*
UPDATE fitness.workout_muscle_groups 
SET muscle_id = ?
WHERE workout_id = ? and muscle_id = ?;






 sendWorkoutData(workoutData, callback) {

        const query = `INSERT INTO workouts (workout_name, goal_id, difficulty) VALUES (?, ?, ?)`;
        const last_id = `SET @last_workout_id = LAST_INSERT_ID();`

        this.connection.query(query, [workoutData.workout_name,workoutData.goal_id, workoutData.difficulty], (err1, results1) => {
            if (err1) {
                console.error("Error executing the first insert: ", err1);
                callback(false, err1.message, null);
            } else {
                console.log("Workout details updated: ", results1);
                // Second query for updating workout_muscle_groups
                const query2 = `INSERT INTO user_workouts (user_id, workout_id) VALUES (?, ?);`;
                
                this.connection.query(query2, [workoutData.client_id, last_id], (err2, results2) => {
                    if (err2) {
                        console.error("Error executing the second statement: ", err2);
                        callback(false, err2.message, null);
                    } else {
                        console.log("Muscle groups updated: ", results2);
                        const query3 = `START TRANSACTION; 
                                        SET @last_workout_id = LAST_INSERT_ID(); 
                                        INSERT INTO workout_muscle_groups (workout_id, muscle_id) VALUES (?, ?); 
                                        COMMIT;`;
                        
                        this.connection.query(query3, [last_id, workoutData.muscle_id], (err3, results3) => {
                            if (err2) {
                                console.error("Error executing the second statement: ", err3);
                                callback(false, err3.message, null);
                            } else {
                                console.log("Muscle groups updated: ", results3);
                            }
                        });
                    }
                });
            }
        });
    }
*/
