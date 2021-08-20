import React from "react";
import { BsCheckCircle } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";

export default function Trainingplan(props) {
  const {
    tp_day,
    tp_whattolearn,
    tp_practiceimgarr,
    tp_practice,
    tp_assignmentimgarr,
    tp_assignment,
    tp_onlineref,
    tp_note,
  } = props.plan;

  return (
    <>
      <h5 className="text-center color-dgreen day py-2">Day {tp_day}</h5>
      <h6 className="color-dgreen wtl">What to learn</h6>
      <ul className="wtllist mb-4">
        {tp_whattolearn
          ? tp_whattolearn.map((item, index) => {
              return (
                <li className="py-1" key={index}>
                  <BsCheckCircle className="fs-5 me-2 color-green" />
                  {item}
                </li>
              );
            })
          : null}
      </ul>

      <h6 className="color-dgreen wtl">Practice Exercise</h6>
      {tp_practiceimgarr.length > 0 ? (
        <div className="m-0 d-inline-block">
          {tp_practiceimgarr.map((item, index) => {
            return (
              <img
                src={item}
                alt=""
                key={index}
                className="m-1"
                style={{ cursor: "pointer", maxWidth: "100%" }}
              />
            );
          })}
        </div>
      ) : null}

      <ul className="wtllist mb-4">
        {tp_practice
          ? tp_practice.map((item, index) => {
              return (
                <li className="py-1 ps-1" key={index}>
                  <FaCircle className="fs-6 me-2 p-1" />
                  {item}
                </li>
              );
            })
          : null}
      </ul>
      <h6 className="color-dgreen wtl">Assignment</h6>
      {tp_assignmentimgarr.length > 0 ? (
        <div className="m-0 d-inline-block">
          {tp_assignmentimgarr.map((item, index) => {
            return (
              <img
                src={item}
                alt=""
                key="index"
                className="m-1"
                style={{ cursor: "pointer", maxWidth: "100%" }}
              />
            );
          })}
        </div>
      ) : null}

      <ul className="wtllist mb-4">
        {tp_assignment
          ? tp_assignment.map((item, index) => {
              return (
                <li className="py-1 ps-1" key={index}>
                  <FaCircle className="fs-6 me-2 p-1" />
                  {item}
                </li>
              );
            })
          : null}
      </ul>
      {tp_onlineref.length > 0 ? (
        <>
          <h6 className="color-dgreen wtl">Online Reference</h6>
          <ul className="wtllist mb-4">
            {tp_onlineref.map((item, index) => {
              return (
                <li className="py-1 ps-1" key={index}>
                  <a
                    href={item}
                    target="_blank"
                    className="d-block"
                    style={{
                      width: "100%",
                      display: "block",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                    }}
                  >
                    {item}
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      ) : null}
      {tp_note ? (
        <div className="alert alert-warning">
          <b>Note :</b>
          {tp_note}
        </div>
      ) : null}
    </>
  );
}
