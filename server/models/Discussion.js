const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiscussionSchema = new Schema({
  sname: {
    type: String,
    required: true,
  },
  cid: {
    type: Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  replies: {
    type: Array,
  },
  review: {
    type: String,
    enum: ["pending", "reviewed"],
    default: "pending",
  },
});

module.exports = Descussion = mongoose.model("discussion", DiscussionSchema);
