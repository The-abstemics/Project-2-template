var express = require('express');
var router = express.Router();

const User = require("../models/User.model")

router.route("/signup")
.get((req,res)=>{
    res.render("auth/signup")
})

module.exports = router;
