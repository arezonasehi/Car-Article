var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var HeadlineSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  teaser: {
    type: String,
    required: false,
    trim: true
  },
  saved: {
    type: Boolean,
    required: true,
    default: false,
  },

  notes: [
    {
      type: Schema.Types.ObjectId,      
      ref: "Note"
    }
  ]
});
var Headline = mongoose.model("Headline", HeadlineSchema);

module.exports = Headline;
