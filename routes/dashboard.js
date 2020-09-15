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


function checkLoginUSer(req,res,next){
  var userToken=localStorage.getItem('userToken');
try{
  if(req.session.userName){
    var decoded=jwt.verify(userToken,'loginToken');
  }else{
    res.redirect('/login');
  }
   
}catch(err){
  res.redirect('/login');
}
next();
}

/* GET home page. */




  
  
  router.get('/',checkLoginUSer,(req,res)=>{
    var loginUser=localStorage.getItem('loginUser')
    res.render('dashboard',{title:'password management system',loginUser:loginUser,msg:''});
  })
  
   
  
  function checkEmail(req,res,next){
    var email=req.body.email;
    var checkexistemail =userModule.findOne({email:email});
    checkexistemail.exec((err,data)=>{
     if(err) throw err;
     if(data){
      return res.render('signup',{title:'password management system',msg:'email already exist'})
     }
    })
    next();
  }
  
  function checkUsername(req,res,next){
    var username=req.body.uname;
    var checkexistemail =userModule.findOne({username:username});
    checkexistemail.exec((err,data)=>{
     if(err) throw err;
     if(data){
      return res.render('signup',{title:'password management system',msg:'this username already exist'})
     }
    })
    next();
  }



  module.exports = router;