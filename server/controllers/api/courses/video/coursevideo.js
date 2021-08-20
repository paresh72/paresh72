const express = require("express");
const path = require("path");
const util = require("util");
const multer = require("multer");
const passport = require("passport");
const mongoose = require("mongoose");
const efupload = require("express-fileupload");
const router = express.Router({ mergeParams: true });

const Course = require("../../../../models/Course");
const Coursevideo = require("../../../../models/Coursevideo");
const cloudinary = require("../../../../setup/cloudinary_config");
const { uploader, utils } = require("../../../../setup/cloudinary_config");

//middleware for accessing findOneAndRemove
mongoose.set("useFindAndModify", false);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/videos/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, file.fieldname + uniqueSuffix + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });

class CoursevideoRoute {
  static async getCoursevideos(req, res) {
    Coursevideo.find({ cid: req.params.id })
      .then((cvideos) => {
        console.log(cvideos)
        res.status(200).json(cvideos);
      })
      .catch((ex) => console.log(ex));
  }

  static async postCoursevideo(req, res) {
    Course.findById(req.params.id)
      .then(async (course) => {
        if (course) {
          const cvideo = await Coursevideo.findOne({
            topic: req.body.topic,
            cid: course._id,
          });
          var min = 1;
          var max = 10000;
          var index = min + (Math.random() * (max - min));
          let newCoursevideo = "";
          let upfiles = await req.files;
          let upfilenames = upfiles.map((item) => {
            return {filename:item.filename,id : index};
          });
          if (cvideo) {
            let vids = cvideo.videos;
            vids = [...vids, ...upfilenames];
            cvideo.set({
              id: cvideo._id,
              videos: vids,
              cid: cvideo.cid,
              topic: cvideo.topic,
              _v: cvideo._v,
            });
            newCoursevideo = cvideo;
          } else {
            newCoursevideo = new Coursevideo({
              cid: course._id,
              topic: req.body.topic,
              videos: upfilenames,
            });
          }
          newCoursevideo
            .save()
            .then((cvideo) => {
              if (cvideo) {
                res.status(200).json({
                  msg: "Videos uploaded successfully..",
                  Courseppt: cvideo,
                });
              } else {
                res.status(400).json({
                  error: "ERROR: while uploading the video..",
                });
              }
            })
            .catch((ex) => console.log(ex));
        } else {
          res.status(404).json({
            error: "Course with the given Id was not found..",
          });
        }
      })
      .catch((ex) => console.log(ex));
  }

  static async putCoursevideo(req, res) {
    Coursevideo.findById(req.params.vid)
      .then((cvideo) => {
        if (cvideo) {
          cvideo.set({
            _id: cvideo._id,
            videos: req.body.videos,
            cid: cvideo.cid,
            topic: cvideo.topic,
            _v: cvideo._v,
          });
          cvideo
            .save()
            .then(async (svideo) => {
              if (svideo) {
                const dvideos = req.body.dvideos;

                // Deleting videos from cloudinary
                dvideos.map(async (item) => {
                  const vname = item.split("/")[8];
                  try {
                    await cloudinary.uploader.destroy("videos/" + vname, {
                      resource_type: "raw",
                    });
                  } catch (error) {
                    console.log(error);
                  }
                });

                res.status(200).json({
                  msg: "Videos updated successfully..",
                  Coursevids: svideo,
                });
              } else {
                res.status(400).json({
                  error: "ERROR: while updating videos..",
                });
              }
            })
            .catch((ex) => console.log(ex));
        }
      })
      .catch((ex) => console.log(ex));
  }



  static async deleteCoursevideo(req, res) {
    console.log(req.params.vid,req.params.id)
    // res.send("hfhfh")
    Coursevideo.find({_id : req.params.id})
      .then(async function (video) {
        console.log(video);
        video.set({
          _id: video._id,
          videos: req.body.videos,
          cid: video.cid,
          topic: video.topic,
          _v: video._v,
        });


        video[0].videos.map(item => {
          console.log(item);
          if(item.id === req.params.vid){
            console.log("hello")
          }
          else{
            const vid = item;
            // video[0].videos = item
            // const test = Coursevideo.updateOne({_id : req.params.id},{videos : item})
          }
          console.log(item)
        })
        console.log(video)
              res.status(200).json({
                msg: "Videos deleted successfully..",
                Coursevids: video,
              });
      })
      .catch((ex) => console.log("hello"));
   }

}

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  CoursevideoRoute.getCoursevideos
);
router.post(
  "/",
  [passport.authenticate("jwt", { session: false }), upload.array("cvids", 50)],
  CoursevideoRoute.postCoursevideo
);
router.put(
  "/:vid",
  passport.authenticate("jwt", { session: false }),
  CoursevideoRoute.putCoursevideo
);
router.delete(
  "/:vid",
  CoursevideoRoute.deleteCoursevideo
);

module.exports = router;
