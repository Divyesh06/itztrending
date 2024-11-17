import { useContext, useEffect, useState } from "react";
//import navlink
import FloatingLabelInput from "./FloatingLabelInput";
import { NavLink, useNavigate } from "react-router-dom";
import InputForm from "./InputForm";
import {
  check_auth,
  login,
  signup,
  set_username_and_profpic,
  check_username_availability,
  send_password_reset_request,
  reset_password,
} from "../auth_apis";
import TrendProvider from "../Context/TrendProvider";

function Authenticate(props) {
  const {
    isLoggedIn,
    setIsLoggedIn,
    email,
    setEmail,
    password,
    setPassword,
    is,
  } = useContext(TrendProvider);
  const mode = props.mode;

  //   setEmail("");
  //   setPassword("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (mode == "signup") {
      const [ success, response ] = await signup(email, password);
      if (success) {
        console.log(response[1]);
        setIsLoggedIn(true);
        navigate("/");
      } else {
        alert(response);
      }
    } else {
      const [ success, response ] = await login(email, password);
      if (success) {
        console.log(response[1]);
        setIsLoggedIn(true);
        navigate("/");
      } else {
        alert(response);
      }
    }
  }

  return (
    <>
      <InputForm handleSubmit={handleSubmit}>
        <section style={{ position: "relative" }}>
          <p style={{ fontSize: "17px", marginTop: "15px" }}>
            {mode == "signup"
              ? "Dive into what's Trending!"
              : "Continue with your account"}
          </p>
          <h1 style={{ fontSize: "32px" }}>
            {mode == "signup" ? "Create an Account" : "Welcome Back"}
            <span style={{ color: "var(--primary-color)", fontSize: "1.4em" }}>
              .
            </span>
          </h1>
          <br></br>

          <FloatingLabelInput
            type="email"
            label="Email"
            value={email}
            onChange={function (e) {
              setEmail(e.target.value);
            }}
            icon={"envelope-fill"}
          />
          <FloatingLabelInput
            type="password"
            label="Password"
            value={password}
            onChange={function (e) {
              setPassword(e.target.value);
            }}
            icon={"eye"}
          />

          {mode == "login" ? (
            <NavLink to="/reset-password" className="reset-link">
              Forgot Password?
            </NavLink>
          ) : (
            ""
          )}
        </section>
        <section>
          <button type="submit">
            {mode == "signup" ? "Get Started" : "Continue"}
          </button>
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            {mode == "signup"
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <NavLink to={mode == "signup" ? "/login" : "/signup"}>
              {mode == "signup" ? "Login" : "Sign Up"}
            </NavLink>{" "}
          </p>
        </section>
      </InputForm>
    </>
  );
}

export default Authenticate;
