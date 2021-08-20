const express = require("express");
const mongoose = require("mongoose");
const Course = require("../../../../models/Course");
const Discussion = require("../../../../models/Discussion");
const router = express.Router({ mergeParams: true });

//middleware for accessing findOneAndRemove
mongoose.set("useFindAndModify", false);

class DiscussionRoute {
  static async getPendingDiscussions(req, res) {
    Discussion.find({ cid: req.params.id, review: "pending" })
      .sort([["_id", 1]])
      .then((discs) => {
        res.status(200).json(discs);
      })
      .catch((ex) => console.log(ex));
  }

  static async postDiscussion(req, res) {
    Course.findById(req.params.id)
      .then((course) => {
        if (course) {
          const newDiscussion = new Discussion({
            cid: req.params.id,
            sname: req.body.sname,
            message: req.body.message,
            review: req.body.review,
            replies: [],
          });
          newDiscussion
            .save()
            .then((disc) => {
              if (disc) {
                res.status(200).json({
                  msg: "Discussion created successfully..",
                  Discussion: disc,
                });
              } else {
                res.status(400).json({
                  error: "ERROR: while creating the discussion..",
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

  static async postDiscussionReply(req, res) {
    const upDisc = await Discussion.findById(req.params.id);
    let replyarr = upDisc.replies;
    replyarr.push({
      sname: req.body.sname,
      message: req.body.message,
      time: new Date(),
    });
    const review = req.body.review;
    upDisc.set({
      _id: upDisc._id,
      cid: upDisc.cid,
      sname: upDisc.sname,
      message: upDisc.message,
      time: upDisc.time,
      review: review,
      replies: replyarr,
      _v: upDisc._v,
    });
    upDisc
      .save()
      .then((result) => {
        if (result) {
          res.status(200).json({
            msg: "Reply added successfully...",
          });
        } else {
          res.status(400).json({
            error: "ERROR: while adding reply...",
          });
        }
      })
      .catch((ex) => console.log(ex));
  }

  static async deleteDiscussion(req, res) {
    Discussion.findOneAndRemove({ cid: req.params.id, _id: req.params.did })
      .then((disc) => {
        if (disc) {
          res.status(200).json({
            msg: "Discussion deleted successfully..",
            Discussion: disc,
          });
        }
      })
      .catch((ex) => console.log(ex));
  }
}

router.get("/pending", DiscussionRoute.getPendingDiscussions);
router.post("/", DiscussionRoute.postDiscussion);
router.post("/reply", DiscussionRoute.postDiscussionReply);
router.delete("/:did", DiscussionRoute.deleteDiscussion);

module.exports = router;
