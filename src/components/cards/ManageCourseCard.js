import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { BiEdit } from "react-icons/bi";

export default function ManageCourseCard(props) {
  const item = props.item;
  const handleCourseUpdate = props.handleCourseUpdate;
  const setRcourse = props.setRcourse;
  const setConfirmBox2 = props.setConfirmBox2;

  const [edit, setEdit] = useState(false);
  const [upcourse, setUpcourse] = useState({
    name: "",
    type: "",
    desc: "",
  });

  return (
    <div className="col-lg-6">
      <div className="bg-white p-3 rounded citem position-relative">
        {edit ? (
          <div
            className="d-flex justify-content-end m-0 mb-2"
            style={{
              right: "0.6rem",
              top: "0.6rem",
              display: "flex",
            }}
          >
            <button
              className="btn btn-secondary py-1 me-2"
              onClick={() => {
                setEdit(false);
              }}
            >
              cancel
            </button>
            <button
              className="btn btn-success py-1"
              onClick={() => {
                handleCourseUpdate(upcourse);
                setEdit(false);
              }}
            >
              update
            </button>
          </div>
        ) : (
          <div
            className="position-absolute"
            style={{
              right: "0.6rem",
              top: "0.6rem",
              display: "flex",
            }}
          >
            <button
              className="btn btn-warning rounded-pill d-flex justify-content-center align-items-center p-0 me-2 text-white"
              style={{
                height: "1.8rem",
                width: "1.8rem",
              }}
              disabled={edit ? true : false}
              onClick={() => {
                setUpcourse(item);
                setEdit(true);
              }}
            >
              <BiEdit className="fs-6" />
            </button>
            <button
              className="btn btn-danger rounded-pill d-flex justify-content-center align-items-center p-0"
              style={{
                height: "1.8rem",
                width: "1.8rem",
              }}
              onClick={() => {
                setRcourse(item);
                setConfirmBox2(true);
              }}
            >
              <FaTrash className="fs-6" />
            </button>
          </div>
        )}

        <form className="">
          <table className="table table-sm">
            <tbody className="fs-6">
              <tr>
                <td className="fw-bold">Name</td>
                <td>
                  {edit ? (
                    <div className="position-relative">
                      <input
                        type="text"
                        value={upcourse.name}
                        className="form-control"
                        style={
                          upcourse.name
                            ? null
                            : {
                                border: "1px solid #df4957",
                                boxShadow: "0 0 5px #df4957",
                              }
                        }
                        onChange={(e) => {
                          setUpcourse((d) => ({ ...d, name: e.target.value }));
                        }}
                      />
                      {upcourse.name !== "" ? null : (
                        <div
                          className="position-absolute rounded px-2 py-1 text-white mt-1"
                          style={{
                            background: "rgba(220,53,69,.9)",
                            zIndex: "1",
                          }}
                        >
                          Please enter course name
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>{item.name}</p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="fw-bold">Type</td>
                <td>
                  {edit ? (
                    <div className="position-relative">
                      <select
                        className="form-select"
                        value={upcourse.type}
                        style={
                          upcourse.type
                            ? null
                            : {
                                border: "1px solid #df4957",
                                boxShadow: "0 0 5px #df4957",
                              }
                        }
                        onChange={(e) =>
                          setUpcourse((d) => ({ ...d, type: e.target.value }))
                        }
                      >
                        <option value="">select type</option>
                        <option value="Common">Common</option>
                        <option value="FrontEnd">FrontEnd</option>
                        <option value="BackEnd">BackEnd</option>
                      </select>
                      {upcourse.type !== "" ? null : (
                        <div
                          className="position-absolute rounded px-2 py-1 text-white mt-1"
                          style={{
                            background: "rgba(220,53,69,.9)",
                            zIndex: "1",
                          }}
                        >
                          Please enter course type
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>{item.type}</p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="fw-bold">Description</td>
                <td>
                  {edit ? (
                    <div className="position-relative">
                      <textarea
                        value={upcourse.desc}
                        className="form-control"
                        rows="5"
                        style={
                          upcourse.desc
                            ? null
                            : {
                                border: "1px solid #df4957",
                                boxShadow: "0 0 5px #df4957",
                              }
                        }
                        onChange={(e) => {
                          setUpcourse((d) => ({ ...d, desc: e.target.value }));
                        }}
                      ></textarea>
                      {upcourse.desc !== "" ? null : (
                        <div
                          className="position-absolute rounded px-2 py-1 text-white mt-1"
                          style={{
                            background: "rgba(220,53,69,.9)",
                            zIndex: "1",
                          }}
                        >
                          Please enter course description
                        </div>
                      )}
                    </div>
                  ) : (
                    <p
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "3",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {item.desc}
                    </p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <table className="table table-sm table-bordered table-hover mb-0">
          <tbody>
            <tr className="w-100 table-success">
              <td className="fw-bold ps-2">Training Plans</td>
              <td className="text-end pe-2">{item.tplans} days</td>
            </tr>
            <tr className="w-100 table-danger">
              <td className="fw-bold ps-2">Ppts</td>
              <td className="text-end pe-2">{item.ppts} files</td>
            </tr>
            <tr className="w-100 table-warning">
              <td className="fw-bold ps-2">Videos</td>
              <td className="text-end pe-2">{item.videos} files</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
