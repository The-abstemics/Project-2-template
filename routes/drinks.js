var express = require('express');
var router = express.Router();
const Drink = require("../models/Drink.models")

//-----CREATE-------//
router.route('/create-drink')
.get((req,res)=>{
    res.render('drinks/create-drink')
})
.post((req,res)=>{
    const {name,description,origin,alcohol,alcohol_content}=req.body;
    Drink.create({name,description,origin,alcohol,alcohol_content})
    .then(res.redirect('/drinks'))
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
    const {name,description,origin,alcohol,alcohol_content}=req.body;
    Drink.findByIdAndUpdate(id,{name,description,origin,alcohol,alcohol_content},{new:true})
    .then(()=>res.redirect('/drinks'))
})




module.exports = router;