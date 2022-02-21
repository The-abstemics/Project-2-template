var express = require('express');
var router = express.Router();
const Drink = require("../models/Drink.model")
const User = require("../models/User.model")

const isLoggedIn = require("../middleware/isLoggedIn");
const { Axios } = require('axios');

//-----CREATE-------//
router.route('/create-drink')
.get((req,res)=>{
    res.render('drinks/create-drink')
})
.post((req,res)=>{
    const {name,description,origin,alcohol_content,image}=req.body;
    const owner = req.session.userId;
    console.log(owner)
    Drink.create({name,description,origin,alcohol_content,image,owner:owner})
    .then(res.redirect('/drinks'))
    .catch((error)=>console.log('The create drink didnt work becasue: ',error))
})


//------EDIT-------//

router.route('/:id/edit-drink')
.get((req,res)=>{
    const id = req.params.id;
    Drink.findById(id)
    .then((drink)=>res.render('drinks/edit-drink',drink))
})
.post((req,res)=>{
    const id = req.params.id;
    const {name,description,origin,alcohol_content,image}=req.body;
    console.log({name,description,origin,alcohol_content})
    Drink.findByIdAndUpdate(id,{name,description,origin,alcohol_content,image},{new:true})
    .then(()=>res.redirect('/drinks'))
    .catch((error)=>console.log('The edit drink didnt work becasue: ',error))
})


//------DELETE-------//

router
  .post('/:id/delete', (req, res, next) => {
      const id = req.params.id;
      Drink.findByIdAndDelete(id)
        .then(() => res.redirect("/"))
        .catch(() => `Error while deleting this drink`)
});

//------LIKES-------//

router
.post('/:id/like', (req, res, next) =>{
    const id = req.params.id;
    Drink.findByIdAndUpdate(id,{$inc: {likes:1}} , {new: true})
        .then(()=>{
            res.redirect('/')
        })
        .catch(() => res.code(401).send(`Something went wrong`))
})

//------DISPLAY-------//

router.get('/',(req, res)=>{
    Drink.find()
    .then((drinks)=>{
        res.render('drinks/drinks', {drinks})
    })
    .catch((error)=>console.log('Something went wrong: ', error))
})

module.exports = router;