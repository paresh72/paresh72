import React, { useState, useEffect } from "react";
import CourseService from "../../services/CourseService";
import formloader from "../../images/formloading.gif";
import {
  FaCheckCircle,
  FaTrash,
  FaTimesCircle,
  FaCloudUploadAlt,
} from "react-icons/fa";
import { MdSelectAll } from "react-icons/md";
import "./form.scss";

export default function AddTrininigPlan(props) {
  const [courseppts, setCourseppts] = useState({
    id: "",
    ppts: [],
  });
  const [page, setPage] = useState({ selected: 1, cname: "" });
  const [dppt, setDppt] = useState([]);
  const [cnames, setCnames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);
  const [msg,setMsg] = useState("")

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
      CourseService.getPpts(cname, token)
        .then((res) => {
          if (res.data) {
            setCourseppts(res.data);
            setPage({ selected: 2, cname: cname });
          } else {
            const course = cnames.find((item) => item.name === cname);
            setCourseppts({
              cid: course._id,
              ppts: [],
            });
            setPage({ selected: 2, cname: cname });
          }
        })
        .catch((ex) => console.log(ex));
    }
  };

  const handlePptcheck = (e, ppt) => {
    const target = e.target;
    if (target.checked) {
      setDppt((d) => [...d, ppt]);
    } else {
      const uppts = dppt.filter((item) => item !== ppt);
      setDppt(uppts);
    }
  };

  const handleUploadPpts = async (e) => {
    let id = courseppts.cid;
    let ppts = e.target.files;
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      if (id && ppts.length > 0) {
        setLoading(true);
        const upCppt = [];

        // Uploading ppts to cloudinary
        for (const ppt of ppts) {
          const formdata = new FormData();
          formdata.append("file", ppt);
          formdata.append("upload_preset", "asjicvxy");
          const result = await CourseService.postPpts(formdata);
          upCppt.push(result.data.url);
        }

        ppts = upCppt;
        try {
          const res = await CourseService.postCourseppt({ id, ppts }, token);
          if (res.data.msg) {
            setConfirmBox(true);
            setMsg(res.data.msg)
          }
        } catch (ex) {
          console.log(ex);
        }
        setLoading(false);
        const course = cnames.find((item) => item._id === id);
        handleCourseChange(course.name);
      }
    }
  };

  const handleDeletePpts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      const { cid } = courseppts;
      if (cid && dppt.length > 0) {
        setLoading(true);
        let upPpt = courseppts;
        const ppts = courseppts.ppts.filter((item) => !dppt.includes(item));
        upPpt.ppts = ppts;
        upPpt.dppts = dppt;
        try {
          const res = await CourseService.removePpt(upPpt, token);
          if (res.data.msg) {
            console.log(res.data)
            setConfirmBox(true);
            setMsg("PPTs deleted successfully..")
          }
        } catch (ex) {
          console.log(ex);
        }
        document.getElementById("myform").reset();
        setCourseppts({
          id: "",
          ppts: [],
        });
        setDppt([]);
        setLoading(false);
        const course = cnames.find((item) => item._id === cid);
        handleCourseChange(course.name);
      }
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
                setDppt([]);
                setPage({ selected: 1, cname: "" });
              }}
            >
              PPTs
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
        <label
          htmlFor="upppt"
          className={
            page.selected === 2
              ? "btn bg-green text-white visible"
              : "btn bg-green text-white invisible"
          }
        >
          <FaCloudUploadAlt className="me-2 fs-5" />
          Upload
        </label>
        <input
          type="file"
          id="upppt"
          className="d-none"
          multiple
          onChange={handleUploadPpts}
        />
      </div>
      <div className="container p-2 px-3">
        {loading && (
          <div className="formloader">
            <div className="row text-center">
              <div className="col-12">
                <img src={formloader} alt="" height="200" />
              </div>
              <div className="col-12 text-white h4">Uploading PPTs...</div>
            </div>
          </div>
        )}
        {confirmBox && (
          <div className="formloader">
            <div className="row text-center">
              <div className="col-6 w-100 confirmbox">
                <div className="alert alert-success">
                  {/* PPTs inserted successfully.. */}
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

        {dppt.length > 0 ? (
          <div className="bg-dark text-white p-2 rounded row selheader">
            <div className="col-auto">
              <div className="count fs-6">
                <FaCheckCircle className="me-2 fs-5" /> {dppt.length} selected
              </div>
            </div>
            <div className="col-auto">
              <button
                className="btn text-white"
                onClick={() => {
                  setDppt(courseppts.ppts);
                }}
              >
                <MdSelectAll className="me-2 fs-5" /> Select All
              </button>
            </div>
            <div className="col-auto">
              <button className="btn text-white" onClick={handleDeletePpts}>
                <FaTrash className="me-2" /> Delete
              </button>
            </div>
            <div className="col-auto">
              <button
                className="btn text-white"
                onClick={() => {
                  setDppt([]);
                }}
              >
                <FaTimesCircle className="me-2" /> Cancel
              </button>
            </div>
          </div>
        ) : null}

        <div className="form px-lg-5 pt-3">
          {page.selected === 2 ? (
            <form className="py-3" method="post" id="myform">
              <div className="row listppts g-4">
                {courseppts.ppts.map((item, index) => {
                  return (
                    <div className="col-lg-4" key={index}>
                      <div className="card rounded">
                        <iframe
                          src={`https://view.officeapps.live.com/op/embed.aspx?src=${item}&embedded=true`}
                          width="100%"
                          height="210"
                        ></iframe>
                        <div className="card-body">
                          <h6 className="card-title color-dgreen">
                            {item.split("/")[8]}
                          </h6>
                        </div>
                        <div className="checkheader">
                          <input
                            type="checkbox"
                            checked={
                              dppt.find((dp) => dp === item) ? true : false
                            }
                            id={"check" + index}
                            className="form-check-input p-2 pptcheck"
                            onChange={(e) => {
                              handlePptcheck(e, item);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </form>
          ) : (
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
          )}
        </div>
      </div>
    </>
  );
}
