var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

const User = require("../models/User.model");
const Drink = require("../models/Drink.model");

const isNotLoggedIn = require("../middleware/isNotLoggedIn");
const isLoggedIn = require("../middleware/isLoggedIn");
const session = require("express-session");


router.route("/")
.get(isLoggedIn, (req, res) => {
  User.findById(req.session.userId)
  .then((profile) => {
    console.log("THIIIIIIIIS", profile.image[0])
    res.render("profile/user-profile", profile);
  });
});

router.get("/delete-profile", isLoggedIn, (req, res) => {
  User.findByIdAndDelete(req.session.userId)
  .then(res.redirect("/"))
  .catch((err)  => `Something went wrong when deleting the profile: ${err}`);
  }
);

///-----EDIT PROFILE-----//

router.route("/:id/edit-profile")
.get(isLoggedIn, (req, res) => {
  User.findById(req.session.userId)
  .then((user) => {
    res.render("profile/edit-profile", user)
  })
})
.post((req, res) => {
  const { age, weight, height, sex } = req.body;
  const id = req.session.userId;

  User.findByIdAndUpdate(id,  { age, weight, height, sex }, {new: true})
  .then(res.redirect("/profile"))
});

//------ADD-DRINK------//

router.route("/add-drink")
  .get((req, res) => {
    Drink.find().then((drinks) => {
      res.render("profile/add-drink", { drinks });
    });
  })
  .post((req, res) => {

    let total = 0;
    Drink.find().then((drinks) => {
      drinks.forEach((drink, idx) => {
        const alcohol_content = drink.alcohol_content;
        const volumen = drink.size;
        const quantity = req.body.quantity[idx];
        const alcoholDensity = 0.8;

        total += ((alcohol_content / 100) * (quantity * volumen) * alcoholDensity)
      });
      const id = req.session.userId;

      User.findById(id).then((user) => {
        const weight = user.weight;
        const gender = user.sex;
        let r = 0;
        let bac = 0;
        console.log(req.session.cookie._expires.toString())
        console.log('stringaaaa:',(req.session.cookie._expires.toString()).slice(11,18))
        gender === "male" ? (r = 0.55) : (r = 0.68);
        bac = Number((Number(total.toFixed(2))/(weight*r)).toFixed(2))+user.bac;
        
          if(bac<0.5){
           
            User.findByIdAndUpdate(id, { $set: { bac: bac , image: "/images/start.jpg"} }, { new: true }).then(() => res.redirect("/profile"))
            
          } else if (bac>0.5 && bac<0.8){
            User.findByIdAndUpdate(id, { $set: { bac: bac , image: "/images/drink.jpg"} }, { new: true }).then(() => res.redirect("/profile"))
            
          } else {
            User.findByIdAndUpdate(id, { $set: { bac: bac , image: "/images/wasted.jpg"} }, { new: true }).then(() => res.redirect("/profile"))
            
          }
          console.log("BAAAAC e IMAGEEEEN", bac, user.image)
        
        //User.findByIdAndUpdate(id, { $set: { bac: bac , image} }, { new: true }).then(() => res.redirect("/profile"))
      });
    });
  });

  //-----RESET-COUNTER-----//
  router.route('/reset-counter')
  .post((req,res)=>{
    User.findByIdAndUpdate(req.session.userId,{bac:0, image: "/images/start.jpg"},{new:true})
    .then((user)=>res.render('profile/user-profile',user))
  })



//-------Search------


router.get("/add-drink/search", (req, res) => {
  const drinkName = req.query.drinkName;
  console.log("DRINKNAME!!!!!", drinkName)
  if (!drinkName) {
      res.render("profile/add-drink", 
      {errorMessage: "You need to type something droogie"})
      
  } else {
    Drink.find({ name: {$regex: `^.*${drinkName}.*$`} })
      .then((drinks) => {
          res.render("profile/add-drink", {drinks})
          })
  }

});


module.exports = router;
