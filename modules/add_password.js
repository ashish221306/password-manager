const mongoose=require('mongoose');
const database=require('../database')
const passSchema=mongoose.Schema({
    password_category:{
        type:String,
        required:true,
        index:{unique:true}
        
    },
    _userID:{
        type:mongoose.Types.ObjectId,
        required:true,
    },
    password_detail:{
        type:String,
        required:true
    },
    project_name:{
    type:String,
    require:true,
    },
date:{
    type:Date,
    default:Date.now()
}
})

mongoose.model('password_details',passSchema);
module.exports=mongoose.model('password_details');