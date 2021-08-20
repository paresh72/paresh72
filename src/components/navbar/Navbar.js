import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import LoginService from "../../services/LoginService";
import CourseService from "../../services/CourseService";
import { Link, useParams } from "react-router-dom";
import "./navbar.scss";
import { FaBars, FaSignOutAlt, FaUser, FaCaretDown } from "react-icons/fa";

export default function Navbar(props) {
  const { loginStatus, setLoginStatus } = props;
  const [user, setUser] = useState();
  const [courses, setCourses] = useState({
    common: [],
    frontend: [],
    backend: [],
  });
  const [logoutToggle, setLogoutToggle] = useState(false);
  const [snav, setSnav] = useState("home");

  useEffect(() => {
    CourseService.getcourse()
      .then((res) => {
        if (res.data.length > 0) {
          const commons = res.data.filter((item) => item.type === "Common");
          const frontends = res.data.filter((item) => item.type === "FrontEnd");
          const backends = res.data.filter((item) => item.type === "BackEnd");
          setCourses({
            common: commons.map((item) => item.name),
            frontend: frontends.map((item) => item.name),
            backend: backends.map((item) => item.name),
          });
        }
      })
      .catch((ex) => console.log(ex));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      if (decoded) {
        LoginService.getUser(token)
          .then((res) => {
            if (res.data.msg) {
              setUser(decoded);
            } else {
              localStorage.removeItem("token");
              setLoginStatus(false);
              props.history.push("/login");
            }
          })
          .catch((ex) => {
            localStorage.removeItem("token");
            setLoginStatus(false);
            props.history.push("/login");
          });
      }
    }
  }, [loginStatus]);

  const handleLogin = (ch) => {
    if (ch === "login") {
      if (!loginStatus) {
        props.history.push("/login");
      }
    }
    if (ch === "logout") {
      if (loginStatus) {
        localStorage.removeItem("token");
        setLoginStatus(false);
        props.history.push("/login");
      }
    }
  };

  return (
    <div className="navbar navbar-expand-lg border bg-lblue">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src="/radix-logo.png" alt="" height="45" />
          <span className="text-white ms-2 sp1">Radix</span>
          <span className="color-green sp2">Training</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mynav"
          aria-controls="mynav"
          aria-expanded="false"
        >
          <FaBars className="text-white" />
        </button>
        <div
          className="collapse navbar-collapse d-lg-flex justify-content-end align-items-center"
          id="mynav"
        >
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="/"
                onClick={() => {
                  setSnav("home");
                }}
                className={
                  snav === "home" ? "nav-link color-green fw-bold" : "nav-link"
                }
              >
                Home
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="dropCommon"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <b className={snav === "common" ? "color-green" : "fw-normal"}>
                  Common
                </b>
              </a>
              <ul
                className="dropdown-menu bg-background rounded-1"
                aria-labelledby="dropCommon"
              >
                {courses.common.map((item, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        setSnav("common");
                      }}
                    >
                      <Link
                        to={`/course/${item}`}
                        className="dropdown-item color-dback"
                      >
                        {item}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="dropFront"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <b
                  className={snav === "frontend" ? "color-green" : "fw-normal"}
                >
                  FrontEnd
                </b>
              </a>
              <ul
                className="dropdown-menu bg-background rounded-1"
                aria-labelledby="dropFront"
              >
                {courses.frontend.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link
                        to={`/course/${item}`}
                        onClick={() => {
                          setSnav("frontend");
                        }}
                        className="dropdown-item color-dback"
                      >
                        {item}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="dropBack"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <b className={snav === "backend" ? "color-green" : "fw-normal"}>
                  BackEnd
                </b>
              </a>
              <ul
                className="dropdown-menu bg-background rounded-1"
                aria-labelledby="dropBack"
              >
                {courses.backend.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link
                        to={`/course/${item}`}
                        onClick={() => {
                          setSnav("backend");
                        }}
                        className="dropdown-item color-dback"
                      >
                        {item}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            {/* <li className="nav-item">
              <Link
                to="/"
                className={
                  snav === "contact" ? "nav-link color-green" : "nav-link"
                }
                onClick={() => {
                  setSnav("contact");
                }}
              >
                Contact Us
              </Link>
            </li> */}
            <li className="nav-item">
              <button
                className="nav-link login btn"
                id="dropLogin"
                onClick={() => handleLogin("login")}
              >
                {loginStatus ? (
                  <>
                    <div onClick={() => setLogoutToggle((item) => !item)}>
                      <FaUser className="me-1 fs-6" />{" "}
                      <span>{user ? user.username : null}</span>
                      <FaCaretDown />
                    </div>
                    {logoutToggle ? (
                      <div className="logoutdrop py-2 border">
                        <a className="dropdown-item color-dback py-1" href="/dashboard">
                          <FaUser className="me-1" /> Profile
                        </a>
                        <a
                          className="dropdown-item color-dback py-1"
                          onClick={() => handleLogin("logout")}
                        >
                          <FaSignOutAlt className="me-1" /> Logout
                        </a>
                      </div>
                    ) : null}
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
