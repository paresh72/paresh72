import React, { useState, useEffect } from "react";
import LoginService from "../../services/LoginService";
import CourseService from "../../services/CourseService";
import { useParams } from "react-router-dom";
import Header from "../../components/header/Header";
import "./course.scss";
import formloader from "../../images/formloading.gif";
import TrainingPlan from "../../components/coursedatails/Trainingplan";
import Videos from "../../components/coursedatails/Videos";
import Ppts from "../../components/coursedatails/Ppts";
import Discussions from "../../components/coursedatails/Discussions";
import { FaChevronRight, FaChevronLeft, FaPlay } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import jwt_decode from "jwt-decode";

export default function Course(props) {
  const setLoginStatus = props.setLoginStatus;

  let { cname } = useParams();

  const [course, setCourse] = useState({});
  const [tplans, setTplans] = useState([]);
  const [cplan, setCplan] = useState({
    _id: "",
    cid: "",
    tp_day: "",
    tp_whattolearn: [],
    tp_practice: [],
    tp_assignment: [],
    tp_onlineref: [],
    tp_note: "",
    tp_practiceimgarr: [],
    tp_assignmentimgarr: [],
  });
  const [pageno, setPageno] = useState(1);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({ selected: "", choice: "" });
  const [vidcount, setVidcount] = useState(0);
  const [playvideo, setPlayvideo] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    if (!token) {
      localStorage.removeItem("token");
      props.history.push("/login");
      setLoginStatus(false);
    } else {
      let tmpcid = "";
      // Checking if user enrolled for this course
      const decoded = jwt_decode(token);
      CourseService.getSingleCourse(cname)
        .then((res) => {
          if (res.data) {
            tmpcid = res.data._id;
            setCourse(res.data);
          }
        })
        .catch((ex) => console.log(ex));
      LoginService.getSingleUser(decoded.id, token)
        .then((res) => {
          if (res.data) {
            const user = res.data;
            if (user.role !== "Trainer") {
              const courses = user.courses;
              const temp = courses.find((item) => item === tmpcid);
              if (!temp) {
                props.history.push("/");
              }
            }
          } else {
            props.history.push("/");
          }
        })
        .catch((ex) => console.log(ex));
      // end checking

      CourseService.getTrainingPlan(cname, token)
        .then((res) => {
          if (res.data.length > 0) {
            const plans = res.data;
            setTplans(plans);
            const plan = {
              ...plans[0],
              tp_whattolearn: plans[0].tp_whattolearn
                ? plans[0].tp_whattolearn.split("\n")
                : plans[0].tp_whattolearn,
              tp_practice: plans[0].tp_practice
                ? plans[0].tp_practice.split("\n")
                : plans[0].tp_practice,
              tp_assignment: plans[0].tp_assignment
                ? plans[0].tp_assignment.split("\n")
                : plans[0].tp_assignment,
            };
            setCplan(plan);
            setDetails({
              selected: <TrainingPlan plan={plan} />,
              choice: "tplan",
            });
          } else {
            setTplans([]);
            setCplan({
              _id: "",
              cid: "",
              tp_day: "",
              tp_whattolearn: [],
              tp_practice: [],
              tp_assignment: [],
              tp_onlineref: [],
              tp_note: "",
              tp_practiceimgarr: [],
              tp_assignmentimgarr: [],
            });
            setDetails({});
          }
        })
        .catch((ex) => {
          setLoginStatus(false);
          localStorage.removeItem("token");
          props.history.push("/login");
        });

      let counter = 0;
      CourseService.getVideos(cname, token)
        .then((res) => {
          if (res.data.length > 0) {
            setPlayvideo(res.data[0].videos[0]);
            res.data.map((item) => {
              item.videos.map((i) => {
                counter++;
              });
            });
            setVidcount(counter);
          }
        })
        .catch((ex) => console.log(ex));
    }
    setLoading(false);
  }, [cname]);

  const handlePlanChange = (id) => {
    setLoading(true);
    const plan = tplans.find((item) => item._id === id);
    const changeplan = {
      ...plan,
      tp_whattolearn: plan.tp_whattolearn
        ? plan.tp_whattolearn.split("\n")
        : plan.tp_whattolearn,
      tp_practice: plan.tp_practice
        ? plan.tp_practice.split("\n")
        : plan.tp_practice,
      tp_assignment: plan.tp_assignment
        ? plan.tp_assignment.split("\n")
        : plan.tp_assignment,
    };
    setCplan(changeplan);
    setDetails({
      selected: <TrainingPlan plan={changeplan} />,
      choice: "tplan",
    });
    setPageno(plan.tp_day);
    setLoading(false);
  };

  const handlePlanNextPrev = (ch) => {
    setLoading(true);
    let spage;
    if (ch === "next") {
      spage = cplan.tp_day + 1;
    }
    if (ch === "prev") {
      spage = cplan.tp_day - 1;
    }
    setPageno(spage);
    const plan = tplans.find((item) => item.tp_day === spage);
    const changeplan = {
      ...plan,
      tp_whattolearn: plan.tp_whattolearn.split("\n"),
      tp_practice: plan.tp_practice.split("\n"),
      tp_assignment: plan.tp_assignment.split("\n"),
    };
    setCplan(changeplan);
    setDetails({
      selected: <TrainingPlan plan={changeplan} />,
      choice: "tplan",
    });
    setLoading(false);
  };

  const handleDatailChange = (ch) => {
    switch (ch) {
      case "tplan":
        setDetails({
          selected: <TrainingPlan plan={cplan} />,
          choice: ch,
        });
        break;
      case "videos":
        setDetails({ selected: <Videos />, choice: ch });
        break;
      case "ppts":
        setDetails({ selected: <Ppts />, choice: ch });
        break;
      case "discussion":
        setDetails({
          selected: <Discussions cid={course._id} />,
          choice: ch,
        });
        break;
      default:
    }
  };

  return (
    <>
      {loading && (
        <div className="formloader">
          <div className="row text-center">
            <div className="col-12">
              <img src={formloader} alt="" height="200" />
            </div>
            <div className="col-12 text-white h4">loading...</div>
          </div>
        </div>
      )}
      <Header text="Course Details" />
      <div className="container course">
        <h4 className="pt-5 px-3">{cname} Tutorials and Training Plan</h4>
        <div className="row py-4 m-0">
          <div className="col-lg-9 leftbar">
            <nav className="mb-3">
              <ul className="pagination row g-0">
                <li className="col-lg-3 page-item">
                  <button
                    className={
                      details.choice === "tplan"
                        ? "page-link w-100 text-uppercase active"
                        : "page-link w-100 text-uppercase"
                    }
                    onClick={() => {
                      handleDatailChange("tplan");
                    }}
                  >
                    Training Plan
                  </button>
                </li>
                <li className="col-lg-3 page-item">
                  <button
                    className={
                      details.choice === "videos"
                        ? "page-link w-100 text-uppercase active"
                        : "page-link w-100 text-uppercase "
                    }
                    onClick={() => {
                      handleDatailChange("videos");
                    }}
                  >
                    Videos
                  </button>
                </li>
                <li className="col-lg-3 page-item">
                  <button
                    className={
                      details.choice === "ppts"
                        ? "page-link w-100 text-uppercase active"
                        : "page-link w-100 text-uppercase"
                    }
                    onClick={() => {
                      handleDatailChange("ppts");
                    }}
                  >
                    {cname} PPTs
                  </button>
                </li>
                <li className="col-lg-3 page-item">
                  <button
                    className={
                      details.choice === "discussion"
                        ? "page-link w-100 text-uppercase active"
                        : "page-link w-100 text-uppercase"
                    }
                    onClick={() => {
                      handleDatailChange("discussion");
                    }}
                  >
                    Discussions
                  </button>
                </li>
              </ul>
            </nav>
            {/* Loading all details change */}
            <div className="dataframe bg-white p-3">
              {details.choice === "tplan" ? (
                <div
                  className="position-absolute fs-6 border rounded ps-2 pe-1 py-1 bg-dark text-white text-center"
                  style={{
                    right: "1rem",
                    top: "1rem",
                    letterSpacing: "0.2rem",
                  }}
                >
                  {cplan.tp_day}/{tplans.length}
                </div>
              ) : null}
              {details.selected}
            </div>
          </div>

          <div className="col-lg-3 rightbar mt-3 mt-lg-0">
            <div className="card h-100 pb-3">
              <figure className="p-1 d-flex justify-content-center align-items-center">
                <button
                  id="playbtn"
                  className="btn rounded-pill mb-4"
                  onClick={() => {
                    const dvid = document.getElementById("displayvid");
                    dvid.play();
                  }}
                >
                  <FaPlay className="text-center" />
                </button>
                <video
                  id="displayvid"
                  className="w-100"
                  src={
                    "http://10.10.10.31:5000/course/" + playvideo + "-video/local"
                  }
                  controls
                  onPlay={() => {
                    const playbtn = document.getElementById("playbtn");
                    playbtn.style.display = "none";
                  }}
                  onPause={() => {
                    const playbtn = document.getElementById("playbtn");
                    playbtn.style.display = "block";
                  }}
                ></video>
              </figure>

              <h4 className="text-center py-2 fw-bold text-uppercase">html</h4>
              <p className="d-flex align-items-center justify-content-center color-dback">
                <BiTimeFive className="mx-1" /> {vidcount} videos to watch
              </p>
              <div className="px-3">
                <p className="color-dback py-2" style={{ fontSize: "0.9rem" }}>
                  {course.desc}
                </p>
                <button
                  className="btn bg-green text-white w-100 rounded-pill"
                  style={{ boxShadow: "0 0 10px #554a4a33" }}
                  onClick={() => {
                    setDetails({
                      selected: <Videos />,
                      choice: "videos",
                    });
                  }}
                >
                  Get started
                </button>
              </div>
            </div>
          </div>

          {tplans.length > 0 ? (
            <div className="col-lg-9">
              {details.choice === "tplan" ? (
                <nav className="mt-4 p-0 pagefooter">
                  <ul className="pagination row g-1" id="pageno">
                    <li className="page-item col-auto">
                      <button
                        className="btn page-link px-3 py-2"
                        disabled={pageno === 1 ? true : false}
                        onClick={() => {
                          handlePlanNextPrev("prev");
                        }}
                      >
                        <FaChevronLeft className="text-muted" />
                      </button>
                    </li>
                    {tplans.map((item) => {
                      return (
                        <li className="page-item col-auto" key={item._id}>
                          <button
                            className={
                              pageno === item.tp_day
                                ? "page-link px-3 py-2 active"
                                : "page-link px-3 py-2"
                            }
                            onClick={() => {
                              handlePlanChange(item._id);
                            }}
                          >
                            {item.tp_day}
                          </button>
                        </li>
                      );
                    })}
                    <li className="page-item col-auto">
                      <button
                        className="btn page-link px-3 py-2"
                        disabled={pageno === tplans.length ? true : false}
                        onClick={async () => {
                          handlePlanNextPrev("next");
                        }}
                      >
                        <FaChevronRight className="text-muted" />
                      </button>
                    </li>
                  </ul>
                </nav>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
