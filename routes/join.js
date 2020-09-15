var express = require('express');
var router = express.Router();
var bcrypt=require('bcryptjs');
var userModule=require('../modules/user');
var passcatModel=require('../modules/password_category');
var passModel=require('../modules/add_password');
var jwt=require('jsonwebtoken');
const {check,validationResult}=require('express-validator');
const { token } = require('morgan');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


var getPassCat=passcatModel.find()
var getAllPass=passModel.find()

router.get('/',(req,res,next)=>{
    passModel.aggregate([
        {
            $lookup:{
                from:'password_category',
                localField:'password_category',
                foreignField:'password_category',
                as:'pass_cat_details'
            }
        },
        {
            $unwind:"$pass_cat_details"
        }
    ]).exec((err,result)=>{
        if(err) throw err;
        console.log(result);
        res.send(result);
    })
})

  module.exports = router;