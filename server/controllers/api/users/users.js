const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../../../models/User");
const router = express.Router();
const nodemailer = require("nodemailer");

class UsersRoute {
  static async getUser(req, res) {
    User.find()
      .then((users) => {
        if (!users)
          return res.status(404).json({
            error: "No Users found...",
          });
        else {
          res.status(200).json(users);
        }
      })
      .catch((ex) => console.log(ex));
  }

  static async getSingleUser(req, res) {
    User.findById(req.params.id)
      .then((user) => {
        if (!user)
          return res.status(404).json({
            error: "No User found...",
          });
        else {
          res.status(200).json(user);
        }
      })
      .catch((ex) => console.log(ex));
  }

  static async postUser(req, res) {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user)
          return res.status(400).json({
            error: "User with the given email-id, already exist.",
          });
        else {
          if (req.body.trainer) {
            User.findOne({ _id: req.body.trainer })
              .then((user) => {
                if (!user)
                  return res.status(400).json({
                    error: "The trainer with the given Id was not found..",
                  });
              })
              .catch((ex) => console.log(ex));
          }
          const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            status: req.body.status,
            trainer: req.body.trainer,
            courses: req.body.courses,
          });

          bcrypt.hash(newUser.password, 10, (err, hash) => {
            if (err)
              return res.status(500).json({
                error: "ERROR: while generating hash for password.",
              });
            else {
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  if (user) {
                    res.status(200).json({
                      msg: "User created successfully",
                    });
                  } else {
                    res.status(400).json({
                      error: "ERROR: while creating User",
                    });
                  }
                })
                .catch((ex) => console.log(ex));
            }
          });
        }
      })
      .catch((ex) => console.log(ex));
  }

  static async forgotPassword(req, res) {
    const uemail = req.body.email;
    if (uemail) {
      User.findOne({ email: uemail }).then(async (user) => {
        if (user) {
          const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            for: "forgotpassword",
          };
          jwt.sign(
            payload,
            global.config.secretKey,
            { expiresIn: 3600 * 1 },
            async (err, token) => {
              if (err) {
                return res.status(500).json({
                  error: "ERROR: while generating token",
                });
              } else {
                const tok = "Bearer " + token;
                const mailtext =
                  '<div style="background:#11698e;padding:1rem;color:#ffffff;font-weight:bold"> Radix<span style="color:#16c79a;font-weight:normal">Training</span> </div>' +
                  '<div style="padding-left:0.5rem;padding-right:0.5rem;">' +
                  "<h3>Hi " +
                  user.username +
                  ",</h3>" +
                  "<p>Forgot your password?</p>" +
                  "<p>We received a request to reset the password for your account</p>" +
                  "<p>To reset your password click on the link below:</p>" +
                  "<p>Or copy and paste the URL into your browser:</p>" +
                  "<a href='http://10.10.10.31:3000/reset-password/" +
                  tok +
                  "'>http://10.10.10.31:3000/reset-password</a><br/><br/>" +
                  "</div>";

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                  service: "gmail",
                  port: 587,
                  secure: false, // true for 465, false for other ports
                  auth: {
                    user: "adityasri2021@gmail.com", // generated ethereal user
                    pass: "******", // enter password here
                  },
                });

                // send mail with defined transport object
                transporter.sendMail(
                  {
                    from: "adityasri2021@gmail.com", // sender address
                    to: uemail, // list of receivers
                    subject: "Reset your RadixTraining password", // Subject line
                    html: mailtext, // plain text body
                  },
                  (err, info) => {
                    if (err) {
                      res.status(400).json({
                        error: "ERROR: while sending email..",
                      });
                    } else {
                      res.status(200).json({
                        msg: info.response,
                      });
                    }
                  }
                );
              }
            }
          );
        } else {
          res.status(400).json({
            error: "ERROR: while sending email..",
          });
        }
      });
    }
  }

  static async resetPassword(req, res) {
    User.findById(req.body.id)
      .then((user) => {
        if (user) {
          const upUserPass = user;
          upUserPass.password = req.body.newpass;
          bcrypt.hash(upUserPass.password, 10, (err, hash) => {
            if (err)
              return res.status(500).json({
                error: "ERROR: while generating hash for password.",
              });
            else {
              upUserPass.password = hash;
              upUserPass
                .save()
                .then((user) => {
                  if (user) {
                    res.status(200).json({
                      msg: "Password updated successfully",
                    });
                  } else {
                    res.status(400).json({
                      error: "ERROR: while creating User",
                    });
                  }
                })
                .catch((ex) => console.log(ex));
            }
          });
        }
      })
      .catch((ex) => console.log(ex));
  }

  static async putUser(req, res) {
    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          if (req.body.trainer) {
            User.findOne({ _id: req.body.trainer })
              .then((trainer) => {
                if (!trainer)
                  return res.status(400).json({
                    error: "The trainer with the given Id was not found..",
                  });
              })
              .catch((ex) => console.log(ex));
          }
          const upUser = user;
          if (upUser.role === "Trainer") {
            upUser.set({
              username: req.body.username,
              email: req.body.email,
              role: req.body.role,
              status: req.body.status,
            });
          }
          if (upUser.role === "Student") {
            upUser.set({
              username: req.body.username,
              email: req.body.email,
              role: req.body.role,
              status: req.body.status,
              trainer: req.body.trainer,
              courses: req.body.courses,
            });
          }
          upUser
            .save()
            .then((user) => {
              if (user) {
                res.status(200).json({
                  msg: "User updated successfully",
                });
              } else {
                res.status(400).json({
                  error: "ERROR: while updating User",
                });
              }
            })
            .catch((ex) => console.log(ex));
        } else {
          return res.status(400).json({
            error: "User with the given id, was not found",
          });
        }
      })
      .catch((ex) => console.log(ex));
  }

  static async deleteUser(req, res) {
    User.findByIdAndRemove(req.params.id)
      .then((user) => {
        if (user) {
          res.status(200).json({
            msg: "User removed successfully..",
          });
        } else {
        }
      })
      .catch((ex) => console.log(ex));
  }
}

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  UsersRoute.getUser
);
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  UsersRoute.getSingleUser
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  UsersRoute.postUser
);
router.post("/forgot", UsersRoute.forgotPassword);
router.post(
  "/reset",
  passport.authenticate("jwt", { session: false }),
  UsersRoute.resetPassword
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  UsersRoute.putUser
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  UsersRoute.deleteUser
);

module.exports = router;
