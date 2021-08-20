const express = require("express");
const passport = require("passport");
const Course = require("../../../models/Course");
const TrainingPlan = require("../../../models/TrainingPlan");
const Coursevideo = require("../../../models/Coursevideo");
const Courseppt = require("../../../models/Courseppt");
const coursepptRoute = require("./ppt/courseppt");
const coursevideoRoute = require("./video/coursevideo");
const trainingplanRoute = require("./trainingplan/trainingplan");
const descussionRoute = require("./discussion/discussion");
const router = express.Router();

router.use("/:id/ppt", coursepptRoute);
router.use("/:id/video", coursevideoRoute);
router.use("/:id/trainingplan", trainingplanRoute);
router.use("/:id/discussion", descussionRoute);

class CourseRoute {
  static async getCourses(req, res) {
    Course.find()
      .then((courses) => {
        if (!courses)
          return res.status(404).json({
            error: "ERROR: No Course found",
          });
        else {
          res.status(200).json(courses);
        }
      })
      .catch((ex) => console.log(ex));
  }

  static async postCourses(req, res) {
    const str = req.body.name
    Course.findOne({ name: req.body.name})
      .then((course) => {
        if (course)
          return res.status(400).json({
            error: "Course with the given name already exist",
          });
        else {
          const newCourse = new Course({
            name: req.body.name,
            type: req.body.type,
            icon: req.body.icon,
            desc: req.body.desc,
          });
          newCourse
            .save()
            .then((course) => {
              if (course) {
                res.status(200).json({
                  msg: "Course created successfully..",
                });
              } else {
                res.status(500).json({
                  error: "ERROR: while creating new course",
                });
              }
            })
            .catch((ex) => console.log(ex));
        }
      })
      .catch((ex) => console.log(ex));
  }

  static async putCourses(req, res) {
    Course.findById(req.params.id)
      .then((course) => {
        if (course) {
          let upCourse = course;
          upCourse.set({
            name: req.body.name,
            type: req.body.type,
            desc: req.body.desc,
          });
          upCourse.save().then((course) => {
            res.status(200).json({
              msg: "Course updated successfully..",
            });
          });
        } else {
          res.status(404).json({
            msg: "Course not found..",
          });
        }
      })
      .catch((ex) => console.log(ex));
  }

  static async deleteCourses(req, res) {
    // Counting trainingplans
    const tplans = await TrainingPlan.find({ cid: req.params.id });
    let count_plans = tplans.length;
    // Counting ppts
    const ppts = await Courseppt.findOne({ cid: req.params.id });
    let count_ppts = 0;
    if (ppts) {
      count_ppts = ppts.ppts.length;
    }
    //Counting videos
    const videos = await Coursevideo.find({ cid: req.params.id });
    let count_videos = 0;
    if (videos.length > 0) {
      videos.map((tp) => {
        count_videos += tp.videos.length;
      });
    }

    if (count_plans === 0 && count_ppts === 0 && count_videos === 0) {
      Course.findByIdAndRemove(req.params.id)
        .then((course) => {
          if (course) {
            res.status(200).json({
              msg: "Course removed successfully..",
            });
          } else {
          }
        })
        .catch((ex) => console.log(ex));
    } else {
      res.status(200).json({
        msg: "dependencies",
      });
    }
  }
}

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  CourseRoute.getCourses
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  CourseRoute.postCourses
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  CourseRoute.putCourses
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  CourseRoute.deleteCourses
);

module.exports = router;
