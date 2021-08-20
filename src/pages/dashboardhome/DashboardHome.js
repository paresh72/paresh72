import React, { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import DashboardCard from "../../components/cards/DashboardCard";
import LoginService from "../../services/LoginService";
import CourseService from "../../services/CourseService";
import jwt_decode from "jwt-decode";
import "./dashboardhome.scss";
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
      <Header text="courses" />
      <section className="container courses">
        <h4 className="choose text-center mt-5 color-dgreen">
          Choose your course
        </h4>
        <p className="text-center fs-sm color-dback chooseinfo ps-lg-5 pe-lg-5 ms-lg-5 me-lg-5">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officiis
          accusamus asperiores atque, eum voluptate quia? Perferendis hic quia,
          assumenda explicabo sapiente ipsa dolores dolorum provident maiores
        </p>
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
