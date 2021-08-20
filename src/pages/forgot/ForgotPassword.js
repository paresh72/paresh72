import React, { useState, useEffect } from "react";
import LoginService from "../../services/LoginService";
import Header from "../../components/header/Header";
import "../../components/forms/form.scss";
import "../login/login.scss";
import formloader from "../../images/formloading.gif";

export default function Login(props) {
  const { setLoginStatus } = props;

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState({ sent: false, msg: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      props.history.push("/");
    }
  }, []);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setLoading(true);
    LoginService.postEmail({ email: email })
      .then((res) => {
        if (res.data) {
          setSent({
            sent: true,
            msg: "Link to reset your password has been sent to your email address",
            alert: "alert-success",
          });
          e.target.reset();
          setLoading(false);
        }
      })
      .catch((ex) => {
        setSent({
          sent: true,
          msg: "Sorry! given email address is not registered with us.",
          alert: "alert-danger",
        });
        e.target.reset();
        setLoading(false);
      });
  };

  return (
    <>
      {loading && (
        <div className="formloader">
          <div className="row text-center">
            <div className="col-12">
              <img src={formloader} alt="" height="200" />
            </div>
            <div className="col-12 text-white h4">Loading...</div>
          </div>
        </div>
      )}
      <Header text="Forgot Password" />
      <section className="container login">
        <div className="row m-0 py-5">
          <div className="col-lg-6 mx-auto bg-white py-5 formcard">
            <h2 className="text-center heading">Forgot your password?</h2>
            <p className="text-center py-2">
              Link to reset your passwod will be sent to your registered email
            </p>
            <form
              onSubmit={handleForgotPassword}
              className="px-lg-4 pt-2 pb-4"
              method="post"
            >
              <div className="mb-3">
                <label htmlFor="uname" className="form-label color-dback ps-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="uname"
                  placeholder="Email address"
                  className="form-control"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
                {sent.sent && (
                  <div className={"py-2 mt-3 alert " + sent.alert}>
                    {sent.msg}
                  </div>
                )}
              </div>
              <div className="footer text-center pt-4">
                <button type="submit" className="btn bg-green text-white">
                  Request password reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
