

const mongoose=require("mongoose")

const schema=new mongoose.Schema(
    {      
userId: {
    type: String,
    required: true
},
  conversationId:{
    type:String
    ,required:true
  },
  role:{
    type:String,
    required:true
  },
  content:{
    type:String
  },
  relevance:{
    type:Boolean
  },
  createdAt:{
    type:Date
  }
}
)

module.exports=mongoose.model("messages",schema);

