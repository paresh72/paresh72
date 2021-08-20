const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TrainingPlanSchema = new Schema({
  cid: {
    type: Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  tp_day: {
    type: Number,
    required: true,
    min: 1,
    unique: true
  },
  tp_whattolearn: {
    type: String,
  },
  tp_practice: {
    type: String,
  },
  tp_assignment: {
    type: String,
  },
  tp_onlineref: {
    type: Array,
  },
  tp_note: {
    type: String,
  },
  tp_practiceimgarr: {
    type: Array,
  },
  tp_assignmentimgarr: {
    type: Array,
  },
});

module.exports = TrainingPlan = mongoose.model(
  "trainingplan",
  TrainingPlanSchema
);
