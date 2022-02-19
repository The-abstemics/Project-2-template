var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model")

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

module.exports = router;