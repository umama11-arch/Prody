const mongoose=require("mongoose")
const user=require("./user")

const schema=new mongoose.Schema({
    task:String,
    time:Date,
    userid:String,
    priority:String,
    // _id=String,
    completed:{
        type:Boolean,
        default:false
    },
    completedDate:{
      type:Date
    },
    completedtoday:{
      type:Boolean,
      default:false
    },
    category:String,
    remainderenable:{
        type:Boolean,
        default:false
    },
    reminderTime: {
  type: Number, // minutes before task
  default: 15
},

notified: {
  type: Boolean,
  default: false
},
reminderSentAt: Date,
goalid: {
  type:String,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "goal",
required:true
},
repeat: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly"],
    default: "none"
},
repeatDays: {
  type: [String],
  default:[]
},

repeatDate: {
  type: Number,
  default: null
}
})
module.exports=mongoose.model("task",schema);

