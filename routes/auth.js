var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model")

const isNotLoggedIn = require("../middleware/isNotLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");

///////////////////////////// SIGNUP //////////////////////////////////

router.route("/signup")
.get(isNotLoggedIn, (req,res)=>{
    res.render("auth/signup")
})
.post((req, res)=> {
    const { username, sex, weight, height, age, password } = req.body;
    console.log({ username, sex, weight, height, age, password })

    if (!username || !password || !sex || !weight || !height || ! age ) {
        return res
          .status(400)
          .render("auth/signup", { errorMessage: "Please fill up all the details." });
      }
      
      if (age < 18) {
        return res
          .status(400)
          .render("auth/signup", { errorMessageAge: "You got to be at least 18 years old" })
      }
      
      if (password.length < 8) {
        return res.status(400).render("auth/signup", {
          errorMessage: "Your password needs to be at least 8 characters long.",
        });
      }
    User.findOne({ username }).then((found) => {
        // If the user is found, send the message username is taken
        if (found) {
          console.log("THIS!!!!!!!!", found, found.age)
          return res
            .status(400)
            .render("auth/signup", { errorMessageUser: "Username already taken." })    
        }
        // if user is not found, create a new user - start with hashing the password
        return bcrypt
          .genSalt(saltRounds)
          .then((salt) => bcrypt.hash(password, salt))
          .then((hashedPassword) => {
            // Create a user and save it in the database
            
            return User.create({
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
            req.session.userId = user._id;
            res.redirect("/profile");
          })})
})

///////////////////////////// LOGIN //////////////////////////////////

router.route('/login')
.get(isNotLoggedIn, (req,res)=>{
  res.render('auth/login')
})
.post(isNotLoggedIn, (req, res)=> {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Please provide your login details." });
  }

  User.findOne({ username })
  .then((user)=> {
    //console.log(user)
    if(!user){
      return res
        .status(400)
        .render("auth/login", { errorMessage: "Wrong credentials." });
    }
    bcrypt.compare(password, user.password)
    .then((isSamePassword)=> {
      if(!isSamePassword){
        return res
            .status(400)
            .render("auth/login", { errorMessage: "Wrong credentials." });
      }
      
      req.session.userId = user._id;
      })
      .then(()=> {
        console.log(user._id.toString())
        let date = new Date;
        const date1= date.getTime();
         User.findByIdAndUpdate(user._id.toString(),{startDrinking:date1 },{new:true})
         .then((updatedUser)=>{
           res.redirect("/profile")
        })
    })
  })
});

///////////////////////////// LOGOUT //////////////////////////////////

router.get("/logout", isLoggedIn, (req, res) => {
  User.findByIdAndUpdate(req.session.userId,{bac:0},{new:true})
  .then(()=>{req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");})
  
  });
});

module.exports = router;
