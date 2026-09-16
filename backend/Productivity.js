const mongoose = require("mongoose");

const productivitySchema = new mongoose.Schema({

  userid: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  taskPercent: {
    type: Number,
    required: true
  },

  goalPercent: [
    {
      goalid: {
        type: String,
        required: true
      },

      percentage: {
        type: Number,
        required: true
      }
    }
  ]

});

module.exports = mongoose.model("Productivity", productivitySchema);