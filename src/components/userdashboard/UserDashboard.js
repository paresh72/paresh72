import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import DashboardCard from "../../components/cards/DashboardCard";
import LoginService from "../../services/LoginService";
import CourseService from "../../services/CourseService";
import jwt_decode from "jwt-decode";
import "./userdashboard.scss";
import {
  FaHtml5,
  FaCss3Alt,
  FaBootstrap,
  FaJs,
  FaAngular,
  FaVuejs,
  FaReact,
  FaNode,
  FaGitAlt,
} from "react-icons/fa";
import { AiOutlineConsoleSql } from "react-icons/ai";
import { SiTypescript, SiDotNet, SiJquery } from "react-icons/si";

export default function Home(props) {
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState({ selected: 1, cname: "" });
  const [dppt, setDppt] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      async function loadFilteredCourses() {
        const res = await LoginService.getSingleUser(decoded.id, token);
        if (res.data) {
          const user = res.data;
          if (user.role !== "Trainer") {
            const fcourses = await CourseService.getCoursesIn({
              courses: user.courses,
            });
            if (fcourses.data) {
              setCourses(fcourses.data);
            } else {
              setCourses([]);
            }
          } else {
            const res = await CourseService.getcourse();
            if (res.data) {
              setCourses(res.data);
            }
          }
        }
      }
      loadFilteredCourses();
    } else {
      CourseService.getcourse()
        .then((res) => {
          if (res.data) {
            setCourses(res.data);
          }
        })
        .catch((ex) => console.log(ex));
    }
  }, []);

  const iconArr = {
    FaHtml5: <FaHtml5 className="clr1" />,
    FaCss3Alt: <FaCss3Alt className="clr2" />,
    FaBootstrap: <FaBootstrap className="clr3" />,
    FaJs: <FaJs className="clr4" />,
    FaAngular: <FaAngular className="clr5" />,
    FaVuejs: <FaVuejs className="clr6" />,
    FaReact: <FaReact className="clr7" />,
    FaNode: <FaNode className="clr8" />,
    AiOutlineConsoleSql: <AiOutlineConsoleSql className="clr9" />,
    SiTypescript: <SiTypescript className="clr10" />,
    SiDotNet: <SiDotNet className="clr11" />,
    SiJquery: <SiJquery className="clr12" />,
    FaGitAlt: <FaGitAlt className="clr1" />,
  };

  return (
    <>
      <div className="px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
        <nav>
          <ol className="breadcrumb mb-0">
            <li
              className={
                page.selected === 1
                  ? "breadcrumb-item active"
                  : "breadcrumb-item text-primary"
              }
              style={{ cursor: page.selected > 1 ? "pointer" : "auto" }}
              onClick={() => {
                setDppt([]);
                setPage({ selected: 1, cname: "" });
              }}
            >
              Courses
            </li>
            <li
              className={
                page.selected === 2 ? "breadcrumb-item active" : "d-none"
              }
            >
              {page.cname + " PPTs"}
            </li>
          </ol>
        </nav>
      </div>

      <section className="container courses">
        <h5 className="choose mt-5 color-dgreen">
          Your Skills
        </h5>
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3 g-lg-5 m-0">
          {courses.map((item, index) => {
            if (item) {
              item.ricon = iconArr[item.icon];
              return (
                <DashboardCard key={index} course={item} history={props.history} />
              );
            }
            return 0;
          })}
        </div>
      </section>
    </>
  );
}
