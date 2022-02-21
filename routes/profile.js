var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model")
const Drink = require("../models/Drink.model")

const isNotLoggedIn = require("../middleware/isNotLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");

router.route("/")
.get((req, res)=> {
    
    console.log("HEEEY: ", req.session)
    User.findOne(req.session.user)
    .then((profile)=> {
        res.render("profile/user-profile", profile)
    })
    
  // res.render("profile/user-profile")
})

router.route("/add-drink")
  .get((req, res)=> {
    Drink.find()
    .then((drinks)=> {
      res.render("profile/add-drink", {drinks})
    })
  })
  .post((req, res)=> {

    res.redirect("/")
  })
module.exports = router;