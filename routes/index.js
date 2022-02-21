var express = require('express');
var router = express.Router();

const User = require("../models/User.model")

const isLoggedIn = require("../middleware/isLoggedIn")

/* GET home page. */
router.get('/', (req, res)=> {
  res.render("index");
});


module.exports = router;
