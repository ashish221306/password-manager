const mongoose=require('mongoose');
const database=require('../database')
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        index:{unique:true}
    },
email:{
    type:String,
    required:true,
    index:{unique:true}

},

password:{
    type:String,
    required:true

}
,
date:{
    type:Date,
    default:Date.now()
}
})

mongoose.model('users',userSchema);
module.exports=mongoose.model('users');