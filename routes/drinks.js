var express = require('express');
var router = express.Router();
const Drink = require("../models/Drink.models")

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




module.exports = router;