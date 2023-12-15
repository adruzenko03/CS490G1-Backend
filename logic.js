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

  getPendingCoaches(callback) {
    this.dataMod.getPendingCoaches((error, coaches) => {
      if (error) {
        console.error("Error retrieving pending coaches", error);
        callback(false, { message: "Error retrieving pending coaches" });
      } else {
        callback(true, coaches);
      }
    });
  }

  updateCoachStatus(coach_id, actionType, callback) {
    if (actionType === 'accept') {
      this.dataMod.acceptCoach(coach_id, (error, result) => {
        if (error) {
          console.error('Error accepting coach:', error);
          callback(error, null);
        } else {
          callback(null, result);
        }
      });
    } else if (actionType === 'decline') {
      this.dataMod.declineCoach(coach_id, (error, result) => {
        if (error) {
          console.error('Error declining coach:', error);
          callback(error, null);
        } else {
          callback(null, result);
        }
      });
    } else {
      callback('Invalid  action', null);
    }
  }

  getExerciseList(callback) {
    this.dataMod.getExerciseList((error, exercises) => {
      if (error) {
        console.error("Error retrieving exercise list", error);
        callback(false, { message: "Error retrieving exercise list" });
      } else {
        callback(true, exercises);
      }
    });
  }

  addExercise(exercise_name, steps, equipmentList, callback) {
    this.dataMod.addExercise(exercise_name, steps, equipmentList, (error, result) => {
      if (error) {
        console.error('Error adding exercise:', error);
      } else {
        callback(true, result);
      }
    });
  }

  updateExerciseStatus(exercise_id, actionType, callback) {
    if (actionType === 'activate') {
      this.dataMod.activateExercise(exercise_id, (error, result) => {
        if (error) {
          console.error('Error activating exercise:', error);
          callback(error, null);
        } else {
          callback(null, result);
        }
      });
    } else if (actionType === 'deactivate') {
      this.dataMod.deactivateExercise(exercise_id, (error, result) => {
        if (error) {
          console.error('Error deactivating exercise:', error);
          callback(error, null);
        } else {
          callback(null, result);
        }
      });
    } else {
      callback('Invalid  action', null);
    }
  }
}