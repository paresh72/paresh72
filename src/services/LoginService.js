import axios from "axios";

// const TUTORIAL_API_LOGIN_URL = "http://10.10.10.31:5000/";
// const TUTORIAL_API_API_USER = "http://10.10.10.31:5000/api/user/";
const TUTORIAL_API_LOGIN_URL = "http://localhost:5000/";
const TUTORIAL_API_API_USER = "http://localhost:5000/api/user/";


class LoginService {
  postLogin(credentials) {
    return axios.post(TUTORIAL_API_LOGIN_URL, credentials);
  }

  getTrainers(token) {
    return axios.get(TUTORIAL_API_API_USER, {
      headers: {
        Authorization: token,
      },
    });
  }

  getUser(token) {
    return axios.get(TUTORIAL_API_LOGIN_URL, {
      headers: {
        Authorization: token,
      },
    });
  }
  getSingleUser(id, token) {
    return axios.get(TUTORIAL_API_API_USER + id, {
      headers: {
        Authorization: token,
      },
    });
  }
  postUser(user, token) {
    return axios.post(TUTORIAL_API_API_USER, user, {
      headers: {
        Authorization: token,
      },
    });
  }
  postEmail(email) {
    return axios.post(TUTORIAL_API_API_USER + "forgot", email);
  }
  postResetPassword(user, token) {
    return axios.post(TUTORIAL_API_API_USER + "reset", user, {
      headers: {
        Authorization: token,
      },
    });
  }
  putUser(user, token) {
    return axios.put(TUTORIAL_API_API_USER + user._id, user, {
      headers: {
        Authorization: token,
      },
    });
  }

  deleteUser(user, token) {
    return axios.delete(TUTORIAL_API_API_USER + user._id, {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new LoginService();
