const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 40,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "offline",
  },
  trainer: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  courses: {
    type: Array(Schema.Types.ObjectId),
    ref: "user",
  },
});

module.exports = User = mongoose.model("user", UserSchema);
