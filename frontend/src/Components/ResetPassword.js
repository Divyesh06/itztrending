import { useState, useEffect, useRef, useContext } from "react";
//import navlink
import { NavLink, useNavigate } from "react-router-dom";
import FloatingLabelInput from "./FloatingLabelInput";
import InputForm from "./InputForm";
import { PlusLg, Check2, ExclamationTriangle } from "react-bootstrap-icons";
import { send_password_reset_request} from "../auth_apis";
import TrendContext from "../Context/TrendProvider";
function ResetPassword(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
    function handleSubmit(e) {
      e.preventDefault();
      send_password_reset_request(email);
      navigate("/verify-otp?email=" + email);
    }


  return (
    <>
      <InputForm handleSubmit={handleSubmit}>
        <section style={{ position: "relative" }}>
        <h1 style={{ fontSize: "32px" }}>
            Reset Password
            <span style={{ color: "var(--primary-color)", fontSize: "1.4em" }}>
              .
            </span>

            
          </h1>
          <p style={{ fontSize: "17px", marginTop: "15px" }}>
            Enter your email address and we will send you an OTP to reset your password
          </p>
          <br></br>
          <FloatingLabelInput
            type="email"
            label="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={"envelope-fill"}
          />
        </section>
        <section>
          <button type="submit">
            Get OTP
          </button>
          <p
            style={{
              marginTop: "20px",
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            <NavLink to="/login">Back to Login</NavLink>
          </p>
        </section>
      </InputForm>
    </>
  );
}

export default ResetPassword;
