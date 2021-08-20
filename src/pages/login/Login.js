import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import LoginService from "../../services/LoginService";
import Header from "../../components/header/Header";
import "./login.scss";

export default function Login(props) {
  const { setLoginStatus } = props;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidmsg, setInvalidmsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      props.history.push("/");
    }
  }, []);

  const validate = () => {
    if (email && password) {
      if (email.length > 3 && password.length > 3) {
      }
    }
    return false;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("");
    }
    LoginService.postLogin({ email, password })
      .then((res) => {
        console.log(res)
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          setLoginStatus(true);
          const decoded = jwt_decode(res.data.token);
          if (decoded) {
            if (decoded.role === "Trainer") {
              props.history.push("/admin");
              return;
            }
          }
          props.history.push("/");
          setInvalidmsg("");
        } else {
          setInvalidmsg("Invalid username or password");
        }
      })
      .catch((ex) => console.log(ex));
  };

  return (
    <>
      <Header text="Login" />
      <section className="container login">
        <div className="row m-0 py-5">
          <div className="col-lg-6 mx-auto bg-white py-5 formcard">
            <h2 className="text-center heading">Login</h2>
            <p className="text-center py-1">
              <span className="color-green"> Welcome! </span> please login with
              your credentials
            </p>
            <form onSubmit={handleLogin} className="px-lg-4 py-4" method="post">
              <div className="mb-3">
                {invalidmsg !== "" ? (
                  <div className="alert alert-danger">{invalidmsg}</div>
                ) : null}
                <label htmlFor="uname" className="form-label color-dback">
                  Username
                </label>
                <input
                  type="email"
                  name="email"
                  id="uname"
                  placeholder="Username"
                  className="form-control"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="upass" className="form-label color-dback">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="upass"
                  placeholder="Password"
                  className="form-control"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  autoComplete="false"
                  required
                />
              </div>
              <div className="row px-3 mb-3">
                <div className="col form-check">
                  <input
                    type="checkbox"
                    id="cremember"
                    placeholder="Password"
                    className="form-check-input"
                  />
                  <label
                    htmlFor="cremember"
                    className="form-check-label color-dback"
                  >
                    Remember me
                  </label>
                </div>
                <div className="col d-flex justify-content-end">
                  <Link to="/forgot-password" className="color-dback">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="footer text-center pt-4">
                <button type="submit" className="btn bg-green text-white">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
