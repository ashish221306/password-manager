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


  router.get('/',checkLoginUSer,(req,res,next)=>{
    var loginUser=localStorage.getItem('loginUser');
    var getPassCat=passcatModel.find({_userID:req.session.userName})
    getPassCat.exec((err,data)=>{
      if(err) throw err;
      res.render('add-new-password',{title:'password Management System',loginUser:loginUser,success:'',records:data})
    })
  })
  
  router.post('/',checkLoginUSer,(req,res,next)=>{
    var loginUser=localStorage.getItem('loginUser');
    var pass_cat=req.body.password_category;
    var pass_details=req.body.pass_details;
    var project_name=req.body.project_name;
    
  
    var password_details=new passModel({
      password_category:pass_cat,
      password_detail:pass_details,
      project_name:project_name,
      _userID:req.session.userName
    })
  
  password_details.save((err,doc)=>{
    var getPassCat=passcatModel.find({_userID:req.session.userName})
    getPassCat.exec((err,data)=>{
      if(err) throw err;
  
      res.render('add-new-password',{title:'password Management System',loginUser:loginUser,success:'Password details inserted successfully',records:data})
    })
  })
  })

  



  module.exports = router;