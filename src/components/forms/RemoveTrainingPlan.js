import React, { useState, useEffect } from "react";
import CourseService from "../../services/CourseService";
import formloader from "../../images/formloading.gif";
import "./form.scss";
import { FaTimesCircle } from "react-icons/fa";

export default function AddTrininigPlan(props) {
  const [tplans, setTplans] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);
  const [confirmBox2, setConfirmBox2] = useState(false);
  const [rplan, setRplan] = useState({});

  useEffect(() => {
    setLoading(true);
    CourseService.getcourse()
      .then((res) => {
        if (res.data.length > 0) {
          setCourses(res.data);
        }
      })
      .catch((ex) => console.log(ex));

    setLoading(false);
  }, [confirmBox]);

  const handleRemoveTplan = async (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      setLoading(true);
      CourseService.removeTplan(rplan, token)
        .then((res) => {
          if (res.data.msg) {
            setConfirmBox(true);
          }
        })
        .catch((ex) => console.log(ex));
      setRplan({});
      setTplans([]);
      document.getElementById("myform").reset();
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    const token = localStorage.getItem("token");
    CourseService.getTrainingPlan(e.target.value, token)
      .then((res) => {
        if (res.data.length > 0) {
          setTplans(res.data);
        } else {
          setTplans([]);
        }
      })
      .catch((ex) => console.log(ex));
  };

  return (
    <div className="container my-2 bg-white p-4">
      {loading && (
        <div className="formloader">
          <div className="row text-center">
            <div className="col-12">
              <img src={formloader} alt="" height="200" />
            </div>
            <div className="col-12 text-white h4">removing user...</div>
          </div>
        </div>
      )}
      {confirmBox && (
        <div className="formloader">
          <div className="row text-center">
            <div className="col-6 w-100 confirmbox">
              <div className="alert alert-success">
                Traiingplan removed successfully..
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
      {confirmBox2 && (
        <div className="formloader">
          <div className="row text-center">
            <div className="col-6 w-100 confirmbox">
              <div className="alert alert-warning">
                Do you really want to remove <b>{rplan.cname}</b> Training plan
                of day <b>{rplan.tp_day}</b>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setConfirmBox2(false);
                  setRplan({});
                }}
              >
                cancel
              </button>
              <button
                className="btn btn-success ms-2"
                onClick={() => {
                  setConfirmBox2(false);
                  handleRemoveTplan();
                }}
              >
                remove
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="form px-lg-5">
        <h5 className="color-dgreen text-uppercase text-center heading">
          Remove Trainingplan
        </h5>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setConfirmBox2(true);
          }}
          className="px-lg-5 py-3"
          id="myform"
        >
          <div className="mb-3">
            <label htmlFor="cname" className="form-label">
              Course name
            </label>
            <select
              className="form-select"
              id="cname"
              name="cname"
              required
              onChange={handleCourseChange}
            >
              <option value="">select course</option>
              {courses.map((item, index) => {
                return (
                  <option value={item.name} key={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mb-5">
            <label htmlFor="tp_day" className="form-label">
              Select Day
            </label>
            <select
              className="form-select"
              id="tp_day"
              name="tp_day"
              onChange={(e) => {
                const day = Number(e.target.value);
                setRplan({
                  ...tplans.find((item) => item.tp_day === day),
                  cname: document.getElementById("cname").value,
                });
              }}
              disabled={tplans.length > 0 ? false : true}
              required
            >
              <option value="">select day</option>
              {tplans.map((item, index) => {
                return (
                  <option value={item.tp_day} key={index}>
                    {item.tp_day}
                  </option>
                );
              })}
            </select>
          </div>
          <button type="submit" className="btn btn-submit">
            Remove Plan
          </button>
          <button type="reset" className="btn btn-secondary ms-3">
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}
