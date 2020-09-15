/*
const mongoose=require('mongoose');
const assert=require('assert');
const db_url=process.env.DB_URL

mongoose.connect(db_url
    ,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:true
}).then(()=>{
console.log('databse connected')
}).catch((err)=>{
console.log(err)
})

*/
//----------------
const mongoose=require('mongoose');
const db_url=process.env.DB_URL;
mongoose.Promise=global.Promise;
mongoose.connect(db_url,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:true,
    useFindAndModify:false
}).then(()=>{
    console.log('database connected')
}).catch((error)=>{
    console.log(error)
})

module.exports=mongoose
