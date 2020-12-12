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
        return savedUser;
    })
    .catch((err) => { console.log("real", err.message); });
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
    .then((data) => { return isExisting; })
    .catch(error => { console.log(error) });
    return isExisting;
  }

  static async list() {
    let list;
    await UserMongo.find({}).then(users => {
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
    await UserMongo.find({}).then(result => {
      result.forEach(note => {
          if(note){
              if(note.email === email){
                  return isAlreadyUse = true;
              }
          }else{
              return isAlreadyUse = false;
          }
        });
    })
    .then((data) => { return isAlreadyUse; })
    .catch(error => { console.log(error) });
    return isAlreadyUse;
  }

  static async getUserByUsername(username){
    let userFound;
    await UserMongo.find({ username: username }).then(result => {
      result.forEach(user => {
        return userFound = user;
      });
    })
    .then((data) => { return userFound; })
    .catch(error => { console.log(error) });
    return userFound;
  }
  
}

module.exports = RealUser;
