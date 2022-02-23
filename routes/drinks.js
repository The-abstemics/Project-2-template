var express = require('express');
var router = express.Router();
const Drink = require("../models/Drink.model")
const User = require("../models/User.model")

const fileUploader= require("../config/cloudinary.config")


const isLoggedIn = require("../middleware/isLoggedIn");
const { Axios } = require('axios');

//-----CREATE-------//
router.route('/create-drink')
.get((req,res)=>{
    res.render('drinks/create-drink')
})
.post(fileUploader.single("image"), (req,res)=>{
    const {name,description,origin,alcohol_content}=req.body;
    const owner = req.session.userId;
    let name1=name.toLowerCase();
    let image = ''
    if (req.file){
        console.log(req.file)
    image = req.file.path
    } else {
    image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Birra_Moretti_Logo_2015.jpeg/640px-Birra_Moretti_Logo_2015.jpeg'
    }
    Drink.create({name:name1,description,origin,alcohol_content,image,owner})
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
.post(fileUploader.single("image"),(req,res)=>{
    const id = req.params.id;
    const {name,description,origin,alcohol_content}=req.body;
    const image = req.file && req.file.path
    Drink.findByIdAndUpdate(id,{name,description,origin,alcohol_content,image},{new:true})
    .then(()=>res.redirect('/drinks'))
    .catch((error)=>console.log('The edit drink didnt work becasue: ',error))
})




//------DELETE-------//

router
  .post('/:id/delete', (req, res, next) => {
      const id = req.params.id;
      Drink.findByIdAndDelete(id)
        .then(() => res.redirect("/drinks"))
        .catch(() => `Error while deleting this drink`)
});

//------LIKES-------//

router
.post('/:id/like', (req, res, next) =>{
    const id = req.params.id;
    Drink.findByIdAndUpdate(id,{$inc: {likes:1}} , {new: true})
        .then((newBeer)=>{
            console.log(">>>>>>>>>>>>>>", newBeer.likes)
            res.send(newBeer.likes.toString())
        })
        .catch(() => res.status(401).send(`Something went wrong`))
})

//------DISLIKES-------//

router
.post('/:id/dislike', (req, res, next) =>{
    const id = req.params.id;
    Drink.findByIdAndUpdate(id,{$inc: {likes:-1}} , {new: true})
        .then((newBeer)=>{
            res.send(newBeer.likes.toString());
        })
        .catch(() => res.status(401).send(`Something went wrong`))
})

//------DISPLAY-------//

router.get('/',(req, res)=>{
    Drink.find()
    .populate("owner")
    .then((drinks)=>{
        console.log(drinks)
        drinks.forEach((drink) => {
           // console.log(drink)
            if (req.session && req.session.userId == drink.owner._id){
                drink.isOwner = true;
            }
        })
        res.render('drinks/drinks', {drinks})
    })
    .catch((error)=>console.log('Something went wrong: ', error))
})

module.exports = router;