import React, { useState, useEffect } from "react";
import CourseService from "../../services/CourseService";
import DiscussionCard from "../cards/DiscussionCard";
import jwt_decode from "jwt-decode";
import { MdSend } from "react-icons/md";
import "./dashboard.scss";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [cdiscount, setCdisccount] = useState({});
  const [discussions, setDiscussions] = useState([]);
  const [myname, setMyname] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [chatselected, setChatselected] = useState({});
  const [colors, setColors] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    setMyname(decoded.username);
    CourseService.getcourse()
      .then((res) => {
        if (res.data.length > 0) {
          setCourses(res.data);
          const tcourses = res.data;
          tcourses.map(async (item) => {
            const disc = await CourseService.getPendingDescussions(item._id);
            setCdisccount((d) => ({ ...d, [item.name]: disc.data.length }));
          });
          setChatselected(tcourses[0].name);
          handleShowDiscussion(tcourses[0]);
        }
      })
      .catch((ex) => console.log(ex));
  }, [confirm]);

  const handleShowDiscussion = (course) => {
    setChatselected(course);
    const token = localStorage.getItem("token");
    CourseService.getDescussions(course.name, token)
      .then((res) => {
        if (res.data.length > 0) {
          setDiscussions(res.data);
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
        } else {
          setDiscussions([]);
        }
        let chatscroll = document.getElementById("chatscroll");
        chatscroll.scrollTop =
          chatscroll.scrollHeight - chatscroll.clientHeight;
      })
      .catch((ex) => console.log(ex));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message !== "" && myname && chatselected) {
      const newDisc = {
        sname: myname,
        cid: chatselected._id,
        message: message,
        review: "reviewed",
      };
      CourseService.postDescussion(newDisc)
        .then((res) => {
          if (res.data) {
            setConfirm((d) => !d);
          }
        })
        .catch((ex) => console.log(ex));
    }
  };

  return (
    <div className="dashboard">
      <section className="p-2 mb-4">
        <div className="container">
          <div className="row my-2 rounded chatbox g-0">
            <div className="col-lg-3 border-end">
              {courses.map((item, index) => {
                return (
                  <div className="row border-bottom course m-0" key={index}>
                    <div
                      className={
                        chatselected.name === item.name
                          ? "d-flex justify-content-between align-items-center bg-chat p-3 course"
                          : "d-flex justify-content-between align-items-center bg-white p-3 course"
                      }
                      onClick={() => {
                        handleShowDiscussion(item);
                      }}
                    >
                      {item.name}
                      {cdiscount[item.name] >= 1 ? (
                        <span className="badge rounded-circle bg-danger p-2 fw-normal">
                          {" "}
                          {cdiscount[item.name]}
                        </span>
                      ) : (
                        <span className="badge rounded-circle bg-rough p-2 fw-normal">
                          {cdiscount[item.name]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="col-lg-9">
              <div className="chats" id="chatscroll">
                {discussions.map((item, index) => {
                  return (
                    <div
                      className={
                        item.review === "pending" ? "bg-pending px-3" : "px-3"
                      }
                      key={index}
                    >
                      <DiscussionCard
                        item={item}
                        myname={myname}
                        setConfirm={setConfirm}
                        review="reviewed"
                        colors={colors}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="footer-chats px-3">
                <form onSubmit={handleSendMessage}>
                  <div className="input-group py-2">
                    <textarea
                      rows="1"
                      className="form-control border-0 border-2 border-bottom"
                      placeholder="Add a public comment..."
                      style={{
                        fontSize: "0.9rem",
                        background: "none",
                        boxShadow: "none",
                      }}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                    ></textarea>
                    <button type="submit" className="btn">
                      <MdSend className="color-green fs-3" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
