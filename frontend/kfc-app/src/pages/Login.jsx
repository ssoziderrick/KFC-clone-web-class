import React, { useState } from "react";
import api from "../utils/api";
// import Header from "../components/Header";
// import Header from "../AuthHeader_Component/AuthHeader";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // const notify = () =>
  //   toast.success("Login Successful", {
  //     position: "top-center",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //   });
  // const notify2 = () =>
  //   toast.warning("Please check Email or Password", {
  //     position: "top-center",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     newestOnTop: false,
  //     rtl: false,
  //   });
  let navigate = useNavigate();

  async function loginUser(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/Auth/login", {
        email,
        password,
      });
      if (!data.token) throw new Error("The server did not return a login token.");
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Unable to log in. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* <Header /> */}
      <section className="loginSection">
        <div id="loginSvgdiv">
          <div className="loginSvgdiv2">
            <svg
              id="loginsvgStrip"
              viewBox="0 0 42 20"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path className="strip-1" d="M0 0h8v20H0z"></path>
              <path className="strip-2" d="M16 0h8v20h-8z"></path>
              <path className="strip-3" d="M32 0h8v20h-8z"></path>
            </svg>
          </div>
        </div>
        <div className="loginmainbox">
          <h1 id="loginTitle">LOG IN TO KFC</h1>
          <div className="loginFormdiv">
            <form onSubmit={loginUser} id="loginForm">
              <div className="input-data">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {/* <div className="underline"></div> */}
                <label>Email</label>
              </div>
              <div id="loginerrorBox"></div>
              <div className="input-data">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* <div className="underline"></div> */}
                <label>Password</label>
              </div>
              <div id="loginerrorBox"></div>
              <div className="loginterms">
                <p className="logintermtext">
                  By logging into the application or proceeding as a guest, you
                  agree to our{" "}
                  <span className="logintermlink">Privacy Policy</span> and{" "}
                  <span className="logintermlink">Terms of Use</span>.
                </p>
              </div>
              <div className="loginBtndiv">
                <input type="submit" value={submitting ? "Logging in..." : "Log In"} disabled={submitting} />
              </div>
              <div className="redirecttosignup">
                <p className="redirectsignuptext">
                  Don't have an account?{" "}
                  <Link to={"/signup"}>
                    <span className="redirectsignuplink">Join Now</span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* <ToastContainer /> */}
    </>
  );
};

export default Login;




