const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const passport = require("passport");
const mongoose = require("mongoose");
const Course = require("../../../../models/Course");
const Courseppt = require("../../../../models/Courseppt");
const router = express.Router({ mergeParams: true });
const cloudinary = require("../../../../setup/cloudinary_config");

//middleware for accessing findOneAndRemove
mongoose.set("useFindAndModify", false);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/ppts");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
var upload = multer({ storage: storage }).single("ppt");

class CoursepptRoute {
  static async getCourseppts(req, res) {
    Courseppt.find({ cid: req.params.id })
      .then((cppts) => {
        res.status(200).json(cppts);
      })
      .catch((ex) => console.log(ex));
  }

  static async postCourseppt(req, res) {
    Course.findById(req.params.id)
      .then(async (course) => {
        if (course) {
          let newCourseppt = "";
          let ccppt = await Courseppt.findOne({ cid: req.params.id });
          if (ccppt) {
            let ppts = ccppt.ppts;
            ppts.push(...req.body.ppts);
            ccppt.set({
              _id: ccppt._id,
              ppts: ppts,
              cid: ccppt.cid,
              _v: ccppt._v,
            });
            newCourseppt = ccppt;
          } else {
            newCourseppt = new Courseppt({
              cid: req.params.id,
              ppts: req.body.ppts,
            });
          }
          newCourseppt
            .save()
            .then((cppt) => {
              if (cppt) {
                res.status(200).json({
                  msg: "PPT uploaded successfully..",
                  Courseppt: cppt,
                });
              } else {
                res.status(400).json({
                  error: "ERROR: while uploading the ppt..",
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

  static async putCourseppt(req, res) {
    Courseppt.findById(req.params.pid)
      .then((cppt) => {
        if (cppt) {
          cppt.set({
            _id: cppt._id,
            ppts: req.body.ppts,
            cid: cppt.cid,
            _v: cppt._v,
          });
          cppt
            .save()
            .then((sppt) => {
              if (sppt) {
                const dppts = req.body.dppts;

                // Deleting ppts from cloudinary
                dppts.map(async (item) => {
                  const pname = item.split("/")[8];
                  try {
                    await cloudinary.uploader.destroy("ppts/" + pname, {
                      resource_type: "raw",
                    });
                  } catch (error) {
                    console.log(error);
                  }
                });

                res.status(200).json({
                  msg: "PPTs updated successfully..",
                  Courseppt: sppt,
                });
              } else {
                res.status(400).json({
                  error: "ERROR: while updating the ppts..",
                });
              }
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
  CoursepptRoute.getCourseppts
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  CoursepptRoute.postCourseppt
);
router.put(
  "/:pid",
  passport.authenticate("jwt", { session: false }),
  CoursepptRoute.putCourseppt
);

module.exports = router;
