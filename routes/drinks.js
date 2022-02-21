var express = require('express');
var router = express.Router();
const Drink = require("../models/Drink.model")
const User = require("../models/User.model")
const fileUploader= require("../config/cloudinary.config")

const isLoggedIn = require("../middleware/isLoggedIn");

//-----CREATE-------//
router.route('/create-drink')
.get((req,res)=>{
    res.render('drinks/create-drink')
})
.post(fileUploader.single("image"), (req,res)=>{
    const {name,description,origin,alcohol_content}=req.body;
    const owner = req.session.userId;
    if (req.file.path){
    const image = req.file.path
    } else {
    image = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Birra_Moretti_Logo_2015.jpeg/640px-Birra_Moretti_Logo_2015.jpeg'
    }
    Drink.create({name,description,origin,alcohol_content,image,owner:owner})
    .then(res.redirect('/drinks'))
    .catch((error)=>console.log('The create drink didnt work becasue: ',error))
})


//------EDIT-------//

router.route('/:id/edit-drink')
.get(isOwner, (req,res)=>{
    const id = req.params.id;
    Drink.findById(id)
    .then((drink)=>{
        res.render('drinks/edit-drink', drink)
        });
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
    .populate("owner")
    .then((drinks)=>{
         let drinkOwner = false;
        drinks.forEach((drink)=> {
           
            
            if(req.session.userId && drink.owner._id == req.session.userId){
                drinkOwner = true;
            }
        }
        
    )
    res.render('drinks/drinks', {drinks, drinkOwner})
        //res.render('drinks/drinks', {drinks})
    })
    .catch((error)=>console.log('Something went wrong: ', error))
})

module.exports = router;