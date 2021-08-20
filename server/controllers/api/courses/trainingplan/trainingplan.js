const express = require("express");
const passport = require("passport");
const Course = require("../../../../models/Course");
const TrainingPlan = require("../../../../models/TrainingPlan");
const router = express.Router({ mergeParams: true });

class TrainingplanRoute {
  static async getTrainingPlans(req, res) {
    Course.findById(req.params.id)
      .then((course) => {
        if (!course)
          return res.status(404).json({
            error: "ERROR: No Course found",
          });
        else {
          TrainingPlan.find({ cid: course._id })
            .then((plan) => {
              res.status(200).json(plan);
            })
            .catch((ex) => console.log(ex));
        }
      })
      .catch((ex) => console.log(ex));
  }

  static async postTrainingPlan(req, res) {
    Course.findById(req.params.id)
      .then((course) => {
        if (!course)
          return res.status(404).json({
            error: "ERROR: No Course found",
          });
        else {
          const newTrainingplan = new TrainingPlan({
            cid: course._id,
            tp_day: req.body.tp_day,
            tp_whattolearn: req.body.tp_whattolearn,
            tp_practice: req.body.tp_practice,
            tp_assignment: req.body.tp_assignment,
            tp_onlineref: req.body.tp_onlineref,
            tp_note: req.body.tp_note,
            tp_practiceimgarr: req.body.tp_practiceimgarr,
            tp_assignmentimgarr: req.body.tp_assignmentimgarr,
          });

          newTrainingplan
            .save()
            .then((plan) => {
              res.status(200).json({
                msg: "Trainingplan inserted successfully..",
                Trainingplan: plan,
              });
            })
            .catch((ex) => console.log(ex));
        }
      })
      .catch((ex) => console.log(ex));
  }

  static async postTrainingPlanXlsx(req, res) {
    Course.findById(req.params.id)
      .then((course) => {
        if (!course)
          return res.status(404).json({
            error: "ERROR: No Course found",
          });
        else {
          const plans = req.body;
          const result = [];
          plans.map(async (item) => {
            let tplan = await TrainingPlan.findOne({
              tp_day: Number(item.tp_day),
              cid: course._id,
            });
            let newTrainingplan;
            if (tplan) {
              newTrainingplan = tplan;
              newTrainingplan.set({
                tp_whattolearn: item.tp_whattolearn,
                tp_practice: item.tp_practice,
                tp_assignment: item.tp_assignment,
                tp_onlineref: item.tp_onlineref,
                tp_note: item.tp_note,
              });
            } else {
              newTrainingplan = new TrainingPlan({
                cid: course._id,
                tp_day: Number(item.tp_day),
                tp_whattolearn: item.tp_whattolearn,
                tp_practice: item.tp_practice,
                tp_assignment: item.tp_assignment,
                tp_onlineref: item.tp_onlineref,
                tp_note: item.tp_note,
                tp_practiceimgarr: [],
                tp_assignmentimgarr: [],
              });
            }
            newTrainingplan.save((err, saved) => {
              if (err) throw err;
              result.push(saved);
            });
          });
          res.status(200).json({
            msg: "Trainingplans inserted successfully..",
            Trainingplan: result,
          });
        }
      })
      .catch((ex) => console.log(ex));
  }

  static async putTrainingPlan(req, res) {
    const upTplan = await TrainingPlan.findById(req.params.tpid);
    if (upTplan) {
      upTplan.set({
        tp_whattolearn: req.body.tp_whattolearn,
        tp_practice: req.body.tp_practice,
        tp_assignment: req.body.tp_assignment,
        tp_onlineref: req.body.tp_onlineref,
        tp_note: req.body.tp_note,
        tp_practiceimgarr: req.body.tp_practiceimgarr,
        tp_assignmentimgarr: req.body.tp_assignmentimgarr,
      });

      upTplan
        .save()
        .then((plan) => {
          res.status(200).json({
            msg: "Trainingplan updated successfully..",
            Trainingplan: plan,
          });
        })
        .catch((ex) => console.log(ex));
    }
  }

  static async deleteTrainingPlan(req, res) {
    Course.findById(req.params.id)
      .then(async function (course) {
        if (!course)
          return res.status(404).json({
            error: "ERROR: No Course found",
          });
        else {
          TrainingPlan.findOneAndRemove({
            cid: course._id,
            tp_day: req.params.day,
          })
            .then((plan) => {
              res.status(200).json({
                msg: "Trainingplan deleted successfully..",
                Trainingplan: plan,
              });
            })
            .catch((ex) => console.log(ex));
        }
      })
      .catch((ex) => console.log(ex));
  }
}

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  TrainingplanRoute.getTrainingPlans
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  TrainingplanRoute.postTrainingPlan
);
router.post(
  "/xlsx",
  passport.authenticate("jwt", { session: false }),
  TrainingplanRoute.postTrainingPlanXlsx
);
router.put(
  "/:tpid",
  passport.authenticate("jwt", { session: false }),
  TrainingplanRoute.putTrainingPlan
);
router.delete(
  "/:day",
  passport.authenticate("jwt", { session: false }),
  TrainingplanRoute.deleteTrainingPlan
);

module.exports = router;
