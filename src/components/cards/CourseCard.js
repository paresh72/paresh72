import React, { useEffect, useState } from "react";
import CourseService from "../../services/CourseService";

export default function CourseCard(props) {
  const { name, ricon, desc } = props.course;

  const [dcounter, setDcounter] = useState(-1);
  const [vcounter, setVcounter] = useState(-1);

  const goToCourse = () => {
    props.history.push("/course/" + name);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Counting Training plans
      CourseService.getTrainingPlan(name, token)
        .then((res) => {
          if (res.data.length > 0) {
            setDcounter(res.data[res.data.length - 1].tp_day);
          } else {
            setDcounter(0);
          }
        })
        .catch((ex) => console.log(ex));

      // Counting videos
      let counter = 0;
      CourseService.getVideos(name, token)
        .then((res) => {
          if (res.data.length > 0) {
            res.data.map((item) => {
              counter += item.videos.length;
            });
            setVcounter(counter);
          } else {
            setVcounter(0);
          }
        })
        .catch((ex) => console.log(ex));
    }
  }, []);

  return (
    <div className="col">
      <div className="card pt-4 pb-2 px-4" onClick={goToCourse}>
        {ricon}
        <h6 className="card-title color-dgreen pt-3">{name}</h6>
        <div className="text-center w-100 p-0">
          <p
            className="card-text color-dback"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
            }}
          >
            {desc}
          </p>
        </div>
        {vcounter === -1 && dcounter === -1 ? (
          <div className="py-3"></div>
        ) : (
          <div className="d-flex justify-content-between pt-3 footer w-100">
            <p>{vcounter} videos</p>
            <p className="color-green">{dcounter} Days</p>
          </div>
        )}
      </div>
    </div>
  );
}
