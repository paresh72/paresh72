import React, { useEffect, useState } from "react";
import CourseService from "../../services/CourseService";
import { useParams } from "react-router-dom";
import { FaPlay, FaTimes } from "react-icons/fa";

export default function Videos(props) {
  const { cname } = useParams();

  const [videos, setVideos] = useState([]);
  const [playvideo, setPlayvideo] = useState();
  const [played, setPlayed] = useState();
  const { getVideoDurationInSeconds } = require('get-video-duration')
  const progress = document.getElementById("progress");
  const [currentplayTime,setplayTime] = useState(0);
  const [currentstopTime,setstopTime] = useState(0);

  // const fs = require('fs')
  // var v = document.getElementById("video");
  // console.log(v.currentTime)
// const timer = document.getElementById("timer");
// button = document.getElementById("play");

// function progressLoop() {
//   setInterval(function () {
//     progress.value = Math.round((video.currentTime / video.duration) * 100);
//     timer.innerHTML = Math.round(video.currentTime) + " seconds";
//   });
// }

// function playPause() {
//   if (video.paused) {
//     video.play();
//     button.innerHTML = "&#10073;&#10073;";
//   } else {
//     video.pause();
//     button.innerHTML = "►";
//   }
// }

// button.addEventListener("click", playPause);
// video.addEventListener("play", progressLoop);

  useEffect(() => {
    const token = localStorage.getItem("token");
    CourseService.getVideos(cname, token)
      .then((res) => {
        if (res.data.length > 0) {
          setVideos(res.data);
        }
      })
      .catch((ex) => console.log(ex));
  }, []);

  const handlePlayVideo = (url) => {
    // setPlayvideo(url);
    const vid = url;
    const token = localStorage.getItem("token");

    CourseService.getLocalVideo(vid, token)
      .then((res) => {
        if (res) {
          setPlayvideo(url);
          // console.log(url.durationTime)
        }
      })
      .catch((ex) => console.log(ex));
  };
  const handleplay =() => {
    const date = new Date().getSeconds()
    if(currentplayTime === 0){
      setplayTime(date)
      console.log(date)      
    }
    else{
      setplayTime(date + currentplayTime)
      console.log(date)
    }
  }
  const handlepause =() => {
    const date = new Date().getSeconds()
    if(currentstopTime === 0){
      setstopTime(date)
      console.log(date)      
    }
    else{
      const datee  = date  + currentstopTime
      setstopTime(date + currentstopTime)
      console.log(date)
    }
  }
  // console.log((((currentstopTime-currentplayTime)*100)/60 ))

  return (
    <>
      {playvideo ? (
        <div className="playvideo">
          <div className="row">
            <div className="col-10 frame">
              <div
                className="close"
                onClick={() => {
                  setPlayed(playvideo);
                  setPlayvideo(null);
                  console.log(Math.ceil(((currentstopTime-currentplayTime)*100)/60))
                  setplayTime(0)
                  setstopTime(0)
                }}
              >
                <FaTimes />
              </div>
              <figure>
                <video id= "video"
                  src={
                    "http://10.10.10.31:5000/course/" + playvideo + "-video/local"
                  }
                  className="my-2"
                  controls
                  onPlay={handleplay}
                  onPause={handlepause}
                ></video>
                  {/* <figcaption>
                    <label id="timer" for="progress" role="timer"></label>
                    <button id="play"  aria-label="Play" role="button">►</button>
                  </figcaption> */}
              </figure>
            </div>
          </div>
        </div>
      ) : null}
      <div className="accordian" id="accordionVideos">
        {videos.map((item, index) => {
          return (
            <div className="accordion-item border-0 mb-2" key={item._id}>
              <h2 className="accordion-header">
                <button
                  className="accordion-button h5 color-dgreen"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={"#myacc" + index}
                  aria-expanded="true"
                  aria-controls={"myacc" + index}
                >
                  {item.topic}
                </button>
              </h2>
              <div
                id={"myacc" + index}
                className={
                  index === 0
                    ? "accordion-collapse collapse show"
                    : "accordion-collapse collapse"
                }
                data-bs-parent="#accordionVideos"
              >
                <div className="accordion-body">
                  {item.videos.map((vid, index) => {
                    return (
                      <div
                        className="row mb-3"
                        key={index}
                        onClick={(e) => {
                          handlePlayVideo(vid);
                          setPlayed(vid);
                        }}
                      >
                        <div className="col-2 d-flex justify-content-center align-items-center color-green ms-3 playbtn">
                          <FaPlay className="fs-6" />
                        </div>
                        <div className="col d-flex align-items-center color-dback">
                          <h6
                            className={
                              played === vid
                                ? "m-0 color-green"
                                : "m-0 color-dback"
                            }
                            style={{ cursor: "pointer" }}
                          >
                            {
                              vid.replace(vid.split("-")[0] + "-", "")
                              // vid.split("/")[8].split(".")[0]
                            }
                          </h6>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
