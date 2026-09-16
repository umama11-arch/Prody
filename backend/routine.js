const mongoose=require("mongoose")

const schema=new mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
    content:{
        type:String
    },
    createdAt:{
        type:Date
    }

})

module.exports=mongoose.model("routine",schema);