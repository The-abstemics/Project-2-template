var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model")
const Drink = require("../models/Drink.model")

const isNotLoggedIn = require("../middleware/isNotLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");

router.route("/")
.get(isLoggedIn, (req, res)=> {
  
    User.findById(req.session.userId)
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
    //console.log(req.body.quantity[3])
  let i=0;
  let total=0;
  
  Drink.find()
  .then((drinks) => drinks.forEach(drink => {
    const alcohol_content=drink.alcohol_content
    const quantity = req.body.quantity[i];
    total+=(alcohol_content*quantity)/100
    i++;
    console.log('total:::::::::::::',alcohol_content,total)}))
  })
module.exports = router;