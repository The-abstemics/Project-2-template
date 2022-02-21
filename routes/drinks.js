var express = require('express');
var router = express.Router();
const Drink = require("../models/Drink.model")
const User = require("../models/User.model")
const document = require("jsdom");
const { JSDOM } = document;

const isLoggedIn = require("../middleware/isLoggedIn");
const { Axios } = require('axios');

//-----CREATE-------//
router.route('/create-drink')
.get((req,res)=>{
    res.render('drinks/create-drink')
})
.post((req,res)=>{
    const {name,description,origin,alcohol_content}=req.body;
    Drink.create({name,description,origin,alcohol_content})
    .then(res.redirect('/'))
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
    const {name,description,origin,alcohol_content}=req.body;
    console.log({name,description,origin,alcohol_content})
    Drink.findByIdAndUpdate(id,{name,description,origin,alcohol_content},{new:true})
    .then(()=>res.redirect('/'))
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
    const dom = new JSDOM(res.body);
    //console.log(dom.window.document.querySelector('#likeImg'));
    
    Drink.findByIdAndUpdate(id,{$inc: {likes:1}} , {new: true})
        .then(()=>{
            Axios
                .get(`https://localhost:3000/drinks`)
                
        //dom.window.document.querySelector("#likeImg").classList.toggle("hidden")
        // dom.window.document.querySelector("#noLikeImg").classList.toggle("hidden")
        //res.redirect("/")
        //console.log("LIKES: ", drink)
        })
        .catch(() => `Something went wrong`)
})

//------DISPLAY-------//

router.get('/',(req, res)=>{
    // let loggedIn = false;
    // if(isLoggedIn){
    //     loggedIn = true;
    //     Drink.find()
    //     .then((drinks)=>{
    //         res.render('drinks/drinks', {drinks}, {isLoggedIn})
    //     }) 
    // }
    Drink.find()
    .then((drinks)=>{
        res.render('drinks/drinks', {drinks})
    })
    .catch((error)=>console.log('Something went wrong: ', error))
})

module.exports = router;