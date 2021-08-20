import React, { useState, useEffect } from "react";
import CourseService from "../../services/CourseService";
import formloader from "../../images/formloading.gif";
import "./form.scss";
import XLSX from "xlsx";

export default function AddTrininigPlan(props) {
  const [trainingplan, setTrainingplan] = useState({
    cid: "",
    xlsx: "",
  });
  const [cnames, setCnames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmBox, setConfirmBox] = useState(false);

  useEffect(() => {
    CourseService.getcourse()
      .then((res) => {
        if (res.data) {
          setCnames(res.data);
        }
      })
      .catch((ex) => console.log(ex));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      props.props.history.push("/login");
    } else {
      if (trainingplan.cid && trainingplan.xlsx) {
        setLoading(true);

        // set up FileReader
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = async (e) => {
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: "binary", bookVBA: true });
          // get worksheet
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = await XLSX.utils.sheet_to_json(ws);

          // Insert to db
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].tp_onlineref) {
                data[i].tp_onlineref = data[i].tp_onlineref.split("\n");
              }
            }
            try {
              const res = await CourseService.postTplanXlsx(
                trainingplan.cid,
                data,
                token
              );
              if (res.data) {
                setConfirmBox(true);
              }
            } catch (ex) {
              console.log(ex);
            }
          }
        };

        if (rABS) {
          reader.readAsBinaryString(trainingplan.xlsx);
        }

        setTrainingplan({ cid: "", xlsx: "" });
        document.getElementById("myform").reset();
        setLoading(false);
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
              Uploading Training plan...
            </div>
          </div>
        </div>
      )}
      {confirmBox && (
        <div className="formloader">
          <div className="row text-center">
            <div className="col-6 w-100 confirmbox">
              <div className="alert alert-success">
                TrainingPlan created successfully..
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
          Add new Training Plans
        </h5>
        <form
          onSubmit={handleSubmit}
          className="px-lg-5 py-3"
          method="post"
          id="myform"
        >
          <div className="mb-3">
            <label htmlFor="cname" className="form-label">
              Course name
            </label>
            <select
              className="form-select"
              id="cname"
              required
              onChange={(e) =>
                setTrainingplan((d) => ({ ...d, cid: e.target.value }))
              }
            >
              <option value="">select course</option>
              {cnames.map((item, index) => {
                return (
                  <option value={item._id} key={index}>
                    {item.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mb-5">
            <label htmlFor="xlsx" className="form-label">
              Select Xlsx file
            </label>
            <input
              type="file"
              name="xlsx"
              id="xlsx"
              className="form-control"
              required
              onChange={(e) =>
                setTrainingplan((d) => ({ ...d, xlsx: e.target.files[0] }))
              }
            />
          </div>
          <button type="submit" className="btn btn-submit">
            Add Training plan
          </button>
          <button type="reset" className="btn btn-secondary ms-3">
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}
