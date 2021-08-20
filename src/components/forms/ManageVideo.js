import React, { useState, useEffect } from "react";
import CourseService from "../../services/CourseService";
import formloader from "../../images/formloading.gif";
import {
  FaCheckCircle,
  FaTrash,
  FaTimesCircle,
  FaArrowLeft,
  FaCloudUploadAlt,
  FaPlay,
} from "react-icons/fa";
import { MdSelectAll } from "react-icons/md";
import "./form.scss";

// import { storage } from "../../firebase/config";

export default function AddTrininigPlan(props) {
  const [coursevideos, setCoursevideos] = useState([]);
  const [cvids, setCvids] = useState({
    cid: "",
    topic: "",
    videos: [],
  });
  const [uvids, setUvids] = useState({ topic: "", videos: [] });
  const [page, setPage] = useState({ selected: 1, cname: "" });
  const [dvids, setDvids] = useState([]);
  const [tnames, setTnames] = useState([]);
  const [cnames, setCnames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);
  const [addvideoBox, setAddvideoBox] = useState(false);

  useEffect(() => {
    CourseService.getcourse()
      .then((res) => {
        if (res.data) {
          setCnames(res.data);
        }
      })
      .catch((ex) => console.log(ex));
  }, []);

  const handleCourseChange = (cname) => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      CourseService.getVideos(cname, token)
        .then((res) => {
          if (res.data) {
            console.log(res.data[0].videos[1] === "cvids1629194666674-Screenshot (1).png")
            setCoursevideos(res.data);
            setTnames(res.data.map((item) => item.topic));
            setPage({ selected: 2, cname: cname });
          } else {
            const course = cnames.find((item) => item.name === cname);
            setCoursevideos([]);
            setPage({ selected: 2, cname: cname });
          }
        })
        .catch((ex) => console.log(ex));
    }
  };

  const handleTopicChange = (tname) => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      const vids = coursevideos.find((item) => item.topic === tname);
      setCvids(vids);
      setPage((d) => ({ selected: 3, cname: d.cname, topic: tname }));
    }
  };

  const handleVidcheck = (e, vid) => {
    const target = e.target;
    console.log(vid.id)
    if (target.checked) {
      setDvids((d) => [...d, vid]);
    } else {
      const uvids = dvids.filter((item) => item !== vid);
      setDvids(uvids);
    }
  };

  const handleUploadVids = async (param) => {
    const course = cnames.find((item) => item.name === page.cname);
    const id = course._id;
    let { videos, topic } = param;
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      if (id && videos.length > 0 && topic) {
        setAddvideoBox(false);
        setLoading(true);

        const formdata = new FormData();
        formdata.append("topic", topic);
        for (const item of videos) {
          formdata.append("cvids", item);
        }
        try {
          CourseService.postCoursevideos(id, formdata, token).then((res) => {
            if (res.data) {
              setConfirmBox(true);
              handleCourseChange(course.name);
              setUvids({ topic: "", videos: "" });
              setLoading(false);
              // handleTopicChange(topic);
            }
          });
        } catch (ex) {
          console.log(ex);
        }
        // const upCvideos = [];
        // Uploading videos to cloudinary
        // for (const video of videos) {
        //   const formdata = new FormData();
        //   formdata.append("file", video);
        //   formdata.append("upload_preset", "so9pztoe");
        //   const result = await CourseService.postVideos(formdata);
        //   upCvideos.push(result.data.url);
        // }
      }
    }
  };

  const handleRemoveVids = async () => {
    if (cvids.topic && dvids.length > 0) {
      setLoading(true);
      const token = localStorage.getItem("token");
      let upVideo = cvids;
      const videos = cvids.videos.filter((item) => !dvids.includes(item));
      upVideo.videos = videos;
      upVideo.dvideos = dvids;
      console.log(upVideo)
      try {
        const res = await CourseService.removeVideo(upVideo,token);
        console.log(res.data.msg)
        if (res.data.msg) {
          setConfirmBox(true);
        }
      } catch (ex) {
        console.log(ex);
      }
      setDvids([]);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="px-3 py-1 border-bottom d-flex justify-content-between align-items-center">
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
                setDvids([]);
                setPage((d) => ({ selected: 1, cname: "" }));
              }}
            >
              Videos
            </li>
            <li
              className={
                page.selected >= 2
                  ? page.selected === 2
                    ? "breadcrumb-item active d-block"
                    : "breadcrumb-item text-primary d-block"
                  : "d-none"
              }
              style={{ cursor: page.selected > 2 ? "pointer" : "auto" }}
              onClick={() => {
                setDvids([]);
                setPage((d) => ({ selected: 2, cname: d.cname }));
              }}
            >
              {page.cname}
            </li>
            <li
              className={
                page.selected === 3
                  ? "breadcrumb-item active d-block"
                  : "breadcrumb-item d-none"
              }
            >
              {page.topic + " Videos"}
            </li>
          </ol>
        </nav>
        <label
          htmlFor={page.selected === 3 ? "uvids" : "abc"}
          className={
            page.selected >= 2
              ? "btn bg-green text-white visible"
              : "btn bg-green text-white invisible"
          }
          onClick={
            page.selected === 2
              ? () => {
                  setAddvideoBox(true);
                }
              : () => {}
          }
        >
          <FaCloudUploadAlt className="me-2 fs-5" />
          Upload
        </label>
        <input
          type="file"
          id="uvids"
          className="d-none"
          multiple
          onChange={(e) => {
            handleUploadVids({ topic: cvids.topic, videos: e.target.files });
            e.target.value = null;
          }}
        />
      </div>
      <div className="container p-2 px-3">
        {loading && (
          <div className="formloader">
            <div className="row text-center">
              <div className="col-12">
                <img src={formloader} alt="" height="200" />
              </div>
              <div className="col-12 text-white h4">Uploading Videos...</div>
            </div>
          </div>
        )}
        {confirmBox && (
          <div className="formloader">
            <div className="row text-center">
              <div className="col-6 w-100 confirmbox">
                <div className="alert alert-success">
                  Videos inserted successfully..
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

        {addvideoBox && (
          <div className="formloader">
            <div className="row text-center">
              <div className="col-6 w-100 confirmbox">
                <form className="px-lg-5 pt-3" id="myform">
                  <div className="mb-3">
                    <label htmlFor="topic" className="form-label">
                      Enter topic
                    </label>
                    <input
                      type="text"
                      name="topic"
                      id="topic"
                      className="form-control"
                      required
                      onChange={(e) =>
                        setUvids((d) => ({
                          ...d,
                          topic: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="ppts" className="form-label">
                      Select videos
                    </label>
                    <input
                      type="file"
                      id="videos"
                      className="form-control"
                      required
                      multiple
                      onChange={(e) =>
                        setUvids((d) => ({
                          ...d,
                          videos: e.target.files,
                        }))
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-secondary mt-5 me-3"
                      onClick={() => {
                        setAddvideoBox(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn bg-green text-white mt-5"
                      onClick={() => {
                        handleUploadVids(uvids);
                      }}
                    >
                      Upload
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {dvids.length > 0 ? (
          <div className="bg-dark text-white p-2 rounded row selheader">
            <div className="col-auto">
              <div className="count fs-6">
                <FaCheckCircle className="me-2 fs-5" /> {dvids.length} selected
              </div>
            </div>
            <div className="col-auto">
              <button
                className="btn text-white"
                onClick={() => {
                  setDvids(
                    coursevideos.find((item) => item.topic === cvids.topic)
                      .videos
                  );
                }}
              >
                <MdSelectAll className="me-2 fs-5" /> Select All
              </button>
            </div>
            <div className="col-auto">
              <button className="btn text-white" onClick={handleRemoveVids}>
                <FaTrash className="me-2" /> Delete
              </button>
            </div>
            <div className="col-auto">
              <button
                className="btn text-white"
                onClick={() => {
                  setDvids([]);
                }}
              >
                <FaTimesCircle className="me-2" /> Cancel
              </button>
            </div>
          </div>
        ) : null}

        <div className="form px-lg-5 pt-3">
          {page.selected === 1 ? (
            <div className="row g-4 listcourses py-4">
              {cnames.map((item, index) => {
                return (
                  <div key={index} className="col-lg-4">
                    <div
                      className="bg-white p-3 rounded citem"
                      onClick={() => {
                        handleCourseChange(item.name);
                      }}
                    >
                      {item.name}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {page.selected === 2 ? (
            <div className="row g-4 listcourses py-4">
              {tnames.map((item, index) => {
                return (
                  <div key={index} className="col-lg-4">
                    <div
                      className="bg-white p-3 rounded citem"
                      onClick={() => {
                        handleTopicChange(item);
                      }}
                    >
                      {item}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {page.selected === 3 ? (
            <form className="py-3" method="post" id="myform">
              <div className="row listppts g-4">
                {cvids.videos.map((item, index) => {
                  console.log(item);
                  return (
                    <div className="col-lg-4" key={index}>
                      <div className="card rounded">
                        <figure className="p-1 d-flex justify-content-center align-items-center">
                          <button
                            type="button"
                            id={"playbtn" + index}
                            className="btn rounded-pill mb-4"
                            onClick={() => {
                              const dvid = document.getElementById(
                                "displayvid" + index
                              );
                              dvid.play();
                            }}
                            style={{
                              position: "absolute",
                              zIndex: "1",
                              height: "2.5rem",
                              width: "2.5rem",
                              textAlign: "center",
                              backgroundColor: "#ffffff",
                              boxShadow: "0 0 6px #554a4a91",
                            }}
                          >
                            <FaPlay className="text-center color-green" />
                          </button>
                          <video
                            id={"displayvid" + index}
                            className="w-100"
                            src={
                              "http://10.10.10.31:5000/course/" +
                              item +
                              "-video/local"
                            }
                            controls
                            onPlay={() => {
                              const playbtn = document.getElementById(
                                "playbtn" + index
                              );
                              playbtn.style.display = "none";
                            }}
                            onPause={() => {
                              const playbtn = document.getElementById(
                                "playbtn" + index
                              );
                              playbtn.style.display = "block";
                            }}
                          ></video>
                        </figure>

                        <div className="card-body pt-0">
                          <h6 className="card-title color-dgreen">
                            {item.replace(item.split("-")[0] + "-", "")}
                          </h6>
                        </div>
                        <div className="checkheader">
                          <input
                            type="checkbox"
                            checked={
                              dvids.find((dp) => dp === item) ? true : false
                            }
                            id={"check" + index}
                            className="form-check-input p-2 pptcheck"
                            onChange={(e) => {
                              handleVidcheck(e, item);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </>
  );
}

// <form
//   onSubmit={handleSubmit}
//   className="px-lg-5 py-3"
//   method="post"
//   id="myform"
// >
//   <div className="mb-3">
//     <label htmlFor="cname" className="form-label">
//       Course name
//     </label>
//     <select
//       className="form-select"
//       id="cname"
//       name="cname"
//       required
//       onChange={(e) => setCoursevideos((d) => ({ ...d, id: e.target.value }))}
//     >
//       <option value="">select course</option>
//       {cnames.map((item, index) => {
//         return (
//           <option value={item._id} key={index}>
//             {item.name}
//           </option>
//         );
//       })}
//     </select>
//   </div>
//   <div className="mb-3">
//     <label htmlFor="topic" className="form-label">
//       Enter topic
//     </label>
//     <input
//       type="text"
//       name="topic"
//       id="topic"
//       className="form-control"
//       required
//       onChange={(e) =>
//         setCoursevideos((d) => ({ ...d, topic: e.target.value }))
//       }
//     />
//   </div>
//   <div className="mb-5">
//     <label htmlFor="ppts" className="form-label">
//       Select videos
//     </label>
//     <input
//       type="file"
//       name="videos"
//       id="videos"
//       className="form-control"
//       required
//       multiple
//       onChange={(e) =>
//         setCoursevideos((d) => ({ ...d, videos: e.target.files }))
//       }
//     />
//   </div>
//   <button type="submit" className="btn btn-submit">
//     Add Videos
//   </button>
//   <button type="reset" className="btn btn-secondary ms-3">
//     Reset
//   </button>
// </form>;
