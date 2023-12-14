import DatabaseService from "./database.js";

export default class LogicService {
  constructor() {
    this.dataMod = new DatabaseService();
  }

  login(username, password, callback) {
    this.dataMod.login(username, password, (res) => {
      if (res.length == 0)
        callback(false, { message: "Incorrect username or password" });
      else {
        this.dataMod.getUserInfo(res.user_id, (userInfo) => {
          if (userInfo) {
            callback(true, { user: { ...res, ...userInfo } });
          } else {
            callback(false, { message: "User information not found" });
          }
        });
      }
    });
  }
  signup(info, callback) {
    this.dataMod.checkUser(info.email, (err, res) => {
      if (err) {
        console.log(err);
        callback(false);
      } else if (res.length == 0) {
        this.dataMod.signupUserAuth(info.email, info.password, (err, ress) => {
          if (err) {
            console.log(err);
            callback(false);
          } else {
            let userID = ress[1][0].userID;
            this.dataMod.signupUser(info, userID, (err) => {
              if (err) {
                console.log(err);
                this.dataMod.deleteUser(userID, () => {
                  callback(false);
                });
              } else {
                if (info.role == "coach") {
                  this.dataMod.signupCoach(info, userID, (err) => {
                    if (err) {
                      console.log(err);
                      this.dataMod.deleteUser(userID, () => {
                        callback(false);
                      });
                    } else {
                      callback(true, { userID: userID, role: info.role });
                    }
                  });
                } else {
                  callback(true, { userID: userID, role: info.role });
                }
              }
            });
          }
        });
      } else callback(false);
    });
  }

  getGoals(callback) {
    this.dataMod.getGoals((res) => {
      callback(res);
    });
  }

  getExercises(callback) {
    this.dataMod.getExercises((error, exercises) => {
      if (error) {
        console.error("Error retrieving exercises:", error);
        callback(false, { message: "Error retrieving exercises" });
      } else {
        callback(true, exercises);
      }
    });
  }

  getWorkouts(callback) {
    this.dataMod.getWorkouts((error, exercises) => {
      if (error) {
        console.error("Error retrieving Workouts", error);
        callback(false, { message: "Error retrieving Workouts" });
      } else {
        callback(true, exercises);
      }
    });
  }

  getUserWorkouts(callback) {
    this.dataMod.getUserWorkouts((error, exercises) => {
      if (error) {
        console.error("Error retrieving Workouts", error);
        callback(false, { message: "Error retrieving Workouts" });
      } else {
        callback(true, exercises);
      }
    });
  }

  deleteUserWorkout(userId, workoutId, callback) {
    this.dataMod.deleteUserWorkout(
      userId,
      workoutId,
      (success, message, insertId) => {
        if (success) {
          callback(true, message, insertId);
        } else {
          callback(false, { message: "Error inserting user workout" });
        }
      }
    );
  }

  insertUserWorkout(userId, workoutId, callback) {
    this.dataMod.insertUserWorkout(
      userId,
      workoutId,
      (success, message, insertId) => {
        if (success) {
          callback(true, message, insertId);
        } else {
          callback(false, { message: "Error inserting user workout" });
        }
      }
    );
  }

  getActivity(callback) {
    this.dataMod.getActivity((error, Activities) => {
      if (error) {
        console.error("Error retrieving Activities", error);
        callback(false, { message: "Error retrieving Activities" });
      } else {
        callback(true, Activities);
      }
    });
  }

  insertUserDailyActivity(
    userId,
    entryDate,
    calorieIntake,
    bodyWeight,
    callback
  ) {
    this.dataMod.insertUserDailyActivity(
      userId,
      entryDate,
      calorieIntake,
      bodyWeight,
      (success, message, insertId) => {
        if (success) {
          callback(true, message, insertId);
        } else {
          callback(false, { message: "Error inserting user daily activity" });
        }
      }
    );
  }
}