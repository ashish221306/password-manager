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

/*check loginuser only by localstorage/jwt

function checkLoginUSer(req,res,next){
  var userToken=localStorage.getItem('userToken')
try{
  var decoded=jwt.verify(userToken,'loginToken')
}catch(err){
res.redirect('/');
}
next();
}
*/
//checkUserlogin by express-session
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
router.get('/login', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser')
  if(req.session.userName){
    res.redirect('/dashboard');
  }else{
    res.render('index', { title: 'password management system' ,msg:''});
  }
  
});
//login post 

router.post('/login',(req,res,next)=>{
  var username=req.body.uname;
  var password=req.body.password;
  var checkUser=userModule.findOne({username:username});
  checkUser.exec((err,data)=>{
  if(err) throw err;
    var getUserID=data._id;
    var getPassword=data.password;
    var gmail=data.email;
    if(bcrypt.compareSync(password,getPassword)){
      var token = jwt.sign({ userID:getUserID }, 'loginToken');
    localStorage.setItem('userToken',token);
    localStorage.setItem('loginUser',username);
    localStorage.setItem('userid',getUserID);
    localStorage.setItem('gmail',gmail);
      //session implementation
      req.session.userName=getUserID;
      res.redirect('/dashboard')
    }else{
    res.render('index', { title: 'Login' ,msg:'invalid username / password'});
      
    }
  
  })
})  







router.get('/signup',(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUser')
  if(req.session.userName){
    res.redirect('/dashboard');
  }else{
   return res.render('signup',{title: 'password management system',msg:''});
  }
  
})


//signup get
router.post('/signup',checkEmail,checkUsername,(req,res,next)=>{
  var username=req.body.uname;
  var email=req.body.email;
  var password=req.body.password;
  var confpassword=req.body.confpassword;

if(password!=confpassword){
 return res.render('signup',{title:'password management system',msg:'password did not matched'})
}else{
  password=bcrypt.hashSync(req.body.password,10)
  var userDetails=new userModule({
    email:email,
    password:password,
    username:username,
  });
  userDetails.save((err,doc)=>{
  if(err) throw err;
  return res.render('signup',{title:'password management system',msg:'user registered succesfully'})
  })


}
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
/*
router.get('/passwordCategory',checkLoginUSer,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUser')
  getPassCat.exec((err,data)=>{
    if(err) throw err;
    res.render('password_category',{title:'password Management System',loginUser:loginUser,records:data})
  })
  
})
//password category delete
router.get('/passwordCategory/delete/:id',checkLoginUSer,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUser')
  var passcat_id=req.params.id;
  var passdelete=passcatModel.findByIdAndDelete(passcat_id);
  passdelete.exec((err)=>{
    if(err) throw err;
    res.redirect('/passwordCategory')
  })
})
//password category update
router.get('/passwordCategory/edit/:id',checkLoginUSer,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUser')
  var passcat_id=req.params.id;
  var getpassCategory=passcatModel.findById(passcat_id);
  getpassCategory.exec((err,data)=>{
    if(err) throw err;
    res.render('edit_pass_category',{title:'password Management System',loginUser:loginUser,errors:'',success:'',id:passcat_id,records:data})
  })
})

router.post('/passwordCategory/edit/:id',checkLoginUSer,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUser')
  var passcat_id=req.body.id;
  var passwordCategory=req.body.passwordCategory;
  var update_passCat=passcatModel.findByIdAndUpdate(passcat_id,{password_category:passwordCategory})
  
  update_passCat.exec((err,doc)=>{
    if(err) throw err;
    res.redirect('/passwordCategory')
  })
})













router.get('/add-new-category',checkLoginUSer,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUser')
  res.render('addNewCategory',{title:'password Management System',loginUser:loginUser,success:'',errors:''})
})

router.post('/add-new-category',checkLoginUSer,[check('passwordCategory','Enter password category name').isLength({min:1})],(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUser')
  const errors=validationResult(req)
  if(!errors.isEmpty()){
    console.log(errors.mapped())
    res.render('addNewCategory',{title:'password Management System',loginUser:loginUser,errors:errors.mapped(),success:''})
  }else{
    var passCatName=req.body.passwordCategory;
    var passCatDetails=new passcatModel({
      password_category:passCatName
    })
    passCatDetails.save((err,doc)=>{
      if(err) throw err;
      res.render('addNewCategory',{title:'password Management System',loginUser:loginUser,errors:'',success:'password category inserted successfully'})
    })
    
  }
  
})

//add new password

router.get('/add-new-password',checkLoginUSer,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUser')
  getPassCat.exec((err,data)=>{
    if(err) throw err;
    res.render('add-new-password',{title:'password Management System',loginUser:loginUser,success:'',records:data})
  })
})

router.post('/add-new-password',checkLoginUSer,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUser');
  var pass_cat=req.body.password_category;
  var pass_details=req.body.pass_details;
  var project_name=req.body.project_name;

  var password_details=new passModel({
    password_category:pass_cat,
    password_detail:pass_details,
    project_name:project_name
  })

password_details.save((err,doc)=>{
  getPassCat.exec((err,data)=>{
    if(err) throw err;

    res.render('add-new-password',{title:'password Management System',loginUser:loginUser,success:'Password details inserted successfully',records:data})
  })
})
})
*/





//view all password
/*
router.get('/view-all-password',checkLoginUSer,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUser')
  getAllPass.exec((err,data)=>{
    if(err) throw err;
    res.render('view-all-password',{title:'password Management System',loginUser:loginUser,records:data})
  })
  
})
//edit
router.get('/password-detail',(req,res,next)=>{
res.redirect('/dashboard')
})

router.get('/password-detail/edit/:id',(req,res,next)=>{
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


  router.post('/password-detail/edit/:id',(req,res,next)=>{
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

    router.get('/password-detail/delete/:id',checkLoginUSer,(req,res,next)=>{
      var loginUser=localStorage.getItem('loginUser')
      var id=req.params.id;
      var passdelete=passModel.findByIdAndDelete(id);
      passdelete.exec((err)=>{
        if(err) throw err;
        res.redirect('/view-all-password')
      })
    })
*/
//dashboard


router.get('/logout',(req,res)=>{
  req.session.destroy((err,res,next)=>{
  if(err){
    res.redirect('/');
  }
  })
  localStorage.removeItem('userToken');
  localStorage.removeItem('loginUser');
  res.redirect('/');
})

router.get('/',(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUser')
  if(req.session.userName){
    res.redirect('/dashboard');
  }else{
    return res.render('home',{title:'password management system'});
  }
  
})

router.get('/profile',(req,res,next)=>{
  res.render('/profile',{title:'password mnagement system'})
})

/*
router.get('/**',(req,res,next)=>{
  res.render('error',{title:'password management system'});
})
*/

module.exports = router;
