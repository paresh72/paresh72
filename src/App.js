import { React, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./App.scss";
// Importing Pages
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Course from "./pages/course/Course";
import Admin from "./pages/admin/Admin";
import ForgotPassword from "./pages/forgot/ForgotPassword";
import UserDashboard from "./pages/userdashboard/UserDashboard"
import ResetPassword from "./pages/reset/ResetPassword";
import Error from "./pages/error/error";
// Importing components
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";

function App() {
  const [loginStatus, setLoginStatus] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoginStatus(true);
    } else {
      setLoginStatus(false);
    }
  }, []);

  return (
    <>
      <Router>
        <Route
          render={(props) => (
            <Navbar
              {...props}
              setLoginStatus={setLoginStatus}
              loginStatus={loginStatus}
            />
          )}
        />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <Home
                {...props}
                setLoginStatus={setLoginStatus}
                loginStatus={loginStatus}
              />
            )}
          />
          <Route
            exact
            path="/login"
            render={(props) => (
              <Login
                {...props}
                setLoginStatus={setLoginStatus}
                loginStatus={loginStatus}
              />
            )}
          />
          <Route
            exact
            path="/course/:cname"
            render={(props) => (
              <Course
                {...props}
                setLoginStatus={setLoginStatus}
                loginStatus={loginStatus}
              />
            )}
          />
          <Route
            exact
            path="/admin"
            render={(props) => (
              <Admin
                {...props}
                setLoginStatus={setLoginStatus}
                loginStatus={loginStatus}
              />
            )}
          />
          <Route
            exact
            path="/dashboard"
            render={(props) => (
              <UserDashboard
                {...props}
                setLoginStatus={setLoginStatus}
                loginStatus={loginStatus}
              />
            )}
          />
          <Route
            exact
            path="/forgot-password"
            render={(props) => (
              <ForgotPassword
                {...props}
                setLoginStatus={setLoginStatus}
                loginStatus={loginStatus}
              />
            )}
          />
          <Route
            exact
            path="/reset-password/:resetoken"
            render={(props) => (
              <ResetPassword
                {...props}
                setLoginStatus={setLoginStatus}
                loginStatus={loginStatus}
              />
            )}
          />
          <Route path="*">
            <Error />
          </Route>
        </Switch>
        <Footer />
      </Router>
    </>
  );
}

export default App;
