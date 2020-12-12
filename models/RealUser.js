"strict mode";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require('mongoose');
const UserMongo = require('./UsersMongo.js');

class RealUser {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.isAdmin = false;
  }

  /* return a promise with async / await */ 
  async save() {
    let hashedPassword = await bcrypt.hash(this.password, saltRounds);
    let user = new UserMongo({ username: this.username, email: this.email, password: hashedPassword, isAdmin: this.isAdmin });

    await user.save().then(savedUser => {
        //console.log("enregistrer");
        return savedUser;
    })
    .catch((err) => {
      console.log("real", err.message);
    });
  }

  /* return a promise with classic promise syntax*/
  async checkCredentials(email, password) {
    if (!email || !password) return false;
    let isExisting = false;
    await UserMongo.find({ email: email }).then(result => {
      result.forEach(user => {
        this.isAdmin = user.isAdmin;
        return isExisting = bcrypt.compare(password, user.password).then((match) => match).catch((err) => err);
      });
    })
    .then((data) => {

      return isExisting;
    })
    .catch(error => {
        console.log(error)
    });
    return isExisting;
  }

  static async list() {
    /*let userList = getUserListFromFile(FILE_PATH);
    return userList;*/
    let list;
    await UserMongo.find({}).then(users => {
      //console.log(users);
      return list = users;
    })
    .catch(error => {
      console.log(error)
      return status(500).send(err.message);
    });
    return list;
  }

  static async isUser(email){
    let isAlreadyUse = false;
    isAlreadyUse = await RealUser.isUserCheck(email, isAlreadyUse);
    console.log("Before",isAlreadyUse);
    return isAlreadyUse;
  }

  static async isUserCheck(email, isAlreadyUse) {
    let response = await UserMongo.find({}).then(result => {
      result.forEach(note => {
          if(note){
              //console.log("note",note, "note.email", note.email);
              if(note.email === email){
                  //console.log("email", email);
                  return isAlreadyUse = true;
              }
          }else{
              //console.log("1");
              return isAlreadyUse = false;
          }
        });
    })
    .then((data) => {
      //console.log("data/email/res :", data, email, isAlreadyUse);
      return isAlreadyUse;
    })
    .catch(error => {
        //console.log("3");
        console.log(error)
    });
    //console.log("Dernier return", isAlreadyUse, response)
    return isAlreadyUse;
  }

  static async getUserByUsername(username){
    let userFound;
    await UserMongo.find({ username: username }).then(result => {
      result.forEach(user => {
        return userFound = user;
      });
    })
    .then((data) => {
      return userFound;
    })
    .catch(error => {
        console.log(error)
    });
    return userFound;
  }

  /*static getUserFromList(username) {
    const userList = getUserListFromFile(FILE_PATH);
    for (let index = 0; index < userList.length; index++) {
      if (userList[index].username === username) return userList[index];
    }
    return;
  }

  static isAdmin(username){
    const userFound = User.getUserFromList(username);
    return userFound.isAdmin == true;
  }*/
  
}

/*function getUserListFromFile(filePath) {
  const fs = require("fs");
  if (!fs.existsSync(filePath)) return [];
  let userListRawData = fs.readFileSync(filePath);
  let userList;
  if (userListRawData) userList = JSON.parse(userListRawData);
  else userList = [];
  return userList;
}

function saveUserListToFile(filePath, userList) {
  const fs = require("fs");
  let data = JSON.stringify(userList);
  fs.writeFileSync(filePath, data);
}*/

module.exports = RealUser;
