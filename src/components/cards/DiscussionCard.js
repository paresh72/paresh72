import React, { useState } from "react";
import { MdSend } from "react-icons/md";
import CourseService from "../../services/CourseService";

export default function CourseCard(props) {
  const { sname, message, _id, replies } = props.item;
  const myname = props.myname;
  const setConfirm = props.setConfirm;
  const review = props.review;
  const colors = props.colors;

  const [toggle, setToggle] = useState(false);
  const [reply, setReply] = useState({
    did: _id,
    sname: myname,
    message: "",
    review: review,
  });

  const handleAddReply = (e) => {
    e.preventDefault();
    console.log(reply);
    if (reply.message && reply.sname) {
      CourseService.postDescussionReply(reply)
        .then((res) => {
          if (res.data.msg) {
            setConfirm((d) => !d);
            setReply((d) => ({ ...d, message: "" }));
          }
        })
        .catch((ex) => console.log(ex));
    }
  };

  return (
    <div className="col-12 py-3 pb-3 border-bottom discussion-card">
      <div className="d-flex">
        <div
          className={
            "d-flex justify-content-center align-items-center text-white fs-5 rounded-circle text-uppercase " +
            colors[sname.replace(/ /g, "")]
          }
          style={{ height: "2.2rem", width: "2.2rem" }}
        >
          {sname.charAt(0)}
        </div>
        <div className="ms-3">
          <h6 className="color-dback mb-0 text-capitalize">{sname}</h6>
          <p className="text-muted m-0" style={{ fontSize: "0.8rem" }}>
            1 months ago
          </p>
        </div>
      </div>
      <div className="color-dback pt-3" style={{ fontSize: "0.9rem" }}>
        {message}
      </div>
      <button
        className="btn btn-link p-0 pt-2 color-dback fw-bold"
        style={{
          fontSize: "0.9rem",
          textDecoration: "none",
          boxShadow: "none",
        }}
        onClick={() => {
          setToggle((e) => !e);
        }}
      >
        {toggle ? (
          <>
            All Replies
            <span className="badge rounded-pill bg-secondary ms-2 p-1 px-2">
              {replies.length}
            </span>
          </>
        ) : replies.length <= 1 ? (
          replies.length + " reply"
        ) : (
          replies.length + " replies"
        )}
      </button>
      {toggle ? (
        <div className="row py-2 ms-4 border-start bg-light">
          <div className="col-12 py-1">
            <form onSubmit={handleAddReply}>
              <div className="input-group">
                <textarea
                  onChange={(e) =>
                    setReply((d) => ({ ...d, message: e.target.value }))
                  }
                  value={reply.message}
                  rows="1"
                  className="form-control border-0 border-2 border-bottom"
                  placeholder="Add a public reply..."
                  style={{
                    fontSize: "0.9rem",
                    background: "none",
                    boxShadow: "none",
                  }}
                ></textarea>
                <button type="submit" className="btn m-0 p-0 mx-2 ms-3">
                  <MdSend className="color-green fs-3 m-0 p-0" />
                </button>
              </div>
            </form>
          </div>
          {replies.map((item, index) => {
            return (
              <div className="col-12 py-3 ps-3 border-bottom" key={index}>
                <div className="d-flex">
                  <div
                    className={
                      "d-flex justify-content-center align-items-center text-white fs-5 rounded-circle text-uppercase " +
                      colors[item.sname.replace(/ /g, "")]
                    }
                    style={{ height: "2.2rem", width: "2.2rem" }}
                  >
                    {item.sname.charAt(0)}
                  </div>
                  <div className="ms-3">
                    <h6 className="color-dback mb-0 text-capitalize">
                      {item.sname}
                    </h6>
                    <p
                      className="text-muted m-0"
                      style={{ fontSize: "0.8rem" }}
                    >
                      1 months ago
                    </p>
                  </div>
                </div>
                <div
                  className="color-dback pt-3"
                  style={{ fontSize: "0.9rem" }}
                >
                  {item.message}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
