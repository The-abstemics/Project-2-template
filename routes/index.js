var express = require('express');
var router = express.Router();

const User = require("../models/User.model")

const isLoggedIn = require("../middleware/isLoggedIn")

/* GET home page. */
router.get('/', (req, res)=> {
  let loggedIn = false;
  if(isLoggedIn){
      loggedIn = true;
      res.render("index", {loggedIn});
      }
  
  res.render("index")
});


module.exports = router;
