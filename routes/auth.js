var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model")


router.route("/signup")
.get((req,res)=>{
    res.render("auth/signup")
})
.post((req, res)=> {
    const { username, sex, weight, height, age, password } = req.body;

    if (!username || !username ) {
        return res
          .status(400)
          .render("auth/signup", { errorMessage: "Please fill up all the details." });
      }
    
      if (password.length < 8) {
        return res.status(400).render("auth/signup", {
          errorMessage: "Your password needs to be at least 8 characters long.",
        });
      }
    User.findOne({ username }).then((found) => {
        // If the user is found, send the message username is taken
        if (found) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: "Username already taken." });
        }
    
        // if user is not found, create a new user - start with hashing the password
        return bcrypt
          .genSalt(saltRounds)
          .then((salt) => bcrypt.hash(password, salt))
          .then((hashedPassword) => {
            // Create a user and save it in the database
            return User.create({
              username,
              username,
              sex, 
              weight, 
              height, 
              age,
              password: hashedPassword
            });
          })
          .then((user) => {
            // Bind the user to the session object
            req.session.user = user;
            res.redirect("/");
          })})
})

//LOGIN
router.route('/login')
.get((req,res)=>{
    res.render('auth/login')
})

module.exports = router;
