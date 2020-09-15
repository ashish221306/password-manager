const mongoose=require('mongoose');
const database=require('../database')
const passcatSchema=mongoose.Schema({
    password_category:{
        type:String,
        required:true,
    },
    _userID:{
        type:mongoose.Types.ObjectId,
        required:true,
    },
date:{
    type:Date,
    default:Date.now()
}
})

mongoose.model('password_categories',passcatSchema);
module.exports=mongoose.model('password_categories');