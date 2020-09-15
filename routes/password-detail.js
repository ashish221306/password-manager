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

//view all password


//edit
/*
router.get('/',(req,res,next)=>{
res.redirect('/dashboard')
})
*/

router.get('/edit/:id',(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUser')
  var id=req.params.id;
  var getPassDetails =passModel.findById({_id:id})
  getPassDetails.exec((err,data)=>{
    if(err) throw err;
    getPassCat.exec((err,data1)=>{
      res.render('edit_password_detail',{title:'password Management System',loginUser:loginUser,record:data,records:data1,success:''})
    })
  })
  })


  router.post('/edit/:id',(req,res,next)=>{
    var loginUser=localStorage.getItem('loginUser')
    var id=req.params.id;
    var passcat=req.body.password_category;
    var project_name=req.body.project_name;
    var pass_details=req.body.pass_details;

    passModel.findByIdAndUpdate(id,{
      password_category:passcat,
      project_name:project_name,
      pass_detail:pass_details
    }).exec((err)=>{
      if(err) throw err;
    var getPassDetails =passModel.findById({_id:id})
    getPassDetails.exec((err,data)=>{
      if(err) throw err;
      getPassCat.exec((err,data1)=>{
        res.render('edit_password_detail',{title:'password Management System',loginUser:loginUser,record:data,records:data1,success:'password updated succesfully'})
      })
    })
    })
    })

    router.get('/delete/:id',checkLoginUSer,(req,res,next)=>{
      var loginUser=localStorage.getItem('loginUser')
      var id=req.params.id;
      var passdelete=passModel.findByIdAndDelete(id);
      passdelete.exec((err)=>{
        if(err) throw err;
        res.redirect('/view-all-password')
      })
    })





  module.exports = router;