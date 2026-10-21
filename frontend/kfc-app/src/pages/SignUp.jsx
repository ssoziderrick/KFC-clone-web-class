import React, { useState } from "react";
import api from "../utils/api";
// import Header from "../AuthHeader_Component/AuthHeader";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  let navigate = useNavigate();
  // const notify = () =>
  //   toast.success("Account Created Successfully", {
  //     position: "top-center",
  //     autoClose: 5000,
  //     hideProgressBar: false,
  //     closeOnClick: true,
  //     pauseOnHover: true,
  //     draggable: true,
  //     progress: undefined,
  //   });

  async function registerUser(event) {
    event.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/Auth/signup", {
        firstname,
        lastname,
        email,
        password,
      });
      alert(data.message || "Account created successfully.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to create account. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <>
      {/* <Header /> */}
      <section className="signupsection">
        <div id="singupsvgdiv">
          <div className="signupsvgdiv2">
            <svg
              id="signupsvgStrip"
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
        <div className="signupmainbox">
          <h1 id="signupTitle">CREATE AN ACCOUNT</h1>
          <div className="signupformdiv">
            <form onSubmit={registerUser} className="signupform">
              <div className="input-data">
                <input
                  type="text"
                  name="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  autoComplete="given-name"
                  required
                />
                {/* <div className="underline"></div> */}
                <label>First Name*</label>
              </div>
              <div id="signuperrorBox"></div>
              <div className="input-data">
                <input
                  type="text"
                  name="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  autoComplete="family-name"
                  required
                />
                {/* <div className="underline"></div> */}
                <label>Last Name*</label>
              </div>
              <div id="signuperrorBox"></div>
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
                <label>Email*</label>
              </div>
              <div id="signuperrorBox"></div>
              <div className="input-data">
                <input
                  type="password"
                  name="password"
                  id="password"
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {/* <div className="underline"></div> */}
                <label>Password*</label>
              </div>
              <div id="signuperrorBox"></div>
              <div className="checkifrequired">
                <div className="checkBoxflex">
                  <div className="checkBoxDiv">
                    <input type="checkbox" name="checkbox" id="checkboxtick" required />
                  </div>
                  <div className="checkBoxText">
                    <p>
                      By selecting the box, you agree to our{" "}
                      <span className="cLink">Privacy Policy</span> and{" "}
                      <span className="cLink">Terms of Use.</span>
                    </p>
                  </div>
                </div>
                <div className="checkBoxflex">
                  <div className="checkBoxDiv">
                    <input type="checkbox" name="checkbox" id="checkboxtick2" />
                  </div>
                  <div className="checkBoxText">
                    <p>Sign up for Email updates and Promotions</p>
                  </div>
                </div>
              </div>
              <div className="signupBtndiv">
                <input type="submit" value={submitting ? "Creating account..." : "Create Account"} disabled={submitting} />
              </div>
              <div className="redirecttologin">
                <p className="redirectlogintext">
                  Already a member?{" "}
                  <Link to={"/login"}>
                    <span className="redirectloginlink">Log In</span>
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

export default SignUp;
