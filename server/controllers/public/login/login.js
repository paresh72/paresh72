const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const passport = require("passport");
const router = express.Router();

class LoginRoute {
  static async getUser(req, res) {
    res.status(200).json({
      msg: "validated",
    });
  }

  static async postLogin(req, res) {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user)
          return res.status(404).json({
            error: "Email-id doesn't exist",
          });
        else {
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
              return res.status(400).json({
                error: "ERROR: while matching password",
              });
            }
            if (result == true) {
              const payload = {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
              };
              jwt.sign(
                payload,
                global.config.secretKey,
                { expiresIn: 3600 * 2 },
                (err, token) => {
                  if (err)
                    return res.status(500).json({
                      error: "ERROR: while generating token",
                    });
                  else {
                    res.status(200).json({
                      success: true,
                      token: "Bearer " + token,
                    });
                  }
                }
              );
            } else {
              res.status(200).json({
                error: "password doesn't match..",
              });
            }
          });
        }
      })
      .catch((ex) => console.log(ex));
  }
}

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  LoginRoute.getUser
);
router.post("/", LoginRoute.postLogin);

module.exports = router;
