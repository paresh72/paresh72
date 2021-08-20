import React, { useEffect, useState } from "react";
import CourseService from "../../services/CourseService";
import DescussionCard from "../../components/cards/DiscussionCard";
import jwt_decode from "jwt-decode";
import { useParams } from "react-router-dom";
import { FaPlus, FaTimes } from "react-icons/fa";

export default function Ppts(props) {
  const cid = props.cid;
  const { cname } = useParams();

  const [disc, setDisc] = useState([]);
  const [newdisc, setNewdisc] = useState({
    sname: "",
    cid: "",
    message: "",
    review: "pending",
  });
  const [quebox, setQuebox] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [colors, setColors] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    setNewdisc({ sname: decoded.username, cid: cid });
    if (token) {
      CourseService.getDescussions(cname, token)
        .then((res) => {
          if (res.data.length > 0) {
            setDisc(res.data);
            let tdiscs = res.data;
            let counter = 1;
            let tcolors = {};
            tdiscs.map((item) => {
              if (counter >= 7) {
                counter = 1;
              }
              const tmpsname = item.sname.replace(/ /g, "");
              if (!tcolors[tmpsname]) {
                tcolors[tmpsname] = "clr" + counter;
                counter++;
              }
              item.replies.map((subitem) => {
                const tmpsubname = subitem.sname.replace(/ /g, "");
                if (counter >= 7) {
                  counter = 1;
                }
                if (!tcolors[tmpsubname]) {
                  tcolors[tmpsubname] = "clr" + counter;
                  counter++;
                }
              });
            });
            setColors(tcolors);
          }
        })
        .catch((ex) => console.log(ex));
    } else {
      props.history.push("/login");
    }
  }, [confirm]);

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (newdisc.cid && newdisc.sname && newdisc.message) {
      CourseService.postDescussion(newdisc)
        .then((res) => {
          if (res.data) {
            setConfirm((d) => !d);
            setQuebox(false);
          }
        })
        .catch((ex) => console.log(ex));
    }
  };

  return (
    <>
      <div className="py-2 px-1">
        {quebox ? (
          <div className="discussback">
            <div className="row">
              <div className="col-10 frame">
                <div className="d-flex justify-content-between align-items-center py-3">
                  <h5>Ask Questions</h5>
                  <div
                    className="close"
                    onClick={() => {
                      setNewdisc({ message: "" });
                      setQuebox(false);
                    }}
                  >
                    <FaTimes className="mb-1 me-2" />
                  </div>
                </div>
                <form onSubmit={handleAskQuestion}>
                  <div className="mb-3">
                    <textarea
                      name="message"
                      rows="4"
                      className="form-control"
                      value={newdisc.message}
                      placeholder="Write something here..."
                      onChange={(e) => {
                        setNewdisc((d) => ({ ...d, message: e.target.value }));
                      }}
                      required
                    ></textarea>
                  </div>
                  <div className="d-flex justify-content-end py-2 mb-3">
                    <button
                      className="btn mx-1"
                      onClick={() => {
                        setNewdisc({ message: "" });
                        setQuebox(false);
                      }}
                    >
                      cancel
                    </button>
                    <button
                      type="submit"
                      className="btn bg-green text-white mx-1 rounded-pill"
                    >
                      Ask Question
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}
        <div className="d-flex justify-content-between align-items-center p-0 m-0">
          <h5 className="h5">All Discussions</h5>
          <button
            className="btn bg-green text-white rounded-pill fs-6"
            onClick={() => {
              setQuebox(true);
            }}
          >
            <FaPlus className="mb-1 me-1" /> Ask Question
          </button>
        </div>
        <div className="row m-0 pt-3">
          {disc.map((item, index) => {
            return (
              <DescussionCard
                item={item}
                myname={newdisc.sname}
                setConfirm={setConfirm}
                review="pending"
                colors={colors}
                key={index}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
