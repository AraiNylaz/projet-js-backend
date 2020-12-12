var express = require("express");
var router = express.Router();
let { authorize } = require("../utils/auth");
const jwt = require("jsonwebtoken");
const jwtSecret = "jkjJ1235Ohno!";
const LIFETIME_JWT = 24 * 60 * 60 * 1000 ; // 10;// in seconds // 24 * 60 * 60 * 1000 = 24h
var User = require("../models/User.js");

/* GET user list : secure the route with JWT authorization */
router.get("/", authorize, function (req, res, next) {
  User.list().then((data) => {
    console.log("POST users/login:", data);
    return res.json(data);
  }).catch((err) => { console.log(err); });
});

/* POST user data for authentication */
router.post("/login", function (req, res, next) {
  User.list().then((data) => {
    console.log("POST users/login:", data);
    let newUser = new User(req.body.email, req.body.email, req.body.password);
    newUser.checkCredentials(req.body.email, req.body.password).then((match) => {
      console.log("match", match);
      if(match){
        console.log("New User :", newUser);
        jwt.sign({ username: newUser.email, isAdmin: newUser.isAdmin}, jwtSecret,{ expiresIn: LIFETIME_JWT }, (err, token) => {
          if (err) {
            console.error("POST users/ :", err);
            return res.status(500).send(err.message);
          }
          return res.json({ username: newUser.username, isAdmin: newUser.isAdmin, token });
        });
      }else{
        console.log("POST users/login Error:", "Unauthentified");
        return res.status(401).send("bad email/password");
      }
    }).catch((err) => { console.log(err); });
  }).catch((err) => { console.log(err); });
});

/* POST a new user *//* Register */
router.post("/", (req, res, next) => {
  User.isUser(req.body.email).then((data) => {
    if(data) return res.status(409).send();
    console.log("as continué After",data);
    let newUser = new User(req.body.email, req.body.email, req.body.password);
    newUser.save().then((data) => {
      console.log("creation jwt :", data);
      jwt.sign({ username: newUser.email, isAdmin: newUser.isAdmin}, jwtSecret,{ expiresIn: LIFETIME_JWT }, (err, token) => {
        if (err) {
          console.error("POST users/ :", err);
          return res.status(500).send(err.message);
        }
        return res.json({ username: newUser.username, isAdmin: newUser.isAdmin, token });
      });
    })
    .catch((err) => {
      console.log(err);
    });
  });
});

/* GET user object from username */
router.get("/:username", function (req, res, next) {
  console.log("GET users/:username", req.params.username);
  User.getUserByUsername(req.params.username).then((userFound) => {
    console.log(userFound);
    if(userFound){
      return res.json(userFound);
    } else {
      return res.status(404).send("ressource not found");
    }
  }).catch((err) => { console.log(err); });
});

module.exports = router;
