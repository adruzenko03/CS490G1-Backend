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

    getGoals(callback){
        this.dataMod.getGoals((res)=>{
            callback(res)
        })
    }
    removeClient(userId, callback) {
        this.dataMod.removeClient(userId, (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    acceptClient(userId, callback) {
        this.dataMod.acceptClient(userId, (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    declineClient(userId, callback) {
        this.dataMod.declineClient(userId, (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }
    
    getClientRequests(userId, callback){
        this.dataMod.getRequestedClients(userId, (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
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

  getUserWorkouts(userId, callback) {
    this.dataMod.getUserWorkouts(userId, (error, exercises) => {
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

  getActivity(userId,callback) {
    this.dataMod.getActivity(userId, (error, Activities) => {
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

  getGoalsList(callback){
    this.dataMod.getGoalsList((error, surveyData)=>{
      if(error){
        console.log("Error retrieving goals list: ", error);
        callback(false, {message:"Error retrieving goals list"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  getExperienceList(callback){
    this.dataMod.getExperienceList((error, surveyData)=>{
      if(error){
        console.log("Error retrieving experience list: ", error);
        callback(false, {message:"Error retrieving experience list"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  getLocationList(callback){
    this.dataMod.getLocationList((error, surveyData)=>{
      if(error){
        console.log("Error retrieving location list: ", error);
        callback(false, {message:"Error retrieving location list"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  getPriceList(callback){
    this.dataMod.getPriceList((error, surveyData)=>{
      if(error){
        console.log("Error retrieving price list: ", error);
        callback(false, {message:"Error retrieving price list"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  getCoachList(callback){
    this.dataMod.getCoachList((error, surveyData)=>{
      if(error){
        console.log("Error retrieving coach list: ", error);
        callback(false, {message:"Error retrieving coach list"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  getUserWorkouts(clientId, callback){
    this.dataMod.getUserWorkouts(clientId, (error, surveyData)=>{
      if(error){
        console.log("Error retrieving coach list: ", error);
        callback(false, {message:"Error retrieving coach list"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  getAcceptedCoach(clientId, callback){
    this.dataMod.getAcceptedCoach(clientId, (error, surveyData)=>{
      if(error){
        console.log("Error retrieving accepted coach : ", error);
        callback(false, {message:"Error retrieving coach list"});
      }else{
        callback(true, surveyData)
      }
    })
  }


  getClientInfo(clientId, callback){
    this.dataMod.getClientInfo(clientId, (error, surveyData)=>{
      if(error){
        console.log("Error retrieving client info : ", error);
        callback(false, {message:"Error retrieving coach list"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  getPendingCoach(clientId, callback){
    this.dataMod.getPendingCoach(clientId, (error, surveyData)=>{
      if(error){
        console.log("Error retrieving pending coaches : ", error);
        callback(false, {message:"Error retrieving pending coach list"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  getClientWorkouts(clientId, callback){
    this.dataMod.getClientWorkouts(clientId, (error, surveyData)=>{
      if(error){
        console.log("Error retrieving client workouts : ", error);
        callback(false, {message:"Error retrieving client workout list"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  requestCoach(clientId, items, callback){
    this.dataMod.requestCoach(clientId, items, (error, surveyData)=>{
      if(error){
        console.log("Error sending request to coach : ", error);
        callback(false, {message:"Error sending request to coach"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  getExerciseCount(workoutId, callback){
    this.dataMod.getExerciseCount(workoutId, (error, surveyData)=>{
      if(error){
        console.log("Error retrieving exercise count : ", error);
        callback(false, {message:"Error retrieving exercise count "});
      }else{
        callback(true, surveyData)
      }
    })
  }

  deleteCoachRequest(requestId, callback){
    this.dataMod.deleteCoachRequest(requestId, (success, message)=>{
      if(success){
        callback(true, message);
      }else{
        callback(false, {message: "Error deleting request"});
      }
    })
  }

  acceptClientRequest(connectionId, callback){
    this.dataMod.acceptClientRequest(connectionId, (error, surveyData)=>{
      if(error){
        console.log("Error sending request to coach : ", error);
        callback(false, {message:"Error sending request to coach"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  getPendingClientRequests(coachId, callback){
    this.dataMod.getPendingClientRequests(coachId, (error, surveyData)=>{
      if(error){
        console.log("Error retrieving pending client requests : ", error);
        callback(false, {message:"Error retrieving pending client requests "});
      }else{
        callback(true, surveyData)
      }
    })
  }

  getAcceptedClients2(coachId, callback){
    this.dataMod.getAcceptedClients2(coachId, (error, surveyData)=>{
      if(error){
        console.log("Error retrieving accepted client list : ", error);
        callback(false, {message:"Error retrieving accepted client list "});
      }else{
        callback(true, surveyData)
      }
    })
  }

  declineClientRequest(connectionId, callback){
    this.dataMod.declineClientRequest(connectionId, (error, surveyData)=>{
      if(error){
        console.log("Error sending request to coach : ", error);
        callback(false, {message:"Error sending request to coach"});
      }else{
        callback(true, surveyData)
      }
    })
  }
  
  deleteClient(connectionId, callback){
    this.dataMod.deleteClient(connectionId, (success, message)=>{
      if(success){
        callback(true, message);
      }else{
        callback(false, {message: "Error deleting user workout"});
      }
    })
  }

  sendWorkoutData(workoutId, data, callback){
    this.dataMod.sendWorkoutData(workoutId, data, (error, surveyData)=>{
      if(error){
        console.log("Error sending workout data: ", error);
        callback(false, {message:"Error sending workout data"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  sendNewWorkoutData(workoutData, callback){
    this.dataMod.sendNewWorkoutData(workoutData, (error, surveyData)=>{
      if(error){
        console.log("Error sending workout data: ", error);
        callback(false, {message:"Error sending workout data"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  getAllExercises(workoutId, callback){
    this.dataMod.getAllExercises(workoutId, (error, surveyData)=>{
      if(error){
        console.log("Error retrieving exercises for workout : ", error);
        callback(false, {message:"Error retrieving exercises for workout "});
      }else{
        callback(true, surveyData)
      }
    })
  }
  


  getExercisesList(callback) {
    this.dataMod.getExercisesList((error, surveyData) => {
      if (error) {
        console.error("Error retrieving exercises:", error);
        callback(false, { message: "Error retrieving exercises" });
      } else {
        callback(true, surveyData);
      }
    });
  }


  udpateExercise(workoutId, data, callback){
    this.dataMod.updateExercise(workoutId, data, (error, surveyData)=>{
      if(error){
        console.log("Error sending updating exercise: ", error);
        callback(false, {message:"Error sending updating exercise"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  deleteExercise(workoutId, data, callback){
    this.dataMod.deleteExercise(workoutId, data, (success, message)=>{
      if(success){
        callback(true, message);
      }else{
        callback(false, {message: "Error deleting exercise"});
      }
    })
  }

  addNewExercise(workoutId, data, callback){
    this.dataMod.addNewExercise(workoutId, data, (error, surveyData)=>{
      if(error){
        console.log("Error adding execise: ", error);
        callback(false, {message:"Error adding execise"});
      }else{
        callback(true, surveyData)
      }
    })
  }

  deleteOneWorkout(workoutId, callback){
    this.dataMod.deleteOneWorkout(workoutId, (success, message)=>{
      if(success){
        callback(true, message);
      }else{
        callback(false, {message: "Error deleting exercise"});
      }
    })
  }

  getMessages(coachId, callback){
    this.dataMod.getMessages(coachId, (error, surveyData)=>{
      if(error){
        console.log("Error retrieving messages for chat : ", error);
        callback(false, {message:"Error retrieving messages for chat "});
      }else{
        callback(true, surveyData);
      }
    })
  }
  
  getAllChats(coachId, callback){
    this.dataMod.getAllChats(coachId, (error, surveyData)=>{
      if(error){
        console.log("Error retrieving chats for user : ", error);
        callback(false, {message:"Error retrieving chats for user "});
      }else{
        callback(true, surveyData);
      }
    })
  }

  getSideNames(chatId, coachId, callback){
    this.dataMod.getSideNames(chatId, coachId, (error, surveyData)=>{
      if(error){
        console.log("Error retrieving chats for user : ", error);
        callback(false, {message:"Error retrieving chats for user "});
      }else{
        callback(true, surveyData);
      }
    })
  }

  getOneSpecificChat(chatId, callback){
    this.dataMod.getOneSpecificChat(chatId, (error, surveyData)=>{
      if(error){
        console.log("Error retrieving one specific chat : ", error);
        callback(false, {message:"Error retrieving one specific chat "});
      }else{
        callback(true, surveyData);
      }
    })
  }

  sendNewMessage(data, callback){
    this.dataMod.sendNewMessage(data, (error, surveyData)=>{
      if(error){
        console.log("Error sending chat data: ", error);
        callback(false, {message:"Error sending chat data"});
      }else{
        callback(true, surveyData)
      }
    })
  }


}