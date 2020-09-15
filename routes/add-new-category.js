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
    var getUser=userModule.findOne({username:loginUser});
    getUser.exec((err,data)=>{
      if(err) throw err;
      res.render('addNewCategory',{title:'password Management System',loginUser:loginUser,success:'',errors:'',userID:data._id})
    })
    
  })

  router.post('/',checkLoginUSer,[check('passwordCategory','Enter password category name').isLength({min:1})],(req,res,next)=>{
    var loginUser=localStorage.getItem('loginUser')
    const errors=validationResult(req);
   
    if(!errors.isEmpty()){
      console.log(errors.mapped())
      res.render('addNewCategory',{title:'password Management System',loginUser:loginUser,errors:errors.mapped(),success:'',userID:''})
    }
    else{
     /* var getpascat=passcatModel.findOne({password_category:req.body.passwordCategory});
      getpascat.exec((err,data)=>{
        if(err) throw err;
        console.log(data)
        if(data!=null){
         return res.render('addNewCategory',{title:'password Management System',loginUser:loginUser,errors:'this category already exist',success:'',userID:''})
        }
      })
     */
      var passCatName=req.body.passwordCategory;
      var userid=req.body.userID;
      var passCatDetails=new passcatModel({
        password_category:passCatName,
        _userID:userid
      })
      passCatDetails.save((err,doc)=>{
        if(err) throw err;
        res.render('addNewCategory',{title:'password Management System',loginUser:loginUser,errors:'',success:'password category inserted successfully',userID:''})
      })
      
    }
    
  })



  module.exports = router;