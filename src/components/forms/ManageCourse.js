import React, { useState, useEffect } from "react";
import CourseService from "../../services/CourseService";
import formloader from "../../images/formloading.gif";
import ManageCourseCard from "../cards/ManageCourseCard";
import {
  FaCheckCircle,
  FaTrash,
  FaTimesCircle,
  FaCloudUploadAlt,
} from "react-icons/fa";
import "./form.scss";

export default function AddTrininigPlan(props) {
  const [course, setCourse] = useState({
    name: "",
    type: "",
    icon: "",
    desc: "",
  });
  const [courses, setCourses] = useState([]);
  const [rcourse, setRcourse] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);
  const [warningBox, setWarningBox] = useState(false);
  const [confirmBox2, setConfirmBox2] = useState(false);
  const [addCourseBox, setAddCourseBox] = useState(false);
  const [validate, setValidate] = useState(false);
  const [msg,setMsg] = useState("")

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      CourseService.getcourse()
        .then(async (res) => {
          if (res.data.length > 0) {
            let allc = res.data;
            for (let i = 0; i < allc.length; i++) {
              // Counting trainingplans
              const tplans = await CourseService.getTrainingPlan(
                allc[i].name,
                token
              );
              allc[i].tplans = tplans.data.length;
              // Counting ppts
              const ppts = await CourseService.getPpts(allc[i].name, token);
              if (ppts.data !== null) {
                allc[i].ppts = ppts.data.ppts.length;
              } else {
                allc[i].ppts = 0;
              }
              //Counting videos
              const videos = await CourseService.getVideos(allc[i].name, token);
              if (videos.data.length > 0) {
                let counter = 0;
                videos.data.map((tp) => {
                  counter += tp.videos.length;
                });
                allc[i].videos = counter;
              } else {
                allc[i].videos = 0;
              }
            }
            setCourses(allc);
          }
          setLoading(false);
        })
        .catch((ex) => console.log(ex));
    }
  }, [confirmBox]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setValidate(true);
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      const { name, type, icon, desc } = course;
      if (name && type && icon && desc) {
        setLoading(true);

        CourseService.postCourse(course, token)
          .then((res) => {
            console.log(res)
            if (res.data.msg) {
              setMsg(res.data.msg)
              setConfirmBox(true);
            }
          })
          .catch((ex) => console.log(ex));

        setAddCourseBox(false);
        setValidate(false);
        setCourse({
          name: "",
          type: "",
          icon: "",
          desc: "",
        });
        document.getElementById("myform").reset();
      }
      setLoading(false);
    }
  };

  const handleCourseUpdate = (upcourse) => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      if (upcourse.name && upcourse.type && upcourse.desc && upcourse._id) {
        setLoading(true);

        console.log(upcourse);

        CourseService.putCourse(upcourse, token)
          .then((res) => {
            if (res.data.msg) {
              setMsg(res.data.msg)
              setConfirmBox(true);
            }
          })
          .catch((ex) => console.log(ex));

        setLoading(false);
      }
    }
  };

  const handleRemoveCourse = async (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      setLoading(true);

      CourseService.removeCourse(rcourse, token)
        .then((res) => {
          if (res.data.msg === "dependencies") {
            setWarningBox(true);
          }
          if (res.data.msg !== "dependencies") {
            setMsg(res.data.msg)
            setConfirmBox(true);
          }
        })
        .catch((ex) => console.log(ex));
      setLoading(false);
    }
  };

  return (
    <>
      <div className="px-3 py-1 border-bottom d-flex justify-content-between align-items-center">
        <nav>
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item active">Courses</li>
          </ol>
        </nav>
        <button
          htmlFor="upppt"
          className="btn bg-green text-white"
          onClick={() => {
            setAddCourseBox(true);
          }}
        >
          <FaCloudUploadAlt className="me-2 fs-5" />
          Add Course
        </button>
      </div>
      <div className="container p-2 px-3">
        {loading && (
          <div className="formloader">
            <div className="row text-center">
              <div className="col-12">
                <img src={formloader} alt="" height="200" />
              </div>
              <div className="col-12 text-white h4">Uploading course...</div>
            </div>
          </div>
        )}
        {confirmBox && (
          <div className="formloader">
            <div className="row text-center">
              <div className="col-6 w-100 confirmbox">
                <div className="alert alert-success">
                  {/* Courses updated successfully.. */}
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

        {warningBox && (
          <div className="formloader">
            <div className="row text-center">
              <div className="col-6 w-100 confirmbox">
                <div className="alert alert-danger">
                  Please first delete all Trainingplans, Videos, Ppts of this
                  course
                </div>
                <button
                  className="btn btn-success"
                  onClick={() => setWarningBox(false)}
                >
                  Ok
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
                  Do you really want to remove course <b>{rcourse.name}</b>
                </div>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setConfirmBox2(false);
                    setRcourse({});
                  }}
                >
                  cancel
                </button>
                <button
                  className="btn btn-success ms-2"
                  onClick={() => {
                    setConfirmBox2(false);
                    handleRemoveCourse();
                  }}
                >
                  remove
                </button>
              </div>
            </div>
          </div>
        )}

        {addCourseBox && (
          <div className="formloader">
            <div className="row">
              <div className="col-6 w-100 confirmbox">
                <form
                  onSubmit={handleAddCourse}
                  className="px-lg-5 py-3"
                  method="post"
                  id="myform"
                >
                  <div className="mb-3 position-relative">
                    <label htmlFor="name" className="form-label">
                      Course name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      value={course.name}
                      style={
                        course.name || !validate
                          ? null
                          : {
                              border: "1px solid #df4957",
                              boxShadow: "0 0 5px #df4957",
                            }
                      }
                      onChange={(e) =>
                        setCourse((d) => ({ ...d, name: e.target.value }))
                      }
                    />
                    {!course.name && validate && (
                      <div
                        className="position-absolute rounded px-2 py-1 text-white mt-1"
                        style={{
                          background: "rgba(220,53,69,.9)",
                          zIndex: "1",
                        }}
                      >
                        Please enter course name
                      </div>
                    )}
                  </div>
                  <div className="mb-3 position-relative">
                    <label htmlFor="type" className="form-label">
                      Select type
                    </label>
                    <select
                      className="form-select"
                      id="type"
                      value={course.type}
                      style={
                        course.type || !validate
                          ? null
                          : {
                              border: "1px solid #df4957",
                              boxShadow: "0 0 5px #df4957",
                            }
                      }
                      onChange={(e) =>
                        setCourse((d) => ({ ...d, type: e.target.value }))
                      }
                    >
                      <option value="">select type</option>
                      <option value="Common">Common</option>
                      <option value="FrontEnd">FrontEnd</option>
                      <option value="BackEnd">BackEnd</option>
                    </select>
                    {!course.type && validate && (
                      <div
                        className="position-absolute rounded px-2 py-1 text-white mt-1"
                        style={{
                          background: "rgba(220,53,69,.9)",
                          zIndex: "1",
                        }}
                      >
                        Please select course type
                      </div>
                    )}
                  </div>
                  <div className="mb-3 position-relative">
                    <label htmlFor="icon" className="form-label">
                      Select icon
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="icon"
                      value={course.icon}
                      style={
                        course.icon || !validate
                          ? null
                          : {
                              border: "1px solid #df4957",
                              boxShadow: "0 0 5px #df4957",
                            }
                      }
                      onChange={(e) =>
                        setCourse((d) => ({ ...d, icon: e.target.value }))
                      }
                    />
                    {!course.icon && validate && (
                      <div
                        className="position-absolute rounded px-2 py-1 text-white mt-1"
                        style={{
                          background: "rgba(220,53,69,.9)",
                          zIndex: "1",
                        }}
                      >
                        Please enter course icon
                      </div>
                    )}
                  </div>
                  <div className="mb-5 position-relative">
                    <label htmlFor="desc" className="form-label">
                      Add description
                    </label>
                    <textarea
                      className="form-control"
                      id="desc"
                      value={course.desc}
                      style={
                        course.desc || !validate
                          ? null
                          : {
                              border: "1px solid #df4957",
                              boxShadow: "0 0 5px #df4957",
                            }
                      }
                      onChange={(e) =>
                        setCourse((d) => ({ ...d, desc: e.target.value }))
                      }
                    ></textarea>
                    {!course.desc && validate && (
                      <div
                        className="position-absolute rounded px-2 py-1 text-white mt-1"
                        style={{
                          background: "rgba(220,53,69,.9)",
                          zIndex: "1",
                        }}
                      >
                        Please enter course description
                      </div>
                    )}
                  </div>
                  <button
                    type="reset"
                    className="btn btn-secondary me-3"
                    onClick={() => {
                      setAddCourseBox(false);
                      setCourse({ name: "", type: "", icon: "", desc: "" });
                      setValidate(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Add Course
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="form px-lg-5">
          <div className="row g-4 listcourses py-4">
            {courses.map((item, index) => {
              return (
                <ManageCourseCard
                  item={item}
                  key={index}
                  handleCourseUpdate={handleCourseUpdate}
                  setRcourse={setRcourse}
                  setConfirmBox2={setConfirmBox2}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// <div className="form px-lg-5">
//   <h5 className="color-dgreen text-uppercase text-center heading py-3">
//     Add Course
//   </h5>
//   <form
//     onSubmit={handleSubmit}
//     className="px-lg-5 py-3"
//     method="post"
//     id="myform"
//   >
//     <div className="mb-3">
//       <label htmlFor="name" className="form-label">
//         Course name
//       </label>
//       <input
//         type="text"
//         name="name"
//         id="name"
//         value={course.name}
//         className="form-control"
//         required
//         onChange={(e) => setCourse((d) => ({ ...d, name: e.target.value }))}
//       />
//     </div>
//     <div className="mb-3">
//       <label htmlFor="type" className="form-label">
//         Select type
//       </label>
//       <select
//         className="form-select"
//         id="type"
//         name="type"
//         required
//         onChange={(e) => setCourse((d) => ({ ...d, type: e.target.value }))}
//       >
//         <option value="">select type</option>
//         <option value="Common">Common</option>
//         <option value="FrontEnd">FrontEnd</option>
//         <option value="BackEnd">BackEnd</option>
//       </select>
//     </div>
//     <div className="mb-3">
//       <label htmlFor="icon" className="form-label">
//         Select icon
//       </label>
//       <input
//         type="text"
//         className="form-control"
//         id="icon"
//         value={course.icon}
//         name="icon"
//         required
//         onChange={(e) => setCourse((d) => ({ ...d, icon: e.target.value }))}
//       />
//     </div>
//     <div className="mb-5">
//       <label htmlFor="desc" className="form-label">
//         Add description
//       </label>
//       <input
//         type="text"
//         className="form-control"
//         id="desc"
//         value={course.desc}
//         name="desc"
//         required
//         onChange={(e) => setCourse((d) => ({ ...d, desc: e.target.value }))}
//       />
//     </div>
//     <button type="submit" className="btn btn-submit">
//       Add Course
//     </button>
//     <button type="reset" className="btn btn-secondary ms-3">
//       Reset
//     </button>
//   </form>
// </div>
