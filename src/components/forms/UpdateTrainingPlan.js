import React, { useState, useEffect } from "react";
import CourseService from "../../services/CourseService";
import formloader from "../../images/formloading.gif";
import "./form.scss";

export default function AddTrininigPlan(props) {
  const [upTplan, setUpTplan] = useState({
    cid: "",
    tp_day: "",
    tp_whattolearn: "",
    tp_practice: "",
    tp_assignment: "",
    tp_onlineref: "",
    tp_note: "",
    tp_practiceimgarr: [],
    tp_assignmentimgarr: [],
  });
  const [cnames, setCnames] = useState([]);
  const [tplans, setTplans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);
  const [validate, setValidate] = useState(false);

  useEffect(() => {
    CourseService.getcourse()
      .then((res) => {
        if (res.data) {
          setCnames(res.data);
        }
      })
      .catch((ex) => console.log(ex));
  }, []);

  const handleCourseChange = async (cname) => {
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      const res = await CourseService.getTrainingPlan(cname, token);
      const plans = res.data;
      if (plans.length > 0) {
        setTplans(plans);
      }
    }
  };

  const handleDayChange = async (day) => {
    const cplan = tplans.find((i) => i.tp_day === Number(day));
    console.log(cplan);
    if (cplan) {
      setUpTplan(cplan);
    }
  };

  const handleUpdate = async (e) => {
    const { cid, tp_day, tp_practiceimgarr, tp_assignmentimgarr } = upTplan;
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      setValidate(true);
      if (cid && tp_day) {
        setLoading(true);
        const upPImgArr = [];
        const upAImgArr = [];
        // Uploading practiceImgArr to cloudinary
        if (tp_practiceimgarr.length > 0) {
          for (const pimg of tp_practiceimgarr) {
            const formdata = new FormData();
            formdata.append("file", pimg);
            formdata.append("upload_preset", "pkzhallh");
            const result = await CourseService.postTrainingPlanImg(formdata);
            upPImgArr.push(result.data.url);
          }
        }

        // Uploading assignmentImgArr to cloudinary
        if (tp_assignmentimgarr.length > 0) {
          for (const aimg of tp_assignmentimgarr) {
            const formdata = new FormData();
            formdata.append("file", aimg);
            formdata.append("upload_preset", "pkzhallh");
            const result = await CourseService.postTrainingPlanImg(formdata);
            upAImgArr.push(result.data.url);
          }
        }

        upTplan.tp_practiceimgarr = upPImgArr;
        upTplan.tp_assignmentimgarr = upAImgArr;
        upTplan.tp_onlineref = upTplan.tp_onlineref
          .toString()
          .replace(/,/g, "")
          .split("\n");
        try {
          const res = await CourseService.putTrainingPlan(upTplan, token);
          if (res.data) {
            console.log(res.data);
            setConfirmBox(true);
          }
        } catch (ex) {
          console.log(ex);
        }
        document.getElementById("myform").reset();
        setLoading(false);
        setValidate(false);
        setUpTplan({
          cid: "",
          tp_day: "",
          tp_whattolearn: "",
          tp_practice: "",
          tp_assignment: "",
          tp_onlineref: "",
          tp_note: "",
          tp_practiceimgarr: [],
          tp_assignmentimgarr: [],
        });
      }
    }
  };

  return (
    <div className="container my-2 bg-white p-4">
      {loading && (
        <div className="formloader">
          <div className="row text-center">
            <div className="col-12">
              <img src={formloader} alt="" height="200" />
            </div>
            <div className="col-12 text-white h4">
              Updating Training plan...
            </div>
          </div>
        </div>
      )}
      {confirmBox && (
        <div className="formloader">
          <div className="row text-center">
            <div className="col-6 w-100 confirmbox">
              <div className="alert alert-success">
                TrainingPlan updated successfully..
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
      <div className="form px-lg-5">
        <h5 className="color-dgreen text-uppercase text-center heading">
          Update Training Plan
        </h5>
        <form
          onSubmit={handleUpdate}
          className="px-lg-5 py-3"
          method="post"
          id="myform"
        >
          <div className="row mb-3">
            <div className="col position-relative">
              <label htmlFor="cname" className="form-label">
                Course name
              </label>
              <select
                className={
                  upTplan.cid || !validate
                    ? "form-select"
                    : "form-select border-danger"
                }
                id="cname"
                name="cname"
                onChange={(e) => {
                  handleCourseChange(e.target.value);
                }}
              >
                <option value="">select course</option>
                {cnames.map((item, index) => {
                  return (
                    <option value={item.name} key={index}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              {!upTplan.cid && validate && (
                <div className="position-absolute rounded px-2 py-1 text-white mt-1 invalidate">
                  Please select course
                </div>
              )}
            </div>
            <div className="col position-relative">
              <label htmlFor="tp_day" className="form-label">
                Training plan day
              </label>
              <select
                className={
                  upTplan.tp_day || !validate
                    ? "form-select"
                    : "form-select border-danger"
                }
                id="tp_day"
                name="tp_day"
                onChange={(e) => {
                  handleDayChange(e.target.value);
                }}
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
              {!upTplan.tp_day && validate && (
                <div className="position-absolute rounded px-2 py-1 text-white mt-1 invalidate">
                  Please enter plan day
                </div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="tp_wtl" className="form-label">
              What to learn
            </label>
            <textarea
              id="tp_wtl"
              rows="5"
              className="form-control"
              name="tp_whattolearn"
              value={upTplan.tp_whattolearn}
              onChange={(e) =>
                setUpTplan((d) => ({
                  ...d,
                  tp_whattolearn: e.target.value,
                }))
              }
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="tp_practice" className="form-label">
              Practice
            </label>
            <textarea
              id="tp_practice"
              rows="5"
              className="form-control"
              name="tp_practice"
              value={upTplan.tp_practice}
              onChange={(e) =>
                setUpTplan((d) => ({
                  ...d,
                  tp_practice: e.target.value,
                }))
              }
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="tp_assignment" className="form-label">
              Assignment
            </label>
            <textarea
              id="tp_assignment"
              rows="4"
              className="form-control"
              name="tp_assignment"
              value={upTplan.tp_assignment}
              onChange={(e) =>
                setUpTplan((d) => ({
                  ...d,
                  tp_assignment: e.target.value,
                }))
              }
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="tp_onlineref" className="form-label">
              Online references
            </label>
            <textarea
              id="tp_onlineref"
              rows="3"
              className="form-control"
              name="tp_onlineref"
              value={upTplan.tp_onlineref}
              onChange={(e) =>
                setUpTplan((d) => ({
                  ...d,
                  tp_onlineref: e.target.value,
                }))
              }
            ></textarea>
          </div>
          <div className="mb-3">
            <label htmlFor="tp_practiceimgarr" className="form-label">
              Practice reference images
            </label>
            <input
              type="file"
              id="tp_practiceimgarr"
              className="form-control"
              name="tp_practiceimgarr"
              multiple
              onChange={(e) =>
                setUpTplan((d) => ({
                  ...d,
                  tp_practiceimgarr: e.target.files,
                }))
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tp_assignmentimgarr" className="form-label">
              Assignment reference images
            </label>
            <input
              type="file"
              id="tp_assignmentimgarr"
              className="form-control"
              name="tp_assignmentimgarr"
              multiple
              onChange={(e) =>
                setUpTplan((d) => ({
                  ...d,
                  tp_assignmentimgarr: e.target.files,
                }))
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tp_note" className="form-label">
              Note
            </label>
            <textarea
              id="tp_note"
              rows="3"
              className="form-control"
              name="tp_note"
              value={upTplan.tp_note}
              onChange={(e) =>
                setUpTplan((d) => ({
                  ...d,
                  tp_note: e.target.value,
                }))
              }
            ></textarea>
          </div>
          <button type="submit" className="btn btn-submit">
            Update Training plan
          </button>
          <button
            type="reset"
            className="btn btn-secondary ms-3"
            onClick={() => {
              setValidate(false);
              setUpTplan({
                cid: "",
                tp_day: "",
                tp_whattolearn: "",
                tp_practice: "",
                tp_assignment: "",
                tp_onlineref: "",
                tp_note: "",
                tp_practiceimgarr: [],
                tp_assignmentimgarr: [],
              });
            }}
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}
