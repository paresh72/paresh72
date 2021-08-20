import React, { useEffect, useState } from "react";
import CourseService from "../../services/CourseService";
import { useParams } from "react-router-dom";

export default function Ppts(props) {
  const { cname } = useParams();
  const [ppts, setPpts] = useState({ ppts: [] });

  useEffect(() => {
    const token = localStorage.getItem("token");
    CourseService.getPpts(cname, token)
      .then((res) => {
        if (res.data) {
          setPpts(res.data);
        }
      })
      .catch((ex) => console.log(ex));
  }, []);

  return (
    <>
      <div className="row g-5 ppts py-3 px-2">
        {ppts.ppts.map((item, index) => {
          return (
            <div className="col-lg-6 ppt" key={index}>
              <div className="card overflow-hidden rounded">
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${item}&embedded=true`}
                  width="100%"
                  height="260"
                  frameBorder="0"
                ></iframe>
                <div className="card-body">
                  <h5 className="card-title color-dgreen">
                    Lesson {index + 1}
                  </h5>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
