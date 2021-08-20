import axios from "axios";

// const TUTORIAL_API_COURSE_URL = "http://10.10.10.31:5000/course/";
// const TUTORIAL_API_API_URL = "http://10.10.10.31:5000/api/course/";
const TUTORIAL_API_COURSE_URL = "http://localhost:5000/course/";
const TUTORIAL_API_API_URL = "http://localhost:5000/api/course/";

const CLOUDNARY_IMG_UP =
  "https://api.cloudinary.com/v1_1/tutorialradix/image/upload";
const CLOUDNARY_RAW_UP =
  "https://api.cloudinary.com/v1_1/tutorialradix/raw/upload";

class CourseService {
  getcourse() {
    return axios.get(TUTORIAL_API_COURSE_URL);
  }
  getSingleCourse(name) {
    return axios.get(TUTORIAL_API_COURSE_URL + name);
  }
  getCoursesIn(courses) {
    return axios.post(TUTORIAL_API_COURSE_URL, courses);
  }

  // api: course apis
  // access: private
  postCourse(course, token) {
    return axios.post(TUTORIAL_API_API_URL, course, {
      headers: {
        Authorization: token,
      },
    });
  }
  putCourse(course, token) {
    return axios.put(TUTORIAL_API_API_URL + course._id, course, {
      headers: {
        Authorization: token,
      },
    });
  }
  removeCourse(course, token) {
    return axios.delete(TUTORIAL_API_API_URL + course._id, {
      headers: {
        Authorization: token,
      },
    });
  }

  // api: trainingplan apis
  // access: private
  getTrainingPlan(cname, token) {
    return axios.get(TUTORIAL_API_COURSE_URL + cname + "-training-plan", {
      headers: {
        Authorization: token,
      },
    });
  }
  postTrainingPlan(trainingplan, token) {
    return axios.post(
      TUTORIAL_API_API_URL + trainingplan.cid + "/trainingplan/",
      trainingplan,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
  postTplanXlsx(cid, tplans, token) {
    return axios.post(
      TUTORIAL_API_API_URL + cid + "/trainingplan/xlsx",
      tplans,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
  postTrainingPlanImg(image) {
    return axios.post(CLOUDNARY_IMG_UP, image);
  }
  putTrainingPlan(trainingplan, token) {
    return axios.put(
      TUTORIAL_API_API_URL +
        trainingplan.cid +
        "/trainingplan/" +
        trainingplan._id,
      trainingplan,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
  removeTplan(plan, token) {
    return axios.delete(
      TUTORIAL_API_API_URL + plan.cid + "/trainingplan/" + plan.tp_day,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // api: ppts apis
  // access: private
  getPpts(cname, token) {
    return axios.get(TUTORIAL_API_COURSE_URL + cname + "-ppts", {
      headers: {
        Authorization: token,
      },
    });
  }
  postCourseppt(cppt, token) {
    return axios.post(TUTORIAL_API_API_URL + cppt.id + "/ppt/", cppt, {
      headers: {
        Authorization: token,
      },
    });
  }
  postPpts(ppt) {
    return axios.post(CLOUDNARY_RAW_UP, ppt);
  }
  removePpt(cppt, token) {
    return axios.put(
      TUTORIAL_API_API_URL + cppt.cid + "/ppt/" + cppt._id,
      cppt,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // api: videos apis
  // access: private
  getVideos(cname, token) {
    return axios.get(TUTORIAL_API_COURSE_URL + cname + "-videos", {
      headers: {
        Authorization: token,
      },
    });
  }
  getLocalVideo(vid, token) {
    return axios.get(TUTORIAL_API_COURSE_URL + vid + "-video/local", {
      headers: {
        Authorization: token,
      },
    });
  }
  postCoursevideos(cid, viddata, token) {
    return axios.post(TUTORIAL_API_API_URL + cid + "/video/", viddata, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });
  }
  postVideos(video) {
    return axios.post(CLOUDNARY_RAW_UP, video);
  }
  removeVideo(cvideo, token) {
    console.log(cvideo,cvideo.videos[0].id,token)
    return axios.delete(
      TUTORIAL_API_API_URL + cvideo._id + "/video/" + cvideo.videos[0].id,
      cvideo,
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  // api: discussion apis
  // access: private
  getDescussions(cname, token) {
    return axios.get(TUTORIAL_API_COURSE_URL + cname + "-discussion", {
      headers: {
        Authorization: token,
      },
    });
  }
  getPendingDescussions(cid) {
    return axios.get(TUTORIAL_API_API_URL + cid + "/discussion/pending");
  }
  postDescussion(discuss) {
    return axios.post(
      TUTORIAL_API_API_URL + discuss.cid + "/discussion",
      discuss
    );
  }
  postDescussionReply(reply) {
    return axios.post(
      TUTORIAL_API_API_URL + reply.did + "/discussion/reply",
      reply
    );
  }
}
export default new CourseService();
