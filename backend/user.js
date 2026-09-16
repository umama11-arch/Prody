const mongoose=require("mongoose")

const schema=new mongoose.Schema({
    username:String,
    password:String,
    createdAt:{
        type:Date,
        required:true
    }
})

module.exports=mongoose.model("users",schema)