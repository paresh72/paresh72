import React, { useState, useEffect } from "react";
import LoginService from "../../services/LoginService";
import CourseService from "../../services/CourseService";
import formloader from "../../images/formloading.gif";
import "./form.scss";
import randomCrypto from "crypto-random-string";
import {
  FaSyncAlt,
  FaCloudUploadAlt,
  FaTimes,
  FaUserPlus,
} from "react-icons/fa";

export default function AddTrininigPlan(props) {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    status: "offline",
    trainer: "",
    courses: [],
  });
  const [users, setUsers] = useState([]);
  const [upUser, setUpUser] = useState({});
  const [ruser, setRuser] = useState({});
  const [randomPassword, setRandomPassword] = useState(
    randomCrypto({ length: 10, type: "alphanumeric" })
  );
  const [trainers, setTrainers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);
  const [confirmBox2, setConfirmBox2] = useState(false);
  const [page, setPage] = useState({ selected: 1 });
  const [msg,setMsg] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      setLoading(true);
      LoginService.getTrainers(token)
        .then((res) => {
          if (res.data.length > 0) {
            setUsers(res.data);
          }
        })
        .catch((ex) => console.log(ex));
      setLoading(false);
    }
  }, [confirmBox]);

  const handleSubmit = async (e) => {
    const { username, email, password, role, status, trainer, courses } = user;
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      if (username && email && password && role && status) {
        setLoading(true);
        if (role === "Student") {
          if (trainer && courses.length > 0) {
            LoginService.postUser(user, token)
              .then((res) => {
                if (res.data) {
                  setMsg(res.data.msg)
                  setConfirmBox(true);
                }
              })
              .catch((ex) => console.log(ex));
          }
        }
        if (role === "Trainer") {
          LoginService.postUser(
            { username, email, password, role, status },
            token
          )
            .then((res) => {
              if (res.data) {
                setMsg(res.data.msg)
                setConfirmBox(true);
              }
            })
            .catch((ex) => console.log(ex));
        }

        setUser({
          username: "",
          email: "",
          password: "",
          role: "",
          status: "offline",
          trainer: "",
        });
        document.getElementById("myform").reset();
        setLoading(false);
      }
    }
  };

  const handleUpdateUser = async (e) => {
    const { _id, username, email, password, role, status, trainer, courses } =
      upUser;
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      if (_id && username && email && role && status) {
        setLoading(true);
        if (role === "Student") {
          if (trainer && courses.length > 0) {
            LoginService.putUser(upUser, token)
              .then((res) => {
                if (res.data) {
                  setMsg(res.data.msg)
                  setConfirmBox(true);
                }
              })
              .catch((ex) => console.log(ex));
          }
        }
        if (role === "Trainer") {
          LoginService.putUser(upUser, token)
            .then((res) => {
              if (res.data) {
                setMsg(res.data.msg)
                setConfirmBox(true);
              }
            })
            .catch((ex) => console.log(ex));
        }
        document.getElementById("myform").reset();
        setLoading(false);
      }
    }
  };

  const handleRemoveUser = async (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      setLoading(true);
      LoginService.deleteUser(ruser, token)
        .then((res) => {
          if (res.data.msg) {
            setMsg(res.data.msg)
            setConfirmBox(true);    
          }
        })
        .catch((ex) => console.log(ex));
      setLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      if (e.target.value === "Student") {
        LoginService.getTrainers(token)
          .then((res) => {
            if (res.data.length > 0) {
              const users = res.data.filter((item) => item.role === "Trainer");
              setTrainers(users);
            }
          })
          .catch((ex) => console.log(ex));

        CourseService.getcourse()
          .then((res) => {
            if (res.data.length > 0) {
              setCourses(res.data);
            }
          })
          .catch((ex) => console.log(ex));
      }
      setLoading(false);
    }
  };

  const handleCheckChange = (e, id) => {
    const target = e.target;
    let ccourses = user.courses;

    if (target.checked) {
      ccourses.push(id);
      setUser((e) => ({ ...e, courses: ccourses }));
    } else {
      ccourses = ccourses.filter((item) => item !== id);
      setUser((e) => ({ ...e, courses: ccourses }));
    }
  };

  const handleUpCheckChange = (e, id) => {
    const target = e.target;
    let ccourses = upUser.courses;

    if (target.checked) {
      ccourses.push(id);
      setUpUser((e) => ({ ...e, courses: ccourses }));
    } else {
      ccourses = ccourses.filter((item) => item !== id);
      setUpUser((e) => ({ ...e, courses: ccourses }));
    }
  };

  return (
    <>
      <div className="px-3 py-1 border-bottom d-flex justify-content-between align-items-center">
        <nav>
          <ol className="breadcrumb mb-0 py-2">
            <li
              className={
                page.selected === 1
                  ? "breadcrumb-item active"
                  : "breadcrumb-item text-primary"
              }
              style={{ cursor: page.selected > 1 ? "pointer" : "auto" }}
              onClick={() => {
                setPage({ selected: 1 });
              }}
            >
              Users
            </li>
            {page.selected === 2 ? (
              <li
                className={
                  page.selected === 2 ? "breadcrumb-item active" : "d-none"
                }
              >
                Add user
              </li>
            ) : null}
            {page.selected === 3 ? (
              <li
                className={
                  page.selected === 3 ? "breadcrumb-item active" : "d-none"
                }
              >
                Update user
              </li>
            ) : null}
          </ol>
        </nav>
      </div>

      <div className="container p-2 px-3">
        {loading && (
          <div className="formloader">
            <div className="row text-center">
              <div className="col-12">
                <img src={formloader} alt="" height="200" />
              </div>
              <div className="col-12 text-white h4">Uploading user...</div>
            </div>
          </div>
        )}
        {confirmBox && (
          <div className="formloader">
            <div className="row text-center">
              <div className="col-6 w-100 confirmbox">
                <div className="alert alert-success">
                  {/* User inserted successfully.. */}
                  {msg}
                </div>
                <button
                  className="btn btn-success"
                  onClick={() => setConfirmBox(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
        {confirmBox2 && (
          <div className="formloader">
            <div className="row text-center">
              <div className="col-6 w-100 confirmbox">
                <div className="alert alert-warning">
                  Do you really want to remove user <b>{ruser.username}</b>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setConfirmBox2(false);
                    setRuser({});
                  }}
                >
                  cancel
                </button>
                <button
                  className="btn btn-success ms-2"
                  onClick={() => {
                    setConfirmBox2(false);
                    handleRemoveUser();
                  }}
                >
                  remove
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="form px-lg-5">
          {page.selected === 1 && (
            <div className="row g-4 listcourses py-4">
              <div className="col-lg-4">
                <div
                  className="bg-white p-3 rounded citem h-100 d-flex justify-content-center align-items-center color-dback"
                  onClick={() => {
                    setPage({ selected: 2 });
                  }}
                >
                  <FaUserPlus className="display-5" />
                  <span className="fs-4 px-2">Add New User</span>
                </div>
              </div>
              {users.map((item, index) => {
                return (
                  <div className="col-lg-4">
                    <div
                      className="bg-white p-3 rounded citem position-relative"
                      // onClick={() => {
                      //   setPage({ selected: 3 });
                      //   setUpUser(item);
                      //   handleRoleChange({ target: { value: item.role } });
                      // }}
                    >
                      <button
                        className="position-absolute rounded-pill d-flex justify-content-center align-items-center btn btn-danger p-0"
                        style={{
                          top: "0.5rem",
                          right: "0.6rem",
                          height: "1.5em",
                          width: "1.5rem",
                        }}
                        onClick={() => {
                          setPage({ selected: 1 })
                          setRuser(item);
                          setConfirmBox2(true);
                        }}
                      >
                        <FaTimes />
                      </button>
                      <div className="row"
                        onClick={() => {
                          setPage({ selected: 3 });
                          setUpUser(item);
                          handleRoleChange({ target: { value: item.role } });
                        }}
                      >
                        <div className="col-3">
                          <div
                            className={
                              "rounded-pill d-flex justify-content-center align-items-center text-capitalize text-white clr" +
                              (Math.floor(Math.random() * 7) + 1)
                            }
                            style={{
                              height: "3rem",
                              width: "3rem",
                              fontSize: "1.6rem",
                            }}
      
                          >
                            {item.username.charAt(0)}
                          </div>
                        </div>
                        <div className="col-9">
                          <h5 className="text-capitalize mb-0">
                            {item.username}
                          </h5>
                          <p className="text-muted pt-1 m-0">{item.email}</p>
                          <p className="text-muted py-1 m-0 fw-bold">
                            {item.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {page.selected === 2 && (
            <div className="bg-white m-0 px-3">
              <form
                onSubmit={handleSubmit}
                className="px-lg-5 py-5"
                method="post"
                id="myform"
              >
                <div className="row mb-3">
                  <div className="col-lg mb-3 mb-lg-0">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={user.username}
                      className="form-control"
                      required
                      onChange={(e) =>
                        setUser((d) => ({ ...d, username: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={user.email}
                      className="form-control"
                      required
                      onChange={(e) =>
                        setUser((d) => ({ ...d, email: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-lg">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={user.password}
                      className="form-control"
                      required
                      onChange={(e) =>
                        setUser((d) => ({ ...d, password: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="password" className="form-label">
                      Random Password
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        value={randomPassword}
                        className="form-control"
                        disabled
                      />
                      <span
                        className="input-group-text btn bg-green text-white"
                        id="basic-addon2"
                        onClick={() => {
                          setRandomPassword(
                            randomCrypto({ length: 10, type: "alphanumeric" })
                          );
                        }}
                      >
                        <FaSyncAlt />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Select role
                  </label>
                  <select
                    className="form-select"
                    id="role"
                    name="role"
                    required
                    onChange={(e) => {
                      setUser((d) => ({ ...d, role: e.target.value }));
                      handleRoleChange(e);
                    }}
                  >
                    <option value="">select role</option>
                    <option value="Student">Student</option>
                    <option value="Trainer">Trainer</option>
                  </select>
                </div>
                {user.role === "Student" ? (
                  <div className="mb-3">
                    <label htmlFor="trainer" className="form-label">
                      Select Trainer
                    </label>
                    <select
                      className="form-select"
                      id="trainer"
                      name="trainer"
                      required
                      onChange={(e) =>
                        setUser((d) => ({ ...d, trainer: e.target.value }))
                      }
                    >
                      <option value="">select trainer</option>
                      {trainers.map((item, index) => {
                        return (
                          <option value={item._id} key={index}>
                            {item.username}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ) : null}
                {user.role === "Student" ? (
                  <div className="mb-3">
                    <label htmlFor="trainer" className="form-label">
                      Select Courses
                    </label>
                    <div className="p-2 border rounded">
                      {courses.map((item, index) => {
                        return (
                          <div
                            className="form-check form-check-inline my-1 mx-2"
                            key={index}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`checkbox${index}`}
                              onChange={(e) => {
                                handleCheckChange(e, item._id);
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`checkbox${index}`}
                            >
                              {item.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
                <button type="submit" className="btn btn-submit mt-4">
                  Add User
                </button>
                <button
                  type="reset"
                  className="btn btn-secondary ms-3 mt-4"
                  onClick={() => {
                    setUser({
                      username: "",
                      email: "",
                      password: "",
                      role: "",
                      status: "offline",
                      trainer: "",
                      courses: [],
                    });
                  }}
                >
                  Reset
                </button>
              </form>
            </div>
          )}

          {page.selected === 3 && (
            <div className="bg-white m-0 px-3">
              <form
                onSubmit={handleUpdateUser}
                className="px-lg-5 py-5"
                method="post"
                id="myform"
              >
                <div className="row mb-3">
                  <div className="col-lg mb-3 mb-lg-0">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={upUser.username}
                      className="form-control"
                      required
                      onChange={(e) =>
                        setUpUser((d) => ({ ...d, username: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-lg">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={upUser.email}
                      className="form-control"
                      required
                      onChange={(e) =>
                        setUpUser((d) => ({ ...d, email: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    User role
                  </label>
                  <select className="form-select" disabled="true">
                    <option value="">{upUser.role}</option>
                  </select>
                </div>
                {upUser.role === "Student" ? (
                  <div className="mb-3">
                    <label htmlFor="trainer" className="form-label">
                      Select Trainer
                    </label>
                    <select
                      className="form-select"
                      id="trainer"
                      name="trainer"
                      value={upUser.trainer}
                      required
                      onChange={(e) =>
                        setUpUser((d) => ({ ...d, trainer: e.target.value }))
                      }
                    >
                      <option value="">select trainer</option>
                      {trainers.map((item, index) => {
                        return (
                          <option value={item._id} key={index}>
                            {item.username}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                ) : null}
                {upUser.role === "Student" ? (
                  <div className="mb-3">
                    <label htmlFor="trainer" className="form-label">
                      Select Courses
                    </label>
                    <div className="p-2 border rounded">
                      {courses.map((item, index) => {
                        return (
                          <div
                            className="form-check form-check-inline my-1 mx-2"
                            key={index}
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`checkbox${index}`}
                              checked={
                                upUser.courses.find((f) => f === item._id)
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                handleUpCheckChange(e, item._id);
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`checkbox${index}`}
                            >
                              {item.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
                <button type="submit" className="btn btn-submit mt-4">
                  Update User
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
