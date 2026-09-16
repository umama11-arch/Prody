const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: ""
  },

  duration: {
    type: Number,
    required: true
  },

  durationUnit: {
    type: String,
    enum: ["days", "weeks", "months"],
    required: true
  },

  status: {
    type: Boolean,
    default: true
  },

  userid: {
    type:String,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "users",
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("goal", goalSchema);