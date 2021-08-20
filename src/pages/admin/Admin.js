import React, { useState, useEffect } from "react";
import Dashboard from "../../components/dashboard/Dashboard";
import ManageCourse from "../../components/forms/ManageCourse";
import ManageUser from "../../components/forms/ManageUser";
import ManageTrainingPlan from "../../components/forms/ManageTrainingPlan";
import ManagePpt from "../../components/forms/ManagePpt";
import Managevideo from "../../components/forms/ManageVideo";
import jwt_decode from "jwt-decode";
import LoginService from "../../services/LoginService";
import {
  FaHome,
  FaLaptopCode,
  FaCalendarAlt,
  FaVideo,
  FaFileAlt,
  FaPlusCircle,
  FaEdit,
  FaTrashAlt,
  FaUserFriends,
  FaUserPlus,
} from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import "./admin.scss";

export default function Admin(props) {
  const [renderDashboard, setRenderDashboard] = useState();
  const [selected, setSelected] = useState({ ch: "", op: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      if (decoded) {
        if (decoded.role === "Trainer") {
          LoginService.getUser(token)
            .then((res) => {
              if (!res.data.msg) {
                props.history.push("/");
              } else {
                handleChoice("dashboard", "");
                setSelected({ ch: "dashboard", op: "" });
              }
            })
            .catch((ex) => console.log(ex));
        } else {
          props.history.push("/");
        }
      }
    } else {
      props.history.push("/");
    }
  }, []);

  const handleChoice = (choice, operation) => {
    switch (choice) {
      case "dashboard":
        setRenderDashboard(<Dashboard />);
        break;
      case "user":
        if (operation === "manage") {
          setRenderDashboard(<ManageUser props={props} />);
        }
        break;
      case "course":
        if (operation === "manage") {
          setRenderDashboard(<ManageCourse props={props} />);
        }
        if (operation === "ppt") {
          setRenderDashboard(<ManagePpt props={props} />);
        }
        if (operation === "video") {
          setRenderDashboard(<Managevideo props={props} />);
        }
        if (operation === "tplan") {
          setRenderDashboard(<ManageTrainingPlan props={props} />);
        }
        break;
      default:
    }
  };

  return (
    <>
      <div className="row g-0 dashboard pt-5 h-100">
        <div className="col-lg-2 leftbar py-4">
          <div className="accordion mt-5">
            <button
              className={
                selected.ch === "dashboard"
                  ? "accordion-item w-100 p-3 text-start border-0 bg-green"
                  : "accordion-item w-100 p-3 text-start border-0"
              }
              onClick={() => {
                handleChoice("dashboard", "");
                setSelected({ ch: "dashboard", op: "" });
              }}
            >
              <FaHome className="me-2 fs-5" /> Dashboard
            </button>

            <div className="accordion-item">
              <h6 className="accordion-header">
                <button
                  type="button"
                  className="accordion-button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelZero"
                  aria-expanded="true"
                  aria-controls="panelZero"
                >
                  <FaUserFriends className="me-2 fs-5" /> User
                </button>
              </h6>
              <div className="accordion-collapse collapse" id="panelZero">
                <div className="accordion-body p-0 bg-lblue">
                  <button
                    className={
                      selected.ch === "user" && selected.op === "manage"
                        ? "accordion-item w-100 ps-4 py-2 text-start bg-green"
                        : "accordion-item w-100 ps-4 py-2 text-start"
                    }
                    onClick={() => {
                      handleChoice("user", "manage");
                      setSelected({ ch: "user", op: "manage" });
                    }}
                  >
                    <AiFillSetting className="me-2 fs-5" /> Manage
                  </button>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h6 className="accordion-header">
                <button
                  type="button"
                  className="accordion-button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelOne"
                  aria-expanded="true"
                  aria-controls="panelOne"
                >
                  <FaLaptopCode className="me-2 fs-5" /> courses
                </button>
              </h6>
              <div className="accordion-collapse collapse" id="panelOne">
                <div className="accordion-body p-0 bg-lblue">
                  <button
                    className={
                      selected.ch === "course" && selected.op === "manage"
                        ? "accordion-item w-100 ps-4 py-2 text-start bg-green"
                        : "accordion-item w-100 ps-4 py-2 text-start"
                    }
                    onClick={() => {
                      handleChoice("course", "manage");
                      setSelected({ ch: "course", op: "manage" });
                    }}
                  >
                    <AiFillSetting className="me-2 fs-5" /> Manage
                  </button>

                  <button
                    className={
                      selected.ch === "course" && selected.op === "ppt"
                        ? "accordion-item w-100 ps-4 py-2 text-start bg-green"
                        : "accordion-item w-100 ps-4 py-2 text-start"
                    }
                    onClick={() => {
                      handleChoice("course", "ppt");
                      setSelected({ ch: "course", op: "ppt" });
                    }}
                  >
                    <FaFileAlt className="me-2 fs-5" /> PPTs
                  </button>
                  <button
                    className={
                      selected.ch === "course" && selected.op === "video"
                        ? "accordion-item w-100 ps-4 py-2 text-start bg-green"
                        : "accordion-item w-100 ps-4 py-2 text-start"
                    }
                    onClick={() => {
                      handleChoice("course", "video");
                      setSelected({ ch: "course", op: "video" });
                    }}
                  >
                    <FaVideo className="me-2 fs-5" /> Videos
                  </button>

                  <button
                    className={
                      selected.ch === "course" && selected.op === "tplan"
                        ? "accordion-item w-100 ps-4 py-2 text-start bg-green"
                        : "accordion-item w-100 ps-4 py-2 text-start"
                    }
                    onClick={() => {
                      handleChoice("course", "tplan");
                      setSelected({ ch: "course", op: "tplan" });
                    }}
                  >
                    <FaCalendarAlt className="me-2 fs-5" /> TrainingPlan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-10 rightbar pt-3">{renderDashboard}</div>
      </div>
    </>
  );
}
