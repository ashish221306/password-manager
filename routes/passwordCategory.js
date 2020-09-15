var express = require('express');
var router = express.Router();
var bcrypt=require('bcryptjs');
var userModule=require('../modules/user');
var passcatModel=require('../modules/password_category');
var passModel=require('../modules/add_password');
var jwt=require('jsonwebtoken');
const {check,validationResult}=require('express-validator');
const { token } = require('morgan');
const { isValidObjectId } = require('mongoose');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var getPassCat=passcatModel.find()
var getAllPass=passModel.find()


var userid=localStorage.getItem('userName');

function checkLoginUSer(req,res,next){
  var userToken=localStorage.getItem('userToken');
try{
  console.log(req.session.userName)
  if(req.session.userName){
    var decoded=jwt.verify(userToken,'loginToken');
  }else{
    res.redirect('/');
  }
   
}catch(err){
  res.redirect('/');
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
    var getPassCatt=passcatModel.find({_userID:req.session.userName})
    getPassCatt.exec((err,data)=>{
      if(err) throw err;
      res.render('password_category',{title:'password Management System',loginUser:loginUser,records:data})
    })
    
  })
  //password category delete
  router.get('/delete/:id',checkLoginUSer,(req,res,next)=>{
    var loginUser=localStorage.getItem('loginUser')
    var passcat_id=req.params.id;
    var passdelete=passcatModel.findByIdAndDelete(passcat_id);
    passdelete.exec((err)=>{
      if(err) throw err;
      res.redirect('/passwordCategory')
    })
  })
  //password category update
  router.get('/edit/:id',checkLoginUSer,(req,res,next)=>{
    var loginUser=localStorage.getItem('loginUser')
    var passcat_id=req.params.id;
    var getpassCategory=passcatModel.findById(passcat_id);
    getpassCategory.exec((err,data)=>{
      if(err) throw err;
      res.render('edit_pass_category',{title:'password Management System',loginUser:loginUser,errors:'',success:'',id:passcat_id,records:data})
    })
  })
  
  router.post('/edit/:id1',checkLoginUSer,(req,res,next)=>{
    var loginUser=localStorage.getItem('loginUser')
    var passcat_id=req.body.id;
    var passwordCategory=req.body.passwordCategory;
    var update_passCat=passcatModel.findByIdAndUpdate(passcat_id,{password_category:passwordCategory})
    
    update_passCat.exec((err,doc)=>{
      if(err) throw err;
      res.redirect('/passwordCategory')
    })
  })
  
  




  module.exports = router;