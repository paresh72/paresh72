import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import LoginService from "../../services/LoginService";
import Header from "../../components/header/Header";
import "../../components/forms/form.scss";
import "../login/login.scss";

export default function Login(props) {
  const [user, setUser] = useState({});
  const [confirmBox, setConfirmBox] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      props.history.push("/");
    } else {
      if (props.match.params.resetoken) {
        const tok = props.match.params.resetoken.replace("%20", " ");
        const decoded = jwt_decode(tok);
        if (decoded.for === "forgotpassword") {
          setUser(decoded);
        } else {
          props.history.push("/");
        }
      } else {
        props.history.push("/");
      }
    }
  }, []);

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (user.newpass === user.conpass && user.newpass.length > 3) {
      const tok = props.match.params.resetoken.replace("%20", " ");
      LoginService.postResetPassword(user, tok)
        .then((res) => {
          if (res.data.msg) {
            setConfirmBox(true);
          }
        })
        .catch((ex) => console.log(ex));
    }
  };

  return (
    <>
      {confirmBox && (
        <div className="formloader">
          <div className="row text-center">
            <div className="col-6 w-100 confirmbox">
              <div className="alert alert-success">
                Password updated successfully..
              </div>
              <button
                className="btn btn-success"
                onClick={() => {
                  setConfirmBox(false);
                  props.history.push("/login");
                }}
              >
                Goto Login
              </button>
            </div>
          </div>
        </div>
      )}
      <Header text="Reset Password" />
      <section className="container login">
        <div className="row m-0 py-5">
          <div className="col-lg-6 mx-auto bg-white py-5 formcard">
            <h2 className="text-center heading">Reset your password?</h2>
            <p className="text-center py-2"></p>
            <form
              onSubmit={handleResetPassword}
              className="px-lg-4 pt-2 pb-4"
              method="post"
            >
              <div className="mb-3">
                <label htmlFor="npass" className="form-label color-dback ps-1">
                  Enter new password
                </label>
                <input
                  type="password"
                  name="newpass"
                  id="npass"
                  placeholder="New password"
                  className="form-control"
                  onChange={(e) => {
                    setUser((d) => ({ ...d, newpass: e.target.value }));
                  }}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="npass" className="form-label color-dback ps-1">
                  Confirm new password
                </label>
                <input
                  type="password"
                  name="newpass"
                  id="npass"
                  placeholder="Confirm password"
                  className="form-control"
                  onChange={(e) => {
                    setUser((d) => ({ ...d, conpass: e.target.value }));
                  }}
                  required
                />
              </div>
              <div className="footer text-center pt-4">
                <button type="submit" className="btn bg-green text-white">
                  Reset password
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
